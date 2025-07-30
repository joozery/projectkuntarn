import api from '@/lib/api';

export const collectorsService = {
  // Get all collectors with pagination and filtering
  getAll: async (params = {}) => {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 15,
      ...params
    };
    return api.get('/collectors', { params: queryParams });
  },

  // Get collector by ID
  getById: async (id) => {
    return api.get(`/collectors/${id}`);
  },

  // Create new collector
  create: async (collectorData) => {
    return api.post('/collectors', collectorData);
  },

  // Update collector
  update: async (id, collectorData) => {
    return api.put(`/collectors/${id}`, collectorData);
  },

  // Delete collector
  delete: async (id) => {
    return api.delete(`/collectors/${id}`);
  },

  // Search collectors
  search: async (searchTerm, params = {}) => {
    const queryParams = {
      search: searchTerm,
      page: params.page || 1,
      limit: params.limit || 15,
      ...params
    };
    return api.get('/collectors', { params: queryParams });
  },

  // Get collector performance statistics
  getPerformance: async (id, params = {}) => {
    const queryParams = {
      startDate: params.startDate,
      endDate: params.endDate,
      ...params
    };
    return api.get(`/collectors/${id}/performance`, { params: queryParams });
  },

  // Get collectors by branch
  getByBranch: async (branchId, params = {}) => {
    const queryParams = {
      branchId,
      page: params.page || 1,
      limit: params.limit || 15,
      ...params
    };
    return api.get('/collectors', { params: queryParams });
  },

  // Get active collectors
  getActive: async (params = {}) => {
    const queryParams = {
      status: 'active',
      page: params.page || 1,
      limit: params.limit || 15,
      ...params
    };
    return api.get('/collectors', { params: queryParams });
  }
}; 