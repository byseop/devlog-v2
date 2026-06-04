import Link from 'next/link';

export default function PostNotFound() {
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
      <h1 style={{ fontSize: '2rem', margin: 0 }}>404</h1>
      <p style={{ margin: 0, opacity: 0.7 }}>
        존재하지 않거나 삭제된 글이에요.
      </p>
      <Link href="/" style={{ textDecoration: 'underline' }}>
        홈으로 돌아가기
      </Link>
    </main>
  );
}
