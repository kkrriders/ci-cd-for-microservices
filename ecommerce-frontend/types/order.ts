/**
 * Order item representing a product in an order
 */
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

/**
 * Address information for shipping
 */
export interface Address {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

/**
 * Payment information
 */
export interface Payment {
  method: 'credit_card' | 'paypal' | 'bank_transfer';
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

/**
 * Refund information if order has been refunded
 */
export interface Refund {
  requestedAt: string;
  processedAt?: string;
  status: 'requested' | 'approved' | 'rejected' | 'processed';
  reason: string;
  refundAmount: number;
}

/**
 * Order status options
 */
export type OrderStatus = 
  | 'pending'
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

/**
 * Full order object
 */
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  payment: Payment;
  status: OrderStatus;
  refund?: Refund;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt?: string;
} 