export interface WeightOption {
  weight: string; // e.g. "500g", "1kg", "5kg"
  priceGBP: number;
  originalPriceGBP?: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  tamilName?: string;
  category: string;
  subCategory: string;
  brand: string;
  description: string;
  origin: string; // e.g., "Tamil Nadu, India", "Kerala, India"
  rating: number;
  reviewCount: number;
  isAirFreightFresh?: boolean;
  isBestseller?: boolean;
  isWeeklyOffer?: boolean;
  isFestiveSpecial?: boolean;
  image: string;
  dietaryTags: string[]; // e.g. ["100% Organic", "Gluten Free", "Vegan"]
  options: WeightOption[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Fresh Air-Shipped Small Onions / Shallots (Chinna Vengayam)',
    tamilName: 'சின்ன வெங்காயம்',
    category: 'Fresh Vegetables & Greens',
    subCategory: 'Fresh Air Produce',
    brand: 'Lakshmi Fresh Sourced',
    description: 'Authentic high-flavor small onions imported via direct express air-freight from Tamil Nadu farms. Perfect for traditional Sambhar, Vatha Kuzhambu, and medicinal preparations.',
    origin: 'Madurai, Tamil Nadu',
    rating: 4.9,
    reviewCount: 184,
    isAirFreightFresh: true,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?q=80&w=800&auto=format&fit=crop',
    dietaryTags: ['Fresh Produce', '100% Natural', 'Air Freight Fresh'],
    options: [
      { weight: '250g', priceGBP: 1.99, originalPriceGBP: 2.49, inStock: true },
      { weight: '500g', priceGBP: 3.49, originalPriceGBP: 4.29, inStock: true },
      { weight: '1kg', priceGBP: 6.29, originalPriceGBP: 7.99, inStock: true },
    ],
  },
  {
    id: 'prod-002',
    name: 'Premium Toor Dal / Ooradh (Yellow Split Pigeons)',
    tamilName: 'துவரம் பருப்பு',
    category: 'Dals & Pulses',
    subCategory: 'Dals',
    brand: 'Lakshmi Select',
    description: 'Unpolished premium grade South Indian Toor Dal sourced from Karnataka farms. Highly aromatic, quick-cooking, rich in dietary fiber and essential plant protein.',
    origin: 'Karnataka, India',
    rating: 4.8,
    reviewCount: 312,
    isBestseller: true,
    isWeeklyOffer: true,
    image: 'https://images.unsplash.com/photo-1585992227540-7048c1607f51?q=80&w=800&auto=format&fit=crop',
    dietaryTags: ['Vegan', 'High Protein', 'Unpolished'],
    options: [
      { weight: '1kg', priceGBP: 2.89, originalPriceGBP: 3.49, inStock: true },
      { weight: '2kg', priceGBP: 5.49, originalPriceGBP: 6.49, inStock: true },
      { weight: '5kg', priceGBP: 12.99, originalPriceGBP: 15.99, inStock: true },
    ],
  },
  {
    id: 'prod-003',
    name: 'Sona Masoori Raw Rice (5kg Pack)',
    tamilName: 'சோனா மசூரி அரிசி',
    category: 'Rice & Flours',
    subCategory: 'Rice',
    brand: 'Royal Harvest',
    description: 'Lightweight, aromatic medium-grain rice grown in Andhra Pradesh. Ideal for daily Indian dining, lemon rice, curd rice, and fried rice.',
    origin: 'Andhra Pradesh, India',
    rating: 4.9,
    reviewCount: 520,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop',
    dietaryTags: ['Gluten-Free', 'Low GI', 'Aged 1 Year'],
    options: [
      { weight: '5kg', priceGBP: 9.99, originalPriceGBP: 12.49, inStock: true },
      { weight: '10kg', priceGBP: 18.99, originalPriceGBP: 22.99, inStock: true },
      { weight: '20kg', priceGBP: 34.99, originalPriceGBP: 41.99, inStock: true },
    ],
  },
  {
    id: 'prod-004',
    name: 'Aashirvaad Superior Shuddha Chakki Atta',
    tamilName: 'ஆசீர்வாத் கோதுமை மாவு',
    category: 'Rice & Flours',
    subCategory: 'Flours',
    brand: 'Aashirvaad',
    description: 'Made from 100% whole wheat grains ground in traditional stone chakkis to absorb more water for soft, fluffy rotis and parathas.',
    origin: 'Madhya Pradesh, India',
    rating: 4.7,
    reviewCount: 410,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    dietaryTags: ['100% Whole Wheat', 'High Fiber'],
    options: [
      { weight: '1kg', priceGBP: 1.99, originalPriceGBP: 2.29, inStock: true },
      { weight: '5kg', priceGBP: 7.99, originalPriceGBP: 9.49, inStock: true },
      { weight: '10kg', priceGBP: 14.49, originalPriceGBP: 16.99, inStock: true },
    ],
  },
  {
    id: 'prod-005',
    name: 'Grand Sweets Sambhar Powder (Authentic Madras Style)',
    tamilName: 'சாம்பார் பொடி',
    category: 'Spices & Masalas',
    subCategory: 'Masala Powders',
    brand: 'Grand Sweets & Snacks',
    description: 'Traditional Tamil Nadu recipe ground with sun-dried red chillies, coriander, fenugreek, cumin, and hing. Delivers rich restaurant-quality Sambhar aroma.',
    origin: 'Chennai, Tamil Nadu',
    rating: 4.9,
    reviewCount: 96,
    isFestiveSpecial: true,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
    dietaryTags: ['No Preservatives', 'Authentic Recipe'],
    options: [
      { weight: '200g', priceGBP: 2.49, originalPriceGBP: 2.99, inStock: true },
      { weight: '500g', priceGBP: 5.49, originalPriceGBP: 6.49, inStock: true },
    ],
  },
  {
    id: 'prod-006',
    name: 'Fresh Curry Leaves (Karuveppilai) Air-Imported',
    tamilName: 'கறிவேப்பிலை',
    category: 'Fresh Vegetables & Greens',
    subCategory: 'Herbs & Greens',
    brand: 'Lakshmi Fresh Sourced',
    description: 'Crisp, highly aromatic fresh green curry leaves flown in weekly directly from Coimbatore farms. Essential tempering for South Indian dishes.',
    origin: 'Coimbatore, Tamil Nadu',
    rating: 4.95,
    reviewCount: 240,
    isAirFreightFresh: true,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=800&auto=format&fit=crop',
    dietaryTags: ['Air Freight Fresh', '100% Organic'],
    options: [
      { weight: '50g Pack', priceGBP: 1.19, originalPriceGBP: 1.49, inStock: true },
      { weight: '100g Pack', priceGBP: 1.99, originalPriceGBP: 2.49, inStock: true },
    ],
  },
  {
    id: 'prod-007',
    name: 'MDH Deggi Mirch (Chilli Powder Blend)',
    tamilName: 'மிளகாய் பொடி',
    category: 'Spices & Masalas',
    subCategory: 'Single Spices',
    brand: 'MDH',
    description: 'Blend of Indian red capsicums and Kashmiri chillies that adds rich ruby color without overwhelming hot spice level.',
    origin: 'Delhi, India',
    rating: 4.8,
    reviewCount: 280,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop',
    dietaryTags: ['Rich Color', 'Medium Heat'],
    options: [
      { weight: '100g', priceGBP: 1.49, originalPriceGBP: 1.79, inStock: true },
      { weight: '500g', priceGBP: 5.29, originalPriceGBP: 6.19, inStock: true },
    ],
  },
  {
    id: 'prod-008',
    name: 'Haldirams Nagpur All-in-One Spicy Snack Mix',
    tamilName: 'ஹல்திராம் ஸ்நாக்ஸ்',
    category: 'Ready Mixes & Sweets',
    subCategory: 'Namkeen & Snacks',
    brand: "Haldiram's",
    description: 'Crispy savory blend of fried lentils, cashew nuts, raisins, chickpeas, and flattened rice seasoned with royal spices.',
    origin: 'Nagpur, India',
    rating: 4.75,
    reviewCount: 165,
    isWeeklyOffer: true,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281288?q=80&w=800&auto=format&fit=crop',
    dietaryTags: ['Vegetarian', 'Crunchy Festive Snack'],
    options: [
      { weight: '200g Pack', priceGBP: 1.79, originalPriceGBP: 2.19, inStock: true },
      { weight: '400g Pack', priceGBP: 3.19, originalPriceGBP: 3.99, inStock: true },
    ],
  },
  {
    id: 'prod-009',
    name: 'Fresh Tender Tindora / Ivy Gourd (Kovakkai)',
    tamilName: 'கோவக்காய்',
    category: 'Fresh Vegetables & Greens',
    subCategory: 'Fresh Air Produce',
    brand: 'Lakshmi Fresh Sourced',
    description: 'Hand-picked tender green Tindora ideal for stir-fries (Poriyal), curries, and pickles. Chilled delivery guaranteed across the UK.',
    origin: 'Tamil Nadu, India',
    rating: 4.85,
    reviewCount: 92,
    isAirFreightFresh: true,
    image: 'https://images.unsplash.com/photo-1598170845058-12ef4a457539?q=80&w=800&auto=format&fit=crop',
    dietaryTags: ['Chilled Delivery', 'Farm Fresh'],
    options: [
      { weight: '250g', priceGBP: 1.89, originalPriceGBP: 2.29, inStock: true },
      { weight: '500g', priceGBP: 3.49, originalPriceGBP: 4.19, inStock: true },
    ],
  },
  {
    id: 'prod-010',
    name: 'Pure Brass Kuthu Vilakku (Traditional Diya Lamp 12 inch)',
    tamilName: 'பித்தளை குத்துவிளக்கு',
    category: 'Pooja Items',
    subCategory: 'Brass Items',
    brand: 'Lakshmi Divine',
    description: 'Heavy solid brass five-face traditional lighting lamp crafted by skilled artisans in Kumbakonam. Essential for Pujas, Festivals, and Housewarmings.',
    origin: 'Kumbakonam, Tamil Nadu',
    rating: 4.95,
    reviewCount: 88,
    isFestiveSpecial: true,
    image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=800&auto=format&fit=crop',
    dietaryTags: ['100% Solid Brass', 'Handicraft'],
    options: [
      { weight: 'Single Lamp (12 inch)', priceGBP: 24.99, originalPriceGBP: 29.99, inStock: true },
      { weight: 'Pair of 2 Lamps', priceGBP: 44.99, originalPriceGBP: 54.99, inStock: true },
    ],
  },
  {
    id: 'prod-011',
    name: 'MTR Ready Instant Idli Mix',
    tamilName: 'இட்லி மிக்ஸ்',
    category: 'Ready Mixes & Sweets',
    subCategory: 'Instant Breakfast Mix',
    brand: 'MTR',
    description: 'Create feather-soft, piping hot South Indian steam Idlis in under 15 minutes. No overnight fermentation required.',
    origin: 'Bengaluru, India',
    rating: 4.7,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop',
    dietaryTags: ['Quick 15 Min', 'Vegetarian'],
    options: [
      { weight: '500g Pack', priceGBP: 2.29, originalPriceGBP: 2.79, inStock: true },
      { weight: '1kg Value Pack', priceGBP: 4.19, originalPriceGBP: 4.99, inStock: true },
    ],
  },
  {
    id: 'prod-012',
    name: 'Narasu’s Udhayam Filter Coffee Powder (80:20 Chicory)',
    tamilName: 'ஃபில்டர் காபி பொடி',
    category: 'Beverages & Tea',
    subCategory: 'Filter Coffee',
    brand: "Narasu's",
    description: 'Classic Salem blend of dark roasted PB coffee beans with 20% chicory for thick, aromatic, frothy South Indian Filter Kaapi.',
    origin: 'Salem, Tamil Nadu',
    rating: 4.9,
    reviewCount: 340,
    isBestseller: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    dietaryTags: ['Strong Roast', 'Authentic Kaapi'],
    options: [
      { weight: '200g Pack', priceGBP: 2.99, originalPriceGBP: 3.49, inStock: true },
      { weight: '500g Pack', priceGBP: 6.49, originalPriceGBP: 7.49, inStock: true },
    ],
  }
];

