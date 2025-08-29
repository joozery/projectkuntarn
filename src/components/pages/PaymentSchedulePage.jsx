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
  Loader2,
  Printer
} from 'lucide-react';
import Swal from 'sweetalert2';
import { paymentScheduleService } from '@/services/paymentScheduleService';
import api from '@/lib/api';

const PaymentSchedulePage = ({ customer, onBack, customerData }) => {
  const [paymentDate, setPaymentDate] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [employee, setEmployee] = useState('');
  const [collectorId, setCollectorId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('ปกติ');
  const [discountStatus, setDiscountStatus] = useState('ไม่มีส่วนลด');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [installments, setInstallments] = useState([]);
  const [customerInstallment, setCustomerInstallment] = useState(null);
  const [collectors, setCollectors] = useState([]);
  const [loadingCollectors, setLoadingCollectors] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editForm, setEditForm] = useState({
    paymentDate: '',
    receiptNumber: '',
    amount: '',
    status: 'ปกติ',
    discount: 'ไม่มีส่วนลด',
    notes: ''
  });

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

  // โหลดข้อมูลพนักงานเก็บเงิน
  const loadCollectors = async () => {
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
  };

  // Load customer installment data
  useEffect(() => {
    if (customerInfo.id) {
      loadCustomerData();
      loadCollectors();
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

  // Helper: build a full address string from individual parts
  const buildAddress = (
    baseAddress,
    moo,
    road,
    subdistrict,
    district,
    province
  ) => {
    const parts = [
      (baseAddress || '').toString().trim(),
      moo ? `หมู่ ${moo}` : '',
      road ? `ถ.${road}` : '',
      subdistrict ? `ต.${subdistrict}` : '',
      district ? `อ.${district}` : '',
      province ? `จ.${province}` : ''
    ].filter(Boolean);
    const full = parts.join(' ').trim();
    return full || 'N/A';
  };

  // Map API data to expected format
  const mappedCustomerInfo = customerInstallment ? {
    id: customerInstallment.customerId || customerInfo.id || customerInfo.code || 'N/A',
    name: customerInstallment.customerFullName || customerInfo.full_name || customerInfo.name || 'N/A',
    nickname: customerInstallment.customerNickname || customerInfo.nickname || 'N/A',
    phone: customerInstallment.customerPhone1 || customerInfo.phone1 || customerInfo.phone || 'N/A',
    address: buildAddress(
      customerInstallment.customerAddress || customerInfo.address,
      customerInstallment.customerMoo || customerInfo.customer_moo,
      customerInstallment.customerRoad || customerInfo.customer_road,
      customerInstallment.customerSubdistrict || customerInfo.customer_subdistrict,
      customerInstallment.customerDistrict || customerInfo.customer_district,
      customerInstallment.customerProvince || customerInfo.customer_province
    ),
    guarantorName: customerInstallment.guarantorName || customerInfo.guarantor_name || 'N/A',
    guarantorNickname: customerInstallment.guarantorNickname || customerInfo.guarantor_nickname || 'N/A',
    guarantorPhone: customerInstallment.guarantorPhone1 || customerInfo.guarantor_phone || 'N/A',
    guarantorAddress: buildAddress(
      customerInstallment.guarantorAddress || customerInfo.guarantor_address,
      customerInstallment.guarantorMoo || customerInfo.guarantor_moo,
      customerInstallment.guarantorRoad || customerInfo.guarantor_road,
      customerInstallment.guarantorSubdistrict || customerInfo.guarantor_subdistrict,
      customerInstallment.guarantorDistrict || customerInfo.guarantor_district,
      customerInstallment.guarantorProvince || customerInfo.guarantor_province
    ),
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
    address: buildAddress(
      customerInfo.address,
      customerInfo.customer_moo,
      customerInfo.customer_road,
      customerInfo.customer_subdistrict,
      customerInfo.customer_district,
      customerInfo.customer_province
    ),
    guarantorName: customerInfo.guarantor_name || 'N/A',
    guarantorNickname: customerInfo.guarantor_nickname || 'N/A',
    guarantorPhone: customerInfo.guarantor_phone || 'N/A',
    guarantorAddress: buildAddress(
      customerInfo.guarantor_address,
      customerInfo.guarantor_moo,
      customerInfo.guarantor_road,
      customerInfo.guarantor_subdistrict,
      customerInfo.guarantor_district,
      customerInfo.guarantor_province
    ),
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

  // ฟังก์ชันสำหรับเงินดาวน์: ดึงเลขที่ใบเสร็จจากแถว payments ที่เป็นเงินดาวน์/งวดแรก
  const getDownPaymentInfo = () => {
    try {
      const downPaymentRow = (installments || []).find(p =>
        (p.notes || '').includes('เงินดาวน์') || (p.notes || '').includes('งวดแรก')
      );
      if (downPaymentRow) {
        const fromNotes = (downPaymentRow.notes || '').includes('ใบเสร็จ:')
          ? downPaymentRow.notes.split('ใบเสร็จ:')[1]?.split(',')[0]?.trim()
          : '';
        return {
          receiptNumber: downPaymentRow.receiptNumber || fromNotes || '-',
          status: 'ปกติ',
          discount: 'ไม่มี'
        };
      }
    } catch (e) {
      console.warn('Down payment info parse error:', e);
    }
    return { receiptNumber: '-', status: 'ปกติ', discount: 'ไม่มี' };
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
  const downInfo = getDownPaymentInfo();
  const paidInstallments = [
    // เงินดาวน์/งวดแรก (แสดงเสมอ) - แนบเลขที่ใบเสร็จถ้ามี
    ...(parseFloat(mappedCustomerInfo.downPayment || 0) > 0 ? [{
      id: 'down-payment',
      notes: `ใบเสร็จ: ${downInfo.receiptNumber || '-'}, สถานะ: ปกติ, ส่วนลด: ไม่มี`,
      paymentDate: customerInstallment?.contract_date || customerInstallment?.createdAt || mappedCustomerInfo.collectionDate,
      dueDate: customerInstallment?.contract_date || customerInstallment?.createdAt || mappedCustomerInfo.collectionDate,
      amount: parseFloat(mappedCustomerInfo.downPayment || 0),
      status: 'paid',
      isDownPayment: true
    }] : []),
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
          notes: `ใบเสร็จ: ${receiptNumber}, สถานะ: ${paymentStatus}, ส่วนลด: ${discountStatus}`,
          collector_id: collectorId || null
        };

        console.log('🔍 Updating existing payment:', {
          installmentId: customerInstallment.id,
          paymentId: matchingInstallment.id,
          updateData,
          paymentDate: paymentDate,
          paymentDateType: typeof paymentDate,
          collectorId: collectorId
        });

        await paymentScheduleService.updatePayment(customerInstallment.id, matchingInstallment.id, updateData);
      } else {
        // สร้างการชำระเงินใหม่
        const paymentData = {
          amount: parseFloat(amount),
          payment_date: paymentDate,
          due_date: paymentDate,
          status: 'paid',
          notes: `ใบเสร็จ: ${receiptNumber}, สถานะ: ${paymentStatus}, ส่วนลด: ${discountStatus}`,
          collector_id: collectorId || null
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
      setCollectorId('');
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

  const handleEditPayment = async (paymentId) => {
    try {
      // ตรวจสอบว่าเป็นเงินดาวน์หรือไม่
      if (paymentId === 'down-payment') {
        // สำหรับเงินดาวน์ ให้อัปเดตข้อมูลในสัญญาแทน
        const updateData = {
          amount: parseFloat(editForm.amount),
          paymentDate: editForm.paymentDate,
          receiptNumber: editForm.receiptNumber,
          status: editForm.status,
          discount: editForm.discount
        };

        console.log('🔍 Updating down payment:', {
          installmentId: customerInstallment.id,
          updateData
        });

        await paymentScheduleService.updateDownPayment(customerInstallment.id, updateData);
      } else {
        // สำหรับงวดอื่นๆ ให้อัปเดต payment ปกติ
        const updateData = {
          amount: parseFloat(editForm.amount),
          payment_date: editForm.paymentDate,
          status: 'paid',
          notes: `ใบเสร็จ: ${editForm.receiptNumber}, สถานะ: ${editForm.status}, ส่วนลด: ${editForm.discount}`,
          receipt_number: editForm.receiptNumber
        };

        console.log('🔍 Updating payment:', {
          installmentId: customerInstallment.id,
          paymentId,
          updateData
        });

        await paymentScheduleService.updatePayment(customerInstallment.id, paymentId, updateData);
      }
      
      // Reload payments data
      await loadCustomerData();
      
      // Reset edit form
      setEditingPayment(null);
      setEditForm({
        paymentDate: '',
        receiptNumber: '',
        amount: '',
        status: 'ปกติ',
        discount: 'ไม่มีส่วนลด',
        notes: ''
      });
      
      toast({
        title: "แก้ไขสำเร็จ",
        description: "แก้ไขรายการชำระเงินเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขรายการชำระเงินได้",
        variant: "destructive"
      });
    }
  };

  const handleEditClick = (payment) => {
    setEditingPayment(payment.id);
    
    // Parse existing payment data
    const { receiptNumber, status, discount } = payment.isDownPayment 
      ? getDownPaymentInfo() 
      : parsePaymentNotes(payment.notes);
    
    setEditForm({
      paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : '',
      receiptNumber: receiptNumber !== '-' ? receiptNumber : '',
      amount: payment.amount || '',
      status: status !== '-' ? status : 'ปกติ',
      discount: discount !== '-' ? (discount === 'มี' ? 'ส่วนลด' : 'ไม่มีส่วนลด') : 'ไม่มีส่วนลด',
      notes: payment.notes || ''
    });

    // แจ้งเตือนเมื่อแก้ไขเงินดาวน์
    if (payment.id === 'down-payment') {
      toast({
        title: "แก้ไขเงินดาวน์",
        description: "การแก้ไขเงินดาวน์จะอัปเดตข้อมูลในสัญญา",
      });
    }
  };

  // ฟังก์ชันปริ้นเอกสาร
  const handlePrintDocument = () => {
    // สร้างเนื้อหาสำหรับปริ้น
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ตารางผ่อนชำระ - ${mappedCustomerInfo.name}</title>
        <style>
          body {
            font-family: 'Sarabun', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 14px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .header p {
            margin: 5px 0;
            font-size: 16px;
          }
          .customer-info {
            margin-bottom: 30px;
          }
          .customer-info h2 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          .info-section {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
          }
          .info-section h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #555;
          }
          .info-item {
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            color: #333;
          }
          .contract-details {
            margin-bottom: 30px;
          }
          .contract-details h2 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .payment-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .payment-table th,
          .payment-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          .payment-table th {
            background-color: #f5f5f5;
            font-weight: bold;
            color: #333;
          }
          .payment-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .summary {
            margin-top: 30px;
            padding: 20px;
            background: #f0f8ff;
            border-radius: 5px;
          }
          .summary h2 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #333;
          }
          .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .summary-label {
            font-weight: bold;
            color: #333;
          }
          .summary-value {
            color: #555;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ตารางผ่อนชำระ</h1>
          <p>บริษัท กุนทาร จำกัด</p>
          <p>วันที่พิมพ์: ${new Date().toLocaleDateString('th-TH')}</p>
        </div>

        <div class="customer-info">
          <h2>ข้อมูลลูกค้า</h2>
          <div class="info-grid">
            <div class="info-section">
              <h3>ข้อมูลลูกค้า</h3>
              <div class="info-item">
                <span class="info-label">ชื่อ-สกุล:</span> ${mappedCustomerInfo.name}
              </div>
              <div class="info-item">
                <span class="info-label">ชื่อเล่น:</span> ${mappedCustomerInfo.nickname}
              </div>
              <div class="info-item">
                <span class="info-label">เบอร์โทร:</span> ${mappedCustomerInfo.phone}
              </div>
              <div class="info-item">
                <span class="info-label">ที่อยู่:</span> ${mappedCustomerInfo.address}
              </div>
            </div>
            <div class="info-section">
              <h3>ข้อมูลผู้ค้ำประกัน</h3>
              <div class="info-item">
                <span class="info-label">ชื่อ-สกุล:</span> ${mappedCustomerInfo.guarantorName}
              </div>
              <div class="info-item">
                <span class="info-label">ชื่อเล่น:</span> ${mappedCustomerInfo.guarantorNickname || '-'}
              </div>
              <div class="info-item">
                <span class="info-label">เบอร์โทร:</span> ${mappedCustomerInfo.guarantorPhone || '-'}
              </div>
              <div class="info-item">
                <span class="info-label">ที่อยู่:</span> ${mappedCustomerInfo.guarantorAddress || '-'}
              </div>
            </div>
          </div>
        </div>

        <div class="contract-details">
          <h2>รายละเอียดสัญญา</h2>
          <div class="info-grid">
            <div class="info-section">
              <div class="info-item">
                <span class="info-label">เลขที่สัญญา:</span> ${mappedCustomerInfo.contractNumber || customerInstallment?.contractNumber || 'N/A'}
              </div>
              <div class="info-item">
                <span class="info-label">สินค้า:</span> ${mappedCustomerInfo.productType}
              </div>
              <div class="info-item">
                <span class="info-label">รุ่น:</span> ${mappedCustomerInfo.model || '-'}
              </div>
              <div class="info-item">
                <span class="info-label">S/N:</span> ${mappedCustomerInfo.serialNumber || '-'}
              </div>
              <div class="info-item">
                <span class="info-label">ราคารวม:</span> ฿${mappedCustomerInfo.totalPrice?.toLocaleString() || 'N/A'}
              </div>
              <div class="info-item">
                <span class="info-label">เงินดาวน์:</span> ฿${mappedCustomerInfo.downPayment?.toLocaleString() || 'N/A'}
              </div>
            </div>
            <div class="info-section">
              <div class="info-item">
                <span class="info-label">งวดต่อเดือน:</span> ฿${mappedCustomerInfo.installmentAmount?.toLocaleString() || 'N/A'}
              </div>
              <div class="info-item">
                <span class="info-label">จำนวนงวด:</span> ${mappedCustomerInfo.months || 'N/A'} งวด
              </div>
              <div class="info-item">
                <span class="info-label">วันที่เริ่ม:</span> ${formatDate(customerInstallment?.startDate) || 'N/A'}
              </div>
              <div class="info-item">
                <span class="info-label">วันที่ครบกำหนด:</span> ${formatDate(customerInstallment?.endDate) || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <h2>รายการชำระเงิน</h2>
        <table class="payment-table">
          <thead>
            <tr>
              <th>งวดที่</th>
              <th>วันที่ชำระ</th>
              <th>เลขที่ใบเสร็จ</th>
              <th>จำนวนเงิน</th>
              <th>ยอดคงเหลือ</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            ${paidInstallments.map((payment, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${formatDate(payment.paymentDate)}</td>
                <td>${payment.notes?.includes('ใบเสร็จ:') ? payment.notes.split('ใบเสร็จ:')[1]?.split(',')[0]?.trim() || '-' : '-'}</td>
                <td>฿${parseFloat(payment.amount || 0).toLocaleString()}</td>
                <td>฿${calculateRemainingBalance(index).toLocaleString()}</td>
                <td>ชำระแล้ว</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary">
          <h2>สรุปข้อมูล</h2>
          <div class="summary-item">
            <span class="summary-label">จำนวนงวดที่ชำระแล้ว:</span>
            <span class="summary-value">${paidInstallments.length} งวด</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">ยอดรวมที่ชำระแล้ว:</span>
            <span class="summary-value">฿${paidInstallments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0).toLocaleString()}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">ยอดคงเหลือ:</span>
            <span class="summary-value">฿${Math.max(0, mappedCustomerInfo.totalPrice - paidInstallments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0)).toLocaleString()}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">จำนวนงวดที่เหลือ:</span>
            <span class="summary-value">${Math.max(0, (mappedCustomerInfo.months || 0) - paidInstallments.length)} งวด</span>
          </div>
        </div>

        <div class="footer">
          <p>เอกสารนี้พิมพ์จากระบบจัดการการผ่อนชำระ</p>
          <p>วันที่พิมพ์: ${new Date().toLocaleDateString('th-TH', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </body>
      </html>
    `;

    // สร้างหน้าต่างใหม่สำหรับปริ้น
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // รอให้เนื้อหาโหลดเสร็จแล้วปริ้น
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  // ฟังก์ชันปริ้นแบบสลิปแนวยาว (80mm)
  const handlePrintSlip = () => {
    const formatTH = (d) => d ? new Date(d).toLocaleDateString('th-TH') : '';
    const paid = paidInstallments || [];
    const getRow = (idx) => {
      const p = paid[idx];
      const receipt = p?.notes?.includes('ใบเสร็จ:') ? p.notes.split('ใบเสร็จ:')[1]?.split(',')[0]?.trim() : '';
      const remaining = Math.max(0, (mappedCustomerInfo.totalPrice || 0) - paid.slice(0, idx + 1).reduce((s, x) => s + parseFloat(x.amount || 0), 0));
      return `
        <tr>
          <td>${idx + 1}</td>
          <td>${p ? formatTH(p.paymentDate) : ''}</td>
          <td>${p ? receipt : ''}</td>
          <td>${p ? Number(p.amount || 0).toLocaleString() : ''}</td>
          <td>${p ? Number(remaining).toLocaleString() : ''}</td>
        </tr>
      `;
    };
    const makeTable = (start) => Array.from({ length: 15 }).map((_, i) => getRow(start + i)).join('');

    const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>สลิปงวด: ${mappedCustomerInfo.contractNumber || ''}</title>
        <style>
          @page { size: 80mm auto; margin: 5mm; }
          body { font-family: 'Sarabun', system-ui, sans-serif; color: #111; display: flex; justify-content: center; }
          .sheet { width: 80mm; margin: 0 auto; }
          .header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px; }
          .brand { font-weight:800; font-size:14px; }
          .addr { font-size:10px; color:#333; }
          .row { display:flex; gap:4px; margin:2px 0; align-items:baseline; }
          .label { width:22mm; font-weight:600; font-size:11px; }
          .value { flex:1; font-size:11px; border-bottom:1px solid #999; padding-bottom:2px; }
          .box { border:1px solid #666; padding:4px; margin-top:6px; }
          .grid { display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-top:6px; }
          table { width:100%; border-collapse:collapse; }
          th, td { border:1px solid #999; font-size:10px; padding:3px; text-align:center; }
          th { background:#f6f6f6; }
        </style>
      </head>
      <body onload="window.print(); setTimeout(() => window.close(), 300);">
        <div class="sheet">
          <div class="header">
            <div>
              <div class="brand">เอฟซี เฟอร์นิเจอร์</div>
              <div class="addr">116 หมู่ 3 ต.ห้วงน้อย อ.เมือง จ.ประจวบคีรีขันธ์ 77000</div>
              <div class="addr">โทร. 092-2856965</div>
            </div>
            <div style="font-size:10px;">เลขที่: ${mappedCustomerInfo.contractNumber || '-'}</div>
          </div>

          <div class="box">
            <div class="row"><div class="label">ชื่อลูกค้า</div><div class="value">${mappedCustomerInfo.name} โทร ${mappedCustomerInfo.phone || ''}</div></div>
            <div class="row"><div class="label">ที่อยู่</div><div class="value">${mappedCustomerInfo.address || ''}</div></div>
            <div class="row"><div class="label">ผู้ค้ำ</div><div class="value">${mappedCustomerInfo.guarantorName || ''} โทร ${mappedCustomerInfo.guarantorPhone || ''}</div></div>
            <div class="row"><div class="label">ที่อยู่ผู้ค้ำ</div><div class="value">${mappedCustomerInfo.guarantorAddress || ''}</div></div>
          </div>

          <div class="box">
            <div class="row"><div class="label">ชนิดสินค้า</div><div class="value">${mappedCustomerInfo.productType || ''}</div></div>
            <div class="row"><div class="label">ราคารวม</div><div class="value">${Number(mappedCustomerInfo.totalPrice || 0).toLocaleString()}</div></div>
            <div class="row"><div class="label">ดาวน์</div><div class="value">${Number(mappedCustomerInfo.downPayment || 0).toLocaleString()}</div></div>
            <div class="row"><div class="label">ผ่อน/เดือน</div><div class="value">${Number(mappedCustomerInfo.installmentAmount || 0).toLocaleString()}</div></div>
            <div class="row"><div class="label">จำนวนงวด</div><div class="value">${mappedCustomerInfo.months || ''} เดือน</div></div>
            <div class="row"><div class="label">เก็บทุกวันที่</div><div class="value">${mappedCustomerInfo.collectionDate || ''}</div></div>
            <div class="row"><div class="label">วันที่ทำสัญญา</div><div class="value">${formatTH(customerInstallment?.startDate)}</div></div>
          </div>

          <div class="box">
            <div class="grid">
              <div>
                <table>
                  <thead>
                    <tr><th>งวด</th><th>ว/ด/ป</th><th>เลขที่ใบเสร็จ</th><th>จำนวนเงิน</th><th>คงเหลือ</th></tr>
                  </thead>
                  <tbody>${makeTable(0)}</tbody>
                </table>
              </div>
              <div>
                <table>
                  <thead>
                    <tr><th>งวด</th><th>ว/ด/ป</th><th>เลขที่ใบเสร็จ</th><th>จำนวนเงิน</th><th>คงเหลือ</th></tr>
                  </thead>
                  <tbody>${makeTable(15)}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>`;

    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
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
                <Button
                  onClick={handlePrintDocument}
                  variant="outline"
                  className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  ปริ้นเอกสาร
                </Button>
                <Button
                  onClick={handlePrintSlip}
                  variant="outline"
                  className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  พิมพ์สลิป 80mm
                </Button>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">พนักงานเก็บเงิน</label>
                      {loadingCollectors ? (
                        <div className="flex items-center px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          โหลด...
                        </div>
                      ) : (
                        <select
                          value={collectorId}
                          onChange={(e) => setCollectorId(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        >
                          <option value="">เลือกพนักงาน</option>
                          {collectors.map((collector) => (
                            <option key={collector.id} value={collector.id}>
                              {collector.name} {collector.surname} ({collector.position})
                            </option>
                          ))}
                        </select>
                      )}
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
                          // ใช้ฟังก์ชันที่แตกต่างกันสำหรับเงินดาวน์และงวดปกติ
                          const { receiptNumber, status, discount } = item.isDownPayment 
                            ? getDownPaymentInfo() 
                            : parsePaymentNotes(item.notes);
                          
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
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {installmentName}
                                  </div>
                                  {item.isDownPayment && (
                                    <div className="text-xs text-blue-600">
                                      เงินดาวน์
                                    </div>
                                  )}
                                  {!item.isDownPayment && (
                                    <div className="text-xs text-gray-500">
                                      งวดที่ {index + 1}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingPayment === item.id ? (
                                  <input
                                    type="date"
                                    value={editForm.paymentDate}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                                    className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                ) : (
                                  <div>
                                    <div className="text-sm text-gray-900">
                                      {formatDate(item.paymentDate)}
                                    </div>
                                    <div className="text-xs text-green-600">
                                      ชำระแล้ว
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingPayment === item.id ? (
                                  <input
                                    type="text"
                                    value={editForm.receiptNumber}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, receiptNumber: e.target.value }))}
                                    placeholder="เลขที่ใบเสร็จ"
                                    className="w-28 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                ) : (
                                  <div>
                                    <div className="text-sm text-gray-900">
                                      {receiptNumber}
                                    </div>
                                    {receiptNumber !== '-' && (
                                      <div className="text-xs text-blue-600">
                                        ใบเสร็จ
                                      </div>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingPayment === item.id ? (
                                  <input
                                    type="number"
                                    value={editForm.amount}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    step="0.01"
                                  />
                                ) : (
                                  <div>
                                    <div className="text-sm font-medium text-green-600">
                                      ฿{parseFloat(item.amount || 0).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-green-600">
                                      ชำระแล้ว
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm text-gray-900">
                                    ฿{calculateRemainingBalance(index).toLocaleString()}
                                  </div>
                                  {index < paidInstallments.length - 1 && (
                                    <div className="text-xs text-gray-500">
                                      งวดที่เหลือ: {paidInstallments.length - index - 1}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingPayment === item.id ? (
                                  <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <option value="ปกติ">ปกติ</option>
                                    <option value="เร่งรัด">เร่งรัด</option>
                                    <option value="รับคืนสินค้า">รับคืนสินค้า</option>
                                  </select>
                                ) : (
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    status === 'ปกติ' ? 'bg-gray-100 text-gray-800' :
                                    status === 'เร่งรัด' ? 'bg-yellow-100 text-yellow-800' :
                                    status === 'รับคืนสินค้า' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {status}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingPayment === item.id ? (
                                  <select
                                    value={editForm.discount}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, discount: e.target.value }))}
                                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <option value="ไม่มีส่วนลด">ไม่มีส่วนลด</option>
                                    <option value="ส่วนลด">ส่วนลด</option>
                                  </select>
                                ) : (
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    discount === 'มี' ? 'bg-purple-100 text-purple-800' :
                                    discount === 'ไม่มี' ? 'bg-gray-100 text-gray-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {discount}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {editingPayment === item.id ? (
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleEditPayment(item.id)}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      บันทึก
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingPayment(null);
                                        setEditForm({
                                          paymentDate: '',
                                          receiptNumber: '',
                                          amount: '',
                                          status: 'ปกติ',
                                          discount: 'ไม่มีส่วนลด',
                                          notes: ''
                                        });
                                      }}
                                    >
                                      ยกเลิก
                                    </Button>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditClick(item)}
                                        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      {!item.isDownPayment && item.id !== 'down-payment' && (
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
                                    {item.id === 'down-payment' && (
                                      <div className="text-xs text-blue-600 mt-1">
                                        แก้ไขเงินดาวน์
                                      </div>
                                    )}
                                  </div>
                                )}
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

            {/* 4. Pending Installments Table (hidden per request) */}

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