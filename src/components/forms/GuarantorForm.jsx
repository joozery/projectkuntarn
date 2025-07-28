import React from 'react';
import { Shield } from 'lucide-react';

const GuarantorForm = ({ guarantor, onGuarantorChange }) => {
  const handleChange = (field, value) => {
    onGuarantorChange({
      ...guarantor,
      [field]: value
    });
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5" />
        ข้อมูลผู้ค้ำประกัน
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">ชื่อผู้ค้ำ</label>
          <input 
            type="text" 
            value={guarantor.name} 
            onChange={(e) => handleChange('name', e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
            placeholder="ชื่อ-นามสกุล"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">ชื่อเล่น</label>
          <input 
            type="text" 
            value={guarantor.nickname} 
            onChange={(e) => handleChange('nickname', e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
            placeholder="ชื่อเล่น"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">เบอร์โทรผู้ค้ำ</label>
          <input 
            type="text" 
            value={guarantor.phone} 
            onChange={(e) => handleChange('phone', e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
            placeholder="08X-XXX-XXXX"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">ที่อยู่ผู้ค้ำ</label>
          <input 
            type="text" 
            value={guarantor.address} 
            onChange={(e) => handleChange('address', e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
            placeholder="ที่อยู่"
          />
        </div>
      </div>
    </div>
  );
};

export default GuarantorForm;