import api from '@/lib/api';

export const employeesService = {
  // Get all employees
  getAll: async (branchId) => {
    const params = branchId ? { branchId } : {};
    return api.get('/employees', { params });
  },

  // Get employee by ID
  getById: async (id) => {
    return api.get(`/employees/${id}`);
  },

  // Create new employee
  create: async (employeeData) => {
    return api.post('/employees', employeeData);
  },

  // Update employee
  update: async (id, employeeData) => {
    return api.put(`/employees/${id}`, employeeData);
  },

  // Delete employee
  delete: async (id) => {
    return api.delete(`/employees/${id}`);
  }
}; 