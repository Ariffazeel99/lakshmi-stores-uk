import { NextRequest, NextResponse } from 'next/server';
import { createOrder, CreateOrderParams } from '@/lib/dal/orders';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!body.shippingAddress || !body.shippingAddress.address_line1) {
      return NextResponse.json(
        { success: false, error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    const orderParams: CreateOrderParams = {
      userId: body.userId || null,
      customerEmail: body.customerEmail || 'orders@lakshmistores.co.uk',
      customerPhone: body.customerPhone || '+44 20 8903 0000',
      currency: body.currency || 'GBP',
      items: body.items,
      shippingAddress: {
        recipient_name: body.shippingAddress.recipient_name || 'Valued Customer',
        phone: body.shippingAddress.phone || body.customerPhone || null,
        address_line1: body.shippingAddress.address_line1,
        address_line2: body.shippingAddress.address_line2 || null,
        city: body.shippingAddress.city || 'London',
        county: body.shippingAddress.county || null,
        postcode: body.shippingAddress.postcode || 'HA9 7AJ',
        country: body.shippingAddress.country || 'United Kingdom',
        delivery_instructions: body.shippingAddress.delivery_instructions || null
      },
      paymentGateway: body.paymentGateway || 'stripe',
      paymentMethod: body.paymentMethod || 'card',
      gatewayTransactionId: body.gatewayTransactionId || `ch_${Date.now()}`
    };

    const order = await createOrder(orderParams);

    return NextResponse.json({
      success: true,
      order
    }, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

