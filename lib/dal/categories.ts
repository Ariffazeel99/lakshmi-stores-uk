import { getDatabase } from '@/lib/mongodb';
import { Category } from '@/data/categories';

// Curated Department metadata for icon & display alignment
const DEPARTMENT_METADATA: Record<string, { name: string; icon: string; image: string }> = {
  'ready-mixes-sweets': {
    name: 'Ready Mixes & Sweets',
    icon: 'Utensils',
    image: 'https://cdn.shopify.com/s/files/1/0152/6530/0544/files/Products_19.png?v=1751556062'
  },
  'sweets-and-snacks': {
    name: 'Indian Sweets & Snacks',
    icon: 'Utensils',
    image: 'https://cdn.shopify.com/s/files/1/0152/6530/0544/files/Products_19.png?v=1751556062'
  },
  'spices-masalas': {
    name: 'Spices & Masalas',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=500&auto=format&fit=crop'
  },
  'rice-flours': {
    name: 'Rice, Atta & Flours',
    icon: 'CookingPot',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=500&auto=format&fit=crop'
  },
  'fresh-vegetables-greens': {
    name: 'Fresh Air Produce & Veggies',
    icon: 'Leaf',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=500&auto=format&fit=crop'
  },
  'pooja-festive-items': {
    name: 'Pooja & Festive Items',
    icon: 'Flame',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=500&auto=format&fit=crop'
  },
  'biscuits-rusk-cake': {
    name: 'Biscuits, Rusk & Bakery',
    icon: 'Cookie',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=500&auto=format&fit=crop'
  },
  'pickles-pastes': {
    name: 'Pickles, Pastes & Chutneys',
    icon: 'Jar',
    image: 'https://images.unsplash.com/photo-1589135233689-d56d953922c1?q=80&w=500&auto=format&fit=crop'
  },
  'lentils-pulses': {
    name: 'Dals & Lentils',
    icon: 'Wheat',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=500&auto=format&fit=crop'
  },
  'fresh-meat-halal': {
    name: 'Fresh Meat & Halal',
    icon: 'Beef',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=500&auto=format&fit=crop'
  }
};

function formatSlugName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function getCategories(): Promise<Category[]> {
  const db = await getDatabase();
  const products = db.collection('products');

  // Aggregation: Group by category slug, count products, and collect subcategories
  const aggregated = await products
    .aggregate([
      { $match: { is_active: true } },
      {
        $project: {
          primaryCategory: { $arrayElemAt: ['$category_slugs', 0] },
          subCategory: { $arrayElemAt: ['$category_slugs', 1] }
        }
      },
      {
        $group: {
          _id: '$primaryCategory',
          itemCount: { $sum: 1 },
          subcategories: { $addToSet: '$subCategory' }
        }
      },
      { $sort: { itemCount: -1 } }
    ])
    .toArray();

  return aggregated.map((item, idx) => {
    const slug = item._id || 'general-groceries';
    const meta = DEPARTMENT_METADATA[slug];
    const name = meta?.name || formatSlugName(slug);
    const subcats = (item.subcategories || [])
      .filter((s: string) => s && s !== slug)
      .map(formatSlugName)
      .slice(0, 6);

    return {
      id: `cat-${slug}`,
      name,
      slug,
      iconName: meta?.icon || 'Sparkles',
      description: `Authentic ${name} imported directly for UK delivery.`,
      itemCount: item.itemCount,
      featuredImg: meta?.image || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=500&auto=format&fit=crop',
      subcategories: subcats.length > 0 ? subcats : ['Authentic Sourced', 'Popular Essentials']
    };
  });
}

