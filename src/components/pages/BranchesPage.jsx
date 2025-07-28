import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Building2, Plus, MapPin, Phone, User, Edit, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { branchesService } from '@/services/branchesService';

const BranchesPage = ({ selectedBranch }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchForm, setBranchForm] = useState({
    name: '',
    address: '',
    phone: '',
    manager: ''
  });

  // โหลดข้อมูลสาขา
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const response = await branchesService.getAll();
      setBranches(response.data || []);
    } catch (error) {
      console.error('Error loading branches:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลสาขาได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchForm.name || !branchForm.address) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ชื่อสาขาและที่อยู่เป็นข้อมูลที่จำเป็น",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);

    if (editingBranch) {
        await branchesService.update(editingBranch.id, branchForm);
      toast({
        title: "แก้ไขสาขาสำเร็จ! ✏️",
        description: `แก้ไขข้อมูล ${branchForm.name} แล้ว`,
      });
      setEditingBranch(null);
    } else {
        await branchesService.create(branchForm);
      toast({
        title: "เพิ่มสาขาสำเร็จ! 🏢",
        description: `เพิ่ม ${branchForm.name} เข้าสู่ระบบแล้ว`,
      });
    }
    
    setBranchForm({ name: '', address: '', phone: '', manager: '' });
    setShowForm(false);
      loadBranches(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error('Error saving branch:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลสาขาได้",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (branch) => {
    setBranchForm({
      name: branch.name,
      address: branch.address,
      phone: branch.phone || '',
      manager: branch.manager || ''
    });
    setEditingBranch(branch);
    setShowForm(true);
  };

  const handleDelete = async (branchId) => {
    if (branches.length <= 1) {
      toast({
        title: "ไม่สามารถลบได้",
        description: "ต้องมีสาขาอย่างน้อย 1 สาขา",
        variant: "destructive"
      });
      return;
    }

    if (branchId === selectedBranch) {
      toast({
        title: "ไม่สามารถลบได้",
        description: "ไม่สามารถลบสาขาที่กำลังใช้งานอยู่",
        variant: "destructive"
      });
      return;
    }

    try {
      await branchesService.delete(branchId);
    toast({
      title: "ลบสาขาสำเร็จ",
      description: "ลบสาขาออกจากระบบแล้ว",
    });
      loadBranches(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบสาขาได้",
        variant: "destructive"
      });
    }
  };

  const toggleBranchStatus = async (branchId) => {
    try {
      const branch = branches.find(b => b.id === branchId);
      const updatedData = { isActive: !branch.isActive };
      await branchesService.update(branchId, updatedData);
      
      toast({
        title: "อัปเดตสถานะสำเร็จ",
        description: `อัปเดตสถานะสาขาแล้ว`,
      });
      loadBranches(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error('Error updating branch status:', error);
    toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะสาขาได้",
        variant: "destructive"
    });
    }
  };

  const cancelEdit = () => {
    setBranchForm({ name: '', address: '', phone: '', manager: '' });
    setEditingBranch(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการสาขา</h1>
            <p className="text-gray-600 mt-1">
              จัดการข้อมูลสาขาต่างๆ ในระบบ
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มสาขาใหม่
          </Button>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading state
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-4"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : branches.length === 0 ? (
          // Empty state
          <div className="col-span-full">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีสาขา</h3>
              <p className="text-gray-500 mb-6">เริ่มต้นโดยการเพิ่มสาขาแรกของคุณ</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มสาขาแรก
              </Button>
            </div>
          </div>
        ) : (
          // Branches list
          branches.map((branch, index) => (
        <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                    <div className="flex items-center gap-2">
                      {branch.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ${branch.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {branch.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleBranchStatus(branch.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {branch.isActive ? 'ปิด' : 'เปิด'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(branch)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(branch.id)}
                    className="text-red-600 hover:text-red-700"
                    disabled={branch.id === selectedBranch}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{branch.address}</span>
                </div>
                {branch.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{branch.phone}</span>
                  </div>
                )}
                {branch.manager && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{branch.manager}</span>
                  </div>
                )}
              </div>

              {branch.id === selectedBranch && (
                <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm text-blue-700 font-medium">สาขาปัจจุบัน</span>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {(showForm || editingBranch) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
            {editingBranch ? 'แก้ไขสาขา' : 'เพิ่มสาขาใหม่'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อสาขา *
              </label>
              <input
                type="text"
                value={branchForm.name}
                onChange={(e) => setBranchForm(prev => ({ ...prev, name: e.target.value }))}
                required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ชื่อสาขา"
              />
            </div>
            
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                ที่อยู่ *
              </label>
              <textarea
                value={branchForm.address}
                onChange={(e) => setBranchForm(prev => ({ ...prev, address: e.target.value }))}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ที่อยู่สาขา"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    value={branchForm.phone}
                    onChange={(e) => setBranchForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="เบอร์โทรศัพท์"
              />
            </div>
            
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ผู้จัดการ
              </label>
              <input
                type="text"
                value={branchForm.manager}
                onChange={(e) => setBranchForm(prev => ({ ...prev, manager: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ชื่อผู้จัดการ"
              />
                </div>
            </div>
            
              <div className="flex gap-2 mt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    editingBranch ? 'แก้ไขสาขา' : 'เพิ่มสาขา'
                  )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={cancelEdit}
                  disabled={submitting}
              >
                ยกเลิก
              </Button>
            </div>
          </form>
          </div>
            </div>
          )}
    </div>
  );
};

export default BranchesPage;