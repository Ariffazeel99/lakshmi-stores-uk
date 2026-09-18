import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { updateOrderStatus } from '@/lib/dal/admin';
import { OrderDocument } from '@/types/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status');
    const queryStr = req.nextUrl.searchParams.get('q');
    const db = await getDatabase();

    const filter: any = {};

    if (status && status !== 'all') {
      if (status === 'unfulfilled') {
        filter.order_status = { $in: ['confirmed', 'pending'] };
      } else if (status === 'chilled_prep') {
        filter['items.is_chilled'] = true;
        filter.order_status = { $in: ['confirmed', 'processing'] };
      } else if (status === 'packing') {
        filter.order_status = 'processing';
      } else if (status === 'dispatched') {
        filter.order_status = { $in: ['partially_shipped', 'completed'] };
      } else {
        filter.order_status = status;
      }
    }

    if (queryStr) {
      filter.$or = [
        { order_number: { $regex: queryStr, $options: 'i' } },
        { customer_email: { $regex: queryStr, $options: 'i' } },
        { 'shipping_address.recipient_name': { $regex: queryStr, $options: 'i' } }
      ];
    }

    const orders = await db
      .collection<OrderDocument>('orders')
      .find(filter)
      .sort({ created_at: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (err: any) {
    console.error('Failed to get admin orders:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orderNumber, status, carrierTracking } = await req.json();

    if (!orderNumber || !status) {
      return NextResponse.json(
        { success: false, error: 'OrderNumber and status are required' },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(orderNumber, status, carrierTracking);

    return NextResponse.json({
      success: true,
      updated
    });
  } catch (err: any) {
    console.error('Failed to update order status:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}
