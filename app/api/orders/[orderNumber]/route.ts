import { NextRequest, NextResponse } from 'next/server';
import { getOrderByNumber } from '@/lib/dal/orders';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> | { orderNumber: string } }
) {
  try {
    const resolvedParams = await params;
    const { orderNumber } = resolvedParams;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Order number is required' },
        { status: 400 }
      );
    }

    const order = await getOrderByNumber(orderNumber);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error: any) {
    console.error('Fetch order error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

