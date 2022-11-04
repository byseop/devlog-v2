/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true
};

const path = require('path');

module.exports = {
  ...nextConfig,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true
    }
  }
};
