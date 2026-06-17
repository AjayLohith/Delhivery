import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/productService';

/**
 * Hook to fetch all products with optional category/search filtering.
 */
export function useProducts(filter = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (filter.search?.trim()) {
        data = await productService.search(filter.search.trim());
      } else if (filter.category && filter.category !== 'all') {
        data = await productService.getByCategory(filter.category);
      } else if (filter.inStockOnly) {
        data = await productService.getInStock();
      } else {
        data = await productService.getAll();
      }

      // Apply strict client-side filtering fallback to support multiple filters simultaneously
      if (filter.category && filter.category !== 'all') {
        data = data.filter(p => p.category === filter.category);
      }
      if (filter.inStockOnly) {
        data = data.filter(p => p.stock > 0);
      }

      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter.search, filter.category, filter.inStockOnly]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

/**
 * Hook for admin product CRUD operations.
 */
export function useProductMutations(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createProduct = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await productService.create(data);
      onSuccess?.('Product created successfully');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      await productService.update(id, data);
      onSuccess?.('Product updated successfully');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await productService.delete(id);
      onSuccess?.('Product deleted successfully');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProduct, updateProduct, deleteProduct, loading, error };
}
