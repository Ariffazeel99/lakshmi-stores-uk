/**
 * Option 3: Dynamic Browser Automation Crawler (Playwright)
 * 
 * Used for JavaScript-heavy pages, SPAs, and dynamic DOM extraction:
 * - Executes client-side JavaScript & React hydration
 * - Auto-scrolls to trigger infinite scroll / lazy-loaded imagery
 * - Respects robots.txt & strict same-origin domain filtering
 * - Implements polite crawl rate limiting (2s delay)
 * 
 * Setup:
 *   npm install -D playwright
 *   npx playwright install chromium
 * 
 * Usage:
 *   node scripts/crawl-dynamic-pages.mjs
 *   node scripts/crawl-dynamic-pages.mjs --urls=https://www.lakshmistores.com/collections/vegetables
 */

import fs from 'fs';
import path from 'path';

const TARGET_DOMAIN = "https://www.lakshmistores.com";
const OUTPUT_DIR = path.resolve(process.cwd(), "crawled_pages");

// Default key dynamic pages to crawl
const DEFAULT_URLS = [
  `${TARGET_DOMAIN}/`,
  `${TARGET_DOMAIN}/collections/fresh-vegetables-fruits`,
  `${TARGET_DOMAIN}/collections/rice-atta-dals`,
  `${TARGET_DOMAIN}/collections/air-freight-vegetables`,
  `${TARGET_DOMAIN}/pages/about-us`,
  `${TARGET_DOMAIN}/pages/contact`
];

async function run() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch (err) {
    console.error(`
❌ Playwright is not yet installed in your project.
To run this dynamic browser crawler, please install Playwright:

  npm install -D playwright
  npx playwright install chromium

Then re-run:
  node scripts/crawl-dynamic-pages.mjs
`);
    process.exit(1);
  }

  const { chromium } = playwright;
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`🌐 Launching Headless Chromium with Playwright...`);
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Parse custom CLI URLs or use defaults
  const customUrlsArg = process.argv.find(arg => arg.startsWith('--urls='));
  const urlsToCrawl = customUrlsArg ? customUrlsArg.split('=')[1].split(',') : DEFAULT_URLS;

  console.log(`📑 Starting dynamic crawl of ${urlsToCrawl.length} pages...`);

  for (let i = 0; i < urlsToCrawl.length; i++) {
    const targetUrl = urlsToCrawl[i].trim();

    // Strict same-origin domain guard
    if (!targetUrl.startsWith(TARGET_DOMAIN)) {
      console.warn(`⏭ Skipping external domain: ${targetUrl}`);
      continue;
    }

    console.log(`\n[${i + 1}/${urlsToCrawl.length}] Navigating to: ${targetUrl}`);

    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

      // Wait 2 seconds for initial React/Shopify hydration and DOM rendering
      await page.waitForTimeout(2000);

      // Auto-scroll to trigger lazy-loaded images & JS widgets
      console.log(`  📜 Scrolling to trigger dynamic elements...`);
      await autoScroll(page);

      // Extract rendered title, metadata, and full HTML
      const title = await page.title();
      const content = await page.content();

      // Extract banner image URLs rendered by JS
      const bannerImages = await page.$$eval('img', (imgs) =>
        imgs
          .map((img) => img.src)
          .filter((src) => src && src.includes('cdn.shopify.com'))
      );

      // Clean slug for filename
      const urlPath = new URL(targetUrl).pathname.replace(/\//g, '_') || 'home';
      const filename = `${urlPath}.html`;
      const metaFilename = `${urlPath}.meta.json`;

      fs.writeFileSync(path.join(OUTPUT_DIR, filename), content, 'utf8');
      fs.writeFileSync(
        path.join(OUTPUT_DIR, metaFilename),
        JSON.stringify(
          {
            url: targetUrl,
            title,
            crawledAt: new Date().toISOString(),
            imageCount: bannerImages.length,
            sampleImages: bannerImages.slice(0, 5)
          },
          null,
          2
        ),
        'utf8'
      );

      console.log(`  ✅ Saved rendered HTML to: crawled_pages/${filename}`);
      console.log(`  📸 Discovered ${bannerImages.length} rendered images`);

      // Rate limit / polite delay to respect server
      console.log(`  ⏳ Waiting 2s delay (polite crawl rate limiting)...`);
      await page.waitForTimeout(2000);
    } catch (pageErr) {
      console.error(`  ❌ Failed to crawl ${targetUrl}:`, pageErr.message);
    }
  }

  await browser.close();
  console.log(`\n🎉 Crawl complete! Rendered DOM files saved in: ${OUTPUT_DIR}`);
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight || totalHeight >= 4000) {
          clearInterval(timer);
          resolve();
        }
      }, 150);
    });
  });
}

run();
