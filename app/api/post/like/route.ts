import { firestore } from '@core/firebase';
import { doc, getDoc, runTransaction } from 'firebase/firestore/lite';
import { SHA256 } from 'crypto-js';
import { createApiSuccessResponse } from '@core/utils';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import type { IAPIError, Response } from '@interfaces/index';
import type { ILikeResponse } from '@interfaces/post';

function getClientIp(request: NextRequest): string | null {
  // Check various headers for the client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a default for development
  return '127.0.0.1';
}

export async function GET(request: NextRequest) {
  try {
    const detectedIp = getClientIp(request);

    if (!detectedIp) {
      return NextResponse.json<IAPIError>(
        { message: 'Invalid IP' },
        { status: 400 }
      );
    }

    const hashedIp = SHA256(detectedIp).toString();
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json<IAPIError>(
        { message: 'Post ID required' },
        { status: 400 }
      );
    }

    const getDocRef = (postId: string) =>
      doc(firestore, 'devlog', 'posts', 'postId', postId);

    const docSnap = await getDoc(getDocRef(postId));

    if (!docSnap.exists()) {
      return NextResponse.json<Response<ILikeResponse>>(
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

    return NextResponse.json<Response<ILikeResponse>>(
      createApiSuccessResponse({
        likeCount,
        isLiked: encryptedIpAddress[hashedIp] === null
      })
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json<IAPIError>(
      { message: 'Unhandled Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const detectedIp = getClientIp(request);

    if (!detectedIp) {
      return NextResponse.json<IAPIError>(
        { message: 'Invalid IP' },
        { status: 400 }
      );
    }

    const hashedIp = SHA256(detectedIp).toString();
    const body = await request.json();
    const postId = body.id as string;

    if (!postId) {
      return NextResponse.json<IAPIError>(
        { message: 'Post ID required' },
        { status: 400 }
      );
    }

    const getDocRef = (postId: string) =>
      doc(firestore, 'devlog', 'posts', 'postId', postId);

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

    return NextResponse.json<Response<null>>(createApiSuccessResponse(null));
  } catch (e) {
    console.log(e);
    return NextResponse.json<IAPIError>(
      { message: 'Unhandled Error' },
      { status: 500 }
    );
  }
}
