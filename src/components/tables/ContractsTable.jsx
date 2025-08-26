import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList,
  Printer,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

const ContractsTable = ({ contracts, onPrint, onView, onEdit, onDelete, sortField, sortDirection, onSort }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'ใช้งาน';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      default: return 'ไม่ทราบ';
    }
  };

  // ฟังก์ชันแสดงไอคอนการเรียงลำดับ
  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-blue-600" /> : 
      <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  if (contracts.length === 0) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบรายการสัญญา</h3>
        <p className="text-gray-500">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th 
              className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50 select-none"
              onClick={() => onSort && onSort('contractNumber')}
            >
              <div className="flex items-center gap-2">
                เลขสัญญา
                {getSortIcon('contractNumber')}
              </div>
            </th>
            <th 
              className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50 select-none"
              onClick={() => onSort && onSort('contractDate')}
            >
              <div className="flex items-center gap-2">
                วันที่
                {getSortIcon('contractDate')}
              </div>
            </th>
            <th 
              className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50 select-none"
              onClick={() => onSort && onSort('customerName')}
            >
              <div className="flex items-center gap-2">
                ลูกค้า
                {getSortIcon('customerName')}
              </div>
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">สินค้า</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">ผ่อน/เดือน</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700 w-48">พนักงาน</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">สถานะ</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract, index) => (
            <motion.tr
              key={contract.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                <div className="font-medium text-blue-600">{contract.contractNumber}</div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-600">
                  {new Date(contract.contractDate).toLocaleDateString('th-TH')}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{contract.customerName}</div>
                <div className="text-xs text-gray-500">{contract.customerPhone}</div>
              </td>
              <td className="py-3 px-4">
                <div className="text-gray-900">{contract.productName}</div>
                <div className="text-xs text-gray-500">฿{contract.productPrice?.toLocaleString()}</div>
              </td>
              <td className="py-3 px-4">
                <div className="font-medium text-green-600">
                  ฿{contract.monthlyPayment?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">{contract.months} งวด</div>
              </td>
              <td className="py-3 px-4">
                <div className="text-gray-900">
                  <div className="font-medium text-blue-600">{contract.employeeName || contract.salespersonFullName || 'ไม่ระบุ'}</div>
                  <div className="text-xs text-purple-600">ผู้ตรวจสอบ: {contract.inspectorName || contract.inspectorFullName || 'ไม่ระบุ'}</div>
                  <div className="text-xs text-green-600">สาย: {contract.line || 'ไม่ระบุ'}</div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                  {getStatusIcon(contract.status)}
                  <span className="ml-1">{getStatusText(contract.status)}</span>
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => onPrint(contract)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                  >
                    <Printer className="w-3 h-3 mr-1" />
                    พิมพ์
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(contract)}
                    className="text-gray-600 border-gray-200 hover:bg-gray-50 text-xs px-2 py-1"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    ดู
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(contract)}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs px-2 py-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    แก้ไข
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(contract)}
                    className="text-red-600 border-red-200 hover:bg-red-50 text-xs px-2 py-1"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    ลบ
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractsTable;