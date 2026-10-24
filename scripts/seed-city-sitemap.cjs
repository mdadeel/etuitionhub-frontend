// Delegates to generate-programmatic-sitemap.cjs so the canonical domain
// (https://e-tuitionhub.vercel.app) and full city/thana hierarchy stay intact.
const { generateSitemap } = require('./generate-programmatic-sitemap.cjs');

generateSitemap();
