export interface Brand {
  id: string;
  name: string;
  logoText: string;
  tagline: string;
  bgColor: string;
}

export const BRANDS: Brand[] = [
  { id: 'b-1', name: 'Aashirvaad', logoText: 'AASHIRVAAD', tagline: '100% Pure Atta & Spices', bgColor: 'bg-red-50 text-red-700' },
  { id: 'b-2', name: 'MDH', logoText: 'MDH', tagline: 'Asli Masale Sach Sach', bgColor: 'bg-amber-50 text-amber-800' },
  { id: 'b-3', name: "Haldiram's", logoText: "HALDIRAM'S", tagline: 'Taste of Tradition', bgColor: 'bg-orange-50 text-orange-700' },
  { id: 'b-4', name: 'MTR', logoText: 'MTR 1924', tagline: 'Authentic Indian Taste', bgColor: 'bg-emerald-50 text-emerald-800' },
  { id: 'b-5', name: 'Priya Foods', logoText: 'PRIYA', tagline: 'Authentic South Pickles', bgColor: 'bg-yellow-50 text-yellow-800' },
  { id: 'b-6', name: 'GRB', logoText: 'GRB Ghee', tagline: 'Pure Cow Ghee Excellence', bgColor: 'bg-blue-50 text-blue-800' },
  { id: 'b-7', name: 'Grand Sweets', logoText: 'GRAND SWEETS', tagline: 'Heritage Chennai Flavors', bgColor: 'bg-amber-100 text-amber-900' },
];

