// IMPORTANT: Load environment variables BEFORE any imports
// This ensures env vars are available when lib/notion.ts initializes the Notion client
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envFile = path.resolve(__dirname, '../.env.production');
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

// Now import after env vars are loaded
const { getNotionPosts, getNotionPost } = require('../lib/notion');
const { processNotionImage } = require('../lib/image-downloader');
import type { ExtendedRecordMap } from 'notion-types';

interface ImageInfo {
  originalUrl: string;
  s3Url: string;
  imageId: string;
}

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
        const imageUrl = block.format?.display_source || block.properties?.source?.[0]?.[0];
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
 * Main function to process all Notion images
 */
async function processAllNotionImages() {
  console.log('🚀 Starting Notion image processing...\n');

  try {
    // Get all posts
    console.log('📚 Fetching all posts from Notion...');
    const posts = await getNotionPosts();
    console.log(`Found ${posts.length} posts\n`);

    const allImageUrls = new Set<string>();
    const processedImages: ImageInfo[] = [];
    const failedImages: string[] = [];

    // Extract all image URLs from all posts
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      console.log(`[${i + 1}/${posts.length}] Processing post: ${post.id}`);

      try {
        const postData = await getNotionPost(post.id);
        const imageUrls = extractImageUrls(postData.notionPage);

        // Add cover image if exists
        if (post.cover && 'external' in post.cover && post.cover.external?.url) {
          imageUrls.push(post.cover.external.url);
        }

        imageUrls.forEach((url) => allImageUrls.add(url));
        console.log(`  Found ${imageUrls.length} images`);
      } catch (error) {
        console.error(`  Error processing post ${post.id}:`, error);
      }
    }

    console.log(`\n📸 Total unique images found: ${allImageUrls.size}\n`);

    // Process each unique image
    let processed = 0;
    for (const imageUrl of allImageUrls) {
      processed++;
      console.log(`[${processed}/${allImageUrls.size}] Processing image...`);
      console.log(`  URL: ${imageUrl.substring(0, 80)}...`);

      try {
        const result = await processNotionImage(imageUrl);
        if (result) {
          processedImages.push(result);
          console.log(`  ✅ Uploaded to S3: ${result.s3Url}\n`);
        } else {
          failedImages.push(imageUrl);
          console.log(`  ⚠️  Skipped (could not process)\n`);
        }
      } catch (error) {
        failedImages.push(imageUrl);
        console.error(`  ❌ Failed:`, error);
        console.log('');
      }

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total images found: ${allImageUrls.size}`);
    console.log(`Successfully uploaded: ${processedImages.length}`);
    console.log(`Failed/Skipped: ${failedImages.length}`);
    console.log('='.repeat(60) + '\n');

    if (failedImages.length > 0) {
      console.log('⚠️  Failed images:');
      failedImages.forEach((url) => console.log(`  - ${url}`));
      console.log('');
    }

    console.log('✅ Image processing complete!');
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
processAllNotionImages();