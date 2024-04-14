import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore/lite';
import requestIp from 'request-ip';
import { SHA256 } from 'crypto-js';

import type { IAPIError, Response } from '@interfaces/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ILikeResponse } from '@interfaces/post';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response<ILikeResponse> | IAPIError>
) {
  try {
    const detectedIp = requestIp.getClientIp(req);
    const postId = req.query.id as string;

    if (!detectedIp) {
      res.status(400).json({ message: 'Invalid IP' });
      return;
    }

    const hashedIp = SHA256(detectedIp).toString();
    const docRef = doc(firestore, 'devlog', 'posts', 'postId', postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const { likeCount, encryptedIpAddress } = data as {
        likeCount: number;
        encryptedIpAddress: { [key: string]: null };
      };

      res.status(200).json({
        data: {
          likeCount,
          isLiked: Object.keys(encryptedIpAddress).includes(hashedIp)
        },
        status: 'ok',
        error: null
      });
    } else {
      res.status(200).json({
        data: {
          isLiked: false,
          likeCount: 0
        },
        status: 'ok',
        error: null
      });
    }

    return;
  } catch (e) {
    res.status(500).json({ message: 'Unhandled Error' });

    return;
  }
}
