import { processNotionImage } from './image-downloader';
import type { ExtendedRecordMap } from 'notion-types';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

/**
 * Extract all image URLs from a Notion page using signed URLs
 */
function extractImageUrls(notionPage: ExtendedRecordMap): string[] {
  const imageUrls: string[] = [];
  const blockIds = Object.keys(notionPage.block);

  for (const blockId of blockIds) {
    const block = notionPage.block[blockId].value;

    if (!block) continue;

    // Image blocks - use signed URL if available
    if (block.type === 'image') {
      // Try to get the signed URL first (this is the presigned, downloadable URL)
      const signedUrl = notionPage.signed_urls?.[blockId];
      if (signedUrl) {
        imageUrls.push(signedUrl);
      } else {
        // Fallback to display_source
        const imageUrl =
          block.format?.display_source || block.properties?.source?.[0]?.[0];
        if (imageUrl && typeof imageUrl === 'string') {
          imageUrls.push(imageUrl);
        }
      }
    }

    // Cover images from the page itself
    if (block.type === 'page' && block.format?.page_cover) {
      const pageCoverUrl = block.format.page_cover;
      // Check if there's a signed URL for the cover
      const signedCoverUrl = notionPage.signed_urls?.[blockId];
      imageUrls.push(signedCoverUrl || pageCoverUrl);
    }
  }

  return imageUrls;
}

/**
 * Process all images in a single post: download from Notion and upload to S3
 */
export async function processPostImages(
  notionPage: ExtendedRecordMap,
  post: PageObjectResponse
): Promise<void> {
  const startTime = Date.now();
  console.log(`[Image Processing] Starting for post ${post.id}`);

  try {
    const imageUrls = extractImageUrls(notionPage);

    // Add cover image if exists
    if (post.cover && 'external' in post.cover && post.cover.external?.url) {
      imageUrls.push(post.cover.external.url);
      console.log(`[Image Processing] Added cover image for post ${post.id}`);
    }

    if (imageUrls.length === 0) {
      console.log(`[Image Processing] No images to process for post ${post.id}`);
      return;
    }

    console.log(
      `[Image Processing] Found ${imageUrls.length} images for post ${post.id}`
    );

    // Process all images in parallel
    const results = await Promise.allSettled(
      imageUrls.map(async (url, index) => {
        const imageStartTime = Date.now();
        console.log(
          `[Image Processing] [${index + 1}/${imageUrls.length}] Processing image: ${url.substring(0, 80)}...`
        );

        try {
          const result = await processNotionImage(url);
          const duration = Date.now() - imageStartTime;

          if (result) {
            console.log(
              `[Image Processing] [${index + 1}/${imageUrls.length}] ✅ Success (${duration}ms): ${result.s3Url}`
            );
          } else {
            console.log(
              `[Image Processing] [${index + 1}/${imageUrls.length}] ⚠️ Skipped (${duration}ms): Already exists or invalid`
            );
          }

          return result;
        } catch (error) {
          const duration = Date.now() - imageStartTime;
          console.error(
            `[Image Processing] [${index + 1}/${imageUrls.length}] ❌ Failed (${duration}ms):`,
            error instanceof Error ? error.message : String(error)
          );
          throw error;
        }
      })
    );

    // Summary
    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    const failCount = results.filter((r) => r.status === 'rejected').length;
    const totalDuration = Date.now() - startTime;

    console.log(
      `[Image Processing] Completed for post ${post.id} (${totalDuration}ms)`
    );
    console.log(
      `[Image Processing] Summary: ${successCount} succeeded, ${failCount} failed, ${imageUrls.length} total`
    );

    if (failCount > 0) {
      console.warn(
        `[Image Processing] Some images failed to process for post ${post.id}`
      );
    }
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(
      `[Image Processing] Fatal error for post ${post.id} (${totalDuration}ms):`,
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}
