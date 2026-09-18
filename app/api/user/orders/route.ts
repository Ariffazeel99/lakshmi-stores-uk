import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { OrderDocument } from '@/types/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    const userId = req.nextUrl.searchParams.get('userId');

    if (!email && !userId) {
      return NextResponse.json(
        { success: false, error: 'Email or userId is required to fetch orders.' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const query: any = { $or: [] };

    if (email) {
      query.$or.push({ customer_email: email.toLowerCase().trim() });
    }
    if (userId && ObjectId.isValid(userId)) {
      query.$or.push({ user_id: new ObjectId(userId) });
    }

    const orders = await db
      .collection<OrderDocument>('orders')
      .find(query)
      .sort({ created_at: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    console.error('Fetch customer orders error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch customer orders.' },
      { status: 500 }
    );
  }
}

