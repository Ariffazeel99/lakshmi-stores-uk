import { NextResponse } from 'next/server';
import { getBrands } from '@/lib/dal/brands';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const brands = await getBrands();
    return NextResponse.json({
      success: true,
      data: brands
    });
  } catch (error: any) {
    console.error('Brands API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

