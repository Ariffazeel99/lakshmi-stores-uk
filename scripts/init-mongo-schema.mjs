import { MongoClient } from 'mongodb';
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

async function run() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await client.connect();
    const db = client.db('lakshmi_stores');
    console.log(`Connected to database: ${db.databaseName}`);

    // Helper to create or ensure collection
    async function setupCollection(name, validator) {
      const collections = await db.listCollections({ name }).toArray();
      if (collections.length === 0) {
        console.log(`Creating collection "${name}" with validator...`);
        try {
          await db.createCollection(name, { validator, validationLevel: 'moderate' });
          console.log(`✅ Collection "${name}" created with validator.`);
        } catch (e) {
          console.warn(`⚠️ Could not create "${name}" with validator (${e.message}), creating standard collection...`);
          await db.createCollection(name);
        }
      } else {
        console.log(`Collection "${name}" already exists.`);
        try {
          await db.command({
            collMod: name,
            validator,
            validationLevel: 'moderate'
          });
          console.log(`✅ Collection "${name}" validator updated.`);
        } catch (e) {
          console.log(`ℹ️ Note: Atlas user permission on collMod ("${name}"): ${e.message}. Proceeding with application-level validation.`);
        }
      }
    }

    // 1. PRODUCTS VALIDATOR
    const productsValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['title', 'slug', 'brand', 'category_slugs', 'is_active', 'variants', 'created_at', 'updated_at'],
        properties: {
          _id: { bsonType: 'objectId' },
          title: { bsonType: 'string' },
          tamil_title: { bsonType: ['string', 'null'] },
          slug: { bsonType: 'string' },
          brand: { bsonType: 'string' },
          category_slugs: {
            bsonType: 'array',
            items: { bsonType: 'string' }
          },
          description: { bsonType: 'string' },
          temperature_class: { enum: ['ambient', 'chilled', 'frozen'] },
          is_perishable: { bsonType: 'boolean' },
          is_active: { bsonType: 'boolean' },
          variants: {
            bsonType: 'array',
            minItems: 1
          }
        }
      }
    };

    // 2. USERS VALIDATOR
    const usersValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['email', 'role', 'created_at', 'updated_at'],
        properties: {
          _id: { bsonType: 'objectId' },
          email: { bsonType: 'string' },
          role: { enum: ['customer', 'admin'] }
        }
      }
    };

    // 3. ORDERS VALIDATOR
    const ordersValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['order_number', 'customer_email', 'currency', 'pricing_summary', 'items', 'shipping_address', 'order_status'],
        properties: {
          _id: { bsonType: 'objectId' },
          order_number: { bsonType: 'string' },
          order_status: { enum: ['pending', 'confirmed', 'processing', 'partially_shipped', 'completed', 'cancelled'] }
        }
      }
    };

    // 4. REVIEWS VALIDATOR
    const reviewsValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['product_id', 'user_id', 'rating', 'title', 'comment', 'is_verified_buyer', 'status', 'created_at'],
        properties: {
          _id: { bsonType: 'objectId' },
          product_id: { bsonType: 'objectId' },
          user_id: { bsonType: 'objectId' },
          rating: { bsonType: ['int', 'number'], minimum: 1, maximum: 5 },
          status: { enum: ['pending', 'approved', 'rejected'] }
        }
      }
    };

    // 5. CARTS & WISHLISTS
    const cartsValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['items', 'updated_at', 'expires_at']
      }
    };

    const wishlistsValidator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['user_id', 'name', 'items', 'created_at']
      }
    };

    await setupCollection('products', productsValidator);
    await setupCollection('users', usersValidator);
    await setupCollection('orders', ordersValidator);
    await setupCollection('reviews', reviewsValidator);
    await setupCollection('carts', cartsValidator);
    await setupCollection('wishlists', wishlistsValidator);

    // =========================================================================
    // INDEX CREATION
    // =========================================================================
    console.log('\n⚡ Creating Indexes across all collections...');

    // Products Indexes
    const prod = db.collection('products');
    try {
      await prod.createIndex({ slug: 1 }, { unique: true, name: 'uq_products_slug' });
      await prod.createIndex({ 'variants.sku': 1 }, { unique: true, name: 'uq_products_variants_sku' });
      await prod.createIndex({ category_slugs: 1, is_active: 1, created_at: -1 }, { name: 'idx_products_cat_active_created' });
      await prod.createIndex({ brand: 1, is_active: 1, 'variants.price': 1 }, { name: 'idx_products_brand_active_price' });
      await prod.createIndex({ 'variants.updated_by_user_id': 1, 'variants.updated_at': -1 }, { name: 'idx_products_variant_audit' });
      await prod.createIndex({ temperature_class: 1, is_active: 1 }, { name: 'idx_products_coldchain' });
      await prod.createIndex({ title: 'text', description: 'text' }, { name: 'idx_products_text_search' });
      console.log('✅ Products indexes created.');
    } catch (e) {
      console.warn('⚠️ Products index notice (will be built after data load if duplicates exist):', e.message);
    }

    // Users Indexes
    const users = db.collection('users');
    await users.createIndex({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 }, name: 'uq_users_email_ci' });
    await users.createIndex({ role: 1, created_at: -1 }, { name: 'idx_users_role_created' });
    console.log('✅ Users indexes created.');

    // Orders Indexes
    const orders = db.collection('orders');
    await orders.createIndex({ order_number: 1 }, { unique: true, name: 'uq_orders_number' });
    await orders.createIndex({ user_id: 1, created_at: -1 }, { name: 'idx_orders_user_created' });
    await orders.createIndex({ order_status: 1, created_at: 1 }, { name: 'idx_orders_status_created' });
    await orders.createIndex({ 'shipments.tracking_number': 1 }, { sparse: true, name: 'idx_orders_shipment_tracking' });
    await orders.createIndex({ 'payments.gateway_transaction_id': 1 }, { sparse: true, name: 'idx_orders_payment_tx' });
    console.log('✅ Orders indexes created.');

    // Reviews Indexes
    const reviews = db.collection('reviews');
    await reviews.createIndex({ product_id: 1, status: 1, created_at: -1 }, { name: 'idx_reviews_product_status_created' });
    await reviews.createIndex({ product_id: 1, user_id: 1, order_id: 1 }, { unique: true, sparse: true, name: 'uq_reviews_user_verified_order' });
    console.log('✅ Reviews indexes created.');

    // Carts Indexes (TTL on guest carts)
    const carts = db.collection('carts');
    await carts.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0, name: 'ttl_carts_expired' });
    await carts.createIndex({ user_id: 1 }, { sparse: true, name: 'idx_carts_user' });
    await carts.createIndex({ session_token: 1 }, { sparse: true, unique: true, name: 'uq_carts_session_token' });
    console.log('✅ Carts indexes created.');

    // Wishlists Indexes
    const wishlists = db.collection('wishlists');
    await wishlists.createIndex({ user_id: 1 }, { name: 'idx_wishlists_user' });
    console.log('✅ Wishlists indexes created.');

    console.log('\n🎉 Collections and indexes setup completed successfully!');
  } catch (err) {
    console.error('❌ Schema initialization error:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();

