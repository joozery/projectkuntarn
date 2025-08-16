import api from '@/lib/api';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.token = localStorage.getItem('auth_token');
    
    // Set default authorization header if token exists
    if (this.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  /**
   * เข้าสู่ระบบ
   */
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });

      const { token, user } = response.data;
      
      // Store token and user data
      this.token = token;
      this.currentUser = user;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_user', JSON.stringify(user));
      
      // Set authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('ไม่สามารถเข้าสู่ระบบได้');
    }
  }

  /**
   * ออกจากระบบ
   */
  async logout() {
    try {
      // Call logout API if needed
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local data
      this.token = null;
      this.currentUser = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      delete api.defaults.headers.common['Authorization'];
    }
  }

  /**
   * ตรวจสอบสถานะการเข้าสู่ระบบ
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * ดึงข้อมูลผู้ใช้งานปัจจุบัน
   */
  getCurrentUser() {
    if (!this.currentUser) {
      const userData = localStorage.getItem('current_user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    }
    return this.currentUser;
  }

  /**
   * รีเฟรช token
   */
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      
      this.token = token;
      localStorage.setItem('auth_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw new Error('Session expired. Please login again.');
    }
  }

  /**
   * ตรวจสอบสิทธิ์
   */
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.role === 'super_admin') return true;
    
    // Check if user has specific permission
    return user.permissions?.includes(permission) || false;
  }

  /**
   * ตรวจสอบบทบาท
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  }

  /**
   * ตรวจสอบว่าเป็น admin หรือไม่
   */
  isAdmin() {
    return this.hasRole(['super_admin', 'admin']);
  }

  /**
   * ตรวจสอบว่าเป็น super admin หรือไม่
   */
  isSuperAdmin() {
    return this.hasRole('super_admin');
  }

  /**
   * ตรวจสอบการเข้าถึงสาขา
   */
  canAccessBranch(branchId) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Super admin and admin can access all branches
    if (this.hasRole(['super_admin', 'admin'])) return true;
    
    // If user has no specific branch, can access all
    if (!user.branch_id) return true;
    
    // Check if user's branch matches
    return user.branch_id === branchId;
  }

  /**
   * ดึงสาขาที่ผู้ใช้งานสามารถเข้าถึงได้
   */
  getAccessibleBranches(allBranches) {
    const user = this.getCurrentUser();
    if (!user) return [];
    
    // Super admin and admin can access all branches
    if (this.hasRole(['super_admin', 'admin'])) {
      return allBranches;
    }
    
    // If user has specific branch, return only that branch
    if (user.branch_id) {
      return allBranches.filter(branch => branch.id === user.branch_id);
    }
    
    return allBranches;
  }

  /**
   * ตรวจสอบ token validity
   */
  async validateToken() {
    if (!this.token) return false;
    
    try {
      const response = await api.get('/auth/validate');
      return response.data.valid;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * เปลี่ยนรหัสผ่าน
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('ไม่สามารถเปลี่ยนรหัสผ่านได้');
    }
  }

  /**
   * ขอรีเซ็ตรหัสผ่าน
   */
  async requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Password reset request error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('ไม่สามารถส่งคำขอรีเซ็ตรหัสผ่านได้');
    }
  }

  /**
   * รีเซ็ตรหัสผ่าน
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('ไม่สามารถรีเซ็ตรหัสผ่านได้');
    }
  }
}

export const authService = new AuthService();