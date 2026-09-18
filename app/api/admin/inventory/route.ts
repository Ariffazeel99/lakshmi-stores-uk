import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { updateProductPriceAndStock } from '@/lib/dal/admin';
import { ProductDocument } from '@/types/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get('q') || '';
    const tempClass = req.nextUrl.searchParams.get('temp') || '';
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit')) || 40, 100);

    const db = await getDatabase();
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'variants.sku': { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (tempClass && tempClass !== 'all') {
      filter.temperature_class = tempClass;
    }

    const products = await db
      .collection<ProductDocument>('products')
      .find(filter)
      .sort({ updated_at: -1 })
      .limit(limit)
      .toArray();

    // Flatten for spreadsheet-style grid representation
    const rows = products.flatMap((p) => {
      return (p.variants || []).map((v) => {
        const reserved = v.reserved_quantity || 0;
        const onHand = v.stock_quantity || 0;
        const availableToSell = Math.max(0, onHand - reserved);

        return {
          productId: p._id.toString(),
          title: p.title,
          brand: p.brand,
          sku: v.sku,
          sizeOrWeight: v.size || null,
          temperatureClass: p.temperature_class,
          price: v.price,
          onHand,
          reserved,
          availableToSell,
          leadTime: p.temperature_class === 'chilled' ? 'Air: 24h' : 'Sea: 14d',
          updatedAt: v.updated_at || p.updated_at
        };
      });
    });

    return NextResponse.json({
      success: true,
      data: rows
    });
  } catch (err: any) {
    console.error('Failed to get inventory matrix:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { sku, price, stockQuantity } = await req.json();

    if (!sku || price === undefined || stockQuantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'SKU, price, and stockQuantity are required' },
        { status: 400 }
      );
    }

    const updated = await updateProductPriceAndStock(sku, Number(price), Number(stockQuantity));

    return NextResponse.json({
      success: true,
      updated
    });
  } catch (err: any) {
    console.error('Failed to update inventory cell:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update inventory' },
      { status: 500 }
    );
  }
}
