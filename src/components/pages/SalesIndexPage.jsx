import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Phone,
  MapPin,
  Package,
  DollarSign,
  CreditCard,
  TrendingUp,
  Calculator,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

// ฟังก์ชันแปลงวันที่เป็นรูปแบบไทย
const formatThaiDate = (date) => {
  if (!date || isNaN(date.getTime())) return '-';
  
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  // ตรวจสอบว่าปีเป็น พ.ศ. หรือ ค.ศ.
  // ถ้าปีมากกว่า 2500 แสดงว่าเป็น พ.ศ. แล้ว
  const isThaiYear = year > 2500;
  const thaiYear = isThaiYear ? year : year + 543;
  
  console.log('🔍 Date Debug:', {
    original: date,
    day,
    month,
    year,
    isThaiYear,
    thaiYear,
    formatted: `${day}/${month}/${thaiYear}`
  });
  
  return `${day}/${month}/${thaiYear}`;
};

const SalesIndexPage = ({ selectedBranch, currentBranch }) => {
  console.log('🔍 SalesIndexPage props:', { selectedBranch, currentBranch });
  
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [commissionRate, setCommissionRate] = useState(5); // ค่าเริ่มต้น 5%

  // สร้างรายการเดือน
  const months = [
    { value: '01', label: 'มกราคม' },
    { value: '02', label: 'กุมภาพันธ์' },
    { value: '03', label: 'มีนาคม' },
    { value: '04', label: 'เมษายน' },
    { value: '05', label: 'พฤษภาคม' },
    { value: '06', label: 'มิถุนายน' },
    { value: '07', label: 'กรกฎาคม' },
    { value: '08', label: 'สิงหาคม' },
    { value: '09', label: 'กันยายน' },
    { value: '10', label: 'ตุลาคม' },
    { value: '11', label: 'พฤศจิกายน' },
    { value: '12', label: 'ธันวาคม' }
  ];

  // สร้างรายการปี
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
      yearList.push(year);
    }
    return yearList;
  }, []);

  // ดึงข้อมูลการขาย
  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = '/installments';
      const params = new URLSearchParams();

      if (selectedMonth) {
        params.append('month', selectedMonth);
      }
      if (selectedYear) {
        params.append('year', selectedYear);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (selectedBranch) {
        params.append('branchId', selectedBranch);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('🔍 Calling API:', url);
      const response = await api.get(url);
      console.log('🔍 API Response:', response.data);
      
      if (response.data?.success) {
        const contracts = response.data.data || [];
        
        console.log('🔍 API Response Data:', contracts);
        
        // ประมวลผลข้อมูลเพื่อคำนวณค่าคอมมิชชัน
        const processedData = contracts.map((contract, index) => {
          // ใช้ข้อมูลจาก API จริง
          const totalPrice = parseFloat(contract.totalAmount) || 0;
          const downPayment = parseFloat(contract.downPayment) || 0;
          const installmentAmount = parseFloat(contract.monthlyPayment) || 0;
          const numberOfInstallments = parseInt(contract.months) || 0;
          
          // คำนวณยอดรวมทั้งหมด
          const grandTotal = downPayment + (installmentAmount * numberOfInstallments);
          
          // เริ่มต้นด้วย commission rate เริ่มต้น แต่สามารถแก้ไขได้
          const initialCommissionRate = commissionRate;
          const commissionAmount = (grandTotal * initialCommissionRate) / 100;
          
          // สร้างที่อยู่ลูกค้า
          const customerAddress = [
            contract.customerMoo,
            contract.customerRoad,
            contract.customerSubdistrict,
            contract.customerDistrict,
            contract.customerProvince
          ].filter(Boolean).join(' ');
          
          return {
            id: contract.id,
            sequence: index + 1,
            contractDate: contract.contractDate ? formatThaiDate(new Date(contract.contractDate)) : '-',
            contractNumber: contract.contractNumber || `C${contract.id}`,
            customerName: contract.customerName || '',
            customerSurname: contract.customerSurname || '',
            customerFullName: contract.customerFullName || `${contract.customerName || ''} ${contract.customerSurname || ''}`.trim(),
            customerAddress: customerAddress || contract.customerAddress || '-',
            customerPhone: contract.customerPhone1 || contract.customerPhone || '-',
            productName: contract.productName || contract.productDescription || '-',
            totalPrice: totalPrice,
            downPayment: downPayment,
            installmentAmount: installmentAmount,
            numberOfInstallments: numberOfInstallments,
            collectionDate: contract.collectionDate ? formatThaiDate(new Date(contract.collectionDate)) : '-',
            inspectorName: contract.inspectorFullName || contract.inspectorName || '-',
            salespersonName: contract.salespersonFullName || contract.salespersonName || '-',
            commissionRate: initialCommissionRate,
            commissionAmount: commissionAmount,
            grandTotal: grandTotal
          };
        });

        console.log('🔍 Processed Data:', processedData);
        setSalesData(processedData);
      } else {
        setError('ไม่สามารถดึงข้อมูลได้');
      }
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลการขายได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันอัปเดต commission rate สำหรับรายการเฉพาะ
  const updateCommissionRate = (itemId, newRate) => {
    setSalesData(prevData => 
      prevData.map(item => {
        if (item.id === itemId) {
          const newCommissionAmount = (item.grandTotal * newRate) / 100;
          return {
            ...item,
            commissionRate: newRate,
            commissionAmount: newCommissionAmount
          };
        }
        return item;
      })
    );
  };

  // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component mount หรือ filter เปลี่ยน
  useEffect(() => {
    console.log('🔍 useEffect triggered - fetching sales data');
    fetchSalesData();
  }, [selectedMonth, selectedYear, commissionRate]);

  // คำนวณสรุปข้อมูล
  const summary = useMemo(() => {
    if (!salesData.length) return null;

    const totalContracts = salesData.length;
    const totalSales = salesData.reduce((sum, item) => sum + item.grandTotal, 0);
    const totalDownPayments = salesData.reduce((sum, item) => sum + item.downPayment, 0);
    const totalInstallments = salesData.reduce((sum, item) => sum + (item.installmentAmount * item.numberOfInstallments), 0);
    const totalCommission = salesData.reduce((sum, item) => sum + item.commissionAmount, 0);

    return {
      totalContracts,
      totalSales,
      totalDownPayments,
      totalInstallments,
      totalCommission
    };
  }, [salesData]);

  // ฟิลเตอร์ข้อมูลตาม search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return salesData;

    return salesData.filter(item =>
      item.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.salespersonName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [salesData, searchTerm]);

  // ฟังก์ชันพิมพ์รายงาน
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>รายงานสารบัญการขาย</title>
          <style>
            body { font-family: 'Sarabun', sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .summary { margin-top: 20px; padding: 10px; background-color: #f9f9f9; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>รายงานสารบัญการขาย</h1>
            <p>เดือน: ${selectedMonth ? months.find(m => m.value === selectedMonth)?.label : 'ทั้งหมด'} ${selectedYear}</p>
            <p>อัตราค่าคอมมิชชัน: ${commissionRate}%</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ว.ด.ป.</th>
                <th>สัญญา</th>
                <th>ชื่อ - นามสกุล</th>
                <th>ที่อยู่</th>
                <th>เบอร์โทรศัพท์</th>
                <th>สินค้า</th>
                <th>ราคา</th>
                <th>เงินดาวน์</th>
                <th>งวดละ</th>
                <th>จำนวน</th>
                <th>วันนัดเก็บ</th>
                <th>ตรวจสอบ</th>
                <th>พนักงานขาย</th>
                <th>คีย์%</th>
                <th>ค่าคอม</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map(item => `
                <tr>
                  <td class="text-center">${item.sequence}</td>
                  <td>${item.contractDate}</td>
                  <td>${item.contractNumber}</td>
                  <td>${item.customerFullName}</td>
                  <td>${item.customerAddress}</td>
                  <td>${item.customerPhone}</td>
                  <td>${item.productName}</td>
                  <td class="text-right">฿${item.totalPrice.toLocaleString()}</td>
                  <td class="text-right">฿${item.downPayment.toLocaleString()}</td>
                  <td class="text-right">฿${item.installmentAmount.toLocaleString()}</td>
                  <td class="text-center">${item.numberOfInstallments}</td>
                  <td>${item.collectionDate}</td>
                  <td>${item.inspectorName}</td>
                  <td>${item.salespersonName}</td>
                  <td class="text-center">${item.commissionRate}%</td>
                  <td class="text-right">฿${item.commissionAmount.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          ${summary ? `
            <div class="summary">
              <h3>สรุปข้อมูล</h3>
              <p>จำนวนสัญญา: ${summary.totalContracts} สัญญา</p>
              <p>ยอดขายรวม: ฿${summary.totalSales.toLocaleString()}</p>
              <p>เงินดาวน์รวม: ฿${summary.totalDownPayments.toLocaleString()}</p>
              <p>เงินผ่อนรวม: ฿${summary.totalInstallments.toLocaleString()}</p>
              <p>ค่าคอมมิชชันรวม: ฿${summary.totalCommission.toLocaleString()}</p>
            </div>
          ` : ''}
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
                             <div>
                 <h1 className="text-2xl font-bold text-gray-900">สารบัญการขาย</h1>
                 <p className="text-gray-600">
                   รายงานการขายและค่าคอมมิชชัน
                   {currentBranch && ` - สาขา ${currentBranch.name}`}
                 </p>
               </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>พิมพ์รายงาน</span>
              </button>
              <button
                onClick={() => {
                  toast({
                    title: "บันทึกสำเร็จ",
                    description: "อัปเดตค่าคอมมิชชันเรียบร้อยแล้ว",
                    variant: "default"
                  });
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calculator className="h-4 w-4" />
                <span>บันทึกการเปลี่ยนแปลง</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาสัญญา, ลูกค้า, สินค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">ทุกเดือน</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Commission Rate */}
            <div className="relative">
              <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                placeholder="อัตราค่าคอม %"
                value={commissionRate}
                onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchSalesData}
              disabled={loading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Filter className="h-4 w-4" />
              )}
              <span>กรองข้อมูล</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">จำนวนสัญญา</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalContracts}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ยอดขายรวม</p>
                  <p className="text-2xl font-bold text-green-600">฿{summary.totalSales.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">เงินดาวน์รวม</p>
                  <p className="text-2xl font-bold text-blue-600">฿{summary.totalDownPayments.toLocaleString()}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">เงินผ่อนรวม</p>
                  <p className="text-2xl font-bold text-purple-600">฿{summary.totalInstallments.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ค่าคอมรวม</p>
                  <p className="text-2xl font-bold text-orange-600">฿{summary.totalCommission.toLocaleString()}</p>
                </div>
                <Calculator className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ลำดับ
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ว.ด.ป.
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สัญญา
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อ - นามสกุล
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ที่อยู่
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เบอร์โทรศัพท์
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สินค้า
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ราคา
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เงินดาวน์
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    งวดละ
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จำนวน
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันนัดเก็บ
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ตรวจสอบ
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    พนักงานขาย
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    คีย์%
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ค่าคอม
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="16" className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="16" className="px-4 py-3 text-center text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="16" className="px-4 py-3 text-center text-gray-500">
                      ไม่พบข้อมูลการขาย
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                        {item.sequence}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.contractDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                        {item.contractNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.customerFullName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {item.customerAddress}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.customerPhone}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {item.productName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        ฿{item.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        ฿{item.downPayment.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                        ฿{item.installmentAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                        {item.numberOfInstallments}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.collectionDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.inspectorName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.salespersonName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={item.commissionRate}
                          onChange={(e) => {
                            const newRate = parseFloat(e.target.value) || 0;
                            updateCommissionRate(item.id, newRate);
                          }}
                          className="w-16 text-center border border-gray-300 rounded px-1 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="ml-1">%</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-orange-600">
                        ฿{item.commissionAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesIndexPage; 