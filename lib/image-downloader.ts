import {
  uploadImageToS3,
  extractNotionImageId,
  getFileExtension
} from './s3-uploader';

/**
 * Download image from URL and return buffer
 */
export async function downloadImage(url: string): Promise<{
  buffer: Buffer;
  contentType: string;
}> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      Accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      Referer: 'https://www.notion.so/',
      Origin: 'https://www.notion.so'
    },
    redirect: 'follow'
  });

  if (!response.ok) {
    throw new Error(`Failed to download image from ${url}: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = response.headers.get('content-type') || 'image/jpeg';

  return { buffer, contentType };
}

/**
 * Process a Notion image: download and upload to S3
 */
export async function processNotionImage(notionUrl: string): Promise<{
  originalUrl: string;
  s3Url: string;
  imageId: string;
} | null> {
  try {
    // Extract image ID from Notion URL
    const imageId = extractNotionImageId(notionUrl);
    if (!imageId) {
      console.log(`Could not extract image ID from URL: ${notionUrl}`);
      return null;
    }

    // Download image
    console.log(`Downloading image ${imageId}...`);
    const { buffer, contentType } = await downloadImage(notionUrl);

    // Get file extension
    const extension = getFileExtension(notionUrl, contentType);
    const imageIdWithExt = `${imageId}.${extension}`;

    // Upload to S3
    const s3Url = await uploadImageToS3(imageIdWithExt, buffer, contentType);

    return {
      originalUrl: notionUrl,
      s3Url,
      imageId: imageIdWithExt
    };
  } catch (error) {
    console.error(`Error processing image ${notionUrl}:`, error);
    return null;
  }
}