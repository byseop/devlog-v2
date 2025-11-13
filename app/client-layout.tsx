'use client';

import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import StyledComponentsRegistry from '@/lib/registry';
import { Providers } from '@/components/Providers';
import { DefaultLayout } from '@components/Layouts';
import LayoutInner from '@components/Layouts/LayoutInner';
import NextTopLoader from 'nextjs-toploader';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader />
      <Analytics />
      {process.env.NEXT_PUBLIC_APP_ENV === 'production' && (
        <>
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-7GJZ6E40WG"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-7GJZ6E40WG');
              `
            }}
          />
        </>
      )}
      <StyledComponentsRegistry>
        <Providers>
          <DefaultLayout>
            <LayoutInner>{children}</LayoutInner>
          </DefaultLayout>
        </Providers>
      </StyledComponentsRegistry>
    </>
  );
}
