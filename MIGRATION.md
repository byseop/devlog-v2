# Migration Guide: Next.js 13 → 16, React 18 → 19

This document describes the migration from Next.js 13.5.6 to Next.js 16.0.2 and React 18 to React 19, along with all related dependency updates.

## Overview

- **Next.js**: 13.5.6 → 16.0.2
- **React**: 18.2.0 → 19.0.0
- **Node.js**: 20.9.0 → 20.19.0
- **Major dependency updates**: Notion API v5, TanStack Query v5, and more

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Package Updates](#package-updates)
3. [Breaking Changes](#breaking-changes)
4. [Code Modifications](#code-modifications)
5. [Migration Checklist](#migration-checklist)

## Prerequisites

### Node.js Version Update

Update Node.js to version 20.19.0 or higher:

```bash
nvm install 20.19.0
nvm use 20.19.0
```

Update `.nvmrc`:
```
v20.19.0
```

Update `package.json`:
```json
{
  "engines": {
    "node": ">=20.18.1"
  }
}
```

## Package Updates

### Core Dependencies

```json
{
  "dependencies": {
    "next": "^16.0.2",           // from 13.5.6
    "react": "^19.0.0",          // from 18.2.0
    "react-dom": "^19.0.0",      // from 18.2.0
    "@notionhq/client": "5.4.0", // from 2.x (v5 API)
    "@tanstack/react-query": "^5.62.14",           // from react-query 3.39.3
    "@tanstack/react-query-devtools": "^5.62.14",  // new
    "next-seo": "^6.6.0",        // from 7.0.1 (v7 not compatible)
    "nextjs-toploader": "^3.9.17" // replaces nextjs-progressbar
  }
}
```

### Removed Packages

- `axios` → replaced with native `fetch`
- `react-query` → migrated to `@tanstack/react-query`
- `nextjs-progressbar` → replaced with `nextjs-toploader`

## Breaking Changes

### 1. Next.js Configuration

#### next.config.js

**Before:**
```javascript
module.exports = {
  swcMinify: true,
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true
    }
  },
  images: {
    domains: ['www.notion.so']
  }
}
```

**After:**
```javascript
module.exports = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true  // Simplified config
  },
  images: {
    remotePatterns: [       // domains deprecated
      {
        protocol: 'https',
        hostname: 'www.notion.so'
      }
    ]
  }
}
```

#### tsconfig.json

**Updates:**
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",  // was "node"
    "jsx": "react-jsx",             // was "preserve"
    "plugins": [{ "name": "next" }],
    "include": [".next/types/**/*.ts"]  // Added
  }
}
```

### 2. Font Imports

**Before:**
```typescript
import { Fira_Mono } from '@next/font/google';
```

**After:**
```typescript
import { Fira_Mono } from 'next/font/google';
```

### 3. Notion API v5 Migration

Notion API v5 introduces a breaking change: `databases.query` is removed. You must now use `dataSources.query`.

#### Database Query Migration

**Before (v2):**
```typescript
const response = await notion.databases.query({
  database_id,
  filter,
  sorts: [{ property: 'publishDate', direction: 'descending' }]
});
```

**After (v5):**
```typescript
// Step 1: Get database to find data source
const database = await notion.databases.retrieve({ database_id });

// Step 2: Query the data source
const response = await notion.dataSources.query({
  data_source_id: database.id,
  filter,
  sorts: [{ property: 'publishDate', direction: 'descending' }]
});
```

#### Import Path Changes

**Before:**
```typescript
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
```

**After:**
```typescript
import type { PageObjectResponse } from '@notionhq/client/build/src';
```

#### Type Changes

- `QueryDatabaseParameters` → `QueryDataSourceParameters`
- `DatabaseObjectResponse` no longer has `properties` field
- `DataSourceObjectResponse` has `properties` field

#### Category API Example

**Before:**
```typescript
const response = await notion.databases.retrieve({ database_id });
const data = response.properties.category.multi_select.options;
```

**After:**
```typescript
const database = await notion.databases.retrieve({ database_id });
const dataSource = await notion.dataSources.retrieve({
  data_source_id: database.id
});
const data = dataSource.properties.category.multi_select.options;
```

### 4. Axios → Native Fetch

Replace all `axios` calls with native `fetch` API.

#### API Client Migration

**Before (axios):**
```typescript
import axios from 'axios';

export const request = async ({ method, url, params, data }) => {
  const response = await axios({
    method,
    url: `${BASE_URL}${url}`,
    params,
    data,
    timeout: 10000
  });
  return response.data;
};
```

**After (fetch):**
```typescript
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function request<R>({ method = 'GET', url, params, data, lang = 'ko', signal }: RequestConfig): Promise<Response<R>> {
  const fullUrl = new URL(url, BASE_URL);

  if (method === 'GET' && params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fullUrl.searchParams.append(key, String(value));
      }
    });
  }

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': lang
    },
    signal
  };

  if (method !== 'GET' && data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetchWithTimeout(fullUrl.toString(), options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
```

#### Image Proxy Migration

**Before:**
```typescript
const response = await axios.get(decodedUrl, {
  responseType: 'arraybuffer',
  headers: { /* ... */ }
});
res.send(Buffer.from(response.data, 'binary'));
```

**After:**
```typescript
const response = await fetch(decodedUrl, {
  method: 'GET',
  headers: { /* ... */ },
  redirect: 'follow'
});

const arrayBuffer = await response.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);
res.send(buffer);
```

### 5. TanStack Query v5 Migration

Complete migration from `react-query` v3 to `@tanstack/react-query` v5.

#### Import Changes

**Before:**
```typescript
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
```

**After:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
```

#### useQuery API Changes

**Before (v3):**
```typescript
export const useGetPosts = (params, options) => {
  return useQuery(
    postsQueryKey.posts(params),
    () => postApis.getPosts(params),
    { ...options }
  );
};
```

**After (v5):**
```typescript
export const useGetPosts = (params, options) => {
  return useQuery({
    queryKey: postsQueryKey.posts(params),
    queryFn: () => postApis.getPosts(params),
    ...options
  });
};
```

#### useMutation API Changes

**Before (v3):**
```typescript
export const useUpdateLike = (id) => {
  const queryClient = useQueryClient();

  return useMutation(
    postQueryKey.updateLike(id),
    () => postApis.updateLike(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(postQueryKey.getAdditionalInfo(id));
      }
    }
  );
};
```

**After (v5):**
```typescript
export const useUpdateLike = (id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: postQueryKey.updateLike(id),
    mutationFn: () => postApis.updateLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postQueryKey.getAdditionalInfo(id)
      });
    }
  });
};
```

#### useIsMutating Changes

**Before:**
```typescript
const isLikeLoading = useIsMutating(postQueryKey.updateLike(id));
```

**After:**
```typescript
const isLikeLoading = useIsMutating({
  mutationKey: postQueryKey.updateLike(id)
});
```

#### Suspense Migration

**Before (v3):**
```typescript
useQuery(queryKey, queryFn, {
  suspense: true,
  useErrorBoundary: true
});
```

**After (v5):**
```typescript
import { useSuspenseQuery } from '@tanstack/react-query';

// Use dedicated suspense hook
useSuspenseQuery({
  queryKey,
  queryFn
});
```

#### QueryErrorResetBoundary

**Before:**
```typescript
<QueryErrorResetBoundary>
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
</QueryErrorResetBoundary>
```

**After:**
```typescript
<QueryErrorResetBoundary>
  {() => (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )}
</QueryErrorResetBoundary>
```

### 6. next-seo Migration

Downgrade from v7 to v6 due to breaking API changes in v7.

**Why v6?**
- v7 completely rewrote the API from component-based to function-based
- v6 maintains backward compatibility with existing code
- v6 continues to receive bug fixes and security updates

```json
{
  "dependencies": {
    "next-seo": "^6.6.0"  // NOT v7
  }
}
```

No code changes required when using v6.

### 7. Progress Bar Component

Replace `nextjs-progressbar` (unmaintained) with `nextjs-toploader`.

**Before:**
```typescript
import NextNProgress from 'nextjs-progressbar';

export default function App({ Component, pageProps }) {
  return (
    <>
      <NextNProgress />
      <Component {...pageProps} />
    </>
  );
}
```

**After:**
```typescript
import NextTopLoader from 'nextjs-toploader';

export default function App({ Component, pageProps }) {
  return (
    <>
      <NextTopLoader />
      <Component {...pageProps} />
    </>
  );
}
```

### 8. next-sitemap v4 (Pages Router)

For Pages Router compatibility, use the legacy API.

**Before:**
```typescript
import { getServerSideSitemapIndex } from 'next-sitemap';

export const getServerSideProps = async (context) => {
  return getServerSideSitemapIndex(context, urls);
};
```

**After:**
```typescript
import { getServerSideSitemapIndexLegacy } from 'next-sitemap';

export const getServerSideProps = async (ctx) => {
  return getServerSideSitemapIndexLegacy(ctx, urls);
};
```

**Note:** For App Router, use `getServerSideSitemapIndex` without the context parameter.

### 9. TypeScript Type Fixes

#### Notion Image URL Type

**Before:**
```typescript
export const customMapImageUrl = (url: string, block: Block): string => {
  if (!url) {
    throw new Error("URL can't be empty");
  }
  // ...
};
```

**After:**
```typescript
export const customMapImageUrl = (url: string | undefined, block: Block): string => {
  if (!url) {
    return '';  // Don't throw, return empty string
  }
  // ...
};
```

## Code Modifications

### Files Modified

#### Configuration Files
- `next.config.js` - Updated images config and removed deprecated options
- `tsconfig.json` - Updated moduleResolution and JSX transform
- `.nvmrc` - Updated Node version
- `package.json` - Updated all dependencies and engine requirements

#### API Routes
- `pages/api/posts.ts` - Migrated to Notion API v5 dataSources
- `pages/api/post/index.ts` - Updated Notion imports
- `pages/api/category.ts` - Migrated to dataSources for properties
- `pages/api/my-blog-images.ts` - Replaced axios with fetch

#### Core Files
- `core/apis/index.ts` - Complete rewrite from axios to fetch
- `core/apis/posts.ts` - Updated Notion types
- `core/queries/posts.ts` - Migrated to TanStack Query v5
- `core/queries/post.ts` - Migrated to TanStack Query v5
- `core/queries/category.ts` - Migrated to TanStack Query v5
- `core/utils/notion-client/customImageMap.ts` - Updated URL type handling

#### Components
- `components/Header/Header.tsx` - Updated font import
- `components/Post/Post.tsx` - Updated TanStack Query hooks
- `components/Posts/Posts.tsx` - Updated to useSuspenseQuery
- `components/PostCard/PostCard.Contents.tsx` - Updated Notion types
- `components/Home/Home.tsx` - Updated Notion types

#### Pages
- `pages/_app.tsx` - Updated to NextTopLoader and TanStack Query v5
- `pages/index.tsx` - Updated Notion types
- `pages/post/[id].tsx` - Updated Notion types
- `pages/server-sitemap-index.xml/index.tsx` - Updated to next-sitemap v4 legacy API

#### Moved Files
- `pages/api/constant.ts` → `core/constants.ts` (not an API route)
- `pages/api/firebase.ts` → `core/firebase.ts` (not an API route)
- `pages/api/utils.ts` → `core/utils.ts` (not an API route)

## Migration Checklist

### Phase 1: Prerequisites
- [ ] Update Node.js to 20.19.0+
- [ ] Update `.nvmrc` file
- [ ] Backup current codebase
- [ ] Create a new branch for migration

### Phase 2: Package Updates
- [ ] Update `package.json` with new versions
- [ ] Remove deprecated packages (axios, react-query, nextjs-progressbar)
- [ ] Run `yarn install` or `npm install`

### Phase 3: Configuration
- [ ] Update `next.config.js`
- [ ] Update `tsconfig.json`
- [ ] Update font imports (`@next/font` → `next/font`)

### Phase 4: Notion API v5
- [ ] Update all Notion import paths
- [ ] Replace `databases.query` with `dataSources.query`
- [ ] Update `pages/api/posts.ts`
- [ ] Update `pages/api/category.ts`
- [ ] Update type definitions

### Phase 5: Axios to Fetch
- [ ] Rewrite `core/apis/index.ts`
- [ ] Update `pages/api/my-blog-images.ts`
- [ ] Test all API endpoints

### Phase 6: TanStack Query v5
- [ ] Update all import statements
- [ ] Migrate `useQuery` calls to object syntax
- [ ] Migrate `useMutation` calls to object syntax
- [ ] Replace suspense option with `useSuspenseQuery`
- [ ] Update `useIsMutating` calls
- [ ] Update `QueryErrorResetBoundary` usage

### Phase 7: Other Updates
- [ ] Replace `nextjs-progressbar` with `nextjs-toploader`
- [ ] Update `next-sitemap` to legacy API
- [ ] Update TypeScript types

### Phase 8: Testing
- [ ] Run `yarn build` (or `npm run build`)
- [ ] Fix any build errors
- [ ] Test development server (`yarn dev`)
- [ ] Test all API endpoints
- [ ] Test page navigation
- [ ] Test static generation
- [ ] Verify sitemap generation

### Phase 9: Deployment
- [ ] Update environment variables if needed
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production

## Common Issues & Solutions

### Issue: Node version error
**Error:** `The engine "node" is incompatible with this module`

**Solution:**
```bash
nvm install 20.19.0
nvm use 20.19.0
```

### Issue: Notion API type errors
**Error:** `Property 'properties' does not exist on type 'DatabaseObjectResponse'`

**Solution:** Use `dataSources.retrieve()` instead of reading properties directly from database.

### Issue: React Query type errors
**Error:** `Type is not assignable to type 'never'`

**Solution:** Update to object-based API and use `useSuspenseQuery` for suspense.

### Issue: next-seo type errors
**Error:** `Module has no exported member 'DefaultSeoProps'`

**Solution:** Use next-seo v6 instead of v7.

## Rollback Plan

If you need to rollback:

1. Revert `package.json` changes
2. Run `yarn install` or `npm install`
3. Revert code changes using git:
   ```bash
   git checkout main -- package.json
   git checkout main -- [modified-files]
   yarn install
   ```

## Resources

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [Notion API v5 Upgrade Guide](https://developers.notion.com/docs/upgrade-guide-2025-09-03)
- [TanStack Query v5 Migration Guide](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5)
- [next-sitemap Documentation](https://github.com/iamvishnusankar/next-sitemap)

## Future Considerations

### App Router Migration

This migration keeps the Pages Router. For App Router migration:

1. Create `app/` directory structure
2. Convert `getServerSideProps`/`getStaticProps` to Server Components
3. Migrate `_app.tsx` to `layout.tsx`
4. Update API routes to Route Handlers
5. Update sitemap to use new App Router API

See [Next.js App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration) for details.

## Support

For issues related to this migration, please refer to:
- Project repository issues
- Next.js documentation
- Package-specific GitHub issues

---

**Migration completed on:** 2025-01-13
**Migrated by:** Claude Code Assistant
**Original version:** Next.js 13.5.6, React 18.2.0
**Target version:** Next.js 16.0.2, React 19.0.0
