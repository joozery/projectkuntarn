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
  AlertCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import Swal from 'sweetalert2';

import { useParams, useNavigate } from 'react-router-dom';

const CheckerInstallmentReport = ({ onBack, checker: propChecker, isStandalone }) => {
  const { checkerId } = useParams();
  const navigate = useNavigate();
  const [checker, setChecker] = useState(propChecker);
  const [sortField, setSortField] = useState('contract');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [summary, setSummary] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedContractFilter, setSelectedContractFilter] = useState('');

  // Update checker State
  useEffect(() => {
    if (propChecker) {
      setChecker(propChecker);
    } else if (isStandalone && checkerId) {
      const fetchChecker = async () => {
        try {
          const response = await api.get(`/checkers/${checkerId}`);
          if (response.data.success || response.data.data) {
            setChecker(response.data.data || response.data);
          }
        } catch (error) {
          console.error("Failed to load checker details", error);
        }
      };
      fetchChecker();
    }
  }, [propChecker, isStandalone, checkerId]);

  const handleBack = () => {
    if (isStandalone) {
      navigate('/checkers');
    } else {
      onBack();
    }
  };


  // ฟังก์ชันคำนวณสถานะ P ตามเดือนปัจจุบัน
  const calculatePStatus = useCallback((dueDate) => {
    if (!dueDate || dueDate === '-') return { pBlack: 0, pBlue: 0 };

    try {
      const date = new Date(dueDate);
      if (isNaN(date.getTime())) return { pBlack: 0, pBlue: 0 };

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      const dueMonth = date.getMonth() + 1;
      const dueYear = date.getFullYear();

      console.log('CalculatePStatus Debug:', {
        dueDate,
        dueMonth,
        dueYear,
        currentMonth,
        currentYear,
        today: currentDate.getDate(),
        dueDay: date.getDate()
      });

      // ตรวจสอบว่าเป็นเดือนที่ต้องเก็บเงินหรือไม่
      if (dueMonth === currentMonth && dueYear === currentYear) {
        // เป็นเดือนปัจจุบัน - แสดง P ดำ = "P", P น้ำเงิน = "1"
        console.log('✅ เดือนที่ต้องเก็บเงิน - P ดำ = "P", P น้ำเงิน = "1"');
        return { pBlack: "P", pBlue: "1" };
      } else if (dueMonth < currentMonth || dueYear < currentYear) {
        // เกินกำหนดชำระแล้ว (เดือนที่ผ่านมา) - แสดง P ดำ = "P", P น้ำเงิน = "1"
        console.log('⚠️ เกินกำหนดชำระแล้ว - P ดำ = "P", P น้ำเงิน = "1"');
        return { pBlack: "P", pBlue: "1" };
      } else {
        // ยังไม่ถึงกำหนดชำระ (เดือนในอนาคต) - ไม่แสดง P
        console.log('📅 ยังไม่ถึงกำหนดชำระ - P ดำ = 0, P น้ำเงิน = 0');
        return { pBlack: 0, pBlue: 0 };
      }
    } catch (error) {
      console.error('Error calculating P status:', error);
      return { pBlack: 0, pBlue: 0 };
    }
  }, []);

  // Helper function เพื่อดึงวันที่นัดเก็บ (เฉพาะวันที่)
  const getCollectionDay = (dateValue) => {
    if (!dateValue) return null;

    // ถ้าเป็นตัวเลข หรือ string ที่เป็นตัวเลขล้วน (เช่น "5", "25")
    if (!isNaN(dateValue) && String(dateValue).length <= 2) {
      return dateValue;
    }

    // ถ้าเป็น ISO Date String (เช่น "2025-01-09T17:00:00.000Z")
    try {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        // ใช้ getDate() เพื่อดึงวันที่ตามเวลาท้องถิ่น (หรือใช้ getUTCDate() ถ้าต้องการ UTC)
        // ปกติวันนัดเก็บมักจะอิงตามวันที่่เราเห็น
        return date.getDate();
      }
    } catch (e) {
      console.error('Error parsing collection date:', e);
    }

    return null;
  };

  // Helper function เพื่อสร้างวันที่นัดเก็บประจำงวด (วัน/เดือน/ปี)
  const formatCollectionDateForPeriod = (collectionDayValue, periodDate) => {
    if (!collectionDayValue || !periodDate) return '-';

    // ดึงเฉพาะวันที่
    const day = getCollectionDay(collectionDayValue);
    if (!day) return '-';

    // สร้างวันที่ใหม่
    const year = periodDate.getFullYear();
    const month = periodDate.getMonth(); // 0-11

    // สร้าง Date object (ระวังเรื่องวันที่เกินจำนวนวันในเดือนนั้นๆ เช่น 31 ก.พ.)
    const specificDate = new Date(year, month, day);

    // แปลงเป็น พ.ศ.
    return specificDate.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  // ฟังก์ชันดึงข้อมูลแยกตามเดือน
  const fetchMonthlyData = useCallback(async () => {
    try {
      const response = await api.get(`/installments`);

      let installmentsData = [];
      if (response.data?.success) {
        installmentsData = response.data.data || [];
      } else if (Array.isArray(response.data)) {
        installmentsData = response.data;
      }

      if (!Array.isArray(installmentsData)) {
        console.error('installmentsData is not an array:', installmentsData);
        return;
      }

      // Filter by inspector
      const filteredData = installmentsData.filter(item =>
        item.inspectorId === checker?.id || item.inspectorId === parseInt(checker?.id)
      );

      const uniqueData = filteredData.filter((item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
      );

      const monthly = {};

      // ดึงข้อมูลสัญญาจริงและแสดงตามเดือน
      for (const item of uniqueData) {
        try {
          const paymentsResponse = await api.get(`/installments/${item.id}/payments`);
          if (paymentsResponse.data?.success && paymentsResponse.data.data) {
            const payments = paymentsResponse.data.data;

            // คำนวณยอดคงเหลือตามจริง
            const totalContractAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
            const totalPaidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
            const actualRemainingDebt = totalContractAmount - totalPaidAmount;
            // หางวดที่ครบกำหนดชำระในเดือนที่เลือก (หรือเดือนปัจจุบันถ้าไม่ได้เลือก)
            const targetMonth = selectedMonth ? parseInt(selectedMonth) : null;
            const targetYear = selectedYear ? parseInt(selectedYear) : null;

            // Debug การกรอง
            // console.log(`Filtering for Month: ${targetMonth}, Year: ${targetYear}`);

            // Helper: แปลงวันที่เป็นเวลาไทยก่อนหาปี/เดือน
            const getThaiDateParts = (dateInput) => {
              if (!dateInput) return { year: 0, month: 0 };

              // แปลงเป็น Date Object
              const date = new Date(dateInput);

              // แปลงเป็น time string ในโซนไทย
              const thaiDateStr = date.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
              const thaiDate = new Date(thaiDateStr);

              return {
                year: thaiDate.getFullYear(),
                month: thaiDate.getMonth() + 1
              };
            };

            // หางวดที่ครบกำหนดชำระตามเงื่อนไข
            const currentMonthPayments = payments.filter(payment => {
              if (!payment.dueDate) return false;

              const { year: dueYear, month: dueMonth } = getThaiDateParts(payment.dueDate);

              // Debug เฉพาะรายการที่มีปัญหา (เช่นปี 2025)
              if (targetYear === 2025 && dueYear === 2025) {
                // console.log(`Found 2025 payment: ${payment.id}, Due: ${dueYear}-${dueMonth}`);
              }

              // กรองตามปี (ถ้าเลือก)
              if (targetYear && dueYear !== targetYear) return false;

              // กรองตามเดือน (ถ้าเลือก)
              if (targetMonth && dueMonth !== targetMonth) return false;

              // ถ้าไม่ได้เลือกปีและเดือน (เลือก "ทั้งหมด") -> แสดงทั้งหมด
              if (!targetYear && !targetMonth) return true;

              return true;
            });

            if (targetYear === 2025 && currentMonthPayments.length > 0) {
              // console.log(`Contract ${item.contractNumber} has ${currentMonthPayments.length} payments in 2025`);
            }

            // ตรวจสอบว่าเป็นสัญญาใหม่หรือไม่ (ยังไม่มีการชำระเงินเลย)
            const isNewContract = payments.every(p => p.status !== 'paid');
            const hasUpcomingPayments = payments.some(payment => {
              if (payment.status === 'paid') return false;

              const { year: dueYear, month: dueMonth } = getThaiDateParts(payment.dueDate);

              // ตรวจสอบเงื่อนไขอนาคตตาม Filter
              if (targetYear) {
                if (dueYear < targetYear) return false;
                if (dueYear === targetYear && targetMonth && dueMonth < targetMonth) return false;
              }

              return true;
            });

            // แสดงสัญญาใหม่ที่ยังไม่ถึงกำหนดชำระงวดแรก หรือ งวดที่ครบกำหนดในเดือนปัจจุบัน
            if (currentMonthPayments.length > 0 || (isNewContract && hasUpcomingPayments)) {

              // กรณีสัญญาใหม่ที่ยังไม่ถึงกำหนดชำระงวดแรก
              if (isNewContract && hasUpcomingPayments && currentMonthPayments.length === 0) {
                // หางวดแรกที่จะครบกำหนด
                const nextPayment = payments
                  .filter(payment => {
                    const dueDate = new Date(payment.dueDate);
                    return dueDate.getMonth() + 1 >= currentMonth && dueDate.getFullYear() >= currentYear;
                  })
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

                if (nextPayment) {
                  const dueDate = nextPayment.dueDate;
                  const date = new Date(dueDate);

                  // ใช้เดือนปัจจุบันสำหรับสัญญาใหม่
                  const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
                  const monthName = new Date(currentYear, currentMonth - 1).toLocaleDateString('th-TH', {
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

                  const amount = parseFloat(nextPayment.amount) || 0;
                  const amountCollected = 0; // สัญญาใหม่ยังไม่ได้ชำระ
                  const napheoBlue = 0; // ยังไม่ได้ชำระ
                  const collectionDateStr = date.toLocaleDateString('th-TH');

                  // สำหรับสัญญาใหม่ ไม่แสดง P เพราะยังไม่ถึงกำหนด
                  const pStatus = { pBlack: 0, pBlue: 0 };

                  console.log('New Contract Debug:', {
                    contract: item.contractNumber,
                    isNewContract: true,
                    nextDueDate: dueDate,
                    currentMonth: currentMonth,
                    currentYear: currentYear,
                    pStatus: pStatus
                  });

                  monthly[monthKey].installments.push({
                    id: `${item.id}-${nextPayment.id}`,
                    contract: item.contractNumber || `C${item.id}`,
                    name: item.customerFullName || `${item.customerName || ''} ${item.customerSurname || ''}`.trim(),
                    collectionDate: item.collectionDate ? formatCollectionDateForPeriod(item.collectionDate, date) : collectionDateStr,
                    amountToCollect: amount,
                    amountCollected: amountCollected,
                    remainingDebt: actualRemainingDebt,
                    napheoRed: 0,
                    napheoBlue: napheoBlue,
                    pBlack: pStatus.pBlack,
                    pRed: 0,
                    pBlue: pStatus.pBlue,
                    paymentStatus: nextPayment.status,
                    isNewContract: true // เพิ่ม flag เพื่อระบุว่าเป็นสัญญาใหม่
                  });

                  monthly[monthKey].totalAmount += amount;
                  monthly[monthKey].totalCollected += amountCollected;
                  monthly[monthKey].totalRemaining += actualRemainingDebt;
                }
              }

              // กรณีงวดที่ครบกำหนดชำระในเดือนปัจจุบัน
              for (const payment of currentMonthPayments) {
                const dueDate = payment.dueDate;
                // const date = new Date(dueDate); // Old logic

                // Use Thai Date Logic
                const { year, month } = getThaiDateParts(dueDate);
                const date = new Date(dueDate); // Keep date object for collection day calc

                const monthKey = `${year}-${String(month).padStart(2, '0')}`;

                const monthName = new Date(year, month - 1).toLocaleDateString('th-TH', {
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

                const amount = parseFloat(payment.amount) || 0;
                const amountCollected = payment.status === 'paid' ? amount : 0;
                const napheoBlue = payment.status === 'paid' ? 1 : 0;
                const collectionDateStr = date.toLocaleDateString('th-TH');
                const pStatus = calculatePStatus(dueDate);

                // Debug: Log P status calculation
                console.log('P Status Debug:', {
                  contract: item.contractNumber,
                  paymentId: payment.id,
                  dueDate: dueDate,
                  pStatus: pStatus,
                  status: payment.status,
                  actualRemainingDebt: actualRemainingDebt,
                  currentDate: new Date().toLocaleDateString('th-TH'),
                  currentMonth: currentMonth,
                  currentYear: currentYear
                });

                monthly[monthKey].installments.push({
                  id: `${item.id}-${payment.id}`,
                  contract: item.contractNumber || `C${item.id}`,
                  name: item.customerFullName || `${item.customerName || ''} ${item.customerSurname || ''}`.trim(),
                  collectionDate: item.collectionDate ? formatCollectionDateForPeriod(item.collectionDate, date) : collectionDateStr,
                  amountToCollect: amount,
                  amountCollected: amountCollected,
                  remainingDebt: actualRemainingDebt, // ยอดคงเหลือตามจริง
                  napheoRed: 0,
                  napheoBlue: napheoBlue, // 1 เมื่อมีการชำระเงินแล้ว
                  pBlack: pStatus.pBlack, // "P" เมื่อถึงเดือนที่ต้องเก็บ
                  pRed: 0,
                  pBlue: pStatus.pBlue, // "1" เมื่อถึงเดือนที่ต้องเก็บ
                  paymentStatus: payment.status
                });

                monthly[monthKey].totalAmount += amount;
                monthly[monthKey].totalCollected += amountCollected;
                monthly[monthKey].totalRemaining += actualRemainingDebt;
              }
            }
          }
        } catch (error) {
          console.error('Error fetching payments for installment:', item.id, error);
        }
      }

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
      });
    }
  }, [checker?.id, calculatePStatus, selectedMonth, selectedYear]);

  // ฟังก์ชันรีเฟรชข้อมูล
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    setLoading(true);
    setError(null);
  }, []);



  // ตรวจสอบ localStorage สำหรับสัญญาที่เลือก
  useEffect(() => {
    const selectedContract = localStorage.getItem('selectedContractForChecker');
    if (selectedContract) {
      setSelectedContractFilter(selectedContract);
      // ลบข้อมูลออกจาก localStorage หลังจากใช้แล้ว
      localStorage.removeItem('selectedContractForChecker');

      // แสดง Swal แจ้งว่ากำลังกรองข้อมูลตามสัญญา
      Swal.fire({
        icon: 'info',
        title: 'กรองข้อมูลตามสัญญา',
        html: `
          <div class="text-left">
            <p>กำลังแสดงตารางผ่อนของสัญญา</p>
            <p><strong>${selectedContract}</strong></p>
          </div>
        `,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#7c3aed'
      });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/installments`);

        let installmentsData = [];
        if (response.data?.success) {
          installmentsData = response.data.data || [];
        } else if (Array.isArray(response.data)) {
          installmentsData = response.data;
        }

        if (!Array.isArray(installmentsData)) {
          throw new Error('ข้อมูลที่ได้รับไม่ใช่ Array');
        }

        const filteredData = installmentsData.filter(item => {
          return item.inspectorId === checker?.id || item.inspectorId === parseInt(checker?.id);
        });

        const uniqueData = filteredData.filter((item, index, self) =>
          index === self.findIndex(t => t.id === item.id)
        );

        // ดึงข้อมูลการชำระเงินสำหรับแต่ละ installment
        const processedData = [];
        for (let index = 0; index < uniqueData.length; index++) {
          const item = uniqueData[index];
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

          const pStatus = calculatePStatus(collectionDate);

          // ดึงข้อมูลการชำระเงินสำหรับ installment นี้
          let amountCollected = 0;
          let napheoBlue = 0;
          let paymentStatus = 'pending';

          try {
            const paymentsResponse = await api.get(`/installments/${item.id}/payments`);
            if (paymentsResponse.data?.success && paymentsResponse.data.data) {
              const payments = paymentsResponse.data.data;
              amountCollected = payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);

              // ถ้ามีการชำระเงินแล้ว ให้ napheoBlue = 1
              if (amountCollected > 0) {
                napheoBlue = 1;
                paymentStatus = 'paid';
              }
            }
          } catch (error) {
            console.error('Error fetching payments for installment:', item.id, error);
          }

          processedData.push({
            id: item.id,
            sequence: index + 1,
            contract: item.contractNumber || `C${item.id}`,
            name: item.customerFullName || `${item.customerName || ''} ${item.customerSurname || ''}`.trim(),
            collectionDate: formattedDate,
            amountToCollect: parseFloat(item.installmentAmount) || 0,
            amountCollected: amountCollected,
            remainingDebt: parseFloat(item.remainingAmount) || 0, // เงินคงเหลือ = ยอดที่เหลือผ่อนทั้งหมด
            napheoRed: 0,
            napheoBlue: napheoBlue, // เพิ่ม napheoBlue
            pBlack: pStatus.pBlack,
            pRed: 0,
            pBlue: pStatus.pBlue,
            paymentStatus: paymentStatus
          });
        }

        setInstallments(processedData);

        const totalPBlack = processedData.reduce((sum, item) => {
          // ถ้า pBlack เป็น "P" หรือ 1 ให้นับเป็น 1
          if (item.pBlack === "P" || item.pBlack === 1) return sum + 1;
          return sum;
        }, 0);
        const totalPBlue = processedData.reduce((sum, item) => {
          // ถ้า pBlue เป็น "1" หรือ 1 ให้นับเป็น 1
          if (item.pBlue === "1" || item.pBlue === 1) return sum + 1;
          return sum;
        }, 0);

        // คำนวณยอดเงินคงเหลือตามจริงจากตาราง payments
        let totalRemainingAmount = 0;
        let totalAmountCollected = 0;
        let cardsCollected = 0;
        let napheoBlueCollected = 0;

        for (const item of processedData) {
          try {
            const paymentsResponse = await api.get(`/installments/${item.id}/payments`);
            if (paymentsResponse.data?.success && paymentsResponse.data.data) {
              const payments = paymentsResponse.data.data;

              // คำนวณยอดคงเหลือตามจริง
              const totalContractAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
              const totalPaidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
              const actualRemainingDebt = totalContractAmount - totalPaidAmount;

              totalRemainingAmount += actualRemainingDebt;
              totalAmountCollected += totalPaidAmount;

              if (totalPaidAmount > 0) {
                cardsCollected++;
                napheoBlueCollected++;
              }
            }
          } catch (error) {
            console.error('Error calculating remaining amount for installment:', item.id, error);
          }
        }

        const summaryData = {
          totalCards: processedData.length,
          cardsToCollect: processedData.length,
          cardsCollected: cardsCollected,
          pGreen: totalPBlue,
          pRed: totalPBlack,
          totalPCards: totalPBlack + totalPBlue,
          pGreenCollected: napheoBlueCollected,
          pRedCollected: 0,
          totalPCardsCollected: napheoBlueCollected,
          totalMoney: totalRemainingAmount, // ยอดเงินคงเหลือทั้งหมด
          moneyToCollect: totalRemainingAmount, // ยอดเงินคงเหลือทั้งหมด (เท่ากับ totalMoney)
          moneyCollected: totalAmountCollected
        };

        setSummary(summaryData);

        await fetchMonthlyData();

      } catch (error) {
        console.error('Error fetching installments:', error);
        setError(error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');

        toast({
          title: 'เกิดข้อผิดพลาด',
          description: error.response?.data?.message || error.message || 'ไม่สามารถดึงข้อมูลได้',
          variant: 'destructive',
        });

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
  }, [checker?.id, selectedMonth, selectedYear, refreshKey, fetchMonthlyData, calculatePStatus]);

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
    const uniqueInstallments = installments.filter((item, index, self) =>
      index === self.findIndex(t => t.id === item.id)
    );

    return uniqueInstallments.filter(item => {
      const matchesSearch = item.contract.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase());

      // กรองตามสัญญาที่เลือก
      const matchesContract = !selectedContractFilter ||
        item.contract.toLowerCase().includes(selectedContractFilter.toLowerCase());

      // กรองตามเดือนและปี
      let matchesDate = true;
      if ((selectedMonth && selectedMonth !== '') || (selectedYear && selectedYear !== '')) {
        try {
          const itemDate = new Date(item.collectionDate);
          if (!isNaN(itemDate.getTime())) {
            const itemMonth = itemDate.getMonth() + 1;
            const itemYear = itemDate.getFullYear();

            let matchesMonth = true;
            let matchesYear = true;

            // กรองตามเดือน
            if (selectedMonth && selectedMonth !== '') {
              matchesMonth = itemMonth === parseInt(selectedMonth);
            }

            // กรองตามปี
            if (selectedYear && selectedYear !== '') {
              matchesYear = itemYear === parseInt(selectedYear);
            }

            matchesDate = matchesMonth && matchesYear;
          } else {
            // ถ้าไม่สามารถแปลงวันที่ได้ ให้แสดงข้อมูลนั้น (อาจเป็นข้อมูลเก่า)
            matchesDate = true;
          }
        } catch (error) {
          console.error('Error parsing date:', item.collectionDate, error);
          // ถ้าแปลงวันที่ไม่ได้ ให้แสดงข้อมูลนั้น (อาจเป็นข้อมูลเก่า)
          matchesDate = true;
        }
      }

      return matchesSearch && matchesDate && matchesContract;
    });
  }, [installments, searchTerm, selectedMonth, selectedYear, selectedContractFilter]);

  // คำนวณยอดรวม
  const { totalAmountToCollect, totalAmountCollected, totalRemainingDebt } = useMemo(() => {
    return {
      totalAmountToCollect: filteredData.reduce((sum, item) => sum + (item.amountToCollect || 0), 0),
      totalAmountCollected: filteredData.reduce((sum, item) => sum + (item.amountCollected || 0), 0),
      totalRemainingDebt: filteredData.reduce((sum, item) => sum + (item.remainingDebt || 0), 0)
    };
  }, [filteredData]);

  // เรียงข้อมูล
  const sortedData = useMemo(() => {
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

  if (!checker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">ไม่พบข้อมูลเช็คเกอร์</h2>
          <p className="text-gray-600 mb-4">กรุณาเลือกเช็คเกอร์ก่อน</p>
          <Button onClick={handleBack} variant="outline">
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
                onClick={handleBack}
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

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
            >
              {/* Filter Status */}
              {(selectedMonth || selectedYear || selectedContractFilter) && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Filter className="w-4 h-4" />
                    <span>กำลังกรองข้อมูล:</span>
                    {selectedMonth && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        เดือน {selectedMonth}
                      </span>
                    )}
                    {selectedYear && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        ปี {selectedYear}
                      </span>
                    )}
                    {selectedContractFilter && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        สัญญา {selectedContractFilter}
                      </span>
                    )}
                    <span className="text-blue-600">
                      (แสดง {filteredData.length} รายการจากทั้งหมด {installments.length} รายการ)
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
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

                {/* Month and Year Filter */}
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
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">ทุกปี</option>
                      {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + 5 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Contract Filter */}
                  {selectedContractFilter && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">กรองสัญญา:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-md">
                        {selectedContractFilter}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedContractFilter('')}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                      >
                        ล้าง
                      </Button>
                    </div>
                  )}

                  {/* Clear All Filters */}
                  {(selectedMonth || selectedYear || selectedContractFilter) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedMonth('');
                        setSelectedYear('');
                        setSelectedContractFilter('');
                      }}
                      className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    >
                      ล้างทั้งหมด
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Monthly View */}
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
                Object.entries(monthlyData)
                  .filter(([monthKey, monthData]) => {
                    // ถ้าไม่ได้เลือกเดือนหรือปีใดๆ ให้แสดงทุกเดือน
                    if ((!selectedMonth || selectedMonth === '') && (!selectedYear || selectedYear === '')) return true;

                    // แยกปีและเดือนจาก monthKey (format: YYYY-MM)
                    const [yearFromKey, monthFromKey] = monthKey.split('-');

                    let matchesMonth = true;
                    let matchesYear = true;

                    // กรองตามเดือน
                    if (selectedMonth && selectedMonth !== '') {
                      matchesMonth = monthFromKey === selectedMonth.padStart(2, '0');
                    }

                    // กรองตามปี
                    if (selectedYear && selectedYear !== '') {
                      matchesYear = yearFromKey === selectedYear;
                    }

                    return matchesMonth && matchesYear;
                  })
                  .map(([monthKey, monthData]) => (
                    <div key={monthKey} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{monthData.monthName}</h3>
                            <p className="text-sm text-gray-600">
                              {monthData.installments.length} สัญญา |
                              เงินต้องเก็บ: ฿{monthData.totalAmount.toLocaleString()} |
                              เงินเก็บได้: ฿{monthData.totalCollected.toLocaleString()} |
                              ยอดเหลือผ่อน: ฿{monthData.totalRemaining.toLocaleString()}
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
                                <div className="text-center">
                                  <div className="text-blue-600 font-bold">นับเพียว</div>
                                  <div className="text-xs text-gray-500">น้ำเงิน</div>
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="text-center">
                                  <div className="text-red-600 font-bold">นับเพียว</div>
                                  <div className="text-xs text-gray-500">แดง</div>
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="text-center">
                                  <div className="text-black font-bold">P</div>
                                  <div className="text-xs text-gray-500">ดำ</div>
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="text-center">
                                  <div className="text-red-600 font-bold">P</div>
                                  <div className="text-xs text-gray-500">แดง</div>
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="text-center">
                                  <div className="text-blue-600 font-bold">P</div>
                                  <div className="text-xs text-gray-500">น้ำเงิน</div>
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                เงินต้องเก็บ
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                เงินเก็บได้
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                เงินคงเหลือ
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 text-center font-medium">
                                  {item.napheoBlue > 0 ? item.napheoBlue : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center font-medium">
                                  {item.napheoRed > 0 ? item.napheoRed : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                  {item.pBlack && item.pBlack !== 0 ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue text-blue-600">
                                      {item.pBlack}
                                    </span>
                                  ) : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                  {item.pRed > 0 ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      P
                                    </span>
                                  ) : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                  {item.pBlue && item.pBlue !== 0 ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {item.pBlue}
                                    </span>
                                  ) : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                                  ฿{item.amountToCollect.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                  ฿{item.amountCollected.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                  ฿{item.remainingDebt.toLocaleString()}
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
                        <span className="text-sm text-gray-600">ยอดเงินคงเหลือทั้งหมด:</span>
                        <span className="text-sm font-medium">฿{(summary.totalMoney || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ยอดเงินคงเหลือ:</span>
                        <span className="text-sm font-medium">฿{(summary.moneyToCollect || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ยอดเงินที่เก็บได้:</span>
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