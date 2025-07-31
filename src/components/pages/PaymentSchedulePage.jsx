import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Package, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { paymentScheduleService } from '@/services/paymentScheduleService';

const PaymentSchedulePage = ({ customer, onBack, customerData }) => {
  const [paymentDate, setPaymentDate] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [employee, setEmployee] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('ปกติ');
  const [discountStatus, setDiscountStatus] = useState('ไม่มีส่วนลด');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [installments, setInstallments] = useState([]);
  const [customerInstallment, setCustomerInstallment] = useState(null);

  // Use customer data from props or fallback to mock data
  const customerInfo = customerData || customer || {
    id: 'F0002',
    name: 'สมาน แก้วอุ่นเรือน',
    nickname: 'สมาน',
    phone: '0870379475',
    address: '43/5 ม.8 ต.บางสะพาน อ.บางสะพานน้อย จ.ประจวบคีรีขันธ์',
    guarantorName: 'ปรีชา มณีโชติ',
    guarantorNickname: '',
    guarantorPhone: '',
    guarantorAddress: '43/5 ม.8 ต.บางสะพาน อ.บางสะพานน้อย จ.ประจวบคีรีขันธ์',
    productType: 'ที่นอน 5 ฟุต ยางอัดผ้านอก',
    totalPrice: 12840.00,
    model: '',
    serialNumber: '',
    downPayment: 1500,
    installmentAmount: 756,
    months: 15,
    collectionDate: '04-05-2564',
    salesperson: 'อุดมศักดิ์ ประถมทอง',
    line: '4',
    inspector: 'อนุชิต',
    status: 'completed'
  };

  // Load customer installment data
  useEffect(() => {
    if (customerInfo.id) {
      loadCustomerData();
    }
  }, [customerInfo.id]);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading customer data for ID:', customerInfo.id);
      
      // ดึงข้อมูลสัญญาของลูกค้า
      console.log('🔍 Calling getCustomerInstallment...');
      const installmentResponse = await paymentScheduleService.getCustomerInstallment(customerInfo.id);
      console.log('✅ Installment response:', installmentResponse);
      
      if (installmentResponse.data?.success && installmentResponse.data.data.length > 0) {
        const installment = installmentResponse.data.data[0];
        console.log('✅ Found installment:', installment);
        setCustomerInstallment(installment);
        
        // ดึงรายการชำระเงิน
        console.log('🔍 Calling getInstallmentPayments for installment ID:', installment.id);
        const paymentsResponse = await paymentScheduleService.getInstallmentPayments(installment.id);
        console.log('✅ Payments response:', paymentsResponse);
        
        if (paymentsResponse.data?.success) {
          setInstallments(paymentsResponse.data.data || []);
        }
      } else {
        console.log('⚠️ No installment found for customer:', customerInfo.id);
        // Set empty installments if no data found
        setInstallments([]);
      }
    } catch (error) {
      console.error('❌ Error loading customer data:', error);
      console.error('❌ Error details:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      toast({
        title: "เกิดข้อผิดพลาด",
        description: `ไม่สามารถโหลดข้อมูลลูกค้าได้: ${error.message}`,
        variant: "destructive"
      });
      
      // Set empty installments on error
      setInstallments([]);
    } finally {
      setLoading(false);
    }
  };

  // Map API data to expected format
  const mappedCustomerInfo = customerInstallment ? {
    id: customerInstallment.customerId || customerInfo.id || customerInfo.code || 'N/A',
    name: customerInstallment.customerFullName || customerInfo.full_name || customerInfo.name || 'N/A',
    nickname: customerInstallment.customerNickname || customerInfo.nickname || 'N/A',
    phone: customerInstallment.customerPhone1 || customerInfo.phone1 || customerInfo.phone || 'N/A',
    address: customerInstallment.customerAddress || customerInfo.address || 'N/A',
    guarantorName: customerInstallment.guarantorName || customerInfo.guarantor_name || 'N/A',
    guarantorNickname: customerInstallment.guarantorNickname || customerInfo.guarantor_nickname || 'N/A',
    guarantorPhone: customerInstallment.guarantorPhone1 || customerInfo.guarantor_phone || 'N/A',
    guarantorAddress: customerInstallment.guarantorAddress || customerInfo.guarantor_address || 'N/A',
    productType: customerInstallment.productName || customerInfo.product_type || customerInfo.product_name || 'N/A',
    totalPrice: customerInstallment.totalAmount ? parseFloat(customerInstallment.totalAmount) : 0,
    model: customerInstallment.productModel || customerInfo.model || 'N/A',
    serialNumber: customerInstallment.productSerialNumber || customerInfo.serial_number || 'N/A',
    downPayment: customerInstallment.downPayment ? parseFloat(customerInstallment.downPayment) : 0,
    installmentAmount: customerInstallment.installmentAmount ? parseFloat(customerInstallment.installmentAmount) : 0,
    months: customerInstallment.months || 0,
    collectionDate: customerInstallment.collectionDate || 'N/A',
    salesperson: customerInstallment.salespersonFullName || customerInfo.salesperson || 'N/A',
    line: customerInstallment.line || customerInfo.line || 'N/A',
    inspector: customerInstallment.inspectorFullName || customerInfo.inspector || 'N/A',
    status: customerInstallment.status || customerInfo.status || 'active',
    contractNumber: customerInstallment.contractNumber || 'N/A' // Add contractNumber
  } : {
    id: customerInfo.id || customerInfo.code || 'N/A',
    name: customerInfo.full_name || customerInfo.name || 'N/A',
    nickname: customerInfo.nickname || 'N/A',
    phone: customerInfo.phone1 || customerInfo.phone || 'N/A',
    address: customerInfo.address || 'N/A',
    guarantorName: customerInfo.guarantor_name || 'N/A',
    guarantorNickname: customerInfo.guarantor_nickname || 'N/A',
    guarantorPhone: customerInfo.guarantor_phone || 'N/A',
    guarantorAddress: customerInfo.guarantor_address || 'N/A',
    productType: customerInfo.product_type || customerInfo.product_name || 'N/A',
    totalPrice: customerInfo.total_contracts_amount ? parseFloat(customerInfo.total_contracts_amount) : 0,
    model: customerInfo.model || 'N/A',
    serialNumber: customerInfo.serial_number || 'N/A',
    downPayment: customerInfo.down_payment ? parseFloat(customerInfo.down_payment) : 0,
    installmentAmount: customerInfo.installment_amount ? parseFloat(customerInfo.installment_amount) : 0,
    months: customerInfo.months || 0,
    collectionDate: customerInfo.collection_date || 'N/A',
    salesperson: customerInfo.salesperson || 'N/A',
    line: customerInfo.line || 'N/A',
    inspector: customerInfo.inspector || 'N/A',
    status: customerInfo.status || 'active',
    contractNumber: customerInfo.contract_number || 'N/A' // Add contractNumber
  };

  // Calculate totals and progress
  const totalPaid = installments
    .filter(item => item.status === 'paid' && !item.notes?.includes('เงินดาวน์') && !item.notes?.includes('งวดแรก'))
    .reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  // เงินดาวน์จากสัญญา (รวมเสมอ)
  const downPaymentAmount = parseFloat(mappedCustomerInfo.downPayment || 0);
  const totalPaidWithDownPayment = totalPaid + downPaymentAmount;
  
  const remainingAmount = Math.max(0, mappedCustomerInfo.totalPrice - totalPaidWithDownPayment);
  const progressPercentage = (totalPaidWithDownPayment / mappedCustomerInfo.totalPrice) * 100;

  // Debug logs
  console.log('🔍 Payment calculation debug:');
  console.log('📊 Total paid from API:', totalPaid);
  console.log('💰 Down payment from contract:', downPaymentAmount);
  console.log('💵 Total paid with down payment:', totalPaidWithDownPayment);
  console.log('📈 Progress percentage:', progressPercentage);
  console.log('📋 Installments from API:', installments);
  console.log('🔍 Customer installment data:', customerInstallment);
  console.log('🔍 Customer info data:', customerInfo);
  console.log('🔍 Mapped customer info:', mappedCustomerInfo);
  console.log('🏠 Guarantor address from API:', customerInstallment?.guarantorAddress);
  console.log('🏠 Guarantor address from customer info:', customerInfo?.guarantor_address);
  console.log('📅 Contract date from API:', customerInstallment?.contract_date);
  console.log('📅 Created date from API:', customerInstallment?.createdAt);
  console.log('📅 Collection date from customer info:', mappedCustomerInfo.collectionDate);

  // ฟังก์ชันแยกข้อมูลจาก notes
  const parsePaymentNotes = (notes) => {
    if (!notes) return { receiptNumber: '-', status: '-', discount: '-' };
    
    const receiptMatch = notes.match(/ใบเสร็จ:\s*([^,]+)/);
    const statusMatch = notes.match(/สถานะ:\s*([^,]+)/);
    const discountMatch = notes.match(/ส่วนลด:\s*([^,]+)/);
    
    // แปลงส่วนลดให้เป็น "มี" หรือ "ไม่มี"
    let discountText = discountMatch ? discountMatch[1].trim() : '-';
    if (discountText === 'ไม่มีส่วนลด') {
      discountText = 'ไม่มี';
    } else if (discountText === 'มีส่วนลด') {
      discountText = 'มี';
    }
    
    return {
      receiptNumber: receiptMatch ? receiptMatch[1].trim() : '-',
      status: statusMatch ? statusMatch[1].trim() : '-',
      discount: discountText
    };
  };

  // ฟังก์ชันแปลงวันที่ให้ถูกต้อง
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      // ถ้าเป็นวันที่ในรูปแบบ ISO string
      if (dateString.includes('T')) {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH');
      }
      
      // ถ้าเป็นวันที่ในรูปแบบอื่น
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '-';
      }
      return date.toLocaleDateString('th-TH');
    } catch (error) {
      console.error('❌ Error formatting date:', dateString, error);
      return '-';
    }
  };

  // สร้างรายการงวดที่ชำระแล้ว
  const paidInstallments = [
    // เงินดาวน์/งวดแรก (แสดงเสมอ) - ใช้ข้อมูลจาก API
    {
      id: 'down-payment',
      notes: 'เงินดาวน์/งวดแรก',
      paymentDate: customerInstallment?.contract_date || customerInstallment?.createdAt || mappedCustomerInfo.collectionDate,
      dueDate: customerInstallment?.contract_date || customerInstallment?.createdAt || mappedCustomerInfo.collectionDate,
      amount: parseFloat(mappedCustomerInfo.downPayment || 0),
      status: 'paid',
      isDownPayment: true
    },
    // งวดที่ชำระแล้วจาก API (งวดที่ 2, 3, 4, ...) - ไม่รวมงวดแรกที่ซ้ำ
    ...installments
      .filter(item => item.status === 'paid' && !item.notes?.includes('เงินดาวน์') && !item.notes?.includes('งวดแรก'))
      .map((item, index) => ({
        ...item,
        notes: item.notes || `งวดที่ ${index + 2}`, // เริ่มจากงวดที่ 2
        isDownPayment: false
      }))
  ];

  // Debug log สำหรับวันที่เงินดาวน์
  console.log('📅 Down payment date debug:');
  console.log('📅 Contract date:', customerInstallment?.contract_date);
  console.log('📅 Created date:', customerInstallment?.createdAt);
  console.log('📅 Collection date:', mappedCustomerInfo.collectionDate);
  console.log('📅 Final payment date:', paidInstallments[0]?.paymentDate);
  console.log('📅 Formatted date:', formatDate(paidInstallments[0]?.paymentDate));

  // คำนวณยอดคงเหลือตามลำดับการชำระ
  const calculateRemainingBalance = (index) => {
    const paidUpToIndex = paidInstallments.slice(0, index + 1);
    const totalPaidUpToIndex = paidUpToIndex.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    return Math.max(0, mappedCustomerInfo.totalPrice - totalPaidUpToIndex);
  };

  // งวดที่รอชำระ (ไม่รวมเงินดาวน์)
  const pendingInstallments = installments
    .filter(item => item.status === 'pending' && !item.notes?.includes('เงินดาวน์') && !item.notes?.includes('งวดแรก'))
    .map((item, index) => ({
      ...item,
      notes: item.notes || `งวดที่ ${index + 2}`, // เริ่มจากงวดที่ 2
      isDownPayment: false
    }));

  const handleSavePayment = async () => {
    if (!paymentDate || !receiptNumber || !amount) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบ',
        text: 'วันที่, เลขที่ใบเสร็จ และจำนวนเงินเป็นข้อมูลที่จำเป็น',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    if (!customerInstallment) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่พบข้อมูลสัญญา',
        text: 'ไม่สามารถบันทึกการชำระเงินได้',
        confirmButtonColor: '#EF4444'
      });
      return;
    }

    setSubmitting(true);
    
    try {
      // หางวดที่ตรงกับจำนวนเงินที่ชำระ
      const matchingInstallment = installments.find(item => 
        parseFloat(item.amount) === parseFloat(amount) && item.status === 'pending'
      );

      if (matchingInstallment) {
        // อัปเดต payment status ของงวดที่มีอยู่
        const updateData = {
          amount: parseFloat(amount),
          payment_date: paymentDate,
          status: 'paid',
          notes: `ใบเสร็จ: ${receiptNumber}, สถานะ: ${paymentStatus}, ส่วนลด: ${discountStatus}`
        };

        console.log('🔍 Updating existing payment:', {
          installmentId: customerInstallment.id,
          paymentId: matchingInstallment.id,
          updateData,
          paymentDate: paymentDate,
          paymentDateType: typeof paymentDate
        });

        await paymentScheduleService.updatePayment(customerInstallment.id, matchingInstallment.id, updateData);
      } else {
        // สร้างการชำระเงินใหม่
        const paymentData = {
          amount: parseFloat(amount),
          payment_date: paymentDate,
          due_date: paymentDate,
          status: 'paid',
          notes: `ใบเสร็จ: ${receiptNumber}, สถานะ: ${paymentStatus}, ส่วนลด: ${discountStatus}`
        };

        await paymentScheduleService.createPayment(customerInstallment.id, paymentData);
      }
      
      // Reload payments data
      await loadCustomerData();
      
      // Reset form
      setPaymentDate('');
      setReceiptNumber('');
      setAmount('');
      setEmployee('');
      setPaymentStatus('ปกติ');
      setDiscountStatus('ไม่มีส่วนลด');
      
      Swal.fire({
        icon: 'success',
        title: 'บันทึกการชำระเงินสำเร็จ!',
        text: `บันทึกการชำระเงิน ฿${parseFloat(amount).toLocaleString()} เรียบร้อยแล้ว`,
        confirmButtonColor: '#10B981'
      });
    } catch (error) {
      console.error('Error saving payment:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกการชำระเงินได้',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณต้องการลบรายการชำระเงินนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed && customerInstallment) {
      try {
        await paymentScheduleService.deletePayment(customerInstallment.id, paymentId);
        
        // Reload payments data
        await loadCustomerData();
        
        toast({
          title: "ลบรายการชำระเงินสำเร็จ",
          description: "รายการชำระเงินถูกลบออกจากระบบแล้ว",
        });
      } catch (error) {
        console.error('Error deleting payment:', error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถลบรายการชำระเงินได้",
          variant: "destructive"
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { label: 'ชำระแล้ว', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { label: 'รอชำระ', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      overdue: { label: 'ค้างชำระ', className: 'bg-red-100 text-red-800', icon: AlertCircle },
      cancelled: { label: 'ยกเลิก', className: 'bg-gray-100 text-gray-800', icon: XCircle },
      active: { label: 'กำลังผ่อนชำระ', className: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      completed: { label: 'ผ่อนเสร็จ', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      normal: { label: 'ปกติ', className: 'bg-gray-100 text-gray-800', icon: CheckCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${config.className}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="bg-white hover:bg-gray-50 border-gray-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  กลับ
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">ตารางผ่อนชำระ</h1>
                  <p className="text-gray-600 mt-1">จัดการการชำระเงินของลูกค้า</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {getStatusBadge(mappedCustomerInfo.status)}
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            {/* 1. Customer Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    ข้อมูลลูกค้า
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Customer Details */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{mappedCustomerInfo.name}</p>
                          <p className="text-sm text-gray-500">เลขที่สัญญา: {mappedCustomerInfo.contractNumber}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">ชื่อเล่น: {mappedCustomerInfo.nickname}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{mappedCustomerInfo.phone}</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-sm text-gray-600">{mappedCustomerInfo.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Guarantor Details */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Users className="w-4 h-4 mr-2 text-purple-600" />
                        ข้อมูลผู้ค้ำประกัน
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{mappedCustomerInfo.guarantorName}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">ชื่อเล่น: {mappedCustomerInfo.guarantorNickname || '-'}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{mappedCustomerInfo.guarantorPhone || '-'}</span>
                        </div>
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-sm text-gray-600">{mappedCustomerInfo.guarantorAddress || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-green-600" />
                        รายละเอียดสัญญา
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{mappedCustomerInfo.productType}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">ราคารวม: ฿{mappedCustomerInfo.totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">ดาวน์: ฿{mappedCustomerInfo.downPayment.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">ผ่อน: ฿{mappedCustomerInfo.installmentAmount.toLocaleString()} x {mappedCustomerInfo.months} เดือน</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. Payment Input Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    บันทึกการชำระเงิน
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">วันที่ชำระ</label>
                      <input
                        type="date"
                        placeholder="เลือกวันที่"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">เลขที่ใบเสร็จ</label>
                      <input
                        type="text"
                        placeholder="เลขที่ใบเสร็จ"
                        value={receiptNumber}
                        onChange={(e) => setReceiptNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนเงิน</label>
                      <input
                        type="number"
                        placeholder="จำนวนเงิน"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleSavePayment}
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-200"
                      >
                        {submitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            บันทึก...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Plus className="w-4 h-4 mr-2" />
                            บันทึก
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Payment Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">สถานะ :</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="paymentStatus"
                              value="รับคืนสินค้า"
                              checked={paymentStatus === 'รับคืนสินค้า'}
                              onChange={(e) => setPaymentStatus(e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">รับคืนสินค้า</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="paymentStatus"
                              value="เร่งรัด"
                              checked={paymentStatus === 'เร่งรัด'}
                              onChange={(e) => setPaymentStatus(e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">เร่งรัด</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="paymentStatus"
                              value="ปกติ"
                              checked={paymentStatus === 'ปกติ'}
                              onChange={(e) => setPaymentStatus(e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">ปกติ</span>
                          </label>
                        </div>
                      </div>

                      {/* Discount Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">สถานะ :</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="discountStatus"
                              value="ไม่มีส่วนลด"
                              checked={discountStatus === 'ไม่มีส่วนลด'}
                              onChange={(e) => setDiscountStatus(e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">ไม่มีส่วนลด</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="discountStatus"
                              value="ส่วนลด"
                              checked={discountStatus === 'ส่วนลด'}
                              onChange={(e) => setDiscountStatus(e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">ส่วนลด</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3. Installments Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    รายการผ่อนชำระ (งวดที่ชำระแล้ว)
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          งวด
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          วันที่
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          เลขที่ใบเสร็จ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          จำนวนเงิน
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ยอดคงเหลือ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          สถานะ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ส่วนลด
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          การดำเนินการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paidInstallments.length > 0 ? (
                        paidInstallments.map((item, index) => {
                          const { receiptNumber, status, discount } = parsePaymentNotes(item.notes);
                          
                          // กำหนดชื่องวด
                          let installmentName = '';
                          if (item.isDownPayment) {
                            installmentName = 'เงินดาวน์/งวดแรก';
                          } else {
                            // งวดที่ชำระแล้ว (ไม่รวมเงินดาวน์) เริ่มจากงวดที่ 2
                            installmentName = `งวดที่ ${index + 1}`;
                          }
                          
                          return (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-900">
                                  {installmentName}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                  {formatDate(item.paymentDate)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                  {receiptNumber}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-green-600">
                                  ฿{parseFloat(item.amount || 0).toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                  ฿{calculateRemainingBalance(index).toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  status === 'ปกติ' ? 'bg-gray-100 text-gray-800' :
                                  status === 'เร่งรัด' ? 'bg-yellow-100 text-yellow-800' :
                                  status === 'รับคืนสินค้า' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  discount === 'มี' ? 'bg-purple-100 text-purple-800' :
                                  discount === 'ไม่มี' ? 'bg-gray-100 text-gray-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {discount}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  {!item.isDownPayment && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeletePayment(item.id)}
                                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <FileText className="w-8 h-8 mb-2 text-gray-400" />
                              <p>ไม่พบรายการผ่อนชำระ</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* 4. Pending Installments Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    งวดที่รอชำระ ({pendingInstallments.length} งวด)
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          งวด
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          วันครบกำหนด
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          จำนวนเงิน
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          สถานะ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          การดำเนินการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingInstallments.length > 0 ? (
                        pendingInstallments
                          .map((item, index) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">
                                {item.notes}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">
                                {formatDate(item.dueDate)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-orange-600">
                                ฿{parseFloat(item.amount || 0).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(item.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
                                  onClick={() => {
                                    // Auto-fill payment form with this installment
                                    setAmount(item.amount);
                                    setPaymentDate(new Date().toISOString().split('T')[0]);
                                    setReceiptNumber('');
                                  }}
                                >
                                  <Plus className="w-3 h-3" />
                                  ชำระ
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <CheckCircle className="w-8 h-8 mb-2 text-green-400" />
                              <p>ไม่มีงวดที่รอชำระ</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* 5. Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    ความคืบหน้าการชำระเงิน
                  </h3>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">฿{totalPaidWithDownPayment.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">ชำระแล้วจาก ฿{mappedCustomerInfo.totalPrice.toLocaleString()}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>0%</span>
                  <span>{Math.round(progressPercentage)}%</span>
                  <span>100%</span>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">ยอดคงเหลือ:</span>
                    <span className="text-lg font-bold text-blue-900">฿{remainingAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentSchedulePage; 