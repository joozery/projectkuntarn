import api from '@/lib/api';

const BASE_URL = '/installments';

export const checkerReportService = {
  // ดึงรายงานค่างวดของเช็คเกอร์
  getCheckerReport: async (checkerId, params = {}) => {
    try {
      const response = await api.get(`${BASE_URL}/checker/${checkerId}/report`, { params });
      return response;
    } catch (error) {
      console.error('Error fetching checker report:', error);
      throw error;
    }
  },

  // อัพเดทสถานะการชำระเงิน
  updatePaymentStatus: async (installmentId, paymentData) => {
    try {
      const response = await api.put(`${BASE_URL}/${installmentId}/payment-status`, paymentData);
      return response;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  // ดึงข้อมูลการติดตามการชำระเงิน
  getPaymentTracking: async (installmentId) => {
    try {
      const response = await api.get(`${BASE_URL}/${installmentId}/payment-tracking`);
      return response;
    } catch (error) {
      console.error('Error fetching payment tracking:', error);
      throw error;
    }
  }
}; 