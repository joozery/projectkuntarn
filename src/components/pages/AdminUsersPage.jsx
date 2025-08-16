import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck,
  Eye,
  EyeOff,
  UserPlus,
  Settings,
  Lock,
  Unlock,
  Crown,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { adminUsersService } from '@/services/adminUsersService';
import AdminUserForm from '@/components/forms/AdminUserForm';

const AdminUsersPage = ({ selectedBranch, currentBranch }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Load users
  useEffect(() => {
    loadUsers();
  }, [selectedBranch]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminUsersService.getAll(selectedBranch);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading admin users:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลผู้ใช้งานได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('คุณต้องการลบผู้ใช้งานนี้หรือไม่?')) {
      try {
        await adminUsersService.delete(userId);
        toast({
          title: "สำเร็จ",
          description: "ลบผู้ใช้งานเรียบร้อยแล้ว",
          variant: "default"
        });
        loadUsers();
      } catch (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถลบผู้ใช้งานได้",
          variant: "destructive"
        });
      }
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await adminUsersService.toggleStatus(userId, !currentStatus);
      toast({
        title: "สำเร็จ",
        description: `${currentStatus ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}ผู้ใช้งานเรียบร้อยแล้ว`,
        variant: "default"
      });
      loadUsers();
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเปลี่ยนสถานะผู้ใช้งานได้",
        variant: "destructive"
      });
    }
  };

  const handleResetPassword = async (userId) => {
    if (window.confirm('คุณต้องการรีเซ็ตรหัสผ่านของผู้ใช้งานนี้หรือไม่?')) {
      try {
        const newPassword = await adminUsersService.resetPassword(userId);
        toast({
          title: "สำเร็จ",
          description: `รีเซ็ตรหัสผ่านเรียบร้อยแล้ว รหัสผ่านใหม่: ${newPassword}`,
          variant: "default"
        });
      } catch (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถรีเซ็ตรหัสผ่านได้",
          variant: "destructive"
        });
      }
    }
  };

  const handleFormSubmit = async (userData) => {
    try {
      if (editingUser) {
        await adminUsersService.update(editingUser.id, userData);
        toast({
          title: "สำเร็จ",
          description: "อัปเดตข้อมูลผู้ใช้งานเรียบร้อยแล้ว",
          variant: "default"
        });
      } else {
        await adminUsersService.create(userData);
        toast({
          title: "สำเร็จ",
          description: "เพิ่มผู้ใช้งานใหม่เรียบร้อยแล้ว",
          variant: "default"
        });
      }
      setShowForm(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive"
      });
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'admin':
        return <ShieldCheck className="h-4 w-4 text-blue-600" />;
      case 'manager':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'user':
        return <User className="h-4 w-4 text-gray-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'manager':
        return 'Manager';
      case 'user':
        return 'User';
      default:
        return 'User';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manager':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'user':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (showForm) {
    return (
      <AdminUserForm
        user={editingUser}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setShowForm(false);
          setEditingUser(null);
        }}
        currentBranch={currentBranch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">จัดการผู้ใช้งาน Admin</h1>
          <p className="text-gray-600 mt-2">
            จัดการบัญชีผู้ใช้งาน สิทธิ์การเข้าถึง และการตั้งค่าระบบ
          </p>
        </div>
        <Button
          onClick={handleAddUser}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          เพิ่มผู้ใช้งานใหม่
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ผู้ใช้งานทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Unlock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ใช้งานได้</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ปิดใช้งาน</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => !u.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Admin</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => ['admin', 'super_admin'].includes(u.role)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="ค้นหาผู้ใช้งาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการผู้ใช้งาน</CardTitle>
          <CardDescription>
            จำนวนผู้ใช้งานทั้งหมด {filteredUsers.length} คน
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่พบข้อมูลผู้ใช้งาน</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">ผู้ใช้งาน</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">บทบาท</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">สาขา</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">สถานะ</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">เข้าใช้งานล่าสุด</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.full_name || user.username}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <p className="text-xs text-gray-400">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {getRoleName(user.role)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">
                          {user.branch_name || 'ทุกสาขา'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'ใช้งานได้' : 'ปิดใช้งาน'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-500">
                          {user.last_login 
                            ? new Date(user.last_login).toLocaleDateString('th-TH')
                            : 'ยังไม่เคยเข้าใช้งาน'
                          }
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id, user.is_active)}
                            className={user.is_active ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"}
                          >
                            {user.is_active ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResetPassword(user.id)}
                            className="text-orange-600 hover:text-orange-800"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;