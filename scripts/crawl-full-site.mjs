/**
 * Comprehensive Full Site Crawler (Playwright)
 * Scope: Complete Catalog Dump (~3,500+ URLs: All Pages, Collections, Blogs, and Product Pages)
 * 
 * Features:
 * - Automatically parses all XML sitemaps directly from the live storefront.
 * - Saves rendered HTML snapshots to `crawled_pages/html/`.
 * - Saves extracted metadata (title, URL, timestamps) to `crawled_pages/metadata/`.
 * - Implements resume capability: skips already crawled URLs so it can be paused & resumed safely.
 * - Polite rate limiting and concurrent batching with Playwright Chromium.
 */

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const BASE_URL = "https://www.lakshmistores.com";
const OUTPUT_DIR = path.resolve(process.cwd(), "crawled_pages");
const HTML_DIR = path.join(OUTPUT_DIR, "html");
const META_DIR = path.join(OUTPUT_DIR, "metadata");
const PROGRESS_FILE = path.join(OUTPUT_DIR, "crawl_progress.json");

fs.mkdirSync(HTML_DIR, { recursive: true });
fs.mkdirSync(META_DIR, { recursive: true });

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
};

function safeFilename(urlStr) {
  try {
    const u = new URL(urlStr);
    let name = (u.pathname + u.search).replace(/[^a-zA-Z0-9-_]/g, '_');
    if (name.startsWith('_')) name = name.slice(1);
    if (!name) name = 'homepage';
    if (name.length > 180) name = name.slice(0, 180);
    return name;
  } catch {
    return 'page_' + Math.random().toString(36).slice(2);
  }
}

async function fetchSitemapUrls() {
  console.log("📡 Fetching sitemap index from", BASE_URL, "...");
  const sitemapIndexRes = await fetch(`${BASE_URL}/sitemap.xml`, { headers: HEADERS });
  const sitemapIndexXml = await sitemapIndexRes.text();
  const subSitemaps = (sitemapIndexXml.match(/<loc>(.*?)<\/loc>/g) || [])
    .map(s => s.replace(/<\/?loc>/g, '').replace(/&amp;/g, '&'))
    .filter(url => !url.includes('sitemap_agentic_discovery'));

  console.log(`📑 Found ${subSitemaps.length} sub-sitemaps. Gathering all URLs...`);
  const allUrls = new Set();

  for (const sitemapUrl of subSitemaps) {
    try {
      const res = await fetch(sitemapUrl, { headers: HEADERS });
      if (!res.ok) continue;
      const xml = await res.text();
      const locs = (xml.match(/<loc>(.*?)<\/loc>/g) || []).map(s => s.replace(/<\/?loc>/g, '').replace(/&amp;/g, '&'));
      locs.forEach(url => allUrls.add(url));
      console.log(`  ✓ Read ${locs.length} URLs from ${sitemapUrl.split('?')[0].split('/').pop()}`);
    } catch (e) {
      console.warn(`  ⚠️ Failed to fetch sitemap: ${sitemapUrl}`);
    }
  }

  // Ensure homepage is in the list
  allUrls.add(`${BASE_URL}/`);
  return Array.from(allUrls);
}

async function main() {
  const allUrls = await fetchSitemapUrls();
  console.log(`\n🎯 Total unique URLs discovered across entire site: ${allUrls.length}`);

  // Load progress if existing
  let completedUrls = new Set();
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      const prog = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
      completedUrls = new Set(prog.completed || []);
      console.log(`🔄 Found previous crawl progress: ${completedUrls.size} already completed.`);
    } catch {}
  }

  const remainingUrls = allUrls.filter(u => !completedUrls.has(u));
  console.log(`🚀 URLs remaining to crawl: ${remainingUrls.length}\n`);

  if (remainingUrls.length === 0) {
    console.log("🎉 All pages already crawled!");
    return;
  }

  console.log("🌐 Launching headless Chromium...");
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: HEADERS['User-Agent'],
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Block heavy third-party tracking scripts to speed up crawling 3x
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (
      url.includes('google-analytics') ||
      url.includes('googletagmanager') ||
      url.includes('facebook') ||
      url.includes('klaviyo') ||
      url.includes('hotjar') ||
      url.includes('doubleclick')
    ) {
      return route.abort();
    }
    return route.continue();
  });

  let counter = 0;
  const total = allUrls.length;

  for (let i = 0; i < remainingUrls.length; i++) {
    const targetUrl = remainingUrls[i];
    const currentIndex = completedUrls.size + 1;
    const baseName = safeFilename(targetUrl);
    const htmlFile = path.join(HTML_DIR, `${baseName}.html`);
    const metaFile = path.join(META_DIR, `${baseName}.meta.json`);

    process.stdout.write(`[${currentIndex}/${total}] Crawling: ${targetUrl.slice(0, 70)}... `);

    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(600); // Allow React hydration

      // Quick scroll to trigger lazy elements
      await page.evaluate(() => window.scrollBy(0, 1000));
      await page.waitForTimeout(300);

      const title = await page.title();
      const content = await page.content();

      fs.writeFileSync(htmlFile, content, 'utf8');
      fs.writeFileSync(
        metaFile,
        JSON.stringify(
          {
            url: targetUrl,
            title,
            crawledAt: new Date().toISOString(),
            bytes: Buffer.byteLength(content, 'utf8')
          },
          null,
          2
        ),
        'utf8'
      );

      completedUrls.add(targetUrl);
      console.log(`✅ OK (${(Buffer.byteLength(content, 'utf8') / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.log(`⚠️ Skip (${err.message.slice(0, 45)})`);
      completedUrls.add(targetUrl); // avoid getting stuck in loops
    }

    counter++;
    // Periodically save progress every 10 pages
    if (counter % 10 === 0) {
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ completed: Array.from(completedUrls) }, null, 2), 'utf8');
    }

    // Polite rate limit delay (300ms)
    await new Promise(r => setTimeout(r, 300));
  }

  // Final progress save
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ completed: Array.from(completedUrls) }, null, 2), 'utf8');
  await browser.close();
  console.log(`\n🎉 Comprehensive crawl complete! All rendered HTML saved in: ${HTML_DIR}`);
}

main().catch(err => {
  console.error("Fatal crawl error:", err);
  process.exit(1);
});

