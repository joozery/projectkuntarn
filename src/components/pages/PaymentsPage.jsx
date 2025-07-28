import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign,
  Filter,
  CreditCard,
  Search,
  TrendingUp,
  Users,
  FileText,
  Loader2,
  Package
} from 'lucide-react';
import { contractsService } from '@/services/contractsService';
import { customersService } from '@/services/customersService';

const PaymentsPage = ({ selectedBranch, currentBranch }) => {
  const [contracts, setContracts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedBranch]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [contractsRes, customersRes] = await Promise.all([
        contractsService.getAll(selectedBranch),
        customersService.getAll(selectedBranch)
      ]);

      setContracts(contractsRes.data || []);
      setCustomers(customersRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (planId, paymentIndex, status) => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll just show a toast
      toast({
        title: status === 'paid' ? "ชำระเงินสำเร็จ! ✅" : "อัพเดทสถานะแล้ว",
        description: status === 'paid' ? "บันทึกการชำระเงินแล้ว" : "เปลี่ยนสถานะการชำระแล้ว",
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะการชำระได้",
        variant: "destructive"
      });
    }
  };

  const getPaymentStatus = (payment) => {
    if (payment.status === 'paid') return 'paid';
    if (new Date(payment.dueDate) < new Date()) return 'overdue';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'ชำระแล้ว';
      case 'overdue':
        return 'เกินกำหนด';
      default:
        return 'รอชำระ';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const allPayments = useMemo(() => {
    const payments = [];
    contracts.forEach(contract => {
      const customer = customers.find(c => c.id === contract.customerId);
      // For now, we'll create mock payments based on contract data
      // This should be replaced with actual payment data from API
      const mockPayments = [];
      for (let i = 0; i < contract.installmentPeriod; i++) {
        const dueDate = new Date(contract.startDate);
        dueDate.setMonth(dueDate.getMonth() + i);
        mockPayments.push({
          id: `${contract.id}-${i}`,
          amount: contract.installmentAmount,
          dueDate: dueDate.toISOString().split('T')[0],
          status: 'pending',
          planId: contract.id,
          customerName: customer?.fullName || 'ไม่ระบุ',
          contractNumber: contract.contractNumber,
          productName: contract.productName
        });
      }
      payments.push(...mockPayments);
    });
    return payments;
  }, [contracts, customers]);

  const filteredPayments = allPayments.filter(payment => {
    const matchesSearch = payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const summaryStats = useMemo(() => {
    const total = allPayments.length;
    const paid = allPayments.filter(p => p.status === 'paid').length;
    const overdue = allPayments.filter(p => getPaymentStatus(p) === 'overdue').length;
    const pending = total - paid - overdue;
    const totalAmount = allPayments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = allPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

    return { total, paid, overdue, pending, totalAmount, paidAmount };
  }, [allPayments]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">จัดการการชำระเงิน</h1>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">กำลังโหลดข้อมูลการชำระเงิน...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการการชำระเงิน</h1>
          <p className="text-gray-600">ติดตามและจัดการการชำระเงินของลูกค้า - {currentBranch?.name}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CreditCard className="w-4 h-4" />
          <span>การชำระทั้งหมด: {summaryStats.total} รายการ</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">ทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">ชำระแล้ว</p>
              <p className="text-2xl font-bold text-green-600">{summaryStats.paid}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">รอชำระ</p>
              <p className="text-2xl font-bold text-yellow-600">{summaryStats.pending}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">เกินกำหนด</p>
              <p className="text-2xl font-bold text-red-600">{summaryStats.overdue}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาลูกค้า, เลขสัญญา, หรือสินค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="paid">ชำระแล้ว</option>
            <option value="pending">รอชำระ</option>
            <option value="overdue">เกินกำหนด</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">รายการการชำระเงิน</h2>
        </div>
        
        <div className="p-6">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีการชำระเงิน</h3>
              <p className="text-gray-500">ยังไม่มีการชำระเงินในระบบ</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredPayments.map((payment, index) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{payment.customerName}</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {payment.contractNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {payment.productName}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ฿{payment.amount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(payment.dueDate).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </div>
                      {payment.status !== 'paid' && (
                        <Button
                          size="sm"
                          onClick={() => updatePaymentStatus(payment.planId, 0, 'paid')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          ชำระ
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;