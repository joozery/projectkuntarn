import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Package, Plus, DollarSign, Trash2, Building2, Loader2 } from 'lucide-react';
import ProductForm from '@/components/ProductForm';
import { productsService } from '@/services/productsService';

const ProductsPage = ({ selectedBranch, currentBranch }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (selectedBranch) {
      loadProducts();
    } else {
      setProducts([]);
    }
  }, [selectedBranch]);

  // Force refresh when component mounts
  useEffect(() => {
    if (selectedBranch) {
      const timer = setTimeout(() => {
        loadProducts();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('Loading products for branch:', selectedBranch);
      
      if (!selectedBranch) {
        console.log('No selectedBranch, using empty array');
        setProducts([]);
        return;
      }
      
      const response = await productsService.getAll(selectedBranch);
      console.log('Products API response:', response);
      
      // Handle different response formats
      let productsData = [];
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Format: { success: true, data: [...] }
        productsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Format: direct array
        productsData = response.data;
      } else if (response.data && Array.isArray(response.data)) {
        // Fallback
        productsData = response.data;
      }
      
      console.log('Processed products data:', productsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลสินค้าได้",
        variant: "destructive"
      });
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      setSubmitting(true);
      
      // Validate product data
      if (!productData.name || !productData.price) {
        toast({
          title: "ข้อมูลไม่ครบถ้วน",
          description: "กรุณากรอกชื่อสินค้าและราคา",
          variant: "destructive"
        });
        return;
      }
      
      const newProduct = {
        ...productData,
        branchId: selectedBranch,
        price: parseFloat(productData.price) || 0
      };
      
      console.log('Creating product with data:', newProduct);
      
      const response = await productsService.create(newProduct);
      console.log('Product creation response:', response);
      
      let createdProduct;
      if (response.data && response.data.success && response.data.data) {
        createdProduct = response.data.data;
      } else if (response.data) {
        createdProduct = response.data;
      } else {
        createdProduct = response;
      }
      
      // Ensure createdProduct has required fields
      const validatedProduct = {
        id: createdProduct.id,
        name: createdProduct.name || productData.name,
        description: createdProduct.description || productData.description || '',
        price: parseFloat(createdProduct.price) || parseFloat(productData.price) || 0,
        category: createdProduct.category || productData.category || '',
        branchId: createdProduct.branchId || selectedBranch,
        branchName: createdProduct.branchName || currentBranch?.name || '',
        status: createdProduct.status || 'active'
      };
      
      console.log('Validated product to add:', validatedProduct);
      
      setProducts(prev => [validatedProduct, ...prev]);
      
      toast({
        title: "สำเร็จ",
        description: "เพิ่มสินค้าเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มสินค้าได้",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await productsService.delete(productId);
      setProducts(prev => prev.filter(product => product.id !== productId));
      
      toast({
        title: "สำเร็จ",
        description: "ลบสินค้าเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบสินค้าได้",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h1>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">กำลังโหลดข้อมูลสินค้า...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h1>
          <p className="text-gray-600">เพิ่ม แก้ไข และจัดการสินค้าในระบบ - {currentBranch?.name}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Package className="w-4 h-4" />
          <span>สินค้าทั้งหมด: {Array.isArray(products) ? products.length : 0} รายการ</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <Building2 className="w-4 h-4" />
                <span>สินค้าจะถูกเพิ่มในสาขา: <strong>{currentBranch?.name}</strong></span>
              </div>
            </div>
            <ProductForm onAddProduct={addProduct} submitting={submitting} />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5" />
                รายการสินค้า
              </h2>
            </div>
            
            <div className="p-6">
              {!Array.isArray(products) || products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีสินค้า</h3>
                  <p className="text-gray-500 mb-4">เริ่มต้นโดยการเพิ่มสินค้าแรกของคุณในสาขานี้</p>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มสินค้า
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {Array.isArray(products) && products.map((product, index) => {
                    // Validate product data before rendering
                    if (!product || !product.id) {
                      console.warn('Invalid product data:', product);
                      return null;
                    }
                    
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{product.name || 'ไม่มีชื่อ'}</h3>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {product.branchName || 'ไม่ระบุสาขา'}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{product.description || 'ไม่มีคำอธิบาย'}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1 text-green-600 font-medium">
                                <DollarSign className="w-4 h-4" />
                                ฿{(product.price || 0).toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1 text-gray-500">
                                <Package className="w-4 h-4" />
                                หมวด: {product.category || 'ไม่ระบุ'}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;