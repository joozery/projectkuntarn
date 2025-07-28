import api from '@/lib/api';

export const customersService = {
  // Get all customers
  getAll: async (branchId) => {
    const params = branchId ? { branchId } : {};
    return api.get('/customers', { params });
  },

  // Get customer by ID
  getById: async (id) => {
    return api.get(`/customers/${id}`);
  },

  // Create new customer
  create: async (customerData) => {
    return api.post('/customers', customerData);
  },

  // Update customer
  update: async (id, customerData) => {
    return api.put(`/customers/${id}`, customerData);
  },

  // Delete customer
  delete: async (id) => {
    return api.delete(`/customers/${id}`);
  }
}; 