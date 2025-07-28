import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Users, 
  UserCheck, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  CheckCircle,
  User,
  Briefcase,
  Calendar,
  LogIn,
  LogOut
} from 'lucide-react';

const Sidebar = ({ 
  isOpen, 
  customers, 
  employees, 
  onAddCustomer, 
  onAddEmployee, 
  onToggleEmployeeCheckIn 
}) => {
  const [activeSection, setActiveSection] = useState('customers');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    position: '',
    phone: '',
    email: ''
  });

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.phone) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ชื่อและเบอร์โทรเป็นข้อมูลที่จำเป็น",
        variant: "destructive"
      });
      return;
    }

    onAddCustomer(customerForm);
    setCustomerForm({ name: '', phone: '', email: '', address: '' });
    setShowCustomerForm(false);
  };

  const handleEmployeeSubmit = (e) => {
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
    setShowEmployeeForm(false);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      exit={{ x: -320 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full w-80 glass-card border-r border-white/20 z-50 overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold gradient-text mb-4">จัดการข้อมูล</h2>
          
          {/* Section Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeSection === 'customers' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('customers')}
              className={`flex-1 ${
                activeSection === 'customers' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'hover:bg-purple-100'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              ลูกค้า
            </Button>
            <Button
              variant={activeSection === 'employees' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('employees')}
              className={`flex-1 ${
                activeSection === 'employees' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                  : 'hover:bg-purple-100'
              }`}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              พนักงาน
            </Button>
          </div>
        </div>

        {/* Customers Section */}
        {activeSection === 'customers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">รายชื่อลูกค้า</h3>
              <Button
                size="sm"
                onClick={() => setShowCustomerForm(!showCustomerForm)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Customer Form */}
            <AnimatePresence>
              {showCustomerForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <form onSubmit={handleCustomerSubmit} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อลูกค้า *
                      </label>
                      <input
                        type="text"
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                        placeholder="ชื่อ-นามสกุล"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        เบอร์โทร *
                      </label>
                      <input
                        type="tel"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                        placeholder="08X-XXX-XXXX"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        อีเมล
                      </label>
                      <input
                        type="email"
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm"
                        placeholder="email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ที่อยู่
                      </label>
                      <textarea
                        value={customerForm.address}
                        onChange={(e) => setCustomerForm(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm resize-none"
                        rows="2"
                        placeholder="ที่อยู่ลูกค้า"
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
                        onClick={() => setShowCustomerForm(false)}
                        className="flex-1"
                      >
                        ยกเลิก
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Customer List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {customers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">ยังไม่มีลูกค้า</p>
                </div>
              ) : (
                customers.map((customer, index) => (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/80 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate">{customer.name}</h4>
                        <div className="space-y-1 mt-1">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{customer.phone}</span>
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{customer.email}</span>
                            </div>
                          )}
                          {customer.address && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{customer.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Employees Section */}
        {activeSection === 'employees' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">รายชื่อพนักงาน</h3>
              <Button
                size="sm"
                onClick={() => setShowEmployeeForm(!showEmployeeForm)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Employee Form */}
            <AnimatePresence>
              {showEmployeeForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <form onSubmit={handleEmployeeSubmit} className="space-y-3">
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
                        onClick={() => setShowEmployeeForm(false)}
                        className="flex-1"
                      >
                        ยกเลิก
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Employee List */}
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
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;