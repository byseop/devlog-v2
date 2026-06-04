'use client';

import Link from 'next/link';

interface PostErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PostError({ reset }: PostErrorProps) {
  return (
    <main
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        textAlign: 'center',
        padding: '40px 20px'
      }}
    >
      <h1 style={{ fontSize: '1.5rem', margin: 0 }}>글을 불러오지 못했어요</h1>
      <p style={{ margin: 0, opacity: 0.7 }}>잠시 후 다시 시도해 주세요.</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button type="button" onClick={reset} style={{ cursor: 'pointer' }}>
          다시 시도
        </button>
        <Link href="/" style={{ textDecoration: 'underline' }}>
          홈으로
        </Link>
      </div>
    </main>
  );
}
