import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { ReviewDocument, OrderDocument } from '@/types/mongodb';

export interface CreateReviewParams {
  productId: string | ObjectId;
  userId: string | ObjectId;
  orderId?: string | ObjectId | null;
  sku?: string | null;
  rating: number; // 1 to 5
  title: string;
  comment: string;
}

export async function createReview(params: CreateReviewParams): Promise<ReviewDocument> {
  const db = await getDatabase();
  const pId = typeof params.productId === 'string' ? new ObjectId(params.productId) : params.productId;
  const uId = typeof params.userId === 'string' ? new ObjectId(params.userId) : params.userId;
  const oId = params.orderId ? (typeof params.orderId === 'string' ? new ObjectId(params.orderId) : params.orderId) : null;

  // Verify buyer status: Check if user has an order containing this product
  let isVerified = false;
  if (oId) {
    const matchingOrder = await db.collection<OrderDocument>('orders').findOne({
      _id: oId,
      user_id: uId,
      'items.product_id': pId
    });
    isVerified = Boolean(matchingOrder);
  } else {
    const priorOrder = await db.collection<OrderDocument>('orders').findOne({
      user_id: uId,
      'items.product_id': pId
    });
    isVerified = Boolean(priorOrder);
  }

  const now = new Date();
  const reviewDoc: ReviewDocument = {
    _id: new ObjectId(),
    product_id: pId,
    user_id: uId,
    order_id: oId,
    sku: params.sku || null,
    rating: Math.max(1, Math.min(5, Math.round(params.rating))),
    title: params.title.trim(),
    comment: params.comment.trim(),
    is_verified_buyer: isVerified,
    status: 'approved', // Auto-approved or 'pending' in moderation workflows
    created_at: now,
    updated_at: now
  };

  await db.collection<ReviewDocument>('reviews').insertOne(reviewDoc);
  return reviewDoc;
}

export async function getProductReviews(productId: string | ObjectId, page: number = 1, limit: number = 10) {
  const db = await getDatabase();
  const pId = typeof productId === 'string' ? new ObjectId(productId) : productId;
  const skip = (Math.max(1, page) - 1) * limit;

  const [reviews, totalCount] = await Promise.all([
    db
      .collection<ReviewDocument>('reviews')
      .find({ product_id: pId, status: 'approved' })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection<ReviewDocument>('reviews').countDocuments({ product_id: pId, status: 'approved' })
  ]);

  return {
    reviews,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
}

export async function getProductReviewStats(productId: string | ObjectId) {
  const db = await getDatabase();
  const pId = typeof productId === 'string' ? new ObjectId(productId) : productId;

  const stats = await db
    .collection<ReviewDocument>('reviews')
    .aggregate([
      { $match: { product_id: pId, status: 'approved' } },
      {
        $group: {
          _id: '$product_id',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          verifiedCount: {
            $sum: { $cond: ['$is_verified_buyer', 1, 0] }
          }
        }
      }
    ])
    .toArray();

  if (stats.length === 0) {
    return {
      averageRating: 5.0,
      totalReviews: 0,
      verifiedCount: 0
    };
  }

  return {
    averageRating: Number(stats[0].averageRating.toFixed(1)),
    totalReviews: stats[0].totalReviews,
    verifiedCount: stats[0].verifiedCount
  };
}

