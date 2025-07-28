import api from '@/lib/api';

export const customersService = {
  // Get all customers
  getAll: async (branchId, checkerId, search, status) => {
    const params = {};
    if (branchId) params.branchId = branchId;
    if (checkerId) params.checkerId = checkerId;
    if (search) params.search = search;
    if (status && status !== 'all') params.status = status;
    
    // เพิ่ม timestamp เพื่อป้องกัน cache
    params._t = new Date().getTime();
    
    return api.get('/customers', { params });
  },

  // Get customer by ID
  getById: async (id) => {
    return api.get(`/customers/${id}`);
  },

  // Get customers by checker
  getByChecker: async (checkerId, search, status) => {
    const params = {};
    if (search) params.search = search;
    if (status && status !== 'all') params.status = status;
    return api.get(`/customers/checker/${checkerId}`, { params });
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