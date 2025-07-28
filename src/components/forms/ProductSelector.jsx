import React from 'react';
import { CreditCard, DollarSign } from 'lucide-react';

const ProductSelector = ({ 
  products = [], 
  selectedProductId, 
  onProductChange 
}) => {
  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <CreditCard className="w-4 h-4" />
        เลือกสินค้า *
      </label>
      <select
        value={selectedProductId}
        onChange={(e) => onProductChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        required
      >
        <option value="">เลือกสินค้า</option>
        {products.map(product => (
          <option key={product.id} value={product.id}>
            {product.name} - ฿{product.price.toLocaleString()}
          </option>
        ))}
      </select>
      {selectedProduct && (
        <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span>ราคา: ฿{selectedProduct.price.toLocaleString()}</span>
          </div>
          {selectedProduct.description && (
            <div className="mt-1">
              <span>📝 {selectedProduct.description}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSelector;