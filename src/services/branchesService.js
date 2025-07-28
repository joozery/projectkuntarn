import api from '@/lib/api';

// Branches API Service
export const branchesService = {
  // Get all branches
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/branches', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get branch by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/branches/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new branch
  create: async (branchData) => {
    try {
      const response = await api.post('/branches', branchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update branch
  update: async (id, branchData) => {
    try {
      const response = await api.put(`/branches/${id}`, branchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete branch
  delete: async (id) => {
    try {
      const response = await api.delete(`/branches/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get branch statistics
  getStatistics: async (id) => {
    try {
      const response = await api.get(`/branches/${id}/statistics`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get checkers by branch
  getCheckers: async (id, params = {}) => {
    try {
      const response = await api.get(`/branches/${id}/checkers`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customers by branch
  getCustomers: async (id, params = {}) => {
    try {
      const response = await api.get(`/branches/${id}/customers`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get installments by branch
  getInstallments: async (id, params = {}) => {
    try {
      const response = await api.get(`/branches/${id}/installments`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get collections by branch
  getCollections: async (id, params = {}) => {
    try {
      const response = await api.get(`/branches/${id}/collections`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 