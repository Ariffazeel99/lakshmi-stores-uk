import { Product } from '@/data/products';
import { Category } from '@/data/categories';
import { Brand } from '@/data/brands';
import { ProductQueryOptions } from '@/lib/dal/products';

export interface CatalogResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchCatalog(options: ProductQueryOptions = {}): Promise<CatalogResponse> {
  const params = new URLSearchParams();
  if (options.categorySlug) params.set('category', options.categorySlug);
  if (options.brand) params.set('brand', options.brand);
  if (options.search) params.set('search', options.search);
  if (options.tab) params.set('tab', options.tab);
  if (options.page) params.set('page', String(options.page));
  if (options.limit) params.set('limit', String(options.limit));
  if (options.sortBy) params.set('sortBy', options.sortBy);

  const res = await fetch(`/api/catalog?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch catalog: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data || [];
}

export async function fetchBrands(): Promise<Brand[]> {
  const res = await fetch('/api/brands');
  if (!res.ok) {
    throw new Error(`Failed to fetch brands: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data || [];
}

