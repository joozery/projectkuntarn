import api from '@/lib/api';

const BASE_URL = '/installments';

export const paymentScheduleService = {
  // ดึงข้อมูลสัญญาของลูกค้า
  getCustomerInstallment: async (customerId) => {
    const queryParams = new URLSearchParams({ customerId });
    return api.get(`${BASE_URL}?${queryParams}`);
  },

  // ดึงรายการชำระเงินของสัญญา
  getInstallmentPayments: async (installmentId) => {
    return api.get(`${BASE_URL}/${installmentId}/payments`);
  },

  // บันทึกการชำระเงินใหม่
  createPayment: async (installmentId, paymentData) => {
    return api.post(`${BASE_URL}/${installmentId}/payments`, paymentData);
  },

  // อัปเดตการชำระเงิน
  updatePayment: async (installmentId, paymentId, paymentData) => {
    console.log('🔍 paymentScheduleService.updatePayment:', {
      installmentId,
      paymentId,
      paymentData
    });
    return api.put(`${BASE_URL}/${installmentId}/payments/${paymentId}`, paymentData);
  },

  // ลบการชำระเงิน
  deletePayment: async (installmentId, paymentId) => {
    return api.delete(`${BASE_URL}/${installmentId}/payments/${paymentId}`);
  },

  // บันทึกการเก็บเงินผ่านเช็คเกอร์
  createCollection: async (checkerId, collectionData) => {
    return api.post(`/checkers/${checkerId}/collections`, collectionData);
  },

  // ดึงประวัติการเก็บเงิน
  getCollections: async (installmentId) => {
    return api.get(`${BASE_URL}/${installmentId}/collections`);
  },

  // อัปเดตข้อมูลสัญญา
  update: async (installmentId, installmentData) => {
    console.log('🔍 paymentScheduleService.update:', {
      installmentId,
      installmentData
    });
    return api.put(`${BASE_URL}/${installmentId}`, installmentData);
  },

  // อัปเดตเงินดาวน์
  updateDownPayment: async (installmentId, downPaymentData) => {
    console.log('🔍 paymentScheduleService.updateDownPayment:', {
      installmentId,
      downPaymentData
    });
    return api.put(`${BASE_URL}/${installmentId}/down-payment`, downPaymentData);
  }
}; 