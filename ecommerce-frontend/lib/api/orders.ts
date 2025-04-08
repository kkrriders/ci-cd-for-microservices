import type { Order, OrderItem } from "@/types/order"

// Set base API URL from environment variable or default to local development URL
const API_BASE_URL = process.env.NEXT_PUBLIC_ORDERS_API_URL || 'http://localhost:8083/api/v1/orders';

/**
 * Get all orders for a user
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/orders`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching orders: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    return [];
  }
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/${orderId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching order: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch order ${orderId}:`, error);
    return null;
  }
}

/**
 * Create a new order
 */
export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order | null> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating order: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to create order:', error);
    return null;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string): Promise<Order | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating order status: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to update order ${orderId} status:`, error);
    return null;
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/${orderId}/cancel`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error cancelling order: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to cancel order ${orderId}:`, error);
    return false;
  }
}

/**
 * Request a refund for an order
 */
export async function requestRefund(orderId: string, reason: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/${orderId}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });
    
    if (!response.ok) {
      throw new Error(`Error requesting refund: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to request refund for order ${orderId}:`, error);
    return false;
  }
} 