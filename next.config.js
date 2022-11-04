/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['redux-persist']);

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true
};

const path = require('path');

module.exports = withTM({
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
});
