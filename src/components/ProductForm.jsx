import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Plus, Package, DollarSign, FileText, Tag, Hash, FileSignature, Calendar, Store } from 'lucide-react';

const ProductForm = ({ onAddProduct, submitting = false, initialData = null, contracts = [] }) => {
  const [formData, setFormData] = useState({
    productCode: initialData?.productCode || '',
    productName: initialData?.productName || '',
    shopName: initialData?.shopName || '',
    contract: initialData?.contract || '',
    costPrice: initialData?.costPrice || '',
    receiveDate: initialData?.receiveDate || '',
    remarks: initialData?.remarks || ''
  });

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      const costPrice = initialData.costPrice ?
        (typeof initialData.costPrice === 'string' ?
          initialData.costPrice :
          parseFloat(initialData.costPrice).toLocaleString()
        ) : '';

      setFormData({
        productCode: initialData.productCode || '',
        productName: initialData.productName || '',
        shopName: initialData.shopName || '',
        contract: initialData.contract || '',
        costPrice: costPrice,
        receiveDate: initialData.receiveDate || '',
        remarks: initialData.remarks || ''
      });
    }
  }, [initialData]);



  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.productName || !formData.costPrice) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ชื่อสินค้าและราคาต้นทุนเป็นข้อมูลที่จำเป็น",
        variant: "destructive"
      });
      return;
    }

    const costPrice = parseFloat(formData.costPrice.replace(/,/g, ''));
    if (isNaN(costPrice) || costPrice < 0) {
      toast({
        title: "ราคาไม่ถูกต้อง",
        description: "กรุณาใส่ราคาที่เป็นตัวเลขและมากกว่าหรือเท่ากับ 0",
        variant: "destructive"
      });
      return;
    }

    onAddProduct({
      ...formData,
      costPrice: costPrice.toLocaleString(),
      name: formData.productName,
      price: costPrice,
      code: formData.productCode,
      shopName: formData.shopName,
      contract: formData.contract,
      receiveDate: formData.receiveDate,
      remarks: formData.remarks
    });

    // Reset form only if not in edit mode
    if (!initialData) {
      setFormData({
        productCode: '',
        productName: '',
        shopName: '',
        contract: '',
        costPrice: '',
        receiveDate: '',
        remarks: ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format cost price with commas
    if (name === 'costPrice') {
      const numericValue = value.replace(/[^\d]/g, '');
      const formattedValue = numericValue ? parseInt(numericValue).toLocaleString() : '';
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Product Code */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Hash className="w-4 h-4" />
              รหัสสินค้า
            </label>
            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              placeholder="เช่น R43, N903"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm"
            />
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Package className="w-4 h-4" />
              ชื่อสินค้า *
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="เช่น เครื่องซักผ้า 11 กิโล"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm"
              required
            />
          </div>

          {/* Shop Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Store className="w-4 h-4" />
              ชื่อร้านค้า
            </label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="เช่น ร้านค้า A, ร้านค้า B"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm"
            />
          </div>

          {/* Contract */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileSignature className="w-4 h-4" />
              สัญญา
            </label>
            <div className="relative">
              <input
                type="text"
                name="contract"
                value={formData.contract}
                onChange={handleChange}
                placeholder="พิมพ์ - หรือเลือกเลขที่สัญญา"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm pr-8"
              />
              {contracts.length > 0 && (
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData(prev => ({
                        ...prev,
                        contract: e.target.value
                      }));
                    }
                  }}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 text-xs border-none bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">📋</option>
                  {contracts.map(contract => (
                    <option key={contract.id} value={contract.contractNumber}>
                      {contract.contractNumber} - {contract.customerName}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {contracts.length > 0 && (
              <p className="text-xs text-gray-500">
                💡 สามารถพิมพ์ "-" หรือเลือกเลขที่สัญญาจากระบบ
              </p>
            )}
          </div>

          {/* Cost Price */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4" />
              ราคาต้นทุน *
            </label>
            <input
              type="text"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              placeholder="เช่น 2,740"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Receive Date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4" />
              ว.ด.ป./รับ
            </label>
            <input
              type="date"
              name="receiveDate"
              value={formData.receiveDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4" />
              หมายเหตุ
            </label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="เช่น ซ่อมแล้ว, มาวันที่ 23/6/68"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 opacity-0">
              <Plus className="w-4 h-4" />
              เพิ่มสินค้า
            </label>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium text-base transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {initialData ? 'กำลังแก้ไขสินค้า...' : 'กำลังเพิ่มสินค้า...'}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {initialData ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;