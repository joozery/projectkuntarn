import React from 'react';
import { Calculator, Calendar, Percent, DollarSign } from 'lucide-react';

const InstallmentDetails = ({ 
  contractDate,
  months,
  interestRate,
  downPayment,
  maxDownPayment,
  onContractDateChange,
  onMonthsChange,
  onInterestRateChange,
  onDownPaymentChange
}) => {
  const monthOptions = [6, 12, 18, 24, 36, 48, 60];

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5" />
        รายละเอียดการผ่อน
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4" />
            วันที่ทำสัญญา
          </label>
          <input
            type="date"
            value={contractDate}
            onChange={(e) => onContractDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4" />
            ระยะเวลาผ่อน (เดือน)
          </label>
          <select
            value={months}
            onChange={(e) => onMonthsChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {monthOptions.map(month => (
              <option key={month} value={month}>{month} เดือน</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Percent className="w-4 h-4" />
            อัตราดอกเบี้ย (% ต่อปี)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => onInterestRateChange(parseFloat(e.target.value))}
            min="0"
            max="50"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4" />
            เงินดาวน์ (บาท)
          </label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => onDownPaymentChange(parseFloat(e.target.value) || 0)}
            min="0"
            max={maxDownPayment || 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default InstallmentDetails;