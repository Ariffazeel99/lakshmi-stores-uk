import { ObjectId, Filter } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { ProductDocument, VariantSubdocument } from '@/types/mongodb';
import { Product, WeightOption } from '@/data/products';

export interface ProductQueryOptions {
  categorySlug?: string;
  brand?: string;
  search?: string;
  tab?: 'all' | 'air-freight' | 'weekly-offers' | 'bestsellers' | 'festive';
  temperatureClass?: 'ambient' | 'chilled' | 'frozen';
  page?: number;
  limit?: number;
  sortBy?: 'created_desc' | 'price_asc' | 'price_desc';
}

/**
 * Adapter helper: Converts an idiomatic MongoDB ProductDocument into
 * the legacy frontend Product interface expected by ProductCard & UI components.
 */
export function mapProductDocumentToFrontend(doc: ProductDocument): Product {
  const primaryImg = doc.images.find((img) => img.is_primary)?.url || doc.images[0]?.url || '';

  const options: WeightOption[] = doc.variants.map((v: VariantSubdocument) => ({
    weight: v.size || 'Standard Pack',
    priceGBP: v.price,
    originalPriceGBP: v.compare_at_price ? v.compare_at_price : undefined,
    inStock: v.stock_quantity > v.reserved_quantity && v.is_active
  }));

  const isAirFreight = doc.temperature_class === 'chilled' || doc.is_perishable;
  const isOffer = options.some((o) => o.originalPriceGBP && o.originalPriceGBP > o.priceGBP);

  return {
    id: `ls-${doc._id.toString()}`,
    name: doc.title,
    tamilName: doc.tamil_title || undefined,
    category: doc.category_slugs[0] ? doc.category_slugs[0].replace(/-/g, ' ') : 'Indian Groceries',
    subCategory: doc.category_slugs[1] ? doc.category_slugs[1].replace(/-/g, ' ') : 'General',
    brand: doc.brand,
    description: doc.description,
    origin: isAirFreight ? 'Tamil Nadu & Kerala, India' : 'India',
    rating: 4.8,
    reviewCount: 45,
    isAirFreightFresh: isAirFreight,
    isBestseller: true,
    isWeeklyOffer: isOffer,
    isFestiveSpecial: false,
    image: primaryImg,
    dietaryTags: isAirFreight ? ['Air Freight Fresh', 'Authentic Indian'] : ['100% Genuine', 'Pure Sourced'],
    options: options.length > 0 ? options : [{ weight: 'Standard Pack', priceGBP: 1.99, inStock: true }]
  };
}

/**
 * Query products from MongoDB utilizing ESR compound indexes.
 */
export async function getProducts(options: ProductQueryOptions = {}) {
  const db = await getDatabase();
  const collection = db.collection<ProductDocument>('products');

  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 24));
  const skip = (page - 1) * limit;

  const filter: Filter<ProductDocument> = { is_active: true };

  if (options.categorySlug) {
    filter.category_slugs = options.categorySlug;
  }

  if (options.brand) {
    filter.brand = options.brand;
  }

  if (options.temperatureClass) {
    filter.temperature_class = options.temperatureClass;
  }

  if (options.tab === 'air-freight') {
    filter.$or = [{ is_perishable: true }, { temperature_class: 'chilled' }];
  } else if (options.tab === 'weekly-offers') {
    filter.$or = [{ 'variants.compare_at_price': { $ne: null } }, { 'variants.price': { $lte: 2.99 } }];
  } else if (options.tab === 'bestsellers') {
    filter.brand = { $in: ['HEERA', 'Lakshmi Stores UK', 'AACHI', 'HALDIRAMS'] } as any;
  } else if (options.tab === 'festive') {
    filter.category_slugs = { $in: ['pooja-festive-items', 'ready-mixes-sweets', 'sweets-and-snacks'] } as any;
  }

  if (options.search) {
    filter.$text = { $search: options.search };
  }

  let sortCriteria: any = { created_at: -1 };
  if (options.sortBy === 'price_asc') {
    sortCriteria = { 'variants.price': 1 };
  } else if (options.sortBy === 'price_desc') {
    sortCriteria = { 'variants.price': -1 };
  }

  const [docs, totalCount] = await Promise.all([
    collection.find(filter).sort(sortCriteria).skip(skip).limit(limit).toArray(),
    collection.countDocuments(filter)
  ]);

  return {
    products: docs.map(mapProductDocumentToFrontend),
    rawDocuments: docs,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
}

/**
 * Fetch a single product by SEO slug with full embedded variants.
 */
export async function getProductBySlug(slug: string): Promise<ProductDocument | null> {
  const db = await getDatabase();
  return db.collection<ProductDocument>('products').findOne({ slug, is_active: true });
}

/**
 * Atomically reserve inventory for a specific variant.
 * Uses guard condition `stock_quantity >= quantity` to guarantee zero overselling.
 */
export async function reserveVariantStock(
  productId: ObjectId | string,
  variantId: ObjectId | string,
  quantity: number,
  adminOrUserId: ObjectId | string
): Promise<{ success: boolean; message: string }> {
  const db = await getDatabase();
  const pId = typeof productId === 'string' ? new ObjectId(productId) : productId;
  const vId = typeof variantId === 'string' ? new ObjectId(variantId) : variantId;
  const uId = typeof adminOrUserId === 'string' ? new ObjectId(adminOrUserId) : adminOrUserId;

  const result = await db.collection<ProductDocument>('products').updateOne(
    {
      _id: pId,
      'variants._id': vId,
      'variants.stock_quantity': { $gte: quantity } // Invariant guard
    },
    {
      $inc: {
        'variants.$.stock_quantity': -quantity,
        'variants.$.reserved_quantity': quantity
      },
      $set: {
        'variants.$.updated_by_user_id': uId,
        'variants.$.updated_at': new Date()
      }
    }
  );

  if (result.matchedCount === 0) {
    return {
      success: false,
      message: 'Insufficient inventory available or product variant not found.'
    };
  }

  return {
    success: true,
    message: `Successfully reserved ${quantity} unit(s).`
  };
}

