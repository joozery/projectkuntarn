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
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Printer
} from 'lucide-react';

const CheckerInstallmentReport = ({ selectedBranch, currentBranch, checker, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(400);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data ตามรูปที่ส่งมา
  const mockData = {
    summary: {
      totalCards: 1,
      cardsToCollect: 0,
      cardsCollected: 0,
      pGreen: 0,
      pRed: 0,
      totalPCards: 0,
      pGreenCollected: 0,
      pRedCollected: 0,
      totalPCardsCollected: 0,
      totalMoney: 0,
      moneyToCollect: 0,
      moneyCollected: 0
    },
    entries: [] // ไม่มีข้อมูลตามรูป
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

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
                รายงานค่างวด - {checker?.fullName}
              </h1>
              <p className="text-gray-600 mt-1">
                สาขา {currentBranch?.name || 'ทั้งหมด'} | {selectedMonth}/{selectedYear}
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
              <option value={400}>400 entries</option>
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
                placeholder="ค้นหา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-2">
                    ลำดับ
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    สัญญา
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
                    วันนัดเก็บ
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    นับเพียว
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    P
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    P
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    P
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    เงินต้องเก็บ
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    เงินเก็บได้
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    เงินต้องเก็บ
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    เงินเก็บได้
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    ลูกหนี้คงเหลือ
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* No search results found */}
              <tr>
                <td colSpan="12" className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>1 No search results found</p>
                  </div>
                </td>
              </tr>
              
              {/* Summary row with zeros */}
              <tr className="bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 bg-gray-50 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  -
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  0
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  0
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  0
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  0
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  0
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  0
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  0
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  0
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  0
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  0
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                  0
                </td>
              </tr>
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
                Showing <span className="font-medium">0</span> to <span className="font-medium">0</span> of{' '}
                <span className="font-medium">0</span> entries
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

      {/* Summary Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">สรุปข้อมูล</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card Counts */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">จำนวนการ์ด</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">จำนวนการ์ดทั้งหมด:</span>
                <span className="text-sm font-medium">{mockData.summary.totalCards} ใบ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">จำนวนการ์ดที่ต้องเก็บ:</span>
                <span className="text-sm font-medium">{mockData.summary.cardsToCollect} ใบ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">จำนวนการ์ดที่เก็บได้:</span>
                <span className="text-sm font-medium">{mockData.summary.cardsCollected} ใบ</span>
              </div>
            </div>
          </div>

          {/* P Counts */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">P Counts</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">P เขียว:</span>
                <span className="text-sm font-medium">{mockData.summary.pGreen} ใบ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">P แดง:</span>
                <span className="text-sm font-medium">{mockData.summary.pRed} ใบ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">รวมการ์ดทั้งหมด:</span>
                <span className="text-sm font-medium">{mockData.summary.totalPCards} ใบ</span>
              </div>
            </div>
          </div>

          {/* P Collected Counts */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">P Collected</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">P เขียว เก็บได้:</span>
                <span className="text-sm font-medium">{mockData.summary.pGreenCollected} ใบ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">P แดง เก็บได้:</span>
                <span className="text-sm font-medium">{mockData.summary.pRedCollected} ใบ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">รวมการ์ดเก็บได้:</span>
                <span className="text-sm font-medium">{mockData.summary.totalPCardsCollected} ใบ</span>
              </div>
            </div>
          </div>

          {/* Money Counts */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">จำนวนเงิน</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">จำนวนเงินทั้งหมด:</span>
                <span className="text-sm font-medium">{formatCurrency(mockData.summary.totalMoney)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">จำนวนเงินที่ต้องเก็บ:</span>
                <span className="text-sm font-medium">{formatCurrency(mockData.summary.moneyToCollect)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">จำนวนเงินที่เก็บได้:</span>
                <span className="text-sm font-medium">{formatCurrency(mockData.summary.moneyCollected)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckerInstallmentReport; 