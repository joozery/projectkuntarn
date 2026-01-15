import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  UserCheck,
  Plus,
  Search,
  Download,
  Bell,
  ArrowUpDown,
  FileText,
  Users,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import { checkersService } from '@/services/checkersService';

const CheckersPage = ({ selectedBranch, currentBranch, onViewPaymentSchedule }) => {
  const navigate = useNavigate();
  const [checkers, setCheckers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingChecker, setEditingChecker] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load checkers from API
  useEffect(() => {
    if (selectedBranch) {
      loadCheckers();
    }
  }, [selectedBranch]);

  // Force refresh on component mount
  useEffect(() => {
    if (selectedBranch) {
      setTimeout(() => {
        loadCheckers();
      }, 100);
    }
  }, []);

  const loadCheckers = async () => {
    try {
      setLoading(true);
      const params = { branchId: selectedBranch };
      // Remove server-side search to rely on client-side filtering for better UX on small datasets

      const response = await checkersService.getAll(selectedBranch, params);

      // Handle different response formats
      let checkersData = [];
      if (response.data?.success && Array.isArray(response.data.data)) {
        checkersData = response.data.data;
      } else if (Array.isArray(response.data)) {
        checkersData = response.data;
      } else if (response.data && Array.isArray(response.data)) {
        checkersData = response.data;
      }

      console.log('Checkers API response:', response);
      console.log('Processed checkers data:', checkersData);
      setCheckers(checkersData);
    } catch (error) {
      console.error('Error loading checkers:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลเช็คเกอร์ได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // ... (addChecker, updateChecker, deleteChecker functions remain same) ...

  // Remove the debounce effect that calls loadCheckers on search term change
  // We only rely on client-side filtering now


  const addChecker = async (checker) => {
    try {
      setSubmitting(true);
      const checkerData = {
        ...checker,
        branchId: selectedBranch
      };

      const response = await checkersService.create(checkerData);
      setCheckers(prev => [...prev, response.data]);
      setShowForm(false);
      toast({
        title: "เพิ่มผู้ตรวจสอบสำเร็จ! ✅",
        description: `เพิ่ม ${checker.fullName} เข้าสู่ระบบแล้ว`,
      });
    } catch (error) {
      console.error('Error adding checker:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มผู้ตรวจสอบได้",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateChecker = async (checker) => {
    try {
      setSubmitting(true);
      const response = await checkersService.update(checker.id, checker);
      setCheckers(prev => prev.map(c => c.id === checker.id ? response.data : c));
      setEditingChecker(null);
      toast({
        title: "แก้ไขผู้ตรวจสอบสำเร็จ! ✏️",
        description: `แก้ไขข้อมูล ${checker.fullName} แล้ว`,
      });
    } catch (error) {
      console.error('Error updating checker:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขผู้ตรวจสอบได้",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteChecker = async (checkerId) => {
    try {
      await checkersService.delete(checkerId);
      setCheckers(prev => prev.filter(c => c.id !== checkerId));
      toast({
        title: "ลบผู้ตรวจสอบสำเร็จ",
        description: "ลบผู้ตรวจสอบออกจากระบบแล้ว",
      });
    } catch (error) {
      console.error('Error deleting checker:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบผู้ตรวจสอบได้",
        variant: "destructive"
      });
    }
  };

  const exportToExcel = () => {
    toast({
      title: "ส่งออกข้อมูล",
      description: "ฟังก์ชันส่งออกจะถูกเพิ่มในภายหลัง",
    });
  };

  const openInstallmentReport = (checker) => {
    navigate(`/checkers/${checker.id}/report`);
  };

  const openCustomersPage = (checker) => {
    navigate(`/checkers/${checker.id}/customers`);
  };

  const filteredCheckers = Array.isArray(checkers) ? checkers.filter(checker => {
    const matchesSearch = checker.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">เช็คเกอร์ รายการผู้ตรวจสอบ</h1>
          <p className="text-gray-600">จัดการรายการผู้ตรวจสอบในระบบ - {currentBranch?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <UserCheck className="w-4 h-4" />
            <span>ผู้ตรวจสอบทั้งหมด: {filteredCheckers.length} คน</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={exportToExcel}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              บันทึกเป็น Excel
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Welcome, ลินนา กล่อมเกลี้ยง</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Search:</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาผู้ตรวจสอบ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    ชื่อ-สกุล
                    <ArrowUpDown className="w-4 h-4 cursor-pointer" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    Action
                    <ArrowUpDown className="w-4 h-4 cursor-pointer" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      <span>กำลังโหลดข้อมูล...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCheckers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>ไม่พบข้อมูลเช็คเกอร์</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCheckers.map((checker, index) => (
                  <motion.tr
                    key={checker.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {checker.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => openInstallmentReport(checker)}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          รายงานค่างวด
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => openCustomersPage(checker)}
                        >
                          <Users className="w-3 h-3 mr-1" />
                          ลูกค้า
                        </Button>
                        <Button
                          size="sm"
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          onClick={() => setEditingChecker(checker)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          แก้ไข
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => deleteChecker(checker.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          ลบ
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing 1 to {filteredCheckers.length} of {filteredCheckers.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled
              className="text-gray-400"
            >
              Previous
            </Button>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              1
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled
              className="text-gray-400"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {(showForm || editingChecker) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingChecker ? 'แก้ไขผู้ตรวจสอบ' : 'เพิ่มผู้ตรวจสอบใหม่'}
            </h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const checkerData = {
                name: formData.get('name'),
                surname: formData.get('surname'),
                fullName: `${formData.get('name')} ${formData.get('surname')}`.trim()
              };

              if (editingChecker) {
                updateChecker({ ...editingChecker, ...checkerData });
              } else {
                addChecker(checkerData);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อ
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingChecker?.name || ''}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    นามสกุล
                  </label>
                  <input
                    type="text"
                    name="surname"
                    defaultValue={editingChecker?.surname || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      {editingChecker ? 'กำลังบันทึก...' : 'กำลังเพิ่ม...'}
                    </>
                  ) : (
                    editingChecker ? 'บันทึก' : 'เพิ่ม'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingChecker(null);
                  }}
                  className="flex-1"
                >
                  ยกเลิก
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มผู้ตรวจสอบใหม่
        </Button>
      </div>

    </div >
  );
};

export default CheckersPage; 