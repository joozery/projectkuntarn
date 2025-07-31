import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Download,
  Filter,
  Search,
  ChevronUp,
  ChevronDown,
  Loader2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

const CheckerInstallmentReport = ({ onBack, checker }) => {
  const [sortField, setSortField] = useState('contract');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [summary, setSummary] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [currentView, setCurrentView] = useState('all'); // 'all' or 'monthly'
  const [selectedMonthView, setSelectedMonthView] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // ฟังก์ชันดึงข้อมูลแยกตามเดือน
  const fetchMonthlyData = useCallback(async () => {
    try {
      console.log('📅 Fetching monthly data for checker:', checker?.id);
      
      const response = await api.get(`/installments`);
      console.log('📅 Monthly API Response:', response);
      
      let installmentsData = [];
      if (response.data?.success) {
        installmentsData = response.data.data || [];
      } else if (Array.isArray(response.data)) {
        installmentsData = response.data;
      }
      
      if (!Array.isArray(installmentsData)) {
        console.error('❌ installmentsData is not an array:', installmentsData);
        return;
      }

      // กรองข้อมูลตาม inspector_id
      const filteredData = installmentsData.filter(item => 
        item.inspectorId === checker?.id || item.inspectorId === parseInt(checker?.id)
      );

      // ลบข้อมูลซ้ำตาม contract ID
      const uniqueData = filteredData.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      );

      // จัดกลุ่มข้อมูลตามเดือน
      const monthly = {};
      
      uniqueData.forEach(item => {
        const collectionDate = item.dueDate || item.collectionDate;
        
        if (collectionDate) {
          const date = new Date(collectionDate);
          
          if (!isNaN(date.getTime())) {
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('th-TH', { 
              year: 'numeric', 
              month: 'long' 
            });
            
            if (!monthly[monthKey]) {
              monthly[monthKey] = {
                monthName,
                monthKey,
                installments: [],
                totalAmount: 0,
                totalCollected: 0,
                totalRemaining: 0
              };
            }
            
            const amount = parseFloat(item.installmentAmount) || 0;
            monthly[monthKey].installments.push({
              id: item.id,
              contract: item.contractNumber || `C${item.id}`,
              name: item.customerFullName || `${item.customerName || ''} ${item.customerSurname || ''}`.trim(),
              collectionDate: date.toLocaleDateString('th-TH'),
              amountToCollect: amount,
              amountCollected: 0,
              remainingDebt: amount,
              napheoRed: 0,
              napheoBlack: 0,
              pBlack: 0,
              pRed: 0,
              pBlue: 0,
              paymentStatus: 'pending'
            });
            
            monthly[monthKey].totalAmount += amount;
            monthly[monthKey].totalRemaining += amount;
          }
        }
      });

      // เรียงลำดับเดือน
      const sortedMonths = Object.keys(monthly).sort();
      const sortedMonthlyData = {};
      sortedMonths.forEach(monthKey => {
        sortedMonthlyData[monthKey] = monthly[monthKey];
      });

      setMonthlyData(sortedMonthlyData);
      
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถดึงข้อมูลรายเดือนได้',
        variant: 'destructive',
      });
    }
  }, [checker?.id]);

  // ฟังก์ชันรีเฟรชข้อมูล
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    setLoading(true);
    setError(null);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Fetching installments for checker:', checker?.id);
        
        // ดึงข้อมูลสัญญาจาก API installments
        const response = await api.get(`/installments`);
        console.log('📊 API Response:', response);
        
        // ดึงข้อมูลจาก response - ตรวจสอบโครงสร้างข้อมูล
        let installmentsData = [];
        if (response.data?.success) {
          installmentsData = response.data.data || [];
        } else if (Array.isArray(response.data)) {
          installmentsData = response.data;
        }
        
        // ตรวจสอบว่าข้อมูลเป็น Array หรือไม่
        if (!Array.isArray(installmentsData)) {
          throw new Error('ข้อมูลที่ได้รับไม่ใช่ Array');
        }
        
        // กรองข้อมูลตาม inspector_id (checker)
        const filteredData = installmentsData.filter(item => {
          return item.inspectorId === checker?.id || item.inspectorId === parseInt(checker?.id);
        });
        
        // ลบข้อมูลซ้ำตาม contract ID
        const uniqueData = filteredData.filter((item, index, self) => 
          index === self.findIndex(t => t.id === item.id)
        );
        
        console.log('🔍 Original filtered data length:', filteredData.length);
        console.log('🔍 Unique data length:', uniqueData.length);
        console.log('🔍 Duplicates removed:', filteredData.length - uniqueData.length);
        
        // Debug: แสดงข้อมูลที่ซ้ำกัน
        if (filteredData.length !== uniqueData.length) {
          const duplicates = filteredData.filter((item, index, self) => 
            self.findIndex(t => t.id === item.id) !== index
          );
          console.log('🔍 Duplicate items:', duplicates);
        }
        
        // ถ้าไม่มีข้อมูล ให้แสดงข้อความ
        if (uniqueData.length === 0) {
          console.log('⚠️ No data found for checker:', checker?.id);
        }
        
        // แปลงข้อมูลให้ตรงกับ frontend
        const processedData = uniqueData.map((item, index) => {
          const collectionDate = item.dueDate || item.collectionDate;
          let formattedDate = '-';
          
          if (collectionDate) {
            try {
              const date = new Date(collectionDate);
              if (!isNaN(date.getTime())) {
                formattedDate = date.toLocaleDateString('th-TH');
              }
            } catch (error) {
              console.error('Error parsing date:', collectionDate, error);
            }
          }
          
          return {
            id: item.id,
            sequence: index + 1,
            contract: item.contractNumber || `C${item.id}`,
            name: item.customerFullName || `${item.customerName || ''} ${item.customerSurname || ''}`.trim(),
            collectionDate: formattedDate,
            amountToCollect: parseFloat(item.installmentAmount) || 0,
            amountCollected: 0, // ยังไม่มีข้อมูลการชำระ
            remainingDebt: parseFloat(item.installmentAmount) || 0,
            // ค่าเริ่มต้นสำหรับระบบ P และนับเพียว
            napheoRed: 0,
            napheoBlack: 0,
            pBlack: 0,
            pRed: 0,
            pBlue: 0,
            paymentStatus: 'pending'
          };
        });
        
        setInstallments(processedData);
        
        // คำนวณยอดรวม
        const summaryData = {
          totalCards: processedData.length,
          cardsToCollect: processedData.length,
          cardsCollected: 0,
          pGreen: 0,
          pRed: 0,
          totalPCards: processedData.length,
          pGreenCollected: 0,
          pRedCollected: 0,
          totalPCardsCollected: 0,
          totalMoney: processedData.reduce((sum, item) => sum + item.amountToCollect, 0),
          moneyToCollect: processedData.reduce((sum, item) => sum + item.amountToCollect, 0),
          moneyCollected: 0
        };
        
        setSummary(summaryData);
        
        // ดึงข้อมูลแยกตามเดือน
        await fetchMonthlyData();
        
      } catch (error) {
        console.error('Error fetching installments:', error);
        setError(error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
        
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: error.response?.data?.message || error.message || 'ไม่สามารถดึงข้อมูลได้',
          variant: 'destructive',
        });
        
        // ตั้งค่า default data
        setInstallments([]);
        setSummary({
          totalCards: 0,
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
        });
      } finally {
        setLoading(false);
      }
    };

    if (checker?.id) {
      fetchData();
    }
  }, [checker?.id, selectedMonth, refreshKey, fetchMonthlyData]);

  // ฟังก์ชันเรียงลำดับ
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const getSortIcon = useCallback((field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  }, [sortField, sortDirection]);

  // ฟังก์ชันกรองข้อมูล
  const filteredData = useMemo(() => {
    // ลบข้อมูลซ้ำตาม ID ก่อน
    const uniqueInstallments = installments.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );
    
    return uniqueInstallments.filter(item => {
      // กรองตามคำค้นหา
      const matchesSearch = item.contract.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // กรองตามเดือนที่เลือก
      let matchesMonth = true;
      if (selectedMonth) {
        try {
          const itemDate = new Date(item.collectionDate);
          if (!isNaN(itemDate.getTime())) {
            const itemMonth = itemDate.getMonth() + 1; // getMonth() returns 0-11
            matchesMonth = itemMonth === parseInt(selectedMonth);
          }
        } catch (error) {
          console.error('❌ Error parsing date:', item.collectionDate, error);
          matchesMonth = false;
        }
      }
      
      return matchesSearch && matchesMonth;
    });
  }, [installments, searchTerm, selectedMonth]);

  // คำนวณยอดรวมจากข้อมูลที่กรองแล้ว
  const { totalAmountToCollect, totalAmountCollected, totalRemainingDebt } = useMemo(() => {
    return {
      totalAmountToCollect: filteredData.reduce((sum, item) => sum + (item.amountToCollect || 0), 0),
      totalAmountCollected: filteredData.reduce((sum, item) => sum + (item.amountCollected || 0), 0),
      totalRemainingDebt: filteredData.reduce((sum, item) => sum + (item.remainingDebt || 0), 0)
    };
  }, [filteredData]);

  // เรียงข้อมูล
  const sortedData = useMemo(() => {
    // ตรวจสอบและลบข้อมูลซ้ำอีกครั้ง
    const uniqueFilteredData = filteredData.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );
    
    return [...uniqueFilteredData].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'sequence') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredData, sortField, sortDirection]);

  // ฟังก์ชันส่งออกข้อมูล
  const handleExport = useCallback(() => {
    try {
      const exportData = {
        checker: checker,
        summary: summary,
        installments: sortedData,
        exportDate: new Date().toLocaleDateString('th-TH'),
        totalAmountToCollect,
        totalAmountCollected,
        totalRemainingDebt
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `checker-report-${checker?.id}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'ส่งออกสำเร็จ',
        description: 'ไฟล์รายงานถูกดาวน์โหลดแล้ว',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถส่งออกข้อมูลได้',
        variant: 'destructive',
      });
    }
  }, [checker, summary, sortedData, totalAmountToCollect, totalAmountCollected, totalRemainingDebt]);

  // Error boundary
  if (!checker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบข้อมูลเช็คเกอร์</h2>
          <p className="text-gray-600 mb-4">กรุณาเลือกเช็คเกอร์ก่อน</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                กลับ
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">รายงานค่างวด</h1>
                <p className="text-sm text-gray-600">
                  เช็คเกอร์: {checker?.name} {checker?.surname}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <Loader2 className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                รีเฟรช
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                disabled={loading || sortedData.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                ส่งออก
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">เกิดข้อผิดพลาด</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">กำลังโหลดข้อมูล...</p>
              <p className="text-sm text-gray-600">กรุณารอสักครู่</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {/* Summary Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">จำนวนสัญญา</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">เงินต้องเก็บ</p>
                    <p className="text-2xl font-bold text-orange-600">฿{totalAmountToCollect.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">เงินเก็บได้</p>
                    <p className="text-2xl font-bold text-green-600">฿{totalAmountCollected.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">ลูกหนี้คงเหลือ</p>
                    <p className="text-2xl font-bold text-red-600">฿{totalRemainingDebt.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* View Toggle and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                {/* View Toggle */}
                <div className="flex items-center space-x-4">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setCurrentView('all')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentView === 'all'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      รายการทั้งหมด
                    </button>
                    <button
                      onClick={() => setCurrentView('monthly')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentView === 'monthly'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      แยกตามเดือน
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="ค้นหาตามเลขสัญญา หรือชื่อลูกค้า..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Month Filter */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">ทุกเดือน</option>
                      <option value="1">มกราคม</option>
                      <option value="2">กุมภาพันธ์</option>
                      <option value="3">มีนาคม</option>
                      <option value="4">เมษายน</option>
                      <option value="5">พฤษภาคม</option>
                      <option value="6">มิถุนายน</option>
                      <option value="7">กรกฎาคม</option>
                      <option value="8">สิงหาคม</option>
                      <option value="9">กันยายน</option>
                      <option value="10">ตุลาคม</option>
                      <option value="11">พฤศจิกายน</option>
                      <option value="12">ธันวาคม</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Monthly View */}
            {currentView === 'monthly' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6 mb-12"
              >
                {Object.keys(monthlyData).length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีข้อมูลรายเดือน</h3>
                    <p className="text-gray-600">ไม่พบข้อมูลการผ่อนชำระในเดือนต่างๆ</p>
                  </div>
                ) : (
                  Object.entries(monthlyData).map(([monthKey, monthData]) => (
                    <div key={monthKey} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{monthData.monthName}</h3>
                            <p className="text-sm text-gray-600">
                              {monthData.installments.length} สัญญา | 
                              เงินต้องเก็บ: ฿{monthData.totalAmount.toLocaleString()} | 
                              เงินคงเหลือ: ฿{monthData.totalRemaining.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                              {monthData.installments.length} รายการ
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ลำดับ
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                เลขที่สัญญา
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ชื่อ-สกุล
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                วันนัดเก็บ
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                เงินต้องเก็บ
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                เงินคงเหลือ
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                สถานะ
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {monthData.installments.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                  {item.contract}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.name || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {item.collectionDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                                  ฿{item.amountToCollect.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                  ฿{item.remainingDebt.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <Clock className="w-3 h-3 mr-1" />
                                    รอชำระ
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* All Data Table */}
            {currentView === 'all' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12"
              >
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">รายการสัญญา</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('sequence')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>ลำดับ</span>
                            {getSortIcon('sequence')}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('contract')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>สัญญา</span>
                            {getSortIcon('contract')}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>ชื่อ-สกุล</span>
                            {getSortIcon('name')}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('collectionDate')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>วันนัดเก็บ</span>
                            {getSortIcon('collectionDate')}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="text-center">
                            <div className="text-blue-600 font-bold">นับเพียว</div>
                            <div className="text-xs text-gray-500">น้ำเงิน</div>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="text-center">
                            <div className="text-red-600 font-bold">นับเพียว</div>
                            <div className="text-xs text-gray-500">แดง</div>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="text-center">
                            <div className="text-black font-bold">P</div>
                            <div className="text-xs text-gray-500">ดำ</div>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="text-center">
                            <div className="text-red-600 font-bold">P</div>
                            <div className="text-xs text-gray-500">แดง</div>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="text-center">
                            <div className="text-blue-600 font-bold">P</div>
                            <div className="text-xs text-gray-500">น้ำเงิน</div>
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('amountToCollect')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>เงินต้องเก็บ</span>
                            {getSortIcon('amountToCollect')}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('amountCollected')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>เงินเก็บได้</span>
                            {getSortIcon('amountCollected')}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('remainingDebt')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>ลูกหนี้คงเหลือ</span>
                            {getSortIcon('remainingDebt')}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedData.length === 0 ? (
                        <tr>
                          <td colSpan="12" className="px-6 py-8 text-center">
                            <div className="text-center">
                              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อมูล</h3>
                              <p className="text-gray-600">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        sortedData.map((item, index) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`hover:bg-gray-50 ${index % 2 === 1 ? 'bg-blue-50' : ''}`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.sequence}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              {item.contract}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.name || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.collectionDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 text-center font-medium">
                              {item.napheoBlack > 0 ? item.napheoBlack : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center font-medium">
                              {item.napheoRed > 0 ? item.napheoRed : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center font-medium">
                              {item.pBlack > 0 ? item.pBlack : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center font-medium">
                              {item.pRed > 0 ? item.pRed : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 text-center font-medium">
                              {item.pBlue > 0 ? item.pBlue : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                              ฿{item.amountToCollect.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              {item.amountCollected ? `฿${item.amountCollected.toLocaleString()}` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                              ฿{item.remainingDebt.toLocaleString()}
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      แสดง {sortedData.length} รายการ จากทั้งหมด {filteredData.length} รายการ
                      {filteredData.length !== installments.length && (
                        <span className="ml-2 text-orange-600">
                          (กรองแล้วจาก {installments.length} รายการ)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="text-gray-600">ยอดรวม:</span>
                      <span className="font-medium text-orange-600">฿{totalAmountToCollect.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Summary Data Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">สรุปข้อมูล</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* จำนวนการ์ด */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700 text-sm">จำนวนการ์ด</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">จำนวนการ์ดทั้งหมด:</span>
                        <span className="text-sm font-medium">{summary.totalCards || 0} ใบ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">จำนวนการ์ดที่ต้องเก็บ:</span>
                        <span className="text-sm font-medium">{summary.cardsToCollect || 0} ใบ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">จำนวนการ์ดที่เก็บได้:</span>
                        <span className="text-sm font-medium">{summary.cardsCollected || 0} ใบ</span>
                      </div>
                    </div>
                  </div>

                  {/* P เขียว */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700 text-sm">P เขียว</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">P เขียว:</span>
                        <span className="text-sm font-medium text-green-600">{summary.pGreen || 0} ใบ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">P แดง:</span>
                        <span className="text-sm font-medium text-red-600">{summary.pRed || 0} ใบ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">รวมการ์ดทั้งหมด:</span>
                        <span className="text-sm font-medium">{summary.totalPCards || 0} ใบ</span>
                      </div>
                    </div>
                  </div>

                  {/* P เก็บได้ */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700 text-sm">P เก็บได้</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">P เขียว เก็บได้:</span>
                        <span className="text-sm font-medium text-green-600">{summary.pGreenCollected || 0} ใบ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">P แดง เก็บได้:</span>
                        <span className="text-sm font-medium text-red-600">{summary.pRedCollected || 0} ใบ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">รวมการ์ดเก็บได้:</span>
                        <span className="text-sm font-medium">{summary.totalPCardsCollected || 0} ใบ</span>
                      </div>
                    </div>
                  </div>

                  {/* จำนวนเงิน */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700 text-sm">จำนวนเงิน</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">จำนวนเงินทั้งหมด:</span>
                        <span className="text-sm font-medium">฿{(summary.totalMoney || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">จำนวนเงินที่ต้องเก็บ:</span>
                        <span className="text-sm font-medium">฿{(summary.moneyToCollect || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">จำนวนเงินที่เก็บได้:</span>
                        <span className="text-sm font-medium">฿{(summary.moneyCollected || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckerInstallmentReport; 