import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

const BASE_URL = "https://www.lakshmistores.com";
const OUTPUT_DIR = path.resolve(process.cwd(), "lakshmi_store_data");
const IMAGES_DIR = path.join(OUTPUT_DIR, "images");
const DATA_DIR = path.resolve(process.cwd(), "data");

// Create output directories
fs.mkdirSync(IMAGES_DIR, { recursive: true });

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
};

const allProducts = [];
let page = 1;
const limit = 250; // Maximum products per page allowed by Shopify

// Set max pages via CLI argument if desired: e.g. node extract-products.mjs --max-pages=2
const maxPagesArg = process.argv.find(arg => arg.startsWith('--max-pages='));
const maxPages = maxPagesArg ? parseInt(maxPagesArg.split('=')[1], 10) : Infinity;

// Option to download images locally: --download-images (default false to keep extraction fast)
const downloadImages = process.argv.includes('--download-images');

console.log(`🚀 Starting product extraction from ${BASE_URL}...`);
if (downloadImages) {
  console.log(`📸 Image downloading enabled: saving images to ${IMAGES_DIR}`);
} else {
  console.log(`⚡ Fast mode: referencing direct CDN image URLs (pass --download-images to save files locally).`);
}

async function downloadImageFile(url, destPath) {
  try {
    if (fs.existsSync(destPath)) return;
    const res = await fetch(url, { headers });
    if (!res.ok) return;
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
  } catch (err) {
    // Non-fatal if an image fails to download
  }
}

async function main() {
  while (page <= maxPages) {
    const url = `${BASE_URL}/products.json?limit=${limit}&page=${page}`;
    console.log(`📡 Fetching page ${page}...`);

    let response;
    try {
      response = await fetch(url, { headers });
    } catch (error) {
      console.error(`❌ Network error fetching page ${page}:`, error.message);
      break;
    }

    if (!response.ok) {
      console.log(`⚠️ Completed or stopped on page ${page}. HTTP status: ${response.status}`);
      break;
    }

    const data = await response.json();
    const products = data.products || [];

    if (products.length === 0) {
      console.log("🏁 No more products found.");
      break;
    }

    console.log(`📦 Processing page ${page} (${products.length} products)...`);

    for (const item of products) {
      const variantsData = (item.variants || []).map(v => ({
        id: v.id,
        title: v.title,
        price: parseFloat(v.price) || 0,
        compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
        sku: v.sku,
        available: Boolean(v.available)
      }));

      const imagesList = (item.images || []).map(img => img.src).filter(Boolean);
      const mainImageUrl = imagesList[0] || null;
      let localImageFilename = null;

      if (mainImageUrl) {
        const cleanUrl = mainImageUrl.split('?')[0];
        const ext = cleanUrl.split('.').pop() || 'jpg';
        const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext.toLowerCase()) ? ext.toLowerCase() : 'jpg';
        const handle = item.handle || String(item.id);
        localImageFilename = `${handle}.${safeExt}`;

        if (downloadImages) {
          const localPath = path.join(IMAGES_DIR, localImageFilename);
          await downloadImageFile(mainImageUrl, localPath);
        }
      }

      const productRecord = {
        id: String(item.id),
        title: item.title,
        handle: item.handle,
        product_type: item.product_type,
        vendor: item.vendor,
        tags: item.tags,
        description: item.body_html,
        price: variantsData[0]?.price ?? 0,
        compare_at_price: variantsData[0]?.compare_at_price ?? null,
        variants: variantsData,
        primary_image_url: mainImageUrl,
        local_image_path: localImageFilename ? `/images/${localImageFilename}` : null,
        all_images: imagesList
      };

      allProducts.push(productRecord);
    }

    page += 1;
    // Delay 1 second to avoid rate-limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Save to lakshmi_store_data/products.json
  const jsonOutputPath = path.join(OUTPUT_DIR, "products.json");
  fs.writeFileSync(jsonOutputPath, JSON.stringify(allProducts, null, 2), "utf-8");

  // Also save a copy directly to data/extracted_products.json for immediate Next.js app imports
  const dataOutputPath = path.join(DATA_DIR, "extracted_products.json");
  fs.writeFileSync(dataOutputPath, JSON.stringify(allProducts, null, 2), "utf-8");

  console.log(`\n✨ Success! Extracted ${allProducts.length} total products.`);
  console.log(`📁 Data saved to:`);
  console.log(`   - ${jsonOutputPath}`);
  console.log(`   - ${dataOutputPath}`);
}

main().catch(err => {
  console.error("Fatal extraction error:", err);
  process.exit(1);
});

