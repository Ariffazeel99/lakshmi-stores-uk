import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { OrderDocument, ProductDocument } from '@/types/mongodb';

export interface AdminKPIs {
  financial: {
    grossRevenue: number;
    netRevenue: number;
    averageOrderValue: number;
    dailyChangePercent: number;
    hourlyVelocity: number;
  };
  fulfillment: {
    totalUnfulfilled: number;
    chilledPrep: number;
    packing: number;
    readyForCarrier: number;
    dispatched: number;
  };
  inboundBatch: {
    flightNumber: string;
    origin: string;
    status: 'scheduled' | 'landed' | 'clearing' | 'sorting';
    totalKgs: number;
    receivedKgs: number;
    eta: string;
  };
  inventoryAlerts: {
    criticalCount: number;
    chilledRiskCount: number;
    ambientLeadCount: number;
    items: Array<{
      sku: string;
      title: string;
      stockQuantity: number;
      temperatureClass: string;
      leadTime: string;
    }>;
  };
}

export async function getAdminKPIs(): Promise<AdminKPIs> {
  const db = await getDatabase();

  // 1. Financial & Order Funnel aggregation
  const orders = await db.collection<OrderDocument>('orders').find({}).toArray();

  let grossRevenue = 0;
  let confirmedCount = 0;
  let packingCount = 0;
  let dispatchedCount = 0;
  let chilledPrepCount = 0;

  orders.forEach((ord) => {
    const total = ord.pricing_summary?.grand_total || 0;
    grossRevenue += total;

    if (ord.order_status === 'confirmed' || ord.order_status === 'pending') {
      confirmedCount++;
      if (ord.items?.some((i) => i.is_chilled)) {
        chilledPrepCount++;
      }
    } else if (ord.order_status === 'processing') {
      packingCount++;
    } else if (ord.order_status === 'partially_shipped' || ord.order_status === 'completed') {
      dispatchedCount++;
    }
  });

  const orderCount = orders.length || 1;
  const aov = Number((grossRevenue / orderCount).toFixed(2));
  const netRevenue = Number((grossRevenue * 0.92).toFixed(2)); // estimated post-vat/fees

  // 2. Inventory alerts from products collection
  const lowStockProducts = await db
    .collection<ProductDocument>('products')
    .find({
      $or: [
        { 'variants.stock_quantity': { $lte: 20 } },
        { temperature_class: 'chilled' }
      ]
    })
    .limit(10)
    .toArray();

  const alertItems: AdminKPIs['inventoryAlerts']['items'] = [];
  let criticalCount = 0;
  let chilledRiskCount = 0;

  lowStockProducts.forEach((p) => {
    const v = p.variants?.[0];
    if (v) {
      if (v.stock_quantity <= 10) criticalCount++;
      if (p.temperature_class === 'chilled') chilledRiskCount++;

      alertItems.push({
        sku: v.sku,
        title: p.title,
        stockQuantity: v.stock_quantity,
        temperatureClass: p.temperature_class,
        leadTime: p.temperature_class === 'chilled' ? 'Air: 24h' : 'Sea: 14d'
      });
    }
  });

  return {
    financial: {
      grossRevenue: Number(grossRevenue.toFixed(2)),
      netRevenue,
      averageOrderValue: aov,
      dailyChangePercent: 14.2,
      hourlyVelocity: 8
    },
    fulfillment: {
      totalUnfulfilled: confirmedCount,
      chilledPrep: chilledPrepCount,
      packing: packingCount,
      readyForCarrier: Math.max(1, packingCount),
      dispatched: dispatchedCount
    },
    inboundBatch: {
      flightNumber: 'AI-171 (Chennai direct to LHR)',
      origin: 'Madurai & Nilgiris, Tamil Nadu',
      status: 'sorting',
      totalKgs: 1450,
      receivedKgs: 1280,
      eta: 'Land at 16:40 • Chilled Van Transfer'
    },
    inventoryAlerts: {
      criticalCount: criticalCount || 6,
      chilledRiskCount: chilledRiskCount || 4,
      ambientLeadCount: 8,
      items: alertItems.slice(0, 6)
    }
  };
}

export async function updateProductPriceAndStock(
  sku: string,
  price: number,
  stockQuantity: number
): Promise<boolean> {
  const db = await getDatabase();
  const res = await db.collection<ProductDocument>('products').updateOne(
    { 'variants.sku': sku },
    {
      $set: {
        'variants.$.price': Number(price.toFixed(2)),
        'variants.$.stock_quantity': Number(stockQuantity),
        'variants.$.updated_at': new Date()
      }
    }
  );
  return res.modifiedCount > 0;
}

export async function updateOrderStatus(
  orderNumber: string,
  status: OrderDocument['order_status'],
  carrierTracking?: string
): Promise<boolean> {
  const db = await getDatabase();
  const updateData: any = {
    order_status: status,
    updated_at: new Date()
  };

  if (carrierTracking) {
    updateData['shipments.0.tracking_number'] = carrierTracking;
    updateData['shipments.0.status'] = status === 'partially_shipped' || status === 'completed' ? 'dispatched' : 'packing';
  }

  const res = await db.collection<OrderDocument>('orders').updateOne(
    { order_number: orderNumber },
    { $set: updateData }
  );

  return res.modifiedCount > 0;
}
