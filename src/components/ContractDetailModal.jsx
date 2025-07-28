import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  X, 
  User, 
  Package, 
  DollarSign, 
  Calendar, 
  Phone, 
  MapPin,
  FileText,
  UserCheck,
  Shield
} from 'lucide-react';

const ContractDetailModal = ({ contract, onClose, onEdit, onPrint }) => {
  if (!contract) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '฿0';
    return `฿${parseFloat(amount).toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            รายละเอียดสัญญา {contract.contractNumber}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onEdit(contract)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              แก้ไข
            </Button>
            <Button
              size="sm"
              onClick={() => onPrint(contract)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              พิมพ์
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Contract Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              ข้อมูลสัญญา
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">เลขสัญญา:</span>
                <span className="font-medium">{contract.contractNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">วันที่ทำสัญญา:</span>
                <span className="font-medium">{formatDate(contract.contractDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">สถานะ:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  contract.status === 'active' ? 'bg-green-100 text-green-800' :
                  contract.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {contract.status === 'active' ? 'ใช้งาน' :
                   contract.status === 'completed' ? 'เสร็จสิ้น' : 'ยกเลิก'}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              ข้อมูลลูกค้า
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ชื่อ:</span>
                <span className="font-medium">{contract.customerDetails?.name || contract.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">โทรศัพท์:</span>
                <span className="font-medium">{contract.customerDetails?.phone1 || contract.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ที่อยู่:</span>
                <span className="font-medium text-right">
                  {contract.customerDetails?.address || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ตำบล/แขวง:</span>
                <span className="font-medium">{contract.customerDetails?.subdistrict || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">อำเภอ/เขต:</span>
                <span className="font-medium">{contract.customerDetails?.district || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">จังหวัด:</span>
                <span className="font-medium">{contract.customerDetails?.province || '-'}</span>
              </div>
            </div>
          </div>

          {/* Guarantor Information */}
          {contract.guarantorDetails?.name && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                ข้อมูลผู้ค้ำ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ชื่อ:</span>
                  <span className="font-medium">{contract.guarantorDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">โทรศัพท์:</span>
                  <span className="font-medium">{contract.guarantorDetails.phone1 || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ที่อยู่:</span>
                  <span className="font-medium text-right">{contract.guarantorDetails.address || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ตำบล/แขวง:</span>
                  <span className="font-medium">{contract.guarantorDetails.subdistrict || '-'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Product Information */}
          <div className="bg-orange-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <Package className="w-5 h-5" />
              ข้อมูลสินค้า
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">สินค้า:</span>
                <span className="font-medium">{contract.productDetails?.name || contract.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ราคารวม:</span>
                <span className="font-medium">{formatCurrency(contract.productDetails?.price || contract.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">รุ่น:</span>
                <span className="font-medium">{contract.productDetails?.model || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">S/N:</span>
                <span className="font-medium">{contract.productDetails?.serialNumber || '-'}</span>
              </div>
            </div>
          </div>

          {/* Payment Plan */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              แผนการผ่อนชำระ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">เงินดาวน์:</span>
                <span className="font-medium">{formatCurrency(contract.planDetails?.downPayment || contract.downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ผ่อนต่อเดือน:</span>
                <span className="font-medium">{formatCurrency(contract.planDetails?.monthlyPayment || contract.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">จำนวนงวด:</span>
                <span className="font-medium">{contract.planDetails?.months || contract.months || contract.installmentPeriod} งวด</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">วันที่เริ่มต้น:</span>
                <span className="font-medium">{formatDate(contract.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">วันที่สิ้นสุด:</span>
                <span className="font-medium">{formatDate(contract.endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">เก็บทุกวันที่:</span>
                <span className="font-medium">{contract.planDetails?.collectionDate || '-'}</span>
              </div>
            </div>
          </div>

          {/* Employee Information */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              ข้อมูลพนักงาน
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">พนักงานขาย:</span>
                <span className="font-medium">{contract.salespersonName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ผู้ตรวจสอบ:</span>
                <span className="font-medium">{contract.inspectorName || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">สาย:</span>
                <span className="font-medium">{contract.line || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContractDetailModal; 