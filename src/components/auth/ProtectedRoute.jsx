import React from 'react';
import { authService } from '@/services/authService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock } from 'lucide-react';

/**
 * Component สำหรับป้องกันการเข้าถึงหน้าที่ต้องการสิทธิ์
 */
const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  requiredRole, 
  requireAuth = true,
  fallback = null 
}) => {
  // ตรวจสอบการเข้าสู่ระบบ
  if (requireAuth && !authService.isAuthenticated()) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            กรุณาเข้าสู่ระบบ
          </h2>
          <p className="text-gray-600">
            คุณต้องเข้าสู่ระบบเพื่อเข้าถึงหน้านี้
          </p>
        </div>
      </div>
    );
  }

  // ตรวจสอบบทบาท
  if (requiredRole && !authService.hasRole(requiredRole)) {
    return fallback || (
      <div className="p-6">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้ ต้องการบทบาท: {
              Array.isArray(requiredRole) ? requiredRole.join(', ') : requiredRole
            }
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // ตรวจสอบสิทธิ์เฉพาะ
  if (requiredPermission && !authService.hasPermission(requiredPermission)) {
    return fallback || (
      <div className="p-6">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            คุณไม่มีสิทธิ์เข้าถึงฟีเจอร์นี้ ต้องการสิทธิ์: {requiredPermission}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return children;
};

/**
 * HOC สำหรับป้องกันการเข้าถึง component
 */
export const withAuth = (WrappedComponent, options = {}) => {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
};

/**
 * Hook สำหรับตรวจสอบสิทธิ์
 */
export const useAuth = () => {
  return {
    isAuthenticated: authService.isAuthenticated(),
    currentUser: authService.getCurrentUser(),
    hasPermission: (permission) => authService.hasPermission(permission),
    hasRole: (role) => authService.hasRole(role),
    isAdmin: () => authService.isAdmin(),
    isSuperAdmin: () => authService.isSuperAdmin(),
    canAccessBranch: (branchId) => authService.canAccessBranch(branchId),
    logout: () => authService.logout()
  };
};

/**
 * Component สำหรับแสดง/ซ่อน element ตามสิทธิ์
 */
export const PermissionGate = ({ 
  permission, 
  role, 
  children, 
  fallback = null,
  requireAll = false 
}) => {
  let hasAccess = true;

  if (permission) {
    if (Array.isArray(permission)) {
      hasAccess = requireAll 
        ? permission.every(p => authService.hasPermission(p))
        : permission.some(p => authService.hasPermission(p));
    } else {
      hasAccess = authService.hasPermission(permission);
    }
  }

  if (role && hasAccess) {
    if (Array.isArray(role)) {
      hasAccess = requireAll 
        ? role.every(r => authService.hasRole(r))
        : role.some(r => authService.hasRole(r));
    } else {
      hasAccess = authService.hasRole(role);
    }
  }

  return hasAccess ? children : fallback;
};

export default ProtectedRoute;