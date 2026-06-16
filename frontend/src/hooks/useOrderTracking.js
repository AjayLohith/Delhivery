import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '@/services/paymentService';

/**
 * Hook to fetch order tracking information.
 */
export function useOrderTracking(orderId) {
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTracking = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getTracking(orderId);
      setTracking(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  return { tracking, loading, error, refetch: fetchTracking };
}
