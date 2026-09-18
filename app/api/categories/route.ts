import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/dal/categories';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

