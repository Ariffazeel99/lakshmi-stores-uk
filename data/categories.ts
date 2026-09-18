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
    name: 'Fresh Air Produce & Veggies',
    slug: 'fresh-vegetables',
    iconName: 'Leaf',
    description: 'Direct Air-Shipped Produce from South & North Indian Farms',
    itemCount: 82,
    featuredImg: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=500&auto=format&fit=crop',
    subcategories: ['Fresh Air Produce', 'Herbs & Greens', 'Chow Chow & Drumsticks', 'Organic Roots', 'Fresh Flowers'],
  },
  {
    id: 'cat-02',
    name: 'Spices & Masalas',
    slug: 'spices-masalas',
    iconName: 'Sparkles',
    description: 'Aachi, MDH, 777, Eastern, Whole Spices, Sambhar & Rasam Powders',
    itemCount: 319,
    featuredImg: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=500&auto=format&fit=crop',
    subcategories: ['Single Spices', 'Masala Powders', 'Paste & Seasonings', 'Hing & Asafetida'],
  },
  {
    id: 'cat-03',
    name: 'Indian Sweets & Snacks',
    slug: 'sweets-snacks',
    iconName: 'Utensils',
    description: 'Haldirams Savories, Jaimin Snacks, Murukku & Traditional Sweets',
    itemCount: 355,
    featuredImg: 'https://cdn.shopify.com/s/files/1/0152/6530/0544/files/Products_19.png?v=1751556062',
    subcategories: ['Haldiram Namkeen', 'Traditional Sweets', 'Mixture & Murukku', 'Roasted Snacks'],
  },
  {
    id: 'cat-04',
    name: 'Rice, Atta & Flours',
    slug: 'rice-flours',
    iconName: 'CookingPot',
    description: 'Sona Masoori, Ponni, Basmati, Idli Rice, Heera, Aashirvaad Atta & Millets',
    itemCount: 167,
    featuredImg: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=500&auto=format&fit=crop',
    subcategories: ['Sona Masoori Rice', 'Chakki Atta', 'Millets', 'Poha & Rava', 'Idli Rice'],
  },
  {
    id: 'cat-05',
    name: 'Dals & Lentils',
    slug: 'dals-pulses',
    iconName: 'Wheat',
    description: 'Heera, TRS Unpolished Toor, Urad, Chana, Moong, Rajma & Dal Essentials',
    itemCount: 106,
    featuredImg: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=500&auto=format&fit=crop',
    subcategories: ['Toor Dal', 'Urad Dal', 'Moong Dal', 'Chana Dal', 'Whole Grams'],
  },
  {
    id: 'cat-06',
    name: 'Pickles, Pastes & Chutneys',
    slug: 'pickles-pastes',
    iconName: 'Flame',
    description: '777, Priya, Ashoka Mango, Lime, Garlic, Gongura & Ginger Chutneys',
    itemCount: 117,
    featuredImg: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop',
    subcategories: ['South Indian Pickles', 'Garlic Pastes', 'Curry Pastes', 'Thokku'],
  },
  {
    id: 'cat-07',
    name: 'Pooja & Festive Items',
    slug: 'pooja-items',
    iconName: 'Flame',
    description: 'Deepam Oils, Camphor, Agarbatti, Dhoop, Brass Diyas & Mandir Items',
    itemCount: 102,
    featuredImg: 'https://cdn.shopify.com/s/files/1/0152/6530/0544/files/WhatsAppImage2026-04-30at6.01.43PM.jpg?v=1777552525',
    subcategories: ['Pooja Oil', 'Incense & Camphor', 'Diya Wicks', 'Brass Mandir Items'],
  },
  {
    id: 'cat-08',
    name: 'Biscuits, Rusk & Bakery',
    slug: 'biscuits-bakery',
    iconName: 'Sparkles',
    description: 'Parle-G, Britannia Good Day, Bourbon, Milk Bikis & Crunchy Rusks',
    itemCount: 137,
    featuredImg: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=500&auto=format&fit=crop',
    subcategories: ['Tea Biscuits', 'Cream Biscuits', 'Cake Rusk', 'Cookies'],
  },
];
