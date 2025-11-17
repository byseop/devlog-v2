import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

let s3Client: S3Client | null = null;
const IMAGE_PREFIX = 'notion-images';

function getS3Client(): S3Client {
  if (!s3Client) {
    const region = process.env.AWS_S3_REGION;
    const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error(
        `Missing AWS S3 environment variables. ` +
        `Got: region=${region}, accessKeyId=${accessKeyId ? '[SET]' : '[MISSING]'}, secretAccessKey=${secretAccessKey ? '[SET]' : '[MISSING]'}`
      );
    }

    s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
  }
  return s3Client;
}

function getBucketName(): string {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('Missing AWS_S3_BUCKET_NAME environment variable');
  }
  return bucketName;
}

/**
 * Check if a file exists in S3
 */
export async function checkFileExists(key: string): Promise<boolean> {
  try {
    const client = getS3Client();
    const bucketName = getBucketName();
    await client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: key
      })
    );
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
}

/**
 * Upload an image buffer to S3
 */
export async function uploadImageToS3(
  imageId: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const client = getS3Client();
  const bucketName = getBucketName();
  const key = `${IMAGE_PREFIX}/${imageId}`;

  // Check if file already exists
  const exists = await checkFileExists(key);
  if (exists) {
    console.log(`Image ${imageId} already exists in S3, skipping upload`);
    return getS3Url(imageId);
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable' // 1 year cache
    })
  );

  console.log(`Uploaded image ${imageId} to S3`);
  return getS3Url(imageId);
}

/**
 * Get the CDN URL for an image ID
 */
export function getS3Url(imageId: string): string {
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
  if (cdnUrl) {
    // CloudFront URL: https://static.byseop.com/{imageId}
    return `${cdnUrl}/${imageId}`;
  }

  // Fallback to direct S3 URL
  const bucketName = getBucketName();
  const region = process.env.AWS_S3_REGION;
  return `https://${bucketName}.s3.${region}.amazonaws.com/${IMAGE_PREFIX}/${imageId}`;
}

/**
 * Extract Notion image ID from URL
 * Examples:
 * - https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b9489b45-dbe1-46e1-b6ad-3f7d940998fe/Untitled.png
 * - https://file.notion.so/f/f/3b78fcca-37ce-4b3e-946b-08dd42e690b1/b9489b45-dbe1-46e1-b6ad-3f7d940998fe/Untitled.png?...
 * Returns: b9489b45-dbe1-46e1-b6ad-3f7d940998fe
 */
export function extractNotionImageId(url: string): string | null {
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
  } catch (error) {
    console.error('Error extracting Notion image ID:', error);
    return null;
  }
}

/**
 * Get file extension from URL or content type
 */
export function getFileExtension(url: string, contentType?: string): string {
  // Try to get from URL first
  const urlMatch = url.match(/\.([a-z0-9]+)(\?|$)/i);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1].toLowerCase();
  }

  // Fallback to content type
  if (contentType) {
    const typeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg'
    };
    return typeMap[contentType] || 'jpg';
  }

  return 'jpg';
}
