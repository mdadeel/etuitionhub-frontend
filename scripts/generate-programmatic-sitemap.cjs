const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://e-tuitionhub.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];

const CORE_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/tutors', priority: '0.9', changefreq: 'daily' },
  { path: '/tuitions', priority: '0.9', changefreq: 'daily' },
  { path: '/tutor-earnings', priority: '0.9', changefreq: 'weekly' },
  { path: '/pricing', priority: '0.9', changefreq: 'weekly' },
  { path: '/organizations', priority: '0.8', changefreq: 'weekly' },
  { path: '/search', priority: '0.8', changefreq: 'daily' },
  { path: '/become-tutor', priority: '0.8', changefreq: 'monthly' },
  { path: '/post-tuition', priority: '0.8', changefreq: 'monthly' },
  { path: '/testimonials', priority: '0.7', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/docs/engineering', priority: '0.5', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
];

const LOCATIONS = [
  {
    city: 'dhaka',
    thanas: ['dhanmondi', 'uttara', 'gulshan', 'banani', 'mirpur', 'mohammadpur', 'bashundhara', 'badda', 'khilgaon', 'shantinagar', 'malibagh', 'lalmatia'],
  },
  {
    city: 'chattogram',
    thanas: ['panchlaish', 'nasirabad', 'agrabad', 'halishahar', 'khulshi', 'chawkbazar'],
  },
  {
    city: 'sylhet',
    thanas: ['zindabazar', 'amberkhana', 'shahjalal-upashahar', 'subidbazar', 'shibganj'],
  },
  {
    city: 'rajshahi',
    thanas: ['boalia', 'motihar', 'rajpara'],
  },
  {
    city: 'khulna',
    thanas: ['sonadanga', 'khalishpur', 'daulatpur'],
  },
  { city: 'barishal', thanas: [] },
  { city: 'rangpur', thanas: [] },
  { city: 'comilla', thanas: [] },
  { city: 'gazipur', thanas: [] },
  { city: 'narayanganj', thanas: [] },
];

function generateSitemap() {
  const urls = [];

  for (const page of CORE_PAGES) {
    urls.push(`  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  // Regional city and thana URLs
  for (const loc of LOCATIONS) {
    urls.push(`  <url>
    <loc>${SITE_URL}/tutors/${loc.city}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);

    for (const thana of loc.thanas) {
      urls.push(`  <url>
    <loc>${SITE_URL}/tutors/${loc.city}/${thana}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml.trim() + '\n', 'utf8');
  console.log(`Generated sitemap with ${urls.length} URLs at ${outputPath}`);
}

generateSitemap();
