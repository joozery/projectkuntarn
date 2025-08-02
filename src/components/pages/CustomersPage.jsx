import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Users, Plus, Phone, Mail, MapPin, User, Building2, Loader2, Trash2, Edit, Search, Filter } from 'lucide-react';
import { customersService } from '@/services/customersService';

const CustomersPage = ({ selectedBranch, currentBranch }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [apiError, setApiError] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    code: '',
    title: 'นาย',
    name: '',
    surname: '',
    fullName: '',
    nickname: '',
    age: '',
    idCard: '',
    address: '',
    moo: '',
    road: '',
    subdistrict: '',
    district: '',
    province: '',
    phone1: '',
    phone2: '',
    phone3: '',
    email: '',
    status: 'active',
    checkerId: null
  });

  // Mock data สำหรับ fallback
  const mockCustomers = [
    {
      id: 1,
      code: 'CUST001',
      title: 'นาย',
      name: 'สมชาย',
      surname: 'ใจดี',
      full_name: 'สมชาย ใจดี',
      id_card: '1234567890123',
      nickname: 'สมชาย',
      age: '35',
      address: '123 ถนนสุขุมวิท',
      moo: '1',
      road: 'สุขุมวิท',
      subdistrict: 'คลองเตย',
      district: 'คลองเตย',
      province: 'กรุงเทพมหานคร',
      phone1: '082-111-1111',
      phone2: '02-123-4567',
      phone3: '02-987-6543',
      email: 'customer1@example.com',
      status: 'active',
      branch_id: 1,
      checker_id: 1,
      branch_name: 'สาขาหลัก',
      checker_name: 'ลินนา กล่อมเกลี้ยง',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      code: 'CUST002',
      title: 'นาง',
      name: 'สมหญิง',
      surname: 'รักดี',
      full_name: 'สมหญิง รักดี',
      id_card: '9876543210987',
      nickname: 'หญิง',
      age: '28',
      address: '456 ถนนรัชดาภิเษก',
      moo: '2',
      road: 'รัชดาภิเษก',
      subdistrict: 'ดินแดง',
      district: 'ดินแดง',
      province: 'กรุงเทพมหานคร',
      phone1: '089-222-2222',
      phone2: '02-234-5678',
      phone3: '',
      email: 'customer2@example.com',
      status: 'active',
      branch_id: 1,
      checker_id: 1,
      branch_name: 'สาขาหลัก',
      checker_name: 'ลินนา กล่อมเกลี้ยง',
      created_at: '2024-01-02T00:00:00.000Z',
      updated_at: '2024-01-02T00:00:00.000Z'
    }
  ];

  useEffect(() => {
    if (selectedBranch) {
      loadCustomers();
    } else {
      // ถ้าไม่มี selectedBranch ให้ใช้ mock data
      setCustomers(mockCustomers);
      setLoading(false);
    }
  }, [selectedBranch, searchTerm, filterStatus]);

  // Force refresh เมื่อ component mount
  useEffect(() => {
    if (selectedBranch) {
      // เพิ่ม delay เล็กน้อยเพื่อให้แน่ใจว่า component mount แล้ว
      const timer = setTimeout(() => {
        loadCustomers();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setApiError(false);
      
      console.log('Loading customers for branch:', selectedBranch);
      console.log('Search term:', searchTerm);
      console.log('Filter status:', filterStatus);
      
      if (!selectedBranch) {
        console.log('No selectedBranch, using mock data');
        setCustomers(mockCustomers);
        return;
      }
      
      const response = await customersService.getAll(selectedBranch, null, searchTerm, filterStatus);
      
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      console.log('Response data type:', typeof response.data);
      console.log('Response data is array:', Array.isArray(response.data));
      console.log('Response data keys:', Object.keys(response.data || {}));
      
      // ตรวจสอบ response และ data
      if (response && response.data) {
        if (response.data.success && Array.isArray(response.data.data)) {
          // API ส่งกลับ { success: true, data: [...] }
          const customersData = response.data.data;
          console.log('Customers data:', customersData);
          setCustomers(customersData);
          console.log('Customers loaded from API:', customersData);
        } else if (Array.isArray(response.data)) {
          // กรณี response.data เป็น array โดยตรง
          const customersData = response.data;
          console.log('Customers data (direct array):', customersData);
          setCustomers(customersData);
          console.log('Customers loaded from API (direct array):', customersData);
        } else {
          console.warn('Invalid response format:', response);
          setCustomers([]);
        }
      } else {
        console.warn('No response data:', response);
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error loading customers from API:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setApiError(true);
      
      // ใช้ mock data เมื่อ API ไม่ทำงาน
      console.log('Using mock data due to API error');
      setCustomers(mockCustomers);
      
      toast({
        title: "คำเตือน",
        description: "ไม่สามารถเชื่อมต่อ API ได้ กำลังแสดงข้อมูลตัวอย่าง",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.phone1 || !customerForm.code || !customerForm.idCard) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "รหัส, ชื่อ-สกุล, โทรศัพท์ 1 และเลขบัตรประชาชนเป็นข้อมูลที่จำเป็น",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const customerData = {
        ...customerForm,
        fullName: `${customerForm.name} ${customerForm.surname}`.trim(),
        branchId: selectedBranch
      };

      if (editingCustomer) {
        // Update existing customer
        const response = await customersService.update(editingCustomer.id, customerData);
        const updatedCustomer = response.data;
        setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? updatedCustomer : c));
        setEditingCustomer(null);
        toast({
          title: "สำเร็จ",
          description: "อัปเดตข้อมูลลูกค้าเรียบร้อยแล้ว",
        });
      } else {
        // Create new customer
        const response = await customersService.create(customerData);
        const newCustomer = response.data;
        setCustomers(prev => [newCustomer, ...prev]);
        toast({
          title: "สำเร็จ",
          description: "เพิ่มลูกค้าเรียบร้อยแล้ว",
        });
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลลูกค้าได้",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      code: customer.code || '',
      title: customer.title || 'นาย',
      name: customer.name || '',
      surname: customer.surname || '',
      fullName: customer.full_name || '',
      nickname: customer.nickname || '',
      age: customer.age || '',
      idCard: customer.id_card || '',
      address: customer.address || '',
      moo: customer.moo || '',
      road: customer.road || '',
      subdistrict: customer.subdistrict || '',
      district: customer.district || '',
      province: customer.province || '',
      phone1: customer.phone1 || customer.phone || '',
      phone2: customer.phone2 || '',
      phone3: customer.phone3 || '',
      email: customer.email || '',
      status: customer.status || 'active',
      checkerId: customer.checker_id || null
    });
    setShowForm(true);
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบลูกค้านี้?')) {
      return;
    }

    try {
      await customersService.delete(customerId);
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      toast({
        title: "สำเร็จ",
        description: "ลบลูกค้าเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบลูกค้าได้",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setCustomerForm({
      code: '',
      title: 'นาย',
      name: '',
      surname: '',
      fullName: '',
      nickname: '',
      age: '',
      idCard: '',
      address: '',
      moo: '',
      road: '',
      subdistrict: '',
      district: '',
      province: '',
      phone1: '',
      phone2: '',
      phone3: '',
      email: '',
      status: 'active',
      checkerId: null
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'ใช้งาน';
      case 'inactive': return 'ไม่ใช้งาน';
      case 'overdue': return 'ค้างชำระ';
      case 'completed': return 'เสร็จสิ้น';
      default: return status;
    }
  };

  // Pagination
  const totalPages = Math.ceil((customers?.length || 0) / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentCustomers = (customers || []).slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการลูกค้า</h1>
          <p className="text-gray-600">จัดการข้อมูลลูกค้าทั้งหมดในระบบ</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มลูกค้าใหม่
        </Button>
      </div>

      {/* API Error Warning */}
      {apiError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                ไม่สามารถเชื่อมต่อ API ได้
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>กำลังแสดงข้อมูลตัวอย่าง ข้อมูลที่แสดงอาจไม่ใช่ข้อมูลจริง</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ค้นหา
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาด้วยรหัส, ชื่อ, เลขบัตร..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานะ
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">ทั้งหมด</option>
              <option value="active">ใช้งาน</option>
              <option value="inactive">ไม่ใช้งาน</option>
              <option value="overdue">ค้างชำระ</option>
              <option value="completed">เสร็จสิ้น</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              แสดงต่อหน้า
            </label>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCustomer ? 'แก้ไขลูกค้า' : 'เพิ่มลูกค้าใหม่'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Customer Information */}
            <div className="lg:col-span-4">
              <h3 className="text-md font-medium text-gray-700 mb-3 border-b pb-2">ข้อมูลลูกค้า</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสลูกค้า *
              </label>
              <input
                type="text"
                value={customerForm.code}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="CUST001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เลขบัตรประชาชน *
              </label>
              <input
                type="text"
                value={customerForm.idCard}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, idCard: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="1234567890123"
                maxLength="13"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คำนำหน้าชื่อ
              </label>
              <div className="flex gap-4">
                {['นาย', 'นาง', 'นางสาว'].map((title) => (
                  <label key={title} className="flex items-center gap-2 text-sm">
                    <input 
                      type="radio" 
                      name="title" 
                      value={title} 
                      checked={customerForm.title === title} 
                      onChange={(e) => setCustomerForm(prev => ({ ...prev, title: e.target.value }))} 
                    />
                    {title}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ-สกุล *
              </label>
              <input
                type="text"
                value={customerForm.name}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ชื่อ-สกุล"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                นามสกุล
              </label>
              <input
                type="text"
                value={customerForm.surname}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, surname: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="นามสกุล"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อเล่น
              </label>
              <input
                type="text"
                value={customerForm.nickname}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, nickname: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ชื่อเล่น"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อายุ
              </label>
              <input
                type="number"
                value={customerForm.age}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="อายุ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                บ้านเลขที่
              </label>
              <input
                type="text"
                value={customerForm.address}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="บ้านเลขที่"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หมู่ที่
              </label>
              <input
                type="text"
                value={customerForm.moo}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, moo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="หมู่ที่"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ถนน
              </label>
              <input
                type="text"
                value={customerForm.road}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, road: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ถนน"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ตำบล/แขวง
              </label>
              <input
                type="text"
                value={customerForm.subdistrict}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, subdistrict: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ตำบล/แขวง"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อำเภอ/เขต
              </label>
              <input
                type="text"
                value={customerForm.district}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, district: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="อำเภอ/เขต"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                จังหวัด
              </label>
              <input
                type="text"
                value={customerForm.province}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, province: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="จังหวัด"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                โทรศัพท์ 1 *
              </label>
              <input
                type="tel"
                value={customerForm.phone1}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, phone1: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="เบอร์โทรศัพท์"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                โทรศัพท์ 2
              </label>
              <input
                type="tel"
                value={customerForm.phone2}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, phone2: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="เบอร์โทรศัพท์สำรอง"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                โทรศัพท์ 3
              </label>
              <input
                type="tel"
                value={customerForm.phone3}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, phone3: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="เบอร์โทรศัพท์บ้าน"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล
              </label>
              <input
                type="email"
                value={customerForm.email}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="customer@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สถานะ
              </label>
              <select
                value={customerForm.status}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="active">ใช้งาน</option>
                <option value="inactive">ไม่ใช้งาน</option>
                <option value="overdue">ค้างชำระ</option>
                <option value="completed">เสร็จสิ้น</option>
              </select>
            </div>

            <div className="lg:col-span-4 flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setEditingCustomer(null);
                  resetForm();
                }}
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
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {editingCustomer ? 'อัปเดต' : 'เพิ่มลูกค้า'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">รายการลูกค้าทั้งหมด</h2>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-6 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีลูกค้า</h3>
              <p className="text-gray-500 mb-4">เริ่มต้นโดยการเพิ่มลูกค้าคนแรกของคุณในสาขานี้</p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มลูกค้า
              </Button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    #
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    รหัส
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    ชื่อ-สกุล
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    เลขบัตรประชาชน
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    ชื่อเล่น
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    เบอร์โทร
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    สถานะ
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-gray-50"
                  >
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 bg-white sticky left-0 z-10 group-hover:bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.code}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.full_name}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.id_card}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.nickname || '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        {customer.primary_phone ? (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-green-600" />
                            <span>{customer.primary_phone}</span>
                          </div>
                        ) : customer.phone1 ? (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-green-600" />
                            <span>{customer.phone1}</span>
                          </div>
                        ) : customer.phone2 ? (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Phone className="w-3 h-3 text-blue-600" />
                            <span>{customer.phone2}</span>
                          </div>
                        ) : customer.phone3 ? (
                          <div className="flex items-center gap-1 text-gray-500">
                            <Phone className="w-3 h-3 text-purple-600" />
                            <span>{customer.phone3}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {getStatusText(customer.status)}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(customer)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {customers.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, customers.length)}</span> of{' '}
                  <span className="font-medium">{customers.length}</span> entries
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    First
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Previous
                  </Button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Last
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;