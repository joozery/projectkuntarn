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
  Loader2,
  Printer
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
  
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${thaiYear}`;
};

const InstallmentIndexPage = ({ selectedBranch, currentBranch }) => {
  const [installmentData, setInstallmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [entriesPerPage, setEntriesPerPage] = useState(200);

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

  // ดึงข้อมูลค่างวด
  const fetchInstallmentData = async () => {
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
        const installments = response.data.data || [];
        
        console.log('🔍 API Response Data:', installments);
        
        // ประมวลผลข้อมูลค่างวดพร้อมข้อมูลการชำระเงิน
        const processedData = await Promise.all(installments.map(async (installment, index) => {
          // ดึงข้อมูลการชำระเงินสำหรับแต่ละสัญญา
          let paymentData = null;
          let totalPaid = 0;
          let remainingDebt = 0;
          
          try {
            const paymentResponse = await api.get(`/installments/${installment.id}/payments`);
            if (paymentResponse.data?.success) {
              paymentData = paymentResponse.data.data;
              // คำนวณยอดที่ชำระแล้ว
              totalPaid = paymentData.reduce((sum, payment) => {
                return sum + (payment.status === 'paid' ? parseFloat(payment.amount) : 0);
              }, 0);
              // คำนวณยอดคงเหลือ
              const totalAmount = parseFloat(installment.totalAmount) || 0;
              remainingDebt = totalAmount - totalPaid;
            }
          } catch (error) {
            console.log('No payment data for installment:', installment.id);
          }

          return {
            id: installment.id,
            sequence: index + 1,
            contractDate: installment.contractDate ? formatThaiDate(new Date(installment.contractDate)) : '-',
            contractNumber: installment.contractNumber || `F${installment.id.toString().padStart(4, '0')}`,
            customerFullName: installment.customerFullName || `${installment.customerName || ''} ${installment.customerSurname || ''}`.trim() || '-',
            line: installment.line || installment.inspectorId || '-',
            amount: totalPaid, // จำนวนเงินที่ชำระแล้ว
            employee: installment.salespersonFullName || installment.salespersonName || '-',
            receiptNumber: paymentData?.length > 0 ? `${paymentData[0].id}/${new Date().getFullYear() + 543 - 2500}` : '0',
            remainingDebt: remainingDebt,
            totalAmount: parseFloat(installment.totalAmount) || 0
          };
        }));

        console.log('🔍 Processed Data:', processedData);
        setInstallmentData(processedData);
      } else {
        setError('ไม่สามารถดึงข้อมูลได้');
      }
    } catch (error) {
      console.error('Error fetching installment data:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลค่างวดได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component mount หรือ filter เปลี่ยน
  useEffect(() => {
    console.log('🔍 useEffect triggered - fetching installment data');
    fetchInstallmentData();
  }, [selectedMonth, selectedYear]);

  // ฟิลเตอร์ข้อมูลตาม search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return installmentData;

    return installmentData.filter(item =>
      item.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employee.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [installmentData, searchTerm]);

  // ฟังก์ชันพิมพ์รายงาน
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>รายงานสารบัญค่างวด</title>
          <style>
            body { font-family: 'Sarabun', sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
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
            <h1>รายงานสารบัญค่างวด</h1>
            <p>เดือน: ${selectedMonth ? months.find(m => m.value === selectedMonth)?.label : 'ทั้งหมด'} ${selectedYear}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ว.ด.ป.</th>
                <th>สัญญา</th>
                <th>ชื่อ-สกุล</th>
                <th>สาย</th>
                <th>จำนวนเงิน</th>
                <th>พนักงาน</th>
                <th>เลขที่ใบเสร็จ</th>
                <th>คงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map(item => `
                <tr>
                  <td>${item.contractDate}</td>
                  <td>${item.contractNumber}</td>
                  <td>${item.customerFullName}</td>
                  <td class="text-center">${item.line}</td>
                  <td class="text-right">฿${item.amount.toLocaleString()}</td>
                  <td>${item.employee}</td>
                  <td class="text-center">${item.receiptNumber}</td>
                  <td class="text-right">฿${item.remainingDebt.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // ฟังก์ชันส่งออก Excel
  const handleExportExcel = () => {
    // สร้าง CSV content
    const headers = ['ว.ด.ป.', 'สัญญา', 'ชื่อ-สกุล', 'สาย', 'จำนวนเงิน', 'พนักงาน', 'เลขที่ใบเสร็จ', 'คงเหลือ'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.contractDate,
        item.contractNumber,
        item.customerFullName,
        item.line,
        item.amount,
        item.employee,
        item.receiptNumber,
        item.remainingDebt
      ].join(','))
    ].join('\n');

    // สร้างและดาวน์โหลดไฟล์
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `สารบัญค่างวด_${selectedMonth || 'ทั้งหมด'}_${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "ส่งออกสำเร็จ",
      description: "ไฟล์ Excel ถูกดาวน์โหลดแล้ว",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  สารบัญค่างวด
                </h1>
                <p className="text-gray-600 mt-1">
                  แสดงข้อมูลค่างวดของสาขา {currentBranch?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Printer className="h-5 w-5" />
                <span className="font-semibold">พิมพ์</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Download className="h-5 w-5" />
                <span className="font-semibold">บันทึกเป็น Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Month Filter */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200"
              >
                <option value="">ทุกเดือน</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200"
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={fetchInstallmentData}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Search className="h-5 w-5" />
              <span className="font-semibold">ค้นหา</span>
            </button>

            {/* Entries Per Page */}
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-sm font-medium text-gray-700">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(e.target.value)}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
              </select>
              <span className="text-sm font-medium text-gray-700">entries</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-gray-700">Search:</span>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาสัญญา, ลูกค้า, พนักงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200">
                    ว.ด.ป. ↕
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200">
                    สัญญา ↕
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200">
                    ชื่อ-สกุล ↕
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200">
                    สาย ↕
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200">
                    จำนวนเงิน ↕
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200">
                    พนักงาน ↕
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200">
                    เลขที่ใบเสร็จ ↕
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors duration-200">
                    คงเหลือ ↕
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="text-gray-600 text-lg">กำลังโหลดข้อมูล...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-red-600 text-lg">
                      {error}
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500 text-lg">
                      ไม่พบข้อมูลค่างวด
                    </td>
                  </tr>
                ) : (
                  filteredData.slice(0, entriesPerPage).map((item, index) => (
                    <tr key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.contractDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600 cursor-pointer hover:text-red-800 hover:underline transition-colors duration-200">
                        {item.contractNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.customerFullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-medium">
                        {item.line}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">
                        ฿{item.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.employee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-medium">
                        {item.receiptNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">
                        ฿{item.remainingDebt.toLocaleString()}
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

export default InstallmentIndexPage; 