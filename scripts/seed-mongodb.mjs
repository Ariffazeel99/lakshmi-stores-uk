import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Read environment variable from .env.local or process.env
let uri = process.env.MONGODB_URI;

if (!uri) {
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    const match = envContent.match(/^MONGODB_URI=(.*)$/m);
    if (match && match[1]) {
      uri = match[1].trim().replace(/^["']|["']$/g, '');
    }
  }
}

if (uri) {
  uri = uri.trim().replace(/^["']|["']$/g, '');
}

if (!uri) {
  console.error('❌ Error: MONGODB_URI is not defined. Please set it in .env.local or pass it as an environment variable.');
  process.exit(1);
}

async function run() {
  const client = new MongoClient(uri);
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas!');

    const db = client.db('lakshmi_stores');
    console.log(`📂 Using database: "${db.databaseName}"`);

    // Load Live Products
    const liveProductsPath = path.resolve(process.cwd(), 'data/live_products.json');
    let liveProducts = [];
    if (fs.existsSync(liveProductsPath)) {
      liveProducts = JSON.parse(fs.readFileSync(liveProductsPath, 'utf8'));
    }

    // Load Extracted Shopify Products
    const extractedPath = path.resolve(process.cwd(), 'data/extracted_products.json');
    let extractedProducts = [];
    if (fs.existsSync(extractedPath)) {
      extractedProducts = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));
    }

    // Seed Live Catalog Products (Next.js format)
    if (liveProducts.length > 0) {
      console.log(`🌱 Seeding ${liveProducts.length} live products into "products" collection...`);
      const prodColl = db.collection('products');
      await prodColl.deleteMany({});
      // Insert in chunks of 500 for high efficiency
      const chunkSize = 500;
      for (let i = 0; i < liveProducts.length; i += chunkSize) {
        const chunk = liveProducts.slice(i, i + chunkSize);
        await prodColl.insertMany(chunk);
      }
      console.log(`✅ Successfully seeded ${liveProducts.length} products!`);
    }

    // Seed Raw Live Catalog Products
    if (extractedProducts.length > 0) {
      console.log(`🌱 Seeding ${extractedProducts.length} raw Shopify catalog items into "raw_shopify_catalog"...`);
      const rawColl = db.collection('raw_shopify_catalog');
      await rawColl.deleteMany({});
      const chunkSize = 500;
      for (let i = 0; i < extractedProducts.length; i += chunkSize) {
        const chunk = extractedProducts.slice(i, i + chunkSize);
        await rawColl.insertMany(chunk);
      }
      console.log(`✅ Successfully seeded ${extractedProducts.length} raw catalog items!`);
    }

    // List collections
    const collections = await db.listCollections().toArray();
    console.log('\n📊 Database Summary:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   - Collection "${col.name}": ${count} documents`);
    }

    console.log('\n🎉 MongoDB Atlas database seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding MongoDB Atlas:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
