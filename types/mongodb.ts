import { ObjectId } from 'mongodb';

// ============================================================================
// 1. PRODUCT & VARIANTS
// ============================================================================
export interface VariantSubdocument {
  _id: ObjectId;
  sku: string;
  barcode?: string | null;
  size?: string | null;
  color?: string | null;
  net_weight_grams?: number | null;
  price: number;
  compare_at_price?: number | null;
  stock_quantity: number;
  reserved_quantity: number;
  vat_rate: number;
  is_active: boolean;
  updated_by_user_id: ObjectId;
  updated_at: Date;
}

export interface ProductImage {
  url: string;
  alt_text?: string | null;
  is_primary: boolean;
}

export interface ProductDocument {
  _id: ObjectId;
  title: string;
  tamil_title?: string | null;
  slug: string;
  brand: string;
  category_slugs: string[];
  description: string;
  temperature_class: 'ambient' | 'chilled' | 'frozen';
  is_perishable: boolean;
  is_active: boolean;
  images: ProductImage[];
  variants: VariantSubdocument[];
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// 2. USERS (Minimal Role Access)
// ============================================================================
export type UserRole = 'customer' | 'admin';

export interface SavedAddressSubdocument {
  _id: ObjectId;
  recipient_name: string;
  phone?: string | null;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  county?: string | null;
  postcode: string;
  country: string;
  delivery_instructions?: string | null;
  is_default: boolean;
}

export interface UserDocument {
  _id: ObjectId;
  email: string;
  password_hash?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  role: UserRole;
  saved_addresses: SavedAddressSubdocument[];
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// 3. ORDERS (Immutable Snapshots)
// ============================================================================
export interface OrderItemSnapshot {
  product_id: ObjectId;
  variant_id?: ObjectId | null;
  sku: string;
  title: string;
  size_or_weight?: string | null;
  unit_price: number;
  discount_applied?: number | null;
  tax_rate?: number | null;
  tax_amount?: number | null;
  quantity: number;
  line_total: number;
  is_chilled?: boolean | null;
}

export interface OrderAddressSnapshot {
  recipient_name: string;
  phone?: string | null;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  county?: string | null;
  postcode: string;
  country: string;
  delivery_instructions?: string | null;
}

export interface PaymentSubdocument {
  payment_id: string;
  method: string; // 'card' | 'apple_pay' | 'google_pay' | 'paypal'
  gateway: string; // 'stripe' | 'paypal'
  gateway_transaction_id?: string | null;
  amount: number;
  currency: string;
  status: string; // 'authorized' | 'captured' | 'failed' | 'refunded'
  failure_reason?: string | null;
  created_at: Date;
}

export interface ShipmentSubdocument {
  shipment_id: string;
  carrier: string;
  tracking_number?: string | null;
  shipping_method: string;
  has_chilled_packaging?: boolean | null;
  ice_pack_count?: number | null;
  status: string; // 'packing' | 'dispatched' | 'in_transit' | 'delivered' | 'failed'
  items_packed: {
    sku: string;
    quantity: number;
  }[];
  dispatched_at?: Date | null;
  delivered_at?: Date | null;
}

export interface OrderDocument {
  _id: ObjectId;
  order_number: string;
  user_id?: ObjectId | null;
  customer_email: string;
  customer_phone?: string | null;
  currency: 'GBP' | 'EUR';
  pricing_summary: {
    subtotal: number;
    discount_total: number;
    tax_total: number;
    shipping_fee: number;
    grand_total: number;
  };
  items: OrderItemSnapshot[];
  shipping_address: OrderAddressSnapshot;
  billing_address?: Partial<OrderAddressSnapshot> | null;
  payments: PaymentSubdocument[];
  shipments: ShipmentSubdocument[];
  order_status: 'pending' | 'confirmed' | 'processing' | 'partially_shipped' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// 4. REVIEWS (Decoupled High-Scale Collection)
// ============================================================================
export interface ReviewDocument {
  _id: ObjectId;
  product_id: ObjectId;
  user_id: ObjectId;
  order_id?: ObjectId | null;
  sku?: string | null;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  is_verified_buyer: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at?: Date | null;
}

// ============================================================================
// 5. CARTS & WISHLISTS (Embedded Line Items)
// ============================================================================
export interface CartItemSubdocument {
  product_id: ObjectId;
  variant_id: ObjectId;
  sku: string;
  quantity: number;
  unit_price_at_addition?: number | null;
  added_at: Date;
}

export interface CartDocument {
  _id: ObjectId;
  user_id?: ObjectId | null;
  session_token?: string | null;
  items: CartItemSubdocument[];
  updated_at: Date;
  expires_at: Date; // TTL Indexed
}

export interface WishlistItemSubdocument {
  product_id: ObjectId;
  variant_id?: ObjectId | null;
  sku?: string | null;
  added_at: Date;
}

export interface WishlistDocument {
  _id: ObjectId;
  user_id: ObjectId;
  name: string;
  items: WishlistItemSubdocument[];
  created_at: Date;
}

