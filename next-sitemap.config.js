/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://byseop.com',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap-index.xml'],
  robotsTxtOptions: {
    additionalSitemaps: ['https://byseop.com/server-sitemap-index.xml']
  }
};
