import { useState, useEffect, useCallback } from 'react';
import { cartService } from '@/services/cartService';

/**
 * Hook to manage a user's shopping cart.
 */
export function useCart(userId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart(userId);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (item) => {
    if (!userId) throw new Error('User ID is required');
    setActionLoading(true);
    try {
      await cartService.addToCart(userId, item);
      await fetchCart();
    } finally {
      setActionLoading(false);
    }
  };

  const removeItem = async (productId) => {
    if (!userId) return;
    setActionLoading(true);
    // Optimistic update
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    try {
      await cartService.removeItem(userId, productId);
    } catch (err) {
      // Revert on failure
      await fetchCart();
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const clearCart = async () => {
    if (!userId) return;
    setActionLoading(true);
    try {
      await cartService.clearCart(userId);
      setItems([]);
    } finally {
      setActionLoading(false);
    }
  };

  const checkout = async (checkoutRequest) => {
    if (!userId) throw new Error('User ID required');
    setActionLoading(true);
    try {
      const result = await cartService.checkout(userId, checkoutRequest);
      setItems([]);
      return result;
    } finally {
      setActionLoading(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  return {
    items,
    loading,
    actionLoading,
    error,
    totalItems,
    subtotal,
    fetchCart,
    addToCart,
    removeItem,
    clearCart,
    checkout,
  };
}
