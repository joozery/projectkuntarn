import React, { useState } from 'react';
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
  CreditCard
} from 'lucide-react';

const PaymentSchedule = ({ installmentPlans, onUpdatePayment }) => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const selectedPlanData = installmentPlans.find(plan => plan.id === selectedPlan);

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

  const handlePaymentUpdate = (paymentIndex, newStatus) => {
    onUpdatePayment(selectedPlan, paymentIndex, newStatus);
  };

  const filteredPayments = selectedPlanData?.payments.filter(payment => {
    if (statusFilter === 'all') return true;
    return payment.status === statusFilter;
  }) || [];

  const calculateSummary = (plan) => {
    if (!plan) return null;
    
    const paidPayments = plan.payments.filter(p => p.status === 'paid');
    const pendingPayments = plan.payments.filter(p => p.status === 'pending');
    const overduePayments = plan.payments.filter(p => {
      if (p.status === 'paid') return false;
      return new Date(p.dueDate) < new Date();
    });

    return {
      totalPayments: plan.payments.length,
      paidCount: paidPayments.length,
      pendingCount: pendingPayments.length,
      overdueCount: overduePayments.length,
      paidAmount: paidPayments.reduce((sum, p) => sum + p.amount, 0),
      remainingAmount: (pendingPayments.length + overduePayments.length) * plan.monthlyPayment
    };
  };

  const summary = calculateSummary(selectedPlanData);

  return (
    <div className="space-y-6">
      {/* Plan Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          ตารางการชำระเงิน
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <CreditCard className="w-4 h-4" />
              เลือกแผนการผ่อน
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <option value="">เลือกแผนการผ่อน</option>
              {installmentPlans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.productName} - {plan.months} งวด
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4" />
              กรองตามสถานะ
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <option value="all">ทั้งหมด</option>
              <option value="pending">รอชำระ</option>
              <option value="paid">ชำระแล้ว</option>
              <option value="overdue">เกินกำหนด</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Summary */}
      {selectedPlanData && summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="payment-card"
        >
          <h3 className="text-xl font-bold mb-4">สรุปการชำระเงิน</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{summary.paidCount}/{summary.totalPayments}</div>
              <div className="text-white/80">งวดที่ชำระแล้ว</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">฿{summary.paidAmount.toLocaleString()}</div>
              <div className="text-white/80">ยอดที่ชำระแล้ว</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">฿{summary.remainingAmount.toLocaleString()}</div>
              <div className="text-white/80">ยอดคงเหลือ</div>
            </div>
          </div>

          {summary.overdueCount > 0 && (
            <div className="mt-4 p-4 bg-red-500/20 rounded-xl border border-red-300/30">
              <div className="flex items-center gap-2 text-red-200">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">
                  มี {summary.overdueCount} งวดที่เกินกำหนดชำระ
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Payment Schedule */}
      {selectedPlanData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold gradient-text mb-6">
            รายละเอียดการชำระ - {selectedPlanData.productName}
          </h3>

          <div className="space-y-4">
            {filteredPayments.map((payment, index) => {
              const actualIndex = selectedPlanData.payments.findIndex(p => p === payment);
              const isOverdue = payment.status !== 'paid' && new Date(payment.dueDate) < new Date();
              const currentStatus = isOverdue ? 'overdue' : payment.status;
              
              return (
                <motion.div
                  key={actualIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/80 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(currentStatus)}
                      <div>
                        <div className="font-semibold text-gray-800">
                          งวดที่ {payment.month}
                        </div>
                        <div className="text-sm text-gray-600">
                          กำหนดชำระ: {new Date(payment.dueDate).toLocaleDateString('th-TH')}
                        </div>
                        {payment.paidDate && (
                          <div className="text-sm text-green-600">
                            ชำระเมื่อ: {new Date(payment.paidDate).toLocaleDateString('th-TH')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          ฿{payment.amount.toLocaleString()}
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(currentStatus)}`}>
                          {getStatusText(currentStatus)}
                        </div>
                      </div>

                      {payment.status !== 'paid' && (
                        <Button
                          onClick={() => handlePaymentUpdate(actualIndex, 'paid')}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          ชำระ
                        </Button>
                      )}

                      {payment.status === 'paid' && (
                        <Button
                          onClick={() => handlePaymentUpdate(actualIndex, 'pending')}
                          size="sm"
                          variant="outline"
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          ยกเลิก
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ไม่มีข้อมูลการชำระตามเงื่อนไขที่เลือก
            </div>
          )}
        </motion.div>
      )}

      {installmentPlans.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 text-center"
        >
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            ยังไม่มีแผนการผ่อน
          </h3>
          <p className="text-gray-500">
            สร้างแผนการผ่อนก่อนเพื่อดูตารางการชำระเงิน
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentSchedule;