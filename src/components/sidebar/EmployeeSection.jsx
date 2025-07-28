import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  UserCheck, 
  Plus, 
  Phone, 
  Briefcase, 
  Clock,
  LogIn,
  LogOut
} from 'lucide-react';

const EmployeeSection = ({ employees, onAddEmployee, onToggleEmployeeCheckIn }) => {
  const [showForm, setShowForm] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    position: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeForm.name || !employeeForm.position) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ชื่อและตำแหน่งเป็นข้อมูลที่จำเป็น",
        variant: "destructive"
      });
      return;
    }

    onAddEmployee(employeeForm);
    setEmployeeForm({ name: '', position: '', phone: '', email: '' });
    setShowForm(false);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">รายชื่อพนักงาน</h3>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อพนักงาน *
                </label>
                <input
                  type="text"
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                  placeholder="ชื่อ-นามสกุล"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ตำแหน่ง *
                </label>
                <input
                  type="text"
                  value={employeeForm.position}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                  placeholder="เช่น พนักงานขาย"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทร
                </label>
                <input
                  type="tel"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                  placeholder="08X-XXX-XXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                  placeholder="email@example.com"
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                  เพิ่ม
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  ยกเลิก
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {employees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UserCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">ยังไม่มีพนักงาน</p>
          </div>
        ) : (
          employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/80 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  employee.isCheckedIn ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Briefcase className={`w-4 h-4 ${
                    employee.isCheckedIn ? 'text-green-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800 truncate">{employee.name}</h4>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      employee.isCheckedIn 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.isCheckedIn ? 'เข้างาน' : 'ออกงาน'}
                    </div>
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Briefcase className="w-3 h-3" />
                      <span>{employee.position}</span>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                    {employee.isCheckedIn && employee.checkInTime && (
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <Clock className="w-3 h-3" />
                        <span>เข้างาน: {formatTime(employee.checkInTime)}</span>
                      </div>
                    )}
                    {!employee.isCheckedIn && employee.checkOutTime && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>ออกงาน: {formatTime(employee.checkOutTime)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => onToggleEmployeeCheckIn(employee.id)}
                    className={`mt-2 w-full text-xs ${
                      employee.isCheckedIn
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {employee.isCheckedIn ? (
                      <>
                        <LogOut className="w-3 h-3 mr-1" />
                        เช็คเอาท์
                      </>
                    ) : (
                      <>
                        <LogIn className="w-3 h-3 mr-1" />
                        เช็คอิน
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeSection;