import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  RotateCcw, 
  Plus, 
  Calendar, 
  Package, 
  User, 
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Download,
  Loader2
} from 'lucide-react';

const ReturnsPage = ({ selectedBranch, currentBranch }) => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [returnForm, setReturnForm] = useState({
    returnNumber: '',
    returnDate: new Date().toISOString().split('T')[0],
    customerName: '',
    productName: '',
    quantity: 1,
    reason: '',
    condition: 'good',
    refundAmount: 0,
    status: 'pending',
    notes: '',
    processedBy: ''
  });

  useEffect(() => {
    loadReturns();
  }, [selectedBranch]);

  const loadReturns = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since returns API doesn't exist yet
      // This should be replaced with actual API call when backend is ready
      const mockReturns = [];
      setReturns(mockReturns);
    } catch (error) {
      console.error('Error loading returns:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลการรับคืนได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReturnNumber = () => {
    const prefix = 'R';
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${year}${month}${day}${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!returnForm.customerName || !returnForm.productName || !returnForm.reason) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ชื่อลูกค้า สินค้า และเหตุผลเป็นข้อมูลที่จำเป็น",
        variant: "destructive"
      });
      return;
    }

    try {
      const newReturn = {
        ...returnForm,
        id: Date.now().toString(),
        returnNumber: generateReturnNumber(),
        branchId: selectedBranch,
        branchName: currentBranch?.name,
        createdAt: new Date().toISOString(),
        processedBy: 'ระบบ'
      };
      
      // For now, we'll just add to local state
      // This should be replaced with actual API call when backend is ready
      setReturns(prev => [newReturn, ...prev]);
      
      setReturnForm({
        returnNumber: '',
        returnDate: new Date().toISOString().split('T')[0],
        customerName: '',
        productName: '',
        quantity: 1,
        reason: '',
        condition: 'good',
        refundAmount: 0,
        status: 'pending',
        notes: '',
        processedBy: ''
      });
      setShowForm(false);
      
      toast({
        title: "บันทึกการรับคืนสำเร็จ! 🔄",
        description: `บันทึกการรับคืนเลขที่ ${newReturn.returnNumber} แล้ว`,
      });
    } catch (error) {
      console.error('Error creating return:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการรับคืนได้",
        variant: "destructive"
      });
    }
  };

  const updateReturnStatus = async (returnId, newStatus) => {
    try {
      // For now, we'll just update local state
      // This should be replaced with actual API call when backend is ready
      setReturns(prev => prev.map(returnItem => 
        returnItem.id === returnId 
          ? { ...returnItem, status: newStatus, updatedAt: new Date().toISOString() }
          : returnItem
      ));
      
      const statusText = {
        'pending': 'รอดำเนินการ',
        'approved': 'อนุมัติ',
        'rejected': 'ปฏิเสธ',
        'completed': 'เสร็จสิ้น'
      };
      
      toast({
        title: "อัปเดตสถานะสำเร็จ",
        description: `เปลี่ยนสถานะเป็น: ${statusText[newStatus]}`,
      });
    } catch (error) {
      console.error('Error updating return status:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'รอดำเนินการ';
      case 'approved':
        return 'อนุมัติ';
      case 'rejected':
        return 'ปฏิเสธ';
      case 'completed':
        return 'เสร็จสิ้น';
      default:
        return 'ไม่ทราบสถานะ';
    }
  };

  const filteredReturns = returns.filter(returnItem => {
    const matchesSearch = returnItem.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.returnNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || returnItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">จัดการการรับคืนสินค้า</h1>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">กำลังโหลดข้อมูลการรับคืน...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการการรับคืนสินค้า</h1>
          <p className="text-gray-600">บันทึกและติดตามการรับคืนสินค้าจากลูกค้า - {currentBranch?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RotateCcw className="w-4 h-4" />
            <span>การรับคืนทั้งหมด: {filteredReturns.length} รายการ</span>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            บันทึกการรับคืน
          </Button>
        </div>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">บันทึกการรับคืนใหม่</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อลูกค้า *
              </label>
              <input
                type="text"
                value={returnForm.customerName}
                onChange={(e) => setReturnForm(prev => ({ ...prev, customerName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ชื่อลูกค้า"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สินค้า *
              </label>
              <input
                type="text"
                value={returnForm.productName}
                onChange={(e) => setReturnForm(prev => ({ ...prev, productName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ชื่อสินค้า"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                จำนวน
              </label>
              <input
                type="number"
                value={returnForm.quantity}
                onChange={(e) => setReturnForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                จำนวนเงินคืน
              </label>
              <input
                type="number"
                value={returnForm.refundAmount}
                onChange={(e) => setReturnForm(prev => ({ ...prev, refundAmount: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                สภาพสินค้า
              </label>
              <select
                value={returnForm.condition}
                onChange={(e) => setReturnForm(prev => ({ ...prev, condition: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="good">ดี</option>
                <option value="fair">ปานกลาง</option>
                <option value="poor">เสียหาย</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่รับคืน
              </label>
              <input
                type="date"
                value={returnForm.returnDate}
                onChange={(e) => setReturnForm(prev => ({ ...prev, returnDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เหตุผลการรับคืน *
              </label>
              <textarea
                value={returnForm.reason}
                onChange={(e) => setReturnForm(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ระบุเหตุผลการรับคืน"
                rows="3"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หมายเหตุ
              </label>
              <textarea
                value={returnForm.notes}
                onChange={(e) => setReturnForm(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="หมายเหตุเพิ่มเติม"
                rows="2"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
              >
                ยกเลิก
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                บันทึกการรับคืน
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาลูกค้า, สินค้า, หรือเลขที่รับคืน..."
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
            <option value="pending">รอดำเนินการ</option>
            <option value="approved">อนุมัติ</option>
            <option value="rejected">ปฏิเสธ</option>
            <option value="completed">เสร็จสิ้น</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">รายการการรับคืนทั้งหมด</h2>
        </div>
        
        <div className="p-6">
          {filteredReturns.length === 0 ? (
            <div className="text-center py-12">
              <RotateCcw className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีการรับคืน</h3>
              <p className="text-gray-500 mb-4">ยังไม่มีการรับคืนสินค้าในระบบ</p>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                บันทึกการรับคืน
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredReturns.map((returnItem, index) => (
                <motion.div
                  key={returnItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{returnItem.customerName}</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {returnItem.returnNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {returnItem.productName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(returnItem.returnDate).toLocaleDateString('th-TH')}
                        </span>
                        {returnItem.refundAmount > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            ฿{returnItem.refundAmount.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {returnItem.reason && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>เหตุผล:</strong> {returnItem.reason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(returnItem.status)}`}>
                        {getStatusText(returnItem.status)}
                      </div>
                      {returnItem.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateReturnStatus(returnItem.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            อนุมัติ
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateReturnStatus(returnItem.id, 'rejected')}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            ปฏิเสธ
                          </Button>
                        </div>
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

export default ReturnsPage;