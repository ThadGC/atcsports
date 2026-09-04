import { writeFileSync } from 'fs'

const SITE = 'https://atcfootball.com'
// path, changefreq, priority — public pages only (account/login/register are noindex-by-robots)
const PAGES = [
  ['/', 'weekly', '1.0'],
  ['/flag-football', 'weekly', '0.9'],
  ['/7v7', 'monthly', '0.8'],
  ['/camps', 'monthly', '0.8'],
  ['/divisions', 'monthly', '0.7'],
  ['/locations', 'monthly', '0.6'],
  ['/contact', 'yearly', '0.5'],
]
const today = new Date().toISOString().slice(0, 10)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(([loc, freq, pri]) => `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${pri}</priority>
  </url>`).join('\n')}
</urlset>
`
writeFileSync('public/sitemap.xml', xml)
console.log(`sitemap.xml — ${PAGES.length} urls, lastmod ${today}`)
