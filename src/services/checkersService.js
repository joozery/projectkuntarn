import api from '@/lib/api';

// Checkers API Service
export const checkersService = {
  // Get all checkers
  getAll: async (branchId, params = {}) => {
    try {
      console.log('🔍 checkersService.getAll called with branchId:', branchId, 'params:', params);
      
      // Create params object with branchId
      const queryParams = { branchId, ...params };
      
      // Add cache busting
      queryParams._t = new Date().getTime();
      console.log('🔄 Making API call to /checkers with params:', queryParams);
      
      const response = await api.get('/checkers', { params: queryParams });
      console.log('✅ checkersService.getAll response:', response);
      
      return response;
    } catch (error) {
      console.error('❌ checkersService.getAll error:', error);
      console.error('❌ Error response:', error.response);
      throw error;
    }
  },

  // Get checker by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/checkers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new checker
  create: async (checkerData) => {
    try {
      const response = await api.post('/checkers', checkerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update checker
  update: async (id, checkerData) => {
    try {
      const response = await api.put(`/checkers/${id}`, checkerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete checker
  delete: async (id) => {
    try {
      const response = await api.delete(`/checkers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get collections by checker
  getCollections: async (id, params = {}) => {
    try {
      const response = await api.get(`/checkers/${id}/collections`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new collection
  createCollection: async (id, collectionData) => {
    try {
      const response = await api.post(`/checkers/${id}/collections`, collectionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get checker reports
  getReports: async (id, params = {}) => {
    try {
      const response = await api.get(`/checkers/${id}/reports`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 