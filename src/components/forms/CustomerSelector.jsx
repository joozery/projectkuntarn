import React from 'react';
import { User, Phone, Mail, MapPin } from 'lucide-react';

const CustomerSelector = ({ 
  customers = [], 
  selectedCustomerId, 
  onCustomerChange 
}) => {
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <User className="w-4 h-4" />
        เลือกลูกค้า *
      </label>
      <select
        value={selectedCustomerId}
        onChange={(e) => onCustomerChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        required
      >
        <option value="">เลือกลูกค้า</option>
        {customers.map(customer => (
          <option key={customer.id} value={customer.id}>
            {customer.name} - {customer.phone}
          </option>
        ))}
      </select>
      {selectedCustomer && (
        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>{selectedCustomer.phone}</span>
          </div>
          {selectedCustomer.email && (
            <div className="flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3" />
              <span>{selectedCustomer.email}</span>
            </div>
          )}
          {selectedCustomer.address && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              <span>{selectedCustomer.address}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerSelector;