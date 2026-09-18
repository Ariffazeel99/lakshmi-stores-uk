import { getDatabase } from '@/lib/mongodb';
import { Brand } from '@/data/brands';

const BRAND_PALETTES = [
  'bg-emerald-50 text-emerald-800',
  'bg-red-50 text-red-700',
  'bg-orange-50 text-orange-700',
  'bg-blue-50 text-blue-800',
  'bg-yellow-50 text-yellow-800',
  'bg-amber-50 text-amber-900',
  'bg-purple-50 text-purple-800',
  'bg-rose-50 text-rose-800'
];

export async function getBrands(): Promise<Brand[]> {
  const db = await getDatabase();
  const products = db.collection('products');

  const aggregated = await products
    .aggregate([
      { $match: { is_active: true } },
      {
        $group: {
          _id: '$brand',
          itemCount: { $sum: 1 }
        }
      },
      { $sort: { itemCount: -1 } },
      { $limit: 12 }
    ])
    .toArray();

  return aggregated.map((item, idx) => ({
    id: `b-${idx + 1}`,
    name: item._id || 'Lakshmi Stores',
    logoText: (item._id || 'LAKSHMI').toUpperCase().slice(0, 16),
    tagline: `${item.itemCount}+ Authentic Products`,
    bgColor: BRAND_PALETTES[idx % BRAND_PALETTES.length]
  }));
}

