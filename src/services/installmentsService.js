import api from '@/lib/api';

// Installments API Service
export const installmentsService = {
  // Get all installments
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/installments', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get installment by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/installments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get installment payments
  getPayments: async (id, params = {}) => {
    try {
      const response = await api.get(`/installments/${id}/payments`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get installment collections
  getCollections: async (id, params = {}) => {
    try {
      const response = await api.get(`/installments/${id}/collections`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update installment
  update: async (id, installmentData) => {
    try {
      const response = await api.put(`/installments/${id}`, installmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 