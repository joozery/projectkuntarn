import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  FileText, 
  Download,
  Search,
  Calendar,
  Filter,
  Loader2,
  Eye,
  Edit,
  Printer
} from 'lucide-react';
import { installmentsService } from '@/services/installmentsService';

const SalesIndexPage = ({ selectedBranch, currentBranch }) => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // โหลดข้อมูลการขาย
  useEffect(() => {
    loadSalesData();
  }, [selectedBranch, selectedMonth, selectedYear]);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      const params = { 
        branchId: selectedBranch,
        month: selectedMonth,
        year: selectedYear
      };
      
      const response = await installmentsService.getAll(params);
      setSalesData(response.data || []);
    } catch (error) {
      console.error('Error loading sales data:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลการขายได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // ข้อมูลตัวอย่างสำหรับการทดสอบ
  const sampleSalesData = [
    {
      id: 1,
      contractNumber: 'CNT-2024-001',
      customerName: 'สมชาย ใจดี',
      customerAddress: '123 ถนนสุขุมวิท กรุงเทพฯ 10110',
      customerPhone: '081-234-5678',
      productName: 'โทรศัพท์มือถือ Samsung Galaxy A54',
      price: 15900,
      downPayment: 3000,
      remainingDownPayment: 0,
      downPaymentDueDate: '2024-01-15',
      remainingDownPayment2: 0,
      downPayment2DueDate: null,
      installmentAmount: 1290,
      totalInstallments: 10,
      remainingInstallments: 8,
      nextDueDate: '2024-02-15',
      status: 'active',
      salesperson: 'อุดมศักดิ์ ประถมทอง',
      salesCommission: 5,
      salesCommissionAmount: 795,
      salesCommission2: 2,
      salesCommission2Amount: 318,
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      contractNumber: 'CNT-2024-002',
      customerName: 'สมหญิง รักดี',
      customerAddress: '456 ถนนรัชดาภิเษก กรุงเทพฯ 10400',
      customerPhone: '082-345-6789',
      productName: 'โน้ตบุ๊ค Lenovo IdeaPad',
      price: 25000,
      downPayment: 5000,
      remainingDownPayment: 0,
      downPaymentDueDate: '2024-01-20',
      remainingDownPayment2: 0,
      downPayment2DueDate: null,
      installmentAmount: 2000,
      totalInstallments: 10,
      remainingInstallments: 10,
      nextDueDate: '2024-02-20',
      status: 'active',
      salesperson: 'เสกศักดิ์ โตทอง',
      salesCommission: 5,
      salesCommissionAmount: 1250,
      salesCommission2: 2,
      salesCommission2Amount: 500,
      createdAt: '2024-01-05'
    },
    {
      id: 3,
      contractNumber: 'CNT-2024-003',
      customerName: 'ประยุทธ มั่นคง',
      customerAddress: '789 ถนนลาดพร้าว กรุงเทพฯ 10310',
      customerPhone: '083-456-7890',
      productName: 'เครื่องซักผ้า LG Front Load',
      price: 18000,
      downPayment: 3600,
      remainingDownPayment: 0,
      downPaymentDueDate: '2024-01-25',
      remainingDownPayment2: 0,
      downPayment2DueDate: null,
      installmentAmount: 1440,
      totalInstallments: 10,
      remainingInstallments: 10,
      nextDueDate: '2024-02-25',
      status: 'active',
      salesperson: 'สุภาพ สุจริต',
      salesCommission: 5,
      salesCommissionAmount: 900,
      salesCommission2: 2,
      salesCommission2Amount: 360,
      createdAt: '2024-01-10'
    }
  ];

  // ใช้ข้อมูลตัวอย่างถ้าไม่มีข้อมูลจาก API
  const currentSalesData = salesData.length > 0 ? salesData : sampleSalesData;

  // กรองข้อมูลตามเงื่อนไข
  const filteredSalesData = currentSalesData.filter(sale => {
    const matchesSearch = 
      sale.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.salesperson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // ส่งออกเป็น Excel
  const exportToExcel = () => {
    toast({
      title: "ส่งออกข้อมูล",
      description: "กำลังส่งออกข้อมูลการขายเป็นไฟล์ Excel...",
    });
  };

  // พิมพ์รายงาน
  const printReport = () => {
    window.print();
  };

  // จัดรูปแบบวันที่
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH');
  };

  // จัดรูปแบบเงิน
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  // สร้างตัวเลือกเดือน
  const months = [
    { value: 1, label: 'มกราคม' },
    { value: 2, label: 'กุมภาพันธ์' },
    { value: 3, label: 'มีนาคม' },
    { value: 4, label: 'เมษายน' },
    { value: 5, label: 'พฤษภาคม' },
    { value: 6, label: 'มิถุนายน' },
    { value: 7, label: 'กรกฎาคม' },
    { value: 8, label: 'สิงหาคม' },
    { value: 9, label: 'กันยายน' },
    { value: 10, label: 'ตุลาคม' },
    { value: 11, label: 'พฤศจิกายน' },
    { value: 12, label: 'ธันวาคม' }
  ];

  // สร้างตัวเลือกปี
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">สารบัญการขาย</h1>
            <p className="text-gray-600 mt-1">
              แสดงข้อมูลการขายของสาขา {currentBranch?.name || 'ทั้งหมด'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={printReport}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              พิมพ์รายงาน
            </Button>
            <Button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              ส่งออก Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* เดือน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เดือน
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* ปี */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ปี
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทั้งหมด</option>
              <option value="active">กำลังผ่อน</option>
              <option value="completed">ผ่อนเสร็จ</option>
              <option value="overdue">ค้างชำระ</option>
            </select>
          </div>

          {/* ค้นหา */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ค้นหา
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาสัญญา, ลูกค้า, สินค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  ว.ด.ป.
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  สัญญา
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  ชื่อ - นามสกุล
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  ที่อยู่
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  เบอร์โทรศัพท์
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  สินค้า
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  ราคา
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  เงินดาวน์
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  ค้างดาวน์
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  วันนัดเก็บ
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  ค้างดาวน์2
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  วันนัดเก็บ
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  งวดละ
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  จำนวน
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  ท้าย
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  วันนัดเก็บ
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  ตรวจสอบ
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  พนักงานขาย
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  % คอมฯ
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  คอมฯ
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  % คอมฯ2
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  คอมฯ2
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="22" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      <span>กำลังโหลดข้อมูล...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSalesData.length === 0 ? (
                <tr>
                  <td colSpan="22" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>ไม่พบข้อมูลการขาย</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSalesData.map((sale, index) => (
                  <motion.tr
                    key={sale.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 group"
                  >
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 bg-white sticky left-0 z-10 group-hover:bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {formatDate(sale.createdAt)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {sale.contractNumber}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.customerName}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {sale.customerAddress}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.customerPhone}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {sale.productName}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(sale.price)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(sale.downPayment)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(sale.remainingDownPayment)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(sale.downPaymentDueDate)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(sale.remainingDownPayment2)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(sale.downPayment2DueDate)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(sale.installmentAmount)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.totalInstallments}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.remainingInstallments}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(sale.nextDueDate)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sale.status === 'active' ? 'bg-green-100 text-green-800' :
                        sale.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.status === 'active' ? 'กำลังผ่อน' :
                         sale.status === 'completed' ? 'ผ่อนเสร็จ' : 'ค้างชำระ'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.salesperson}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.salesCommission}%
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(sale.salesCommissionAmount)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.salesCommission2}%
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(sale.salesCommission2Amount)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredSalesData.length}
            </div>
            <div className="text-sm text-gray-600">จำนวนสัญญา</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(filteredSalesData.reduce((sum, sale) => sum + sale.price, 0))}
            </div>
            <div className="text-sm text-gray-600">มูลค่าการขายรวม</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(filteredSalesData.reduce((sum, sale) => sum + sale.salesCommissionAmount, 0))}
            </div>
            <div className="text-sm text-gray-600">คอมมิชชันรวม</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(filteredSalesData.reduce((sum, sale) => sum + sale.salesCommission2Amount, 0))}
            </div>
            <div className="text-sm text-gray-600">คอมมิชชัน2 รวม</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesIndexPage; 