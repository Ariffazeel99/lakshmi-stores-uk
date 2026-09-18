export interface Brand {
  id: string;
  name: string;
  logoText: string;
  tagline: string;
  bgColor: string;
}

export const BRANDS: Brand[] = [
  { id: 'b-1', name: 'Heera', logoText: 'HEERA', tagline: '338+ Pure Spices & Lentils', bgColor: 'bg-emerald-50 text-emerald-800' },
  { id: 'b-2', name: 'Lakshmi Fresh', logoText: 'LAKSHMI STORES', tagline: 'Air-Freight Fresh Produce', bgColor: 'bg-emerald-100 text-emerald-900' },
  { id: 'b-3', name: 'Aachi', logoText: 'AACHI', tagline: '98+ Chettinad Masalas & Pastes', bgColor: 'bg-red-50 text-red-700' },
  { id: 'b-4', name: "Haldiram's", logoText: "HALDIRAM'S", tagline: '95+ Traditional Namkeen & Sweets', bgColor: 'bg-orange-50 text-orange-700' },
  { id: 'b-5', name: 'MTR', logoText: 'MTR 1924', tagline: 'Instant Breakfast & Ready Meals', bgColor: 'bg-blue-50 text-blue-800' },
  { id: 'b-6', name: '777', logoText: '777 BRAND', tagline: 'Madras Heritage Pickles & Pastes', bgColor: 'bg-yellow-50 text-yellow-800' },
  { id: 'b-7', name: 'Jaimin', logoText: 'JAIMIN', tagline: 'Khakhra & Crunchy Tea Snacks', bgColor: 'bg-amber-50 text-amber-900' },
  { id: 'b-8', name: 'Ashoka', logoText: 'ASHOKA', tagline: 'Gourmet Indian Heat & Eat', bgColor: 'bg-purple-50 text-purple-800' },
];
