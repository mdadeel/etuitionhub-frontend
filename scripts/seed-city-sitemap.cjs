// Run from project root: node etuitionhub-frontend/scripts/seed-city-sitemap.cjs
// Appends <urlset> entries for the 12 major BD cities to public/sitemap.xml
const fs = require('fs');
const path = require('path');

const CITIES = ['dhaka', 'chattogram', 'sylhet', 'rajshahi', 'khulna', 'barishal', 'rangpur', 'comilla', 'gazipur', 'narayanganj', 'mirpur', 'uttara'];

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
let xml = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
CITIES.forEach((c) => {
  xml += `<url><loc>https://etuitionhub-frontend.vercel.app/tutors/${c}</loc><changefreq>weekly</changefreq></url>`;
});
xml += '</urlset>';
fs.writeFileSync(sitemapPath, xml);
console.log('Sitemap updated for', CITIES.length, 'cities');
