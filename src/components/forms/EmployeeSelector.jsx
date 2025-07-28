import React from 'react';
import { UserCheck, Briefcase, Phone } from 'lucide-react';

const EmployeeSelector = ({ 
  employees = [], 
  selectedEmployeeId, 
  onEmployeeChange 
}) => {
  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <UserCheck className="w-4 h-4" />
        พนักงานผู้ทำรายการ *
      </label>
      <select
        value={selectedEmployeeId}
        onChange={(e) => onEmployeeChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        required
      >
        <option value="">เลือกพนักงาน</option>
        {employees.map(employee => (
          <option key={employee.id} value={employee.id}>
            {employee.name} - {employee.position}
          </option>
        ))}
      </select>
      {selectedEmployee && (
        <div className="mt-2 p-2 bg-purple-50 rounded text-xs text-purple-700">
          <div className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            <span>{selectedEmployee.position}</span>
          </div>
          {selectedEmployee.phone && (
            <div className="flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3" />
              <span>{selectedEmployee.phone}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeSelector;