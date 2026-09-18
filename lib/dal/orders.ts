import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { OrderDocument, OrderItemSnapshot, OrderAddressSnapshot, PaymentSubdocument, ShipmentSubdocument } from '@/types/mongodb';

export interface CreateOrderParams {
  userId?: string | null;
  customerEmail: string;
  customerPhone: string;
  currency?: 'GBP' | 'EUR';
  items: Array<{
    productId: string;
    variantId?: string | null;
    sku: string;
    title: string;
    sizeOrWeight?: string | null;
    unitPrice: number;
    discountApplied?: number;
    taxRate?: number;
    quantity: number;
    isChilled?: boolean;
  }>;
  shippingAddress: OrderAddressSnapshot;
  paymentGateway: 'stripe' | 'paypal';
  paymentMethod: string;
  gatewayTransactionId: string;
}

export async function createOrder(params: CreateOrderParams): Promise<OrderDocument> {
  const db = await getDatabase();
  const now = new Date();

  // 1. Build immutable line item snapshots
  let subtotal = 0;
  let taxTotal = 0;
  let hasChilledItem = false;

  const itemSnapshots: OrderItemSnapshot[] = params.items.map((item) => {
    const lineTotal = Number((item.unitPrice * item.quantity).toFixed(2));
    const taxAmount = Number(((lineTotal * (item.taxRate || 0)) / (1 + (item.taxRate || 0))).toFixed(2));
    subtotal += lineTotal;
    taxTotal += taxAmount;
    if (item.isChilled) hasChilledItem = true;

    return {
      product_id: ObjectId.isValid(item.productId) ? new ObjectId(item.productId) : new ObjectId(),
      variant_id: item.variantId && ObjectId.isValid(item.variantId) ? new ObjectId(item.variantId) : null,
      sku: item.sku,
      title: item.title,
      size_or_weight: item.sizeOrWeight || null,
      unit_price: item.unitPrice,
      discount_applied: item.discountApplied || 0,
      tax_rate: item.taxRate || 0.0,
      tax_amount: taxAmount,
      quantity: item.quantity,
      line_total: lineTotal,
      is_chilled: item.isChilled || false
    };
  });

  // Shipping logic (£50 free shipping threshold or £4.99 standard)
  const shippingFee = subtotal >= 50.0 ? 0.0 : 4.99;
  const grandTotal = Number((subtotal + shippingFee).toFixed(2));

  // 2. Build payment record
  const paymentRecord: PaymentSubdocument = {
    payment_id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    method: params.paymentMethod,
    gateway: params.paymentGateway,
    gateway_transaction_id: params.gatewayTransactionId,
    amount: grandTotal,
    currency: params.currency || 'GBP',
    status: 'captured',
    failure_reason: null,
    created_at: now
  };

  // 3. Build initial shipment consignment
  const shipmentRecord: ShipmentSubdocument = {
    shipment_id: `ship_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    carrier: 'DPD',
    tracking_number: null,
    shipping_method: hasChilledItem ? 'chilled_express' : 'standard',
    has_chilled_packaging: hasChilledItem,
    ice_pack_count: hasChilledItem ? 2 : 0,
    status: 'packing',
    items_packed: itemSnapshots.map((item) => ({
      sku: item.sku,
      quantity: item.quantity
    })),
    dispatched_at: null,
    delivered_at: null
  };

  const orderDoc: OrderDocument = {
    _id: new ObjectId(),
    order_number: `LSUK-ORD-${Date.now().toString().slice(-6)}`,
    user_id: params.userId && ObjectId.isValid(params.userId) ? new ObjectId(params.userId) : null,
    customer_email: params.customerEmail.toLowerCase().trim(),
    customer_phone: params.customerPhone,
    currency: params.currency || 'GBP',
    pricing_summary: {
      subtotal: Number(subtotal.toFixed(2)),
      discount_total: 0.0,
      tax_total: Number(taxTotal.toFixed(2)),
      shipping_fee: shippingFee,
      grand_total: grandTotal
    },
    items: itemSnapshots,
    shipping_address: params.shippingAddress,
    payments: [paymentRecord],
    shipments: [shipmentRecord],
    order_status: 'confirmed',
    created_at: now,
    updated_at: now
  };

  await db.collection<OrderDocument>('orders').insertOne(orderDoc);
  return orderDoc;
}

export async function getUserOrders(userId: string | ObjectId): Promise<OrderDocument[]> {
  const db = await getDatabase();
  const uId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  return db
    .collection<OrderDocument>('orders')
    .find({ user_id: uId })
    .sort({ created_at: -1 })
    .toArray();
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderDocument | null> {
  const db = await getDatabase();
  return db.collection<OrderDocument>('orders').findOne({ order_number: orderNumber });
}

