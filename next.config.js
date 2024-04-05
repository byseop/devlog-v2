/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true
    }
  },
  images: {
    domains: ['www.notion.so']
  },
  async headers() {
    return [
      {
        source: '/api/:path',
        headers: [
          { key: 'Access-Controll-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Controll-Allow-Origin',
            value:
              'http://localhost:3000, https://byseop.com, https://devlog-v2-rj71-9z91i9fdn-byseops-projects.vercel.app/'
          },
          {
            key: 'Access-Controll-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,POST,PUT'
          },
          {
            key: 'Access-Controll-Allow-Headers',
            value:
              '"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"'
          }
        ]
      }
    ];
  }
};
