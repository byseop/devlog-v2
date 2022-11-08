import Head from 'next/head';

interface Props {
  title: string;
  description: string;
  url: string;
  image?: string;
}

const Meta: React.FC<Props> = ({
  title,
  description,
  url,
  image = '/assets/images/byseop.png'
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="image_src" href={image} />
      <meta property="og:site_name" content="byseop.com" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="ko-KR" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta property="fb:pages" content="byseop.com" />
    </Head>
  );
};

export default Meta;
