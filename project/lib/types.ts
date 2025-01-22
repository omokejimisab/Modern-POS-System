export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes: {
    [key: string]: string;  // e.g., { size: 'L', color: 'Red' }
  };
}

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  sku: string;
  category: string;
  stockQuantity: number;
  expiryDate?: string;
  image?: string;
  hasVariants: boolean;
  variants?: ProductVariant[];
}

export interface CartItem extends Omit<Product, 'variants'> {
  quantity: number;
  variant?: ProductVariant;
}

export interface PendingOrder {
  id: string;
  items: CartItem[];
  timestamp: string;
  customerNote?: string;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  change: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
  staffId: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'admin' | 'cashier';
  pin: string;
  email: string;
  active: boolean;
  lastActive?: string;
}

export type PaymentMethod = 'cash' | 'card';

export interface AppState {
  products: Product[];
  transactions: Transaction[];
  staff: Staff[];
  pendingOrders: PendingOrder[];
}