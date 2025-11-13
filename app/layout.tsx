import type { Metadata } from 'next';
import { ClientLayout } from './client-layout';

import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: 'byseop devlog',
  description:
    '프론트엔드 개발자 byseop 개발블로그 입니다. 세상에서 가장 빠르게 최신 개발 트렌드를 확인해보세요.',
  openGraph: {
    title: 'byseop devlog',
    description:
      '프론트엔드 개발자 byseop 개발블로그 입니다. 세상에서 가장 빠르게 최신 개발 트렌드를 확인해보세요.',
    type: 'website',
    locale: 'ko_KR',
    url: 'https://byseop.com',
    siteName: 'byseop devlog',
    images: [
      {
        url: 'https://byseop.com/assets/images/byseop.png',
        width: 1074,
        height: 674,
        alt: 'byseop devlog',
        secureUrl: 'https://byseop.com/assets/images/byseop.png',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: 'https://byseop.com',
    creator: 'byseop'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
