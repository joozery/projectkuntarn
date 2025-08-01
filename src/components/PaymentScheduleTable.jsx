import React, { useState, useEffect, useCallback } from 'react';
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
  Eye,
  Edit,
  Loader2
} from 'lucide-react';
import { installmentsService } from '@/services/installmentsService';
import api from '@/lib/api';

const PaymentScheduleTable = ({ installmentId, selectedBranch }) => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingPayment, setEditingPayment] = useState(null);
  const [editForm, setEditForm] = useState({
    status: 'pending',
    paymentDate: '',
    receiptNumber: '',
    amount: '',
    dueDate: '',
    notes: ''
  });
  const [collectors, setCollectors] = useState([]);
  const [loadingCollectors, setLoadingCollectors] = useState(false);

  // โหลดข้อมูลพนักงานเก็บเงิน
  const loadCollectors = useCallback(async () => {
    try {
      setLoadingCollectors(true);
      const response = await api.get('/employees');
      
      let collectorsData = [];
      if (response.data?.success) {
        collectorsData = response.data.data || [];
      } else if (Array.isArray(response.data)) {
        collectorsData = response.data;
      }
      
      // กรองเฉพาะพนักงานที่มีตำแหน่งเป็น collector หรือ เก็บเงิน
      const filteredCollectors = collectorsData.filter(employee => 
        employee.position && (
          employee.position.toLowerCase().includes('collector') ||
          employee.position.toLowerCase().includes('เก็บเงิน') ||
          employee.position.toLowerCase().includes('พนักงานเก็บเงิน')
        )
      );
      
      setCollectors(filteredCollectors);
    } catch (error) {
      console.error('Error loading collectors:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดข้อมูลพนักงานเก็บเงินได้',
        variant: 'destructive',
      });
    } finally {
      setLoadingCollectors(false);
    }
  }, []);

  useEffect(() => {
    if (installmentId) {
      loadPayments();
      loadCollectors();
    }
  }, [installmentId, statusFilter, loadCollectors]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await installmentsService.getPayments(installmentId, params);
      setPayments(response.data || []);
      setSummary(response.summary || null);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลการชำระเงินได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเปลี่ยนพนักงานเก็บเงิน
  const handleCollectorChange = useCallback(async (paymentId, collectorId) => {
    try {
      const response = await api.put(`/payments/${paymentId}/collector`, {
        collectorId: collectorId
      });
      
      if (response.data?.success) {
        toast({
          title: 'สำเร็จ',
          description: 'เปลี่ยนพนักงานเก็บเงินเรียบร้อยแล้ว',
        });
        
        // รีเฟรชข้อมูล
        loadPayments();
      } else {
        throw new Error(response.data?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error updating collector:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถเปลี่ยนพนักงานเก็บเงินได้',
        variant: 'destructive',
      });
    }
  }, [loadPayments]);

  const handlePaymentUpdate = async (paymentId) => {
    try {
      const paymentData = {
        status: editForm.status,
        paymentDate: editForm.status === 'paid' ? editForm.paymentDate : null,
        notes: editForm.notes,
        receipt_number: editForm.receiptNumber,
        amount: editForm.amount,
        due_date: editForm.dueDate
      };
      
      await installmentsService.updatePayment(installmentId, paymentId, paymentData);
      
      toast({
        title: "อัพเดทสำเร็จ",
        description: `อัพเดทข้อมูลการชำระเงินเรียบร้อยแล้ว`,
      });
      
      loadPayments(); // Reload payments
      setEditingPayment(null);
      setEditForm({
        status: 'pending',
        paymentDate: '',
        receiptNumber: '',
        amount: '',
        dueDate: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพเดทการชำระเงินได้",
        variant: "destructive"
      });
    }
  };

  const handleEditClick = (payment) => {
    setEditingPayment(payment.id);
    setEditForm({
      status: payment.status,
      paymentDate: payment.paymentDate || '',
      receiptNumber: payment.receiptNumber || '',
      amount: payment.amount || '',
      dueDate: payment.dueDate || '',
      notes: payment.notes || ''
    });
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

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && status !== 'paid';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">กำลังโหลด...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">รวมงวด</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalPayments}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ชำระแล้ว</p>
                <p className="text-2xl font-bold text-green-600">{summary.paidCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">รอชำระ</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">เกินกำหนด</p>
                <p className="text-2xl font-bold text-red-600">{summary.overdueCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">ทั้งหมด</option>
            <option value="paid">ชำระแล้ว</option>
            <option value="pending">รอชำระ</option>
            <option value="overdue">เกินกำหนด</option>
          </select>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  งวดที่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จำนวนเงิน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันครบกำหนด
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันชำระ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เลขที่ใบเสร็จ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  หมายเหตุ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {loadingCollectors ? (
                    <div className="flex items-center">
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      โหลด...
                    </div>
                  ) : (
                    'พนักงานเก็บเงิน'
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr key={payment.id} className={isOverdue(payment.dueDate) ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.notes || `งวดที่ ${index + 1}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingPayment === payment.id ? (
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        step="0.01"
                      />
                    ) : (
                      <div>
                        <div className="font-medium text-gray-900">฿{parseFloat(payment.amount).toLocaleString()}</div>
                        {payment.status === 'paid' && (
                          <div className="text-xs text-green-600">ชำระแล้ว</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingPayment === payment.id ? (
                      <input
                        type="date"
                        value={editForm.dueDate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div>
                        <div className="text-sm text-gray-900">{new Date(payment.dueDate).toLocaleDateString('th-TH')}</div>
                        {isOverdue(payment.dueDate) && payment.status !== 'paid' && (
                          <div className="text-xs text-red-600">เกินกำหนด</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingPayment === payment.id ? (
                      <input
                        type="date"
                        value={editForm.paymentDate}
                        onChange={(e) => setEditForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                        className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div>
                        <div className="text-sm text-gray-900">
                          {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('th-TH') : '-'}
                        </div>
                        {payment.paymentDate && (
                          <div className="text-xs text-green-600">ชำระแล้ว</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingPayment === payment.id ? (
                      <input
                        type="text"
                        value={editForm.receiptNumber}
                        onChange={(e) => setEditForm(prev => ({ ...prev, receiptNumber: e.target.value }))}
                        placeholder="เลขที่ใบเสร็จ"
                        className="w-28 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div>
                        <div className="text-sm text-gray-900">{payment.receiptNumber || '-'}</div>
                        {payment.receiptNumber && (
                          <div className="text-xs text-blue-600">ใบเสร็จ</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingPayment === payment.id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">รอชำระ</option>
                        <option value="paid">ชำระแล้ว</option>
                        <option value="overdue">เกินกำหนด</option>
                        <option value="cancelled">ยกเลิก</option>
                      </select>
                    ) : (
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1">{getStatusText(payment.status)}</span>
                        </span>
                        {payment.status === 'overdue' && (
                          <div className="text-xs text-red-600 mt-1">เกินกำหนดแล้ว</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingPayment === payment.id ? (
                      <input
                        type="text"
                        value={editForm.notes}
                        onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="หมายเหตุ"
                        className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="max-w-xs">
                        <div className="text-sm text-gray-900">{payment.notes || '-'}</div>
                        {payment.notes && payment.notes !== 'เงินดาวน์/งวดแรก' && (
                          <div className="text-xs text-gray-500 mt-1">งวดที่ {index + 1}</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {loadingCollectors ? (
                      <div className="flex items-center">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        โหลด...
                      </div>
                    ) : (
                      <select
                        value={payment.collectorId || ''}
                        onChange={(e) => handleCollectorChange(payment.id, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">เลือกพนักงาน</option>
                        {collectors.map((collector) => (
                          <option key={collector.id} value={collector.id}>
                            {collector.name} {collector.surname} ({collector.position})
                          </option>
                        ))}
                      </select>
                    )}
                    {payment.collectorId && !loadingCollectors && (
                      <div className="mt-1 text-xs text-gray-500">
                        {(() => {
                          const selectedCollector = collectors.find(c => c.id === payment.collectorId);
                          return selectedCollector ? (
                            <div>
                              <div className="text-xs text-gray-700">{selectedCollector.name} {selectedCollector.surname}</div>
                              <div className="text-xs text-blue-600">{selectedCollector.position}</div>
                            </div>
                          ) : 'ไม่พบข้อมูล';
                        })()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingPayment === payment.id ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handlePaymentUpdate(payment.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          บันทึก
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPayment(null);
                            setEditForm({
                              status: 'pending',
                              paymentDate: '',
                              receiptNumber: '',
                              amount: '',
                              dueDate: '',
                              notes: ''
                            });
                          }}
                        >
                          ยกเลิก
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(payment)}
                          className="mb-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <div className="text-xs text-gray-500">
                          แก้ไขข้อมูล
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      {summary && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">ยอดชำระแล้ว:</p>
              <p className="text-lg font-bold text-green-600">฿{summary.paidAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ยอดคงเหลือ:</p>
              <p className="text-lg font-bold text-red-600">฿{summary.remainingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentScheduleTable; 