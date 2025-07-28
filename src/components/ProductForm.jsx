import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Plus, Package, DollarSign, FileText, Tag } from 'lucide-react';

const ProductForm = ({ onAddProduct, submitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const categories = [
    'อิเล็กทรอนิกส์',
    'เครื่องใช้ไฟฟ้า',
    'เฟอร์นิเจอร์',
    'รถยนต์',
    'มอเตอร์ไซค์',
    'เครื่องประดับ',
    'อื่นๆ'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ชื่อสินค้า, ราคา และหมวดหมู่เป็นข้อมูลที่จำเป็น",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "ราคาไม่ถูกต้อง",
        description: "กรุณาใส่ราคาที่เป็นตัวเลขและมากกว่า 0",
        variant: "destructive"
      });
      return;
    }

    onAddProduct({
      ...formData,
      price: price
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      category: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6" />
        เพิ่มสินค้าใหม่
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Package className="w-4 h-4" />
              ชื่อสินค้า *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="เช่น iPhone 15 Pro Max"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4" />
              ราคา (บาท) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="เช่น 45000"
              min="1"
              step="0.01"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Tag className="w-4 h-4" />
            หมวดหมู่ *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
            required
          >
            <option value="">เลือกหมวดหมู่</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4" />
            รายละเอียด
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="รายละเอียดเพิ่มเติมของสินค้า..."
            rows="3"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white/80 backdrop-blur-sm resize-none"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              กำลังเพิ่มสินค้า...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              เพิ่มสินค้า
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ProductForm;