import api from '@/lib/api';

class AdminUsersService {
  /**
   * ดึงรายการผู้ใช้งาน admin ทั้งหมด
   */
  async getAll(branchId = null) {
    try {
      const params = branchId ? { branch_id: branchId } : {};
      const response = await api.get('/admin-users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching admin users:', error);
      throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้งานได้');
    }
  }

  /**
   * ดึงข้อมูลผู้ใช้งานตาม ID
   */
  async getById(id) {
    try {
      const response = await api.get(`/admin-users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin user:', error);
      throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้งานได้');
    }
  }

  /**
   * สร้างผู้ใช้งาน admin ใหม่
   */
  async create(userData) {
    try {
      const response = await api.post('/admin-users', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name,
        role: userData.role,
        branch_id: userData.branch_id,
        permissions: userData.permissions || [],
        is_active: userData.is_active !== undefined ? userData.is_active : true
      });
      return response.data;
    } catch (error) {
      console.error('Error creating admin user:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('ไม่สามารถสร้างผู้ใช้งานได้');
    }
  }

  /**
   * อัปเดตข้อมูลผู้ใช้งาน
   */
  async update(id, userData) {
    try {
      const response = await api.put(`/admin-users/${id}`, {
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        branch_id: userData.branch_id,
        permissions: userData.permissions || [],
        is_active: userData.is_active
      });
      return response.data;
    } catch (error) {
      console.error('Error updating admin user:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('ไม่สามารถอัปเดตข้อมูลผู้ใช้งานได้');
    }
  }

  /**
   * ลบผู้ใช้งาน
   */
  async delete(id) {
    try {
      const response = await api.delete(`/admin-users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting admin user:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('ไม่สามารถลบผู้ใช้งานได้');
    }
  }

  /**
   * เปลี่ยนสถานะการใช้งาน
   */
  async toggleStatus(id, isActive) {
    try {
      const response = await api.patch(`/admin-users/${id}/status`, {
        is_active: isActive
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw new Error('ไม่สามารถเปลี่ยนสถานะผู้ใช้งานได้');
    }
  }

  /**
   * รีเซ็ตรหัสผ่าน
   */
  async resetPassword(id) {
    try {
      const response = await api.post(`/admin-users/${id}/reset-password`);
      return response.data.new_password;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw new Error('ไม่สามารถรีเซ็ตรหัสผ่านได้');
    }
  }

  /**
   * เปลี่ยนรหัสผ่าน
   */
  async changePassword(id, currentPassword, newPassword) {
    try {
      const response = await api.post(`/admin-users/${id}/change-password`, {
        current_password: currentPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('ไม่สามารถเปลี่ยนรหัสผ่านได้');
    }
  }

  /**
   * ดึงรายการสิทธิ์ที่มีอยู่
   */
  async getAvailablePermissions() {
    try {
      const response = await api.get('/admin-users/permissions');
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      // Return default permissions if API fails
      return {
        data: [
          { id: 'dashboard.view', name: 'ดูแดชบอร์ด', category: 'dashboard' },
          { id: 'branches.view', name: 'ดูข้อมูลสาขา', category: 'branches' },
          { id: 'branches.create', name: 'เพิ่มสาขา', category: 'branches' },
          { id: 'branches.edit', name: 'แก้ไขสาขา', category: 'branches' },
          { id: 'branches.delete', name: 'ลบสาขา', category: 'branches' },
          { id: 'customers.view', name: 'ดูข้อมูลลูกค้า', category: 'customers' },
          { id: 'customers.create', name: 'เพิ่มลูกค้า', category: 'customers' },
          { id: 'customers.edit', name: 'แก้ไขลูกค้า', category: 'customers' },
          { id: 'customers.delete', name: 'ลบลูกค้า', category: 'customers' },
          { id: 'products.view', name: 'ดูข้อมูลสินค้า', category: 'products' },
          { id: 'products.create', name: 'เพิ่มสินค้า', category: 'products' },
          { id: 'products.edit', name: 'แก้ไขสินค้า', category: 'products' },
          { id: 'products.delete', name: 'ลบสินค้า', category: 'products' },
          { id: 'contracts.view', name: 'ดูสัญญา', category: 'contracts' },
          { id: 'contracts.create', name: 'สร้างสัญญา', category: 'contracts' },
          { id: 'contracts.edit', name: 'แก้ไขสัญญา', category: 'contracts' },
          { id: 'contracts.delete', name: 'ลบสัญญา', category: 'contracts' },
          { id: 'payments.view', name: 'ดูการชำระเงิน', category: 'payments' },
          { id: 'payments.create', name: 'บันทึกการชำระ', category: 'payments' },
          { id: 'payments.edit', name: 'แก้ไขการชำระ', category: 'payments' },
          { id: 'reports.view', name: 'ดูรายงาน', category: 'reports' },
          { id: 'reports.export', name: 'ส่งออกรายงาน', category: 'reports' },
          { id: 'settings.view', name: 'ดูการตั้งค่า', category: 'settings' },
          { id: 'settings.edit', name: 'แก้ไขการตั้งค่า', category: 'settings' },
          { id: 'users.view', name: 'ดูผู้ใช้งาน', category: 'users' },
          { id: 'users.create', name: 'เพิ่มผู้ใช้งาน', category: 'users' },
          { id: 'users.edit', name: 'แก้ไขผู้ใช้งาน', category: 'users' },
          { id: 'users.delete', name: 'ลบผู้ใช้งาน', category: 'users' }
        ]
      };
    }
  }

  /**
   * ดึงรายการบทบาทที่มีอยู่
   */
  getRoles() {
    return [
      { id: 'super_admin', name: 'Super Admin', description: 'สิทธิ์เต็มทุกอย่าง' },
      { id: 'admin', name: 'Admin', description: 'จัดการระบบและข้อมูล' },
      { id: 'manager', name: 'Manager', description: 'จัดการสาขาและพนักงาน' },
      { id: 'user', name: 'User', description: 'ใช้งานระบบพื้นฐาน' }
    ];
  }

  /**
   * ตรวจสอบสิทธิ์ของผู้ใช้งาน
   */
  async checkPermission(userId, permission) {
    try {
      const response = await api.get(`/admin-users/${userId}/permissions/${permission}`);
      return response.data.has_permission;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * ดึงข้อมูลผู้ใช้งานปัจจุบัน
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/admin-users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้งานปัจจุบันได้');
    }
  }

  /**
   * อัปเดตโปรไฟล์ผู้ใช้งานปัจจุบัน
   */
  async updateProfile(userData) {
    try {
      const response = await api.put('/admin-users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('ไม่สามารถอัปเดตโปรไฟล์ได้');
    }
  }
}

export const adminUsersService = new AdminUsersService();