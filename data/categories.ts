export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  itemCount: number;
  featuredImg: string;
  subcategories: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'cat-01',
    name: 'Fresh Vegetables & Greens',
    slug: 'fresh-vegetables',
    iconName: 'Leaf',
    description: 'Direct Air-Shipped Produce from South & North Indian Farms',
    itemCount: 84,
    featuredImg: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?q=80&w=500&auto=format&fit=crop',
    subcategories: ['Fresh Air Produce', 'Herbs & Greens', 'Gourds & Squash', 'Organic Roots', 'Fresh Flowers'],
  },
  {
    id: 'cat-02',
    name: 'Dals & Pulses',
    slug: 'dals-pulses',
    iconName: 'Wheat',
    description: 'Unpolished Toor, Urad, Chana, Moong, Rajma & Specialty Lentils',
    itemCount: 62,
    featuredImg: 'https://images.unsplash.com/photo-1585992227540-7048c1607f51?q=80&w=500&auto=format&fit=crop',
    subcategories: ['Dals', 'Whole Grams', 'Organic Pulses', 'Soya & Beans'],
  },
  {
    id: 'cat-03',
    name: 'Rice & Flours',
    slug: 'rice-flours',
    iconName: 'CookingPot',
    description: 'Sona Masoori, Ponni, Royal Basmati, Idli Rice, Atta & Millet Flours',
    itemCount: 110,
    featuredImg: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=500&auto=format&fit=crop',
    subcategories: ['Rice', 'Flours', 'Millets', 'Poha & Rava', 'Noodles & Vermicelli'],
  },
  {
    id: 'cat-04',
    name: 'Spices & Masalas',
    slug: 'spices-masalas',
    iconName: 'Sparkles',
    description: 'Whole Spices, Blended Masalas, Sambhar & Rasam Powders',
    itemCount: 145,
    featuredImg: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=500&auto=format&fit=crop',
    subcategories: ['Single Spices', 'Masala Powders', 'Paste & Seasonings', 'Hing & Asafetida'],
  },
  {
    id: 'cat-05',
    name: 'Ready Mixes & Sweets',
    slug: 'ready-mixes-sweets',
    iconName: 'Utensils',
    description: 'Instant Breakfast Mixes, Haldirams Savories & Traditional Sweets',
    itemCount: 95,
    featuredImg: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281288?q=80&w=500&auto=format&fit=crop',
    subcategories: ['Instant Breakfast Mix', 'Namkeen & Snacks', 'Indian Sweets', 'Pickles & Chutneys'],
  },
  {
    id: 'cat-06',
    name: 'Pooja & Festive Items',
    slug: 'pooja-items',
    iconName: 'Flame',
    description: 'Brass Diyas, Incense Cones, Agarbatti, Camphor & Festival Decor',
    itemCount: 50,
    featuredImg: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=500&auto=format&fit=crop',
    subcategories: ['Brass Items', 'Incense & Dhoop', 'Puja Oils & Wicks', 'Festival Essentials'],
  },
];

