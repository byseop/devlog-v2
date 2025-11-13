import { Block } from 'notion-types';

export const customMapImageUrl = (url: string | undefined, block: Block): string => {
  if (!url) {
    return '';
  }

  // data: URLs는 그대로 반환
  if (url.startsWith('data:')) {
    return url;
  }

  // 외부 이미지는 직접 프록시
  if (url.startsWith('https://') || url.startsWith('http://')) {
    return `/api/my-blog-images?url=${encodeURIComponent(url)}`;
  }

  // Notion 내부 이미지 (file.notion.so)의 경우
  if (url.includes('file.notion.so')) {
    return `/api/my-blog-images?url=${encodeURIComponent(url)}`;
  }

  try {
    const u = new URL(url);

    // AWS S3 호스팅 이미지
    if (
      u.pathname.startsWith('/secure.notion-static.com') &&
      u.hostname.endsWith('.amazonaws.com')
    ) {
      if (
        u.searchParams.has('X-Amz-Credential') &&
        u.searchParams.has('X-Amz-Signature') &&
        u.searchParams.has('X-Amz-Algorithm')
      ) {
        return `/api/my-blog-images?url=${encodeURIComponent(
          u.origin + u.pathname
        )}`;
      }
    }
  } catch {
    // 잘못된 URL 무시
  }

  // Notion 상대 경로를 절대 경로로 변환
  if (url.startsWith('/images')) {
    url = `https://www.notion.so${url}`;
  }

  // 최종 URL 반환
  return `/api/my-blog-images?url=${encodeURIComponent(url)}`;
};
