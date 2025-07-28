import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { UserCheck, Plus, Phone, Mail, Briefcase, Clock, LogIn, LogOut, Building2, Loader2, Trash2, Edit } from 'lucide-react';
import { employeesService } from '@/services/employeesService';

const EmployeesPage = ({ selectedBranch, currentBranch }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    surname: '',
    fullName: '',
    position: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    loadEmployees();
  }, [selectedBranch]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeesService.getAll(selectedBranch);
      const employeesData = response.data || [];
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลพนักงานได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeForm.name || !employeeForm.position) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ชื่อและตำแหน่งเป็นข้อมูลที่จำเป็น",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const employeeData = {
        ...employeeForm,
        fullName: `${employeeForm.name} ${employeeForm.surname}`.trim(),
        branchId: selectedBranch
      };

      if (editingEmployee) {
        // Update existing employee
        const response = await employeesService.update(editingEmployee.id, employeeData);
        const updatedEmployee = response.data;
        setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? updatedEmployee : e));
        setEditingEmployee(null);
        toast({
          title: "สำเร็จ",
          description: "อัปเดตข้อมูลพนักงานเรียบร้อยแล้ว",
        });
      } else {
        // Create new employee
        const response = await employeesService.create(employeeData);
        const newEmployee = response.data;
        setEmployees(prev => [newEmployee, ...prev]);
        toast({
          title: "สำเร็จ",
          description: "เพิ่มพนักงานเรียบร้อยแล้ว",
        });
      }

      setEmployeeForm({ name: '', surname: '', fullName: '', position: '', phone: '', email: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลพนักงานได้",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setEmployeeForm({
      name: employee.name || '',
      surname: employee.surname || '',
      fullName: employee.fullName || '',
      position: employee.position || '',
      phone: employee.phone || '',
      email: employee.email || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (employeeId) => {
    try {
      await employeesService.delete(employeeId);
      setEmployees(prev => prev.filter(e => e.id !== employeeId));
      toast({
        title: "สำเร็จ",
        description: "ลบพนักงานเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบพนักงานได้",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setEmployeeForm({ name: '', surname: '', fullName: '', position: '', phone: '', email: '' });
    setEditingEmployee(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">จัดการพนักงาน</h1>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">กำลังโหลดข้อมูลพนักงาน...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการพนักงาน</h1>
          <p className="text-gray-600">เพิ่มพนักงานและติดตามการเข้างาน - {currentBranch?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <UserCheck className="w-4 h-4" />
            <span>พนักงานทั้งหมด: {employees.length} คน</span>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มพนักงาน
          </Button>
        </div>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingEmployee ? 'แก้ไขพนักงาน' : 'เพิ่มพนักงานใหม่'}
            </h2>
            <Button variant="outline" size="sm" onClick={resetForm}>
              ยกเลิก
            </Button>
          </div>
          <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <Building2 className="w-4 h-4" />
              <span>พนักงานจะถูกเพิ่มในสาขา: <strong>{currentBranch?.name}</strong></span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ *
              </label>
              <input
                type="text"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ชื่อ"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                นามสกุล
              </label>
              <input
                type="text"
                value={employeeForm.surname}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, surname: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="นามสกุล"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ตำแหน่ง *
              </label>
              <input
                type="text"
                value={employeeForm.position}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="เช่น พนักงานขาย, ผู้จัดการ"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เบอร์โทร
              </label>
              <input
                type="tel"
                value={employeeForm.phone}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="081-234-5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล
              </label>
              <input
                type="email"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="employee@example.com"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                disabled={submitting}
              >
                ยกเลิก
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {editingEmployee ? 'อัปเดต' : 'เพิ่มพนักงาน'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">รายการพนักงานทั้งหมด</h2>
        </div>
        
        <div className="p-6">
          {employees.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีพนักงาน</h3>
              <p className="text-gray-500 mb-4">เริ่มต้นโดยการเพิ่มพนักงานคนแรกของคุณในสาขานี้</p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มพนักงาน
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {employees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{employee.fullName}</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {employee.branchName}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {employee.position}
                        </span>
                        {employee.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {employee.phone}
                          </span>
                        )}
                        {employee.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {employee.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;