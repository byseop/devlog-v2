import { Block } from 'notion-types';

/**
 * Extract Notion image ID from URL
 */
function extractNotionImageId(url: string): string | null {
  try {
    // Pattern for signed URLs: file.notion.so/f/f/{workspace_id}/{image_id}/{filename}
    const signedMatch = url.match(/file\.notion\.so\/f\/f\/[a-f0-9-]+\/([a-f0-9-]+)\//i);
    if (signedMatch && signedMatch[1]) {
      return signedMatch[1];
    }

    // Pattern for static URLs: secure.notion-static.com/{id}/{filename}
    const staticMatch = url.match(/secure\.notion-static\.com\/([a-f0-9-]+)\//i);
    if (staticMatch && staticMatch[1]) {
      return staticMatch[1];
    }

    // Also handle notion.so image URLs
    const notionMatch = url.match(/notion\.so\/image\/([^?]+)/i);
    if (notionMatch && notionMatch[1]) {
      return notionMatch[1].replace(/\//g, '-');
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get file extension from URL
 */
function getFileExtension(url: string): string {
  const match = url.match(/\.([a-z0-9]+)(\?|$)/i);
  return match && match[1] ? match[1].toLowerCase() : 'jpg';
}

/**
 * Convert Notion image URL to CDN URL
 */
function convertToS3Url(url: string): string | null {
  const imageId = extractNotionImageId(url);
  if (!imageId) {
    return null;
  }

  const extension = getFileExtension(url);
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;

  if (cdnUrl) {
    // CloudFront URL: https://static.byseop.com/{imageId}.{ext}
    return `${cdnUrl}/${imageId}.${extension}`;
  }

  // Fallback to direct S3 URL
  const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || 'devlog-static';
  const region = process.env.NEXT_PUBLIC_AWS_S3_REGION || 'ap-northeast-2';
  return `https://${bucketName}.s3.${region}.amazonaws.com/notion-images/${imageId}.${extension}`;
}

export const customMapImageUrl = (url: string | undefined, _block: Block): string => {
  if (!url) {
    return '';
  }

  // data: URLs는 그대로 반환
  if (url.startsWith('data:')) {
    return url;
  }

  // Notion 이미지인지 확인하고 S3 URL로 변환 시도
  if (
    url.includes('notion-static.com') ||
    url.includes('notion.so/image') ||
    url.includes('file.notion.so')
  ) {
    const s3Url = convertToS3Url(url);
    if (s3Url) {
      return s3Url;
    }
  }

  // S3 URL 변환 실패한 경우 원본 URL 반환 (외부 이미지 등)
  return url;
};
