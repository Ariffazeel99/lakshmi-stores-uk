import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Read connection string
const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
const match = envContent.match(/^MONGODB_URI=(.*)$/m);
if (!match || !match[1]) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}
const uri = match[1].trim().replace(/^['"]|['"]$/g, '');

const client = new MongoClient(uri);

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseWeightGrams(label) {
  if (!label) return null;
  const str = label.toLowerCase();
  const kgMatch = str.match(/(\d+(\.\d+)?)\s*kg/);
  if (kgMatch) return parseFloat(kgMatch[1]) * 1000;
  const gMatch = str.match(/(\d+(\.\d+)?)\s*g/);
  if (gMatch) return parseFloat(gMatch[1]);
  return null;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function run() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas for catalog migration...');
    await client.connect();
    const db = client.db('lakshmi_stores');
    console.log(`Connected to database: ${db.databaseName}`);

    // 1. BACKUP CURRENT PRODUCTS
    const existingProductsCount = await db.collection('products').countDocuments();
    console.log(`Current products count: ${existingProductsCount}`);
    if (existingProductsCount > 0) {
      console.log('📦 Creating backup collection "products_legacy_backup"...');
      const backupCollection = db.collection('products_legacy_backup');
      await backupCollection.deleteMany({});
      const oldDocs = await db.collection('products').find({}).toArray();
      await backupCollection.insertMany(oldDocs);
      console.log(`✅ Backed up ${oldDocs.length} legacy products to "products_legacy_backup".`);
    }

    // 2. SEED ADMIN & CUSTOMER USERS
    console.log('\n👤 Checking/Seeding Admin & Customer accounts in "users"...');
    const usersColl = db.collection('users');
    let adminUser = await usersColl.findOne({ email: 'admin@lakshmistores.co.uk' });
    if (!adminUser) {
      const now = new Date();
      const insertResult = await usersColl.insertOne({
        _id: new ObjectId(),
        email: 'admin@lakshmistores.co.uk',
        password_hash: '$2b$10$e8b5K7PZ.adminHashPlaceholder1234567890',
        first_name: 'Store',
        last_name: 'Administrator',
        phone: '+44 1332 505250',
        role: 'admin',
        saved_addresses: [
          {
            _id: new ObjectId(),
            recipient_name: 'Lakshmi Stores Operations Hub',
            phone: '+44 1332 505250',
            address_line1: '25-27 Normanton Road',
            city: 'Derby',
            county: 'Derbyshire',
            postcode: 'DE1 2GJ',
            country: 'United Kingdom',
            delivery_instructions: 'Operations and Fulfillment Depot',
            is_default: true
          }
        ],
        created_at: now,
        updated_at: now
      });
      adminUser = await usersColl.findOne({ _id: insertResult.insertedId });
      console.log(`✅ Created system administrator: ${adminUser.email} (ID: ${adminUser._id})`);
    } else {
      console.log(`ℹ️ System administrator exists: ${adminUser.email} (ID: ${adminUser._id})`);
    }

    // Test customer
    let sampleCustomer = await usersColl.findOne({ email: 'customer@lakshmistores.co.uk' });
    if (!sampleCustomer) {
      const now = new Date();
      await usersColl.insertOne({
        _id: new ObjectId(),
        email: 'customer@lakshmistores.co.uk',
        password_hash: '$2b$10$e8b5K7PZ.customerHashPlaceholder123456',
        first_name: 'Priya',
        last_name: 'Sundaram',
        phone: '+44 7700 900077',
        role: 'customer',
        saved_addresses: [
          {
            _id: new ObjectId(),
            recipient_name: 'Priya Sundaram',
            phone: '+44 7700 900077',
            address_line1: '42 Belgrave Road',
            city: 'Leicester',
            county: 'Leicestershire',
            postcode: 'LE4 5AS',
            country: 'United Kingdom',
            delivery_instructions: 'Leave with concierge or neighbor if absent',
            is_default: true
          }
        ],
        created_at: now,
        updated_at: now
      });
      console.log('✅ Created sample customer account (customer@lakshmistores.co.uk)');
    }
    sampleCustomer = await usersColl.findOne({ email: 'customer@lakshmistores.co.uk' });

    const adminUserId = adminUser._id;

    // 3. READ RAW AND LIVE PRODUCT SOURCES
    console.log('\n📖 Reading catalog sources...');
    const rawShopifyList = await db.collection('raw_shopify_catalog').find({}).toArray();
    console.log(`Found ${rawShopifyList.length} products in raw_shopify_catalog.`);

    const liveProductsPath = path.resolve(process.cwd(), 'data/live_products.json');
    let liveProductsMap = new Map();
    if (fs.existsSync(liveProductsPath)) {
      const liveArr = JSON.parse(fs.readFileSync(liveProductsPath, 'utf8'));
      liveArr.forEach(lp => {
        const numericId = lp.id.replace(/^ls-/, '');
        liveProductsMap.set(numericId, lp);
      });
      console.log(`Loaded ${liveProductsMap.size} frontend mappings from data/live_products.json.`);
    }

    // 4. MAP TO IDIOMATIC MONGODB DOCUMENT SCHEMA
    console.log('\n⚙️ Transforming catalog into idiomatic MongoDB document schema...');
    const usedSlugs = new Set();
    const usedSkus = new Set();
    const newProducts = [];
    const now = new Date();

    for (let i = 0; i < rawShopifyList.length; i++) {
      const raw = rawShopifyList[i];
      const live = liveProductsMap.get(String(raw.id)) || {};

      // Deterministic unique slug
      let baseSlug = raw.handle || slugify(raw.title || `product-${raw.id}`);
      if (!baseSlug) baseSlug = `product-${raw.id}`;
      let slug = baseSlug;
      let counter = 1;
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter++}`;
      }
      usedSlugs.add(slug);

      // Categories and classification
      const catName = live.category || 'Indian Groceries & Essentials';
      const subCatName = live.subCategory || raw.product_type || catName;
      const categorySlugs = [
        slugify(catName),
        slugify(subCatName)
      ].filter((v, idx, arr) => v && arr.indexOf(v) === idx);

      const titleUpper = (raw.title || '').toUpperCase();
      const tagsUpper = (raw.tags || []).map(t => String(t).toUpperCase());
      const isMeatFish = titleUpper.includes('MEAT') || titleUpper.includes('FISH') || titleUpper.includes('MUTTON') || titleUpper.includes('CHICKEN');
      const isFreshProduce = titleUpper.includes('FRESH') || catName.includes('Vegetables') || tagsUpper.some(t => t.includes('FRESH'));
      const isPerishable = isMeatFish || isFreshProduce || Boolean(live.isAirFreightFresh);
      const temperatureClass = (isMeatFish || isFreshProduce) ? 'chilled' : 'ambient';

      // Transform embedded images
      const rawImages = raw.all_images && raw.all_images.length > 0 ? raw.all_images : [raw.primary_image_url || live.image];
      const images = rawImages.filter(Boolean).map((imgUrl, idx) => ({
        url: imgUrl,
        alt_text: `${raw.title} - Image ${idx + 1}`,
        is_primary: idx === 0
      }));

      // Transform embedded variants
      const rawVariants = (raw.variants && raw.variants.length > 0)
        ? raw.variants
        : [
            {
              id: raw.id,
              title: 'Standard Pack',
              price: raw.price || 0.99,
              compare_at_price: raw.compare_at_price || null,
              sku: `LSUK-AUTO-${raw.id}`,
              available: true
            }
          ];

      const variants = rawVariants.map((v, vIdx) => {
        let skuCandidate = (v.sku || '').trim();
        if (!skuCandidate) {
          skuCandidate = `LSUK-${raw.id}-${vIdx + 1}`;
        }
        let finalSku = skuCandidate;
        let skuSuffix = 1;
        while (usedSkus.has(finalSku)) {
          finalSku = `${skuCandidate}-${skuSuffix++}`;
        }
        usedSkus.add(finalSku);

        let sizeLabel = v.title;
        if (!sizeLabel || sizeLabel.toLowerCase() === 'default title') {
          sizeLabel = 'Standard Pack';
        }

        const priceNum = Number(v.price) || Number(raw.price) || 0.99;
        const compareNum = v.compare_at_price ? Number(v.compare_at_price) : null;
        const stockQty = v.available !== false ? 100 : 0;

        return {
          _id: new ObjectId(),
          sku: finalSku,
          barcode: v.barcode ? String(v.barcode) : null,
          size: sizeLabel,
          color: null,
          net_weight_grams: parseWeightGrams(sizeLabel) || parseWeightGrams(raw.title),
          price: priceNum,
          compare_at_price: compareNum && compareNum > priceNum ? compareNum : null,
          stock_quantity: stockQty,
          reserved_quantity: 0,
          vat_rate: 0.0, // Food essentials zero-rated in UK
          is_active: true,
          updated_by_user_id: adminUserId,
          updated_at: now
        };
      });

      const cleanDesc = cleanHtml(raw.description) || `${raw.title} authentic Indian grocery essentials from Lakshmi Stores UK.`;

      newProducts.push({
        _id: new ObjectId(),
        title: raw.title.trim(),
        tamil_title: live.tamilName || null,
        slug,
        brand: raw.vendor || live.brand || 'Lakshmi Stores UK',
        category_slugs: categorySlugs,
        description: cleanDesc,
        temperature_class: temperatureClass,
        is_perishable: isPerishable,
        is_active: true,
        images,
        variants,
        created_at: now,
        updated_at: now
      });
    }

    console.log(`✨ Successfully transformed ${newProducts.length} products with ${usedSkus.size} unique variants.`);

    // 5. INSERT INTO PRODUCTS COLLECTION IN CHUNKS
    console.log('\n🚀 Replacing "products" collection with validated document schema...');
    const productsColl = db.collection('products');
    await productsColl.deleteMany({});

    const chunkSize = 500;
    for (let i = 0; i < newProducts.length; i += chunkSize) {
      const chunk = newProducts.slice(i, i + chunkSize);
      await productsColl.insertMany(chunk);
      console.log(`Inserted chunk ${i + 1} - ${Math.min(i + chunkSize, newProducts.length)} / ${newProducts.length}`);
    }

    console.log('\n⚡ Building production indexes on "products"...');
    await productsColl.createIndex({ slug: 1 }, { unique: true, name: 'uq_products_slug' });
    await productsColl.createIndex({ 'variants.sku': 1 }, { unique: true, name: 'uq_products_variants_sku' });
    await productsColl.createIndex({ category_slugs: 1, is_active: 1, created_at: -1 }, { name: 'idx_products_cat_active_created' });
    await productsColl.createIndex({ brand: 1, is_active: 1, 'variants.price': 1 }, { name: 'idx_products_brand_active_price' });
    await productsColl.createIndex({ 'variants.updated_by_user_id': 1, 'variants.updated_at': -1 }, { name: 'idx_products_variant_audit' });
    await productsColl.createIndex({ temperature_class: 1, is_active: 1 }, { name: 'idx_products_coldchain' });
    await productsColl.createIndex({ title: 'text', description: 'text' }, { name: 'idx_products_text_search' });
    console.log('✅ Products indexes created successfully!');

    // 6. SEED A SAMPLE ORDER WITH IMMUTABLE SNAPSHOTS
    console.log('\n📝 Seeding sample verified order & review...');
    const sampleProduct = newProducts[0];
    const sampleVariant = sampleProduct.variants[0];

    const orderNumber = `LSUK-ORD-${Date.now().toString().slice(-6)}`;
    const orderDoc = {
      _id: new ObjectId(),
      order_number: orderNumber,
      user_id: sampleCustomer._id,
      customer_email: sampleCustomer.email,
      customer_phone: sampleCustomer.phone,
      currency: 'GBP',
      pricing_summary: {
        subtotal: sampleVariant.price,
        discount_total: 0,
        tax_total: 0,
        shipping_fee: 4.99,
        grand_total: Number((sampleVariant.price + 4.99).toFixed(2))
      },
      items: [
        {
          product_id: sampleProduct._id,
          variant_id: sampleVariant._id,
          sku: sampleVariant.sku,
          title: sampleProduct.title,
          size_or_weight: sampleVariant.size,
          unit_price: sampleVariant.price,
          discount_applied: 0,
          tax_rate: 0.0,
          tax_amount: 0.0,
          quantity: 1,
          line_total: sampleVariant.price,
          is_chilled: sampleProduct.temperature_class === 'chilled'
        }
      ],
      shipping_address: {
        recipient_name: 'Priya Sundaram',
        phone: '+44 7700 900077',
        address_line1: '42 Belgrave Road',
        address_line2: null,
        city: 'Leicester',
        county: 'Leicestershire',
        postcode: 'LE4 5AS',
        country: 'United Kingdom',
        delivery_instructions: 'Leave at front porch'
      },
      billing_address: {
        recipient_name: 'Priya Sundaram',
        address_line1: '42 Belgrave Road',
        city: 'Leicester',
        postcode: 'LE4 5AS',
        country: 'United Kingdom'
      },
      payments: [
        {
          payment_id: `pay_${Date.now()}`,
          method: 'card',
          gateway: 'stripe',
          gateway_transaction_id: `ch_3NwK...${Date.now()}`,
          amount: Number((sampleVariant.price + 4.99).toFixed(2)),
          currency: 'GBP',
          status: 'captured',
          failure_reason: null,
          created_at: now
        }
      ],
      shipments: [
        {
          shipment_id: `ship_${Date.now()}`,
          carrier: 'DPD',
          tracking_number: `DPD-UK-99281726`,
          shipping_method: sampleProduct.temperature_class === 'chilled' ? 'chilled_express' : 'standard',
          has_chilled_packaging: sampleProduct.temperature_class === 'chilled',
          ice_pack_count: sampleProduct.temperature_class === 'chilled' ? 2 : 0,
          status: 'dispatched',
          items_packed: [
            {
              sku: sampleVariant.sku,
              quantity: 1
            }
          ],
          dispatched_at: now,
          delivered_at: null
        }
      ],
      order_status: 'processing',
      created_at: now,
      updated_at: now
    };

    const ordersColl = db.collection('orders');
    await ordersColl.insertOne(orderDoc);
    console.log(`✅ Created verified order: ${orderDoc.order_number}`);

    // Seed sample verified review
    const reviewsColl = db.collection('reviews');
    await reviewsColl.insertOne({
      _id: new ObjectId(),
      product_id: sampleProduct._id,
      user_id: sampleCustomer._id,
      order_id: orderDoc._id,
      sku: sampleVariant.sku,
      rating: 5,
      title: 'Exceptional freshness and authentic aroma!',
      comment: 'Arrived promptly with ice packs and fresh cold seal. Exactly what we were looking for in the UK.',
      is_verified_buyer: true,
      status: 'approved',
      created_at: now,
      updated_at: now
    });
    console.log(`✅ Created verified review for product: ${sampleProduct.title}`);

    // 7. FINAL AUDIT
    const finalCount = await productsColl.countDocuments();
    const finalOrdersCount = await ordersColl.countDocuments();
    const finalUsersCount = await usersColl.countDocuments();
    const finalReviewsCount = await reviewsColl.countDocuments();

    console.log('\n=============================================');
    console.log('🎉 MIGRATION SUCCESSFULLY COMPLETED!');
    console.log(`Total Products: ${finalCount}`);
    console.log(`Total Unique Variants: ${usedSkus.size}`);
    console.log(`Total Users: ${finalUsersCount}`);
    console.log(`Total Orders: ${finalOrdersCount}`);
    console.log(`Total Reviews: ${finalReviewsCount}`);
    console.log('=============================================\n');

  } catch (err) {
    console.error('❌ Migration Error:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
