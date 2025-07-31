import api from '@/lib/api';

const BASE_URL = '/installments';

export const installmentsService = {
  // Get all installments
  getAll: async (branchId = null, params = {}) => {
    const queryParams = new URLSearchParams();
    if (branchId) queryParams.append('branchId', branchId);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    const url = queryParams.toString() ? `${BASE_URL}?${queryParams}` : BASE_URL;
    console.log('🔍 installmentsService.getAll calling:', url);
    try {
      const response = await api.get(url);
      console.log('✅ installmentsService.getAll response:', response);
      return response;
    } catch (error) {
      console.error('❌ installmentsService.getAll error:', error);
      console.error('❌ Error details:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw error;
    }
  },

  // Get installment by ID
  getById: async (id) => {
    console.log('🔍 installmentsService.getById called with id:', id);
    const url = `${BASE_URL}/${id}?_t=${Date.now()}`;
    console.log('🔍 Making API call to:', url);
    try {
      const response = await api.get(url);
      console.log('✅ installmentsService.getById response:', response);
      return response;
    } catch (error) {
      console.error('❌ installmentsService.getById error:', error);
      console.error('❌ Error details:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw error;
    }
  },

  // Create new installment
  create: async (data) => {
    return api.post(BASE_URL, data);
  },

  // Update installment
  update: async (id, data) => {
    return api.put(`${BASE_URL}/${id}`, data);
  },

  // Delete installment
  delete: async (id) => {
    return api.delete(`${BASE_URL}/${id}`);
  },

  // Get installment payments
  getPayments: async (id, params = {}) => {
    const queryParams = new URLSearchParams(params);
    return api.get(`${BASE_URL}/${id}/payments?${queryParams}`);
  },

  // Update payment status
  updatePayment: async (installmentId, paymentId, data) => {
    return api.put(`${BASE_URL}/${installmentId}/payments/${paymentId}`, data);
  },

  // Get installment collections
  getCollections: async (id, params = {}) => {
    const queryParams = new URLSearchParams(params);
    return api.get(`${BASE_URL}/${id}/collections?${queryParams}`);
  }
}; 