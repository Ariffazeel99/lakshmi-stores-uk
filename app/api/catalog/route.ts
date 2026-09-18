import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/dal/products';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const search = searchParams.get('search') || undefined;
    const tab = (searchParams.get('tab') as any) || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);
    const sortBy = (searchParams.get('sortBy') as any) || 'created_desc';

    const result = await getProducts({
      categorySlug,
      brand,
      search,
      tab,
      page,
      limit,
      sortBy
    });

    return NextResponse.json({
      success: true,
      data: result.products,
      pagination: result.pagination
    });
  } catch (error: any) {
    console.error('Catalog API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch catalog from MongoDB'
      },
      { status: 500 }
    );
  }
}

