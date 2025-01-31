import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.query.url || typeof req.query.url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  const decodedUrl = decodeURIComponent(req.query.url);

  try {
    const response = await axios({
      url: decodedUrl,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://www.notion.so/',
        Origin: 'https://www.notion.so'
      },
      maxRedirects: 5
    });

    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader(
      'Content-Type',
      response.headers['content-type'] || 'image/jpeg'
    );
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to proxy image' });
  }
}
