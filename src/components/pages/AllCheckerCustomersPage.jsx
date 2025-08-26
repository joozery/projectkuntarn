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
  Shield,
  FileText,
  UserCheck
} from 'lucide-react';
import api from '@/lib/api';

const AllCheckerCustomersPage = ({ selectedBranch, currentBranch, onViewPaymentSchedule }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEntries, setShowEntries] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkerFilter, setCheckerFilter] = useState('all');
  const [checkers, setCheckers] = useState([]);

  // Load checkers and customers
  useEffect(() => {
    if (selectedBranch) {
      loadCheckers();
      loadAllCustomers();
    }
  }, [selectedBranch, searchTerm, statusFilter, checkerFilter]);

  const loadCheckers = async () => {
    try {
      const response = await api.get(`/checkers`, { 
        params: { branchId: selectedBranch } 
      });
      
      if (response.data?.success) {
        setCheckers(response.data.data || []);
      } else {
        setCheckers([]);
      }
    } catch (error) {
      console.error('Error loading checkers:', error);
      setCheckers([]);
    }
  };

  const loadAllCustomers = async () => {
    try {
      setLoading(true);
      
      // Get all checkers first
      const checkersResponse = await api.get(`/checkers`, { 
        params: { branchId: selectedBranch } 
      });
      
      if (checkersResponse.data?.success) {
        const allCheckers = checkersResponse.data.data || [];
        let allCustomers = [];
        
        // Get customers for each checker
        for (const checker of allCheckers) {
          try {
            const params = {};
            
            if (searchTerm) {
              params.search = searchTerm;
            }
            
            if (statusFilter && statusFilter !== 'all') {
              params.status = statusFilter;
            }
            
            const response = await api.get(`/customers/checker/${checker.id}/contracts`, { params });
            
            if (response.data?.success) {
              const customersData = response.data.data || [];
              
              // Process each customer to separate contracts into individual rows
              for (const customer of customersData) {
                // Split contract numbers if they exist
                const contractNumbers = customer.contract_numbers ? 
                  customer.contract_numbers.split(', ').map(num => num.trim()) : 
                  [customer.code || 'ไม่ระบุ'];
                
                // Create separate row for each contract
                for (const contractNumber of contractNumbers) {
                  const customerWithContract = {
                    ...customer,
                    checker_name: checker.fullName,
                    checker_id: checker.id,
                    contract_number: contractNumber, // Single contract number
                    contract_numbers: contractNumber, // For display
                    contract_count: 1, // Single contract per row
                    total_contracts_amount: customer.total_contracts_amount / contractNumbers.length // Divide amount equally
                  };
                  allCustomers.push(customerWithContract);
                }
              }
            }
          } catch (error) {
            console.error(`Error loading customers for checker ${checker.id}:`, error);
          }
        }
        
        // Filter by checker if specified
        if (checkerFilter && checkerFilter !== 'all') {
          allCustomers = allCustomers.filter(customer => customer.checker_id === parseInt(checkerFilter));
        }
        
        console.log('🔍 All customers data:', allCustomers);
        setCustomers(allCustomers);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error loading all customers:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลลูกค้าได้",
        variant: "destructive"
      });
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

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
      description: `ดูข้อมูล ${customer.full_name}`,
    });
  };

  const editCustomer = (customer) => {
    toast({
      title: "แก้ไขข้อมูลลูกค้า",
      description: `แก้ไขข้อมูล ${customer.full_name}`,
    });
  };

  const viewPaymentSchedule = (customer) => {
    if (onViewPaymentSchedule) {
      onViewPaymentSchedule(customer);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchTerm === '' || 
      customer.contract_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id_card?.includes(searchTerm) ||
      customer.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone1?.includes(searchTerm) ||
      customer.phone2?.includes(searchTerm) ||
      customer.phone3?.includes(searchTerm) ||
      customer.primary_phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * showEntries,
    currentPage * showEntries
  );

  const totalPages = Math.ceil(filteredCustomers.length / showEntries);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับ
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              รายการลูกค้าของทุกเช็คเกอร์
            </h1>
            <p className="text-gray-600 mt-1">
              สาขา {currentBranch?.name || 'ทั้งหมด'} | ลูกค้าทั้งหมด: {customers.length} คน
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={loadAllCustomers}
            variant="outline"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            รีเฟรช
          </Button>
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

          {/* Checker Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เช็คเกอร์
            </label>
            <select
              value={checkerFilter}
              onChange={(e) => setCheckerFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทั้งหมด</option>
              {checkers.map((checker) => (
                <option key={checker.id} value={checker.id}>
                  {checker.fullName}
                </option>
              ))}
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
              <option value="กำลังผ่อนชำระ">กำลังผ่อนชำระ</option>
              <option value="ค้างชำระ">ค้างชำระ</option>
              <option value="ผ่อนเสร็จ">ผ่อนเสร็จ</option>
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
                  placeholder="ค้นหาเลขที่สัญญา, ชื่อ, เลขบัตร, ชื่อเล่น, เบอร์โทร, ที่อยู่..."
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
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เลขที่สัญญา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อ-สกุล
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เลขบัตรประชาชน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อเล่น
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เช็คเกอร์
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เบอร์โทร
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สัญญา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      <span>กำลังโหลดข้อมูล...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>ไม่พบข้อมูลลูกค้า</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(currentPage - 1) * showEntries + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.contract_number || customer.code || 'ไม่ระบุ'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {customer.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.id_card}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.nickname && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {customer.nickname}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        {customer.checker_name || 'ไม่ระบุ'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.primary_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {customer.primary_phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>1 ฿{customer.total_contracts_amount?.toLocaleString() || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.status === 'กำลังผ่อนชำระ' ? 'bg-green-100 text-green-800' :
                        customer.status === 'ค้างชำระ' ? 'bg-red-100 text-red-800' :
                        customer.status === 'ผ่อนเสร็จ' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.status || 'ไม่ระบุ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => viewPaymentSchedule(customer)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          ดูตารางผ่อน
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
        {totalPages > 1 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              แสดง {((currentPage - 1) * showEntries) + 1} ถึง {Math.min(currentPage * showEntries, filteredCustomers.length)} จาก {filteredCustomers.length} รายการ
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-gray-700"
              >
                ก่อนหน้า
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="text-gray-700"
              >
                ถัดไป
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCheckerCustomersPage;
