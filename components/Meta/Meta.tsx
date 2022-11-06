import Head from 'next/head';

interface Props {
  title: string;
  description: string;
  url: string;
  image?: string;
}

const Meta: React.FC<Props> = ({ title, description, url, image }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="image_src" href={image || ''} />
      <meta property="og:site_name" content="byseop.dev" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ko-KR" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image || ''} />
      <meta property="fb:pages" content="byseop.dev" />
    </Head>
  );
};

export default Meta;
