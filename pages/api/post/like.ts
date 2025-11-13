import { firestore } from '@core/firebase';
import { doc, getDoc, runTransaction } from 'firebase/firestore/lite';
import requestIp from 'request-ip';
import { SHA256 } from 'crypto-js';
import { createApiSuccessResponse } from '@core/utils';

import type { IAPIError, Response } from '@interfaces/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ILikeResponse } from '@interfaces/post';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response<ILikeResponse> | Response<null> | IAPIError>
) {
  try {
    const detectedIp = requestIp.getClientIp(req);

    if (!detectedIp) {
      return res.status(400).json({ message: 'Invalid IP' });
    }

    const hashedIp = SHA256(detectedIp).toString();
    const getDocRef = (postId: string) =>
      doc(firestore, 'devlog', 'posts', 'postId', postId);

    if (req.method === 'GET') {
      const postId = req.query.id as string;
      const docSnap = await getDoc(getDocRef(postId));

      if (!docSnap.exists()) {
        return res.status(200).json(
          createApiSuccessResponse({
            isLiked: false,
            likeCount: 0
          })
        );
      }

      const data = docSnap.data();
      const { likeCount, encryptedIpAddress } = data as {
        likeCount: number;
        encryptedIpAddress: { [key: string]: null };
      };

      return res.status(200).json(
        createApiSuccessResponse({
          likeCount,
          isLiked: encryptedIpAddress[hashedIp] === null
        })
      );
    }

    if (req.method === 'POST') {
      const postId = req.body.id as string;
      await runTransaction(
        firestore,
        async (transaction) => {
          const docRef = getDocRef(postId);
          const docSnap = await transaction.get(docRef);
          const isDocSnapExists = docSnap.exists();

          if (!isDocSnapExists) {
            transaction.set(docRef, {
              likeCount: 1,
              encryptedIpAddress: {
                [hashedIp]: null
              }
            });
            return;
          }

          const { likeCount, encryptedIpAddress } = docSnap.data() as {
            likeCount: number;
            encryptedIpAddress: { [key: string]: null };
          };

          const isAleadyLiked = encryptedIpAddress[hashedIp] === null;
          const newEncryptedIpAddress = Object.assign({}, encryptedIpAddress);

          if (isAleadyLiked) {
            delete newEncryptedIpAddress[hashedIp];
          } else {
            newEncryptedIpAddress[hashedIp] = null;
          }

          transaction.update(docRef, {
            likeCount: likeCount + (isAleadyLiked ? -1 : 1),
            encryptedIpAddress: newEncryptedIpAddress
          });
        },
        {
          maxAttempts: 1
        }
      );

      return res.status(200).json(createApiSuccessResponse(null));
    }

    return res.status(405).json({});
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Unhandled Error' });
  }
}
