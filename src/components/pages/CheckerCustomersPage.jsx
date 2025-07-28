import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Users, 
  Download,
  Search,
  Filter,
  Loader2,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Printer,
  Eye,
  Edit,
  Phone,
  MapPin,
  User,
  Shield
} from 'lucide-react';

const CheckerCustomersPage = ({ selectedBranch, currentBranch, checker, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEntries, setShowEntries] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data สำหรับลูกค้าของเช็คเกอร์
  const mockCustomers = [
    {
      id: 1,
      code: 'CUST-001',
      fullName: 'สมชาย ใจดี',
      idCard: '1234567890123',
      nickname: 'ชาย',
      status: 'active',
      phone: '081-234-5678',
      address: '123 ถนนสุขุมวิท กรุงเทพฯ 10110'
    },
    {
      id: 2,
      code: 'CUST-002',
      fullName: 'อุดมศักดิ์ ประถมทอง',
      idCard: '2345678901234',
      nickname: 'อุดม',
      status: 'overdue',
      phone: '082-345-6789',
      address: '456 ถนนรัชดาภิเษก กรุงเทพฯ 10400'
    },
    {
      id: 3,
      code: 'CUST-003',
      fullName: 'ลินนา กล่อมเกลี้ยง',
      idCard: '3456789012345',
      nickname: 'ลิน',
      status: 'completed',
      phone: '083-456-7890',
      address: '789 ถนนลาดพร้าว กรุงเทพฯ 10310'
    }
  ];

  const handleExport = () => {
    toast({
      title: "ส่งออกข้อมูล",
      description: "ฟังก์ชันส่งออกจะถูกเพิ่มในภายหลัง",
    });
  };

  const handlePrint = () => {
    toast({
      title: "พิมพ์รายงาน",
      description: "ฟังก์ชันพิมพ์จะถูกเพิ่มในภายหลัง",
    });
  };

  const viewCustomer = (customer) => {
    toast({
      title: "ดูข้อมูลลูกค้า",
      description: `ดูข้อมูล ${customer.fullName}`,
    });
  };

  const editCustomer = (customer) => {
    toast({
      title: "แก้ไขข้อมูลลูกค้า",
      description: `แก้ไขข้อมูล ${customer.fullName}`,
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'กำลังผ่อน', className: 'bg-green-100 text-green-800' },
      overdue: { label: 'ค้างชำระ', className: 'bg-red-100 text-red-800' },
      completed: { label: 'ผ่อนเสร็จ', className: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = 
      customer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.idCard.includes(searchTerm) ||
      customer.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับ
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ลูกค้าของ {checker?.fullName}
              </h1>
              <p className="text-gray-600 mt-1">
                สาขา {currentBranch?.name || 'ทั้งหมด'} | ลูกค้าทั้งหมด: {filteredCustomers.length} คน
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handlePrint}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              พิมพ์รายงาน
            </Button>
            <Button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              ส่งออก
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Show Entries */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              แสดง
            </label>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10 entries</option>
              <option value={25}>25 entries</option>
              <option value={50}>50 entries</option>
              <option value={100}>100 entries</option>
            </select>
          </div>

          {/* สถานะ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานะ
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทั้งหมด</option>
              <option value="active">กำลังผ่อน</option>
              <option value="overdue">ค้างชำระ</option>
              <option value="completed">ผ่อนเสร็จ</option>
            </select>
          </div>

          {/* ค้นหา */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ค้นหา
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหารหัส, ชื่อ, เลขบัตรประชาชน, ชื่อเล่น..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-2">
                    #
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    รหัส
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    ชื่อ-สกุล
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    เลขบัตรประชาชน
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    ชื่อเล่น
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>

                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    สถานะ
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      <span>กำลังโหลดข้อมูล...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>ไม่พบข้อมูลลูกค้า</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 group"
                  >
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 bg-white sticky left-0 z-10 group-hover:bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {index + 1}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {customer.code}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {customer.fullName}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {customer.idCard}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {customer.nickname}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getStatusBadge(customer.status)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => viewCustomer(customer)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          ดู
                        </Button>
                        <Button
                          size="sm"
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          onClick={() => editCustomer(customer)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          แก้ไข
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
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomers.length}</span> of{' '}
                <span className="font-medium">{filteredCustomers.length}</span> entries
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
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </Button>
                <Button
                  onClick={() => setCurrentPage(1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Last
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckerCustomersPage; 