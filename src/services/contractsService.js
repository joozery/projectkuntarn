import api from '@/lib/api';

export const contractsService = {
  // Get all contracts (installments)
  getAll: async (branchId) => {
    const params = branchId ? { branchId } : {};
    return api.get('/installments', { params });
  },

  // Get contract by ID
  getById: async (id) => {
    return api.get(`/installments/${id}`);
  },

  // Create new contract
  create: async (contractData) => {
    return api.post('/installments', contractData);
  },

  // Update contract
  update: async (id, contractData) => {
    return api.put(`/installments/${id}`, contractData);
  },

  // Delete contract
  delete: async (id) => {
    return api.delete(`/installments/${id}`);
  }
}; 