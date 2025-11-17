import { getNotionPosts, getNotionPost } from '../lib/notion';

async function checkNotionImages() {
  try {
    const posts = await getNotionPosts();

    if (posts.length > 0) {
      const firstPost = posts[0];
      console.log('First Post ID:', firstPost.id);

      const postData = await getNotionPost(firstPost.id);
      const notionPage = postData.notionPage;

      // ExtendedRecordMap의 구조 확인
      console.log('\n=== Block Structure ===');
      const blockIds = Object.keys(notionPage.block);
      console.log('Total blocks:', blockIds.length);

      // 이미지 블록 찾기
      const imageBlocks = blockIds.filter(id => {
        const block = notionPage.block[id].value;
        return block?.type === 'image';
      });

      console.log('\n=== Image Blocks ===');
      console.log('Total image blocks:', imageBlocks.length);

      if (imageBlocks.length > 0) {
        const firstImageBlock = notionPage.block[imageBlocks[0]].value;
        console.log('\n=== First Image Block Detail ===');
        console.log('Block ID:', firstImageBlock.id);
        console.log('Block Type:', firstImageBlock.type);
        console.log('Properties:', JSON.stringify(firstImageBlock.properties, null, 2));
        console.log('Format:', JSON.stringify(firstImageBlock.format, null, 2));

        // 이미지 URL 확인
        if (firstImageBlock.properties?.source) {
          console.log('\n=== Image URL (from properties.source) ===');
          console.log(firstImageBlock.properties.source);
        }

        if (firstImageBlock.format?.display_source) {
          console.log('\n=== Image URL (from format.display_source) ===');
          console.log(firstImageBlock.format.display_source);
        }
      }

      // signed_urls 확인
      console.log('\n=== Checking signed_urls ===');
      if (notionPage.signed_urls) {
        console.log('signed_urls exists!');
        const signedUrlKeys = Object.keys(notionPage.signed_urls);
        console.log('Total signed URLs:', signedUrlKeys.length);
        if (signedUrlKeys.length > 0) {
          console.log('\nFirst 3 signed URLs:');
          signedUrlKeys.slice(0, 3).forEach(key => {
            console.log('\nKey:', key);
            console.log('Signed URL:', notionPage.signed_urls[key]);
          });
        }
      } else {
        console.log('No signed_urls found');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkNotionImages();
