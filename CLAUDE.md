# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal developer blog (devlog-v2) built with Next.js 13, TypeScript, and styled-components. The blog fetches content from Notion using the Notion API and displays it using the react-notion-x renderer. It includes features like post filtering, categorization, and a like system backed by Firebase.

## Commands

### Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run postbuild    # Generate sitemap (runs automatically after build)
npm start            # Start production server
npm run lint         # Run ESLint
```

### Node Version
- Required: Node.js >= 20.9.0 (see `.nvmrc`)

## Architecture

### Path Aliases
TypeScript path aliases are configured in `tsconfig.json`:
- `@components/*` → `components/*`
- `@core/*` → `core/*`
- `@interfaces/*` → `interfaces/*`
- `@pages/*` → `pages/*`
- `@styles/*` → `styles/*`
- `@assets/*` → `public/assets/*`

Always use these aliases when importing files from these directories.

### Data Flow

**Notion → API Routes → React Query → Components**

1. **Notion Integration**: The app uses two Notion clients:
   - `@notionhq/client`: Official client for metadata (posts list, properties)
   - `notion-client` (NotionAPI): Unofficial client for full page rendering with authentication

2. **API Routes** (`pages/api/`):
   - `posts.ts`: Query Notion database for post list with filtering
   - `post/index.ts`: Fetch individual post data and render content
   - `post/like.ts`: Handle like/unlike via Firebase (IP-based using SHA256 hashing)
   - `post/additional-info.ts`: Additional post metadata
   - `category.ts`: Fetch available categories
   - `my-blog-images.ts`: Proxy for Notion images to avoid CORS issues
   - `constant.ts`: Notion API filter definitions (encoded property IDs)

3. **State Management**:
   - Redux for theme state (`core/reducer/styleTheme.ts`)
   - React Query for server state (`core/queries/`)
   - React Query config: No refetch on mount/reconnect/focus

4. **Styling**:
   - styled-components with SSR enabled
   - Global theme in `styles/theme.ts` and `styles/global.ts`
   - Theme switching via Redux

### Environment Variables

Required environment variables (see `.env.development` for reference):
- `NEXT_PUBLIC_APP_ENV`: 'development' or 'production'
- `NOTION_AUTH_TOKEN`: Unofficial Notion auth token for rendering
- `NOTION_USER_ID`: Notion user ID
- `NOTION_DATABASE_ID`: Main posts database ID
- `NOTION_API_KEY`: Official Notion integration key
- `FIREBASE_*`: Firebase configuration for like system

**Important**: `.env*` files are in `.gitignore`. Never commit these files.

### Static Generation

The blog uses Next.js ISR (Incremental Static Regeneration):
- Post pages (`pages/post/[id].tsx`):
  - `getStaticPaths`: Generates paths for all published posts
  - `getStaticProps`: Fetches post data with 1-hour revalidation (`revalidate: 3600`)
  - Fallback: `true` (allows new posts without rebuild)

### Notion Filters

Filters are defined in `pages/api/constant.ts` with encoded property IDs:
- `STATUS_PUBLISHED`: Filters for 'Done' status (production only)
- `MULTI_SELECT_CATEGORY`: Filter by category
- `TITLE_CONTAINED`: Search in title
- `RICH_TEXT_CONTAINED`: Search in subtitle

### Component Structure

Components are organized by feature in `components/`:
- `Layouts/`: Page layouts (DefaultLayout, LayoutInner)
- `Post/`: Individual post view (uses react-notion-x)
- `Posts/`: Post list view
- `PostCard/`: Post preview cards
- `CategoryFilter/`: Category filtering UI
- `TextFilter/`: Search/text filtering
- `LikeButton/`: Post like button (uses react-icons)
- `Header/`: Site header
- `Comment/`: Comment section
- `CustomSuspense/`: Suspense wrapper

### Firebase Like System

The like system (`pages/api/post/like.ts`) uses:
- IP address hashing (SHA256) for anonymous like tracking
- Firestore path: `devlog/posts/postId/{postId}`
- Document structure: `{ likeCount: number, encryptedIpAddress: { [hash]: null } }`
- Transaction-based updates to prevent race conditions

### Image Handling

- Notion images are proxied through `/api/my-blog-images` to avoid CORS
- Next.js Image component configured for `www.notion.so` domain
- Image proxy sets 1-year cache headers

## Important Notes

- Production mode filters out non-published posts (status !== 'Done')
- Google Analytics is only loaded in production (`NEXT_PUBLIC_APP_ENV === 'production'`)
- The app uses Next.js 13 with Pages Router (not App Router)
- All Notion property IDs in filters are URL-encoded
