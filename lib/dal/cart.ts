import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { CartDocument, CartItemSubdocument } from '@/types/mongodb';

const CART_TTL_DAYS = 30;

function getExpirationDate(): Date {
  const expires = new Date();
  expires.setDate(expires.getDate() + CART_TTL_DAYS);
  return expires;
}

export async function getOrCreateCart(userId?: string | null, sessionToken?: string | null): Promise<CartDocument> {
  const db = await getDatabase();
  const carts = db.collection<CartDocument>('carts');
  const now = new Date();
  const expiresAt = getExpirationDate();

  if (userId) {
    const uId = new ObjectId(userId);
    let userCart = await carts.findOne({ user_id: uId });
    if (!userCart) {
      const newCart: CartDocument = {
        _id: new ObjectId(),
        user_id: uId,
        session_token: sessionToken || null,
        items: [],
        updated_at: now,
        expires_at: expiresAt
      };
      await carts.insertOne(newCart);
      return newCart;
    }
    return userCart;
  }

  if (sessionToken) {
    let guestCart = await carts.findOne({ session_token: sessionToken });
    if (!guestCart) {
      const newCart: CartDocument = {
        _id: new ObjectId(),
        user_id: null,
        session_token: sessionToken,
        items: [],
        updated_at: now,
        expires_at: expiresAt
      };
      await carts.insertOne(newCart);
      return newCart;
    }
    return guestCart;
  }

  // Fallback guest cart
  const newCart: CartDocument = {
    _id: new ObjectId(),
    user_id: null,
    session_token: `gst_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    items: [],
    updated_at: now,
    expires_at: expiresAt
  };
  await carts.insertOne(newCart);
  return newCart;
}

export async function addItemToCart(
  cartId: string | ObjectId,
  item: {
    productId: string | ObjectId;
    variantId: string | ObjectId;
    sku: string;
    quantity: number;
    unitPrice?: number;
  }
): Promise<CartDocument | null> {
  const db = await getDatabase();
  const cId = typeof cartId === 'string' ? new ObjectId(cartId) : cartId;
  const pId = typeof item.productId === 'string' ? new ObjectId(item.productId) : item.productId;
  const vId = typeof item.variantId === 'string' ? new ObjectId(item.variantId) : item.variantId;
  const now = new Date();
  const expiresAt = getExpirationDate();

  // Try incrementing quantity if variant already exists in cart items
  const updateExisting = await db.collection<CartDocument>('carts').findOneAndUpdate(
    { _id: cId, 'items.variant_id': vId },
    {
      $inc: { 'items.$.quantity': item.quantity },
      $set: { updated_at: now, expires_at: expiresAt }
    },
    { returnDocument: 'after' }
  );

  if (updateExisting) {
    return updateExisting;
  }

  // Otherwise push new item subdocument
  const newItem: CartItemSubdocument = {
    product_id: pId,
    variant_id: vId,
    sku: item.sku,
    quantity: item.quantity,
    unit_price_at_addition: item.unitPrice || null,
    added_at: now
  };

  return db.collection<CartDocument>('carts').findOneAndUpdate(
    { _id: cId },
    {
      $push: { items: newItem },
      $set: { updated_at: now, expires_at: expiresAt }
    },
    { returnDocument: 'after' }
  );
}

export async function updateCartItemQuantity(
  cartId: string | ObjectId,
  variantId: string | ObjectId,
  quantity: number
): Promise<CartDocument | null> {
  const db = await getDatabase();
  const cId = typeof cartId === 'string' ? new ObjectId(cartId) : cartId;
  const vId = typeof variantId === 'string' ? new ObjectId(variantId) : variantId;
  const now = new Date();
  const expiresAt = getExpirationDate();

  if (quantity <= 0) {
    return removeItemFromCart(cId, vId);
  }

  return db.collection<CartDocument>('carts').findOneAndUpdate(
    { _id: cId, 'items.variant_id': vId },
    {
      $set: {
        'items.$.quantity': quantity,
        updated_at: now,
        expires_at: expiresAt
      }
    },
    { returnDocument: 'after' }
  );
}

export async function removeItemFromCart(
  cartId: string | ObjectId,
  variantId: string | ObjectId
): Promise<CartDocument | null> {
  const db = await getDatabase();
  const cId = typeof cartId === 'string' ? new ObjectId(cartId) : cartId;
  const vId = typeof variantId === 'string' ? new ObjectId(variantId) : variantId;
  const now = new Date();
  const expiresAt = getExpirationDate();

  return db.collection<CartDocument>('carts').findOneAndUpdate(
    { _id: cId },
    {
      $pull: { items: { variant_id: vId } },
      $set: { updated_at: now, expires_at: expiresAt }
    },
    { returnDocument: 'after' }
  );
}

export async function clearCart(cartId: string | ObjectId): Promise<boolean> {
  const db = await getDatabase();
  const cId = typeof cartId === 'string' ? new ObjectId(cartId) : cartId;
  const result = await db.collection<CartDocument>('carts').updateOne(
    { _id: cId },
    {
      $set: {
        items: [],
        updated_at: new Date(),
        expires_at: getExpirationDate()
      }
    }
  );
  return result.modifiedCount > 0;
}

