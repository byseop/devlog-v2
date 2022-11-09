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
  image = 'https://byseop.com/assets/images/byseop.png'
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="image_src" href={image} />
      <meta property="og:site_name" content="byseop devlog" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="blog" />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

export default Meta;
