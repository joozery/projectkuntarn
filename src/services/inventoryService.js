import api from '@/lib/api';

export const inventoryService = {
  // Get all inventory items with pagination and filtering
  getAll: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 15,
      ...params
    };
    return api.get('/inventory', { params: queryParams });
  },

  // Get inventory item by ID
  getById: async (id) => {
    return api.get(`/inventory/${id}`);
  },

  // Create new inventory item
  create: async (inventoryData) => {
    return api.post('/inventory', inventoryData);
  },

  // Update inventory item
  update: async (id, inventoryData) => {
    return api.put(`/inventory/${id}`, inventoryData);
  },

  // Delete inventory item
  delete: async (id) => {
    return api.delete(`/inventory/${id}`);
  },

  // Search inventory items
  search: async (searchTerm, params = {}) => {
    const queryParams = {
      search: searchTerm,
      page: params.page || 1,
      limit: params.limit || 15,
      ...params
    };
    return api.get('/inventory', { params: queryParams });
  }
}; 