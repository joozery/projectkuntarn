import api from '@/lib/api';

export const productsService = {
  // Get all products
  getAll: async (branchId) => {
    const params = branchId ? { branchId } : {};
    params._t = new Date().getTime(); // Cache busting
    return api.get('/products', { params });
  },

  // Get product by ID
  getById: async (id) => {
    return api.get(`/products/${id}`);
  },

  // Create new product
  create: async (productData) => {
    return api.post('/products', productData);
  },

  // Update product
  update: async (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },

  // Delete product
  delete: async (id) => {
    return api.delete(`/products/${id}`);
  }
}; 