import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Package, Plus, DollarSign, Trash2, Building2, Loader2, Search, Filter, ChevronLeft, ChevronRight, Edit, CheckCircle } from 'lucide-react';
import ProductForm from '@/components/ProductForm';
import { inventoryService } from '@/services/inventoryService';
import { contractsService } from '@/services/contractsService';
import Swal from 'sweetalert2';

const ProductsPage = ({ selectedBranch, currentBranch }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [totalPagesFromApi, setTotalPagesFromApi] = useState(0);
  const [pageInput, setPageInput] = useState('1');
  const [contracts, setContracts] = useState([]);
  const [contractDetails, setContractDetails] = useState({}); // เพิ่ม state สำหรับเก็บรายละเอียดสัญญา
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    activeItems: 0,
    itemsWithStock: 0,
    totalValue: 0,
    categories: {},
    contractsCount: 0,
    itemsWithContracts: 0
  });



  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load contracts first
        const contractsData = await loadContracts();
        
        // Load contract details first (for mapping)
        await loadContractDetails();
        
        // Then load products with contract data
        const response = await inventoryService.getAll({
          branchId: selectedBranch,
          page: currentPage,
          limit: itemsPerPage
        });
        
        if (response.data.success) {
          // total items/pages from backend
          const total = response.data.total 
            || response.data.pagination?.totalItems 
            || response.data.count 
            || 0;
          if (total) setTotalItems(total);
          const apiPages = response.data.pagination?.totalPages || 0;
          if (apiPages) setTotalPagesFromApi(apiPages);
          
          // Get product names from installments table
          const productsWithNames = response.data.data.map(product => {
            // Find matching contract to get product name
            const matchingContract = contractsData.find(contract => 
              contract.product_id === product.id
            );
            
            return {
              ...product,
              display_name: matchingContract?.product_name || product.product_name
            };
          });
          
          // เรียงลำดับตามวันที่รับ (เก่าไปใหม่) และชื่อสินค้า
          const sortedProducts = productsWithNames.sort((a, b) => {
            // เรียงลำดับตามวันที่รับ (เก่าไปใหม่)
            if (a.receive_date && b.receive_date) {
              return new Date(a.receive_date) - new Date(b.receive_date);
            }
            // ถ้าไม่มีวันที่รับ ให้เรียงตามชื่อสินค้า
            if (a.display_name && b.display_name) {
              return a.display_name.localeCompare(b.display_name, 'th');
            }
            return 0;
          });
          
          // ตั้งค่า products เฉพาะสินค้าคงเหลือก่อน (จะถูกอัปเดตใน calculateInventoryStats)
          setProducts(sortedProducts);
    } else {
          console.error('Error loading products:', response.data.message);
        }
        
        // Calculate inventory statistics (after contract details are loaded)
        console.log('🔍 Before calculateInventoryStats - contractDetails:', contractDetails);
        await calculateInventoryStats();
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [selectedBranch, currentPage, itemsPerPage]);

  const loadContracts = async () => {
    try {
    if (selectedBranch) {
        const response = await contractsService.getAll(selectedBranch);
        const contractsData = response.data?.success ? response.data.data : (response.data || []);
        setContracts(contractsData);
        return contractsData;
      }
      return [];
    } catch (error) {
      console.error('Error loading contracts:', error);
      setContracts([]);
      return [];
    }
  };

  // โหลดรายละเอียดสัญญาและสร้าง mapping
  const loadContractDetails = async () => {
    try {
      if (!selectedBranch) return;
      
      const response = await contractsService.getAll(selectedBranch);
      const contractsData = response.data?.success ? response.data.data : (response.data || []);
      
      console.log('🔍 loadContractDetails - raw response:', response.data);
      console.log('🔍 loadContractDetails - contractsData:', contractsData);
      
      // สร้าง mapping ระหว่าง product_id และ contract details
      const contractMap = {};
      contractsData.forEach(contract => {
        // ตรวจสอบทั้ง productId และ product_id (API อาจส่งมาเป็น field ใด field หนึ่ง)
        const productId = contract.productId || contract.product_id;
        if (productId) {
          contractMap[productId] = {
            contractNumber: contract.contractNumber,
            customerName: contract.customerName,
            totalAmount: contract.totalAmount,
            status: contract.status,
            createdAt: contract.createdAt,
            productName: contract.productName
          };
        }
      });
      
      console.log('🔍 All contracts with productId/product_id:', contractsData.map(c => ({
        contractNumber: c.contractNumber,
        productId: c.productId,
        product_id: c.product_id,
        productName: c.productName
      })));
      
      setContractDetails(contractMap);
      console.log('🔍 Contract details loaded:', contractMap);
      console.log('🔍 Contracts with productId:', contractsData.filter(c => c.productId).length);
    } catch (error) {
      console.error('Error loading contract details:', error);
      setContractDetails({});
    }
  };

  // Calculate inventory statistics
  const calculateInventoryStats = async () => {
    try {
      if (!selectedBranch) return;
      
      // Load all inventory items for statistics
      const response = await inventoryService.getAll({
        branchId: selectedBranch,
        limit: 1000 // Get all items for accurate stats
      });
      
      if (response.data?.success && response.data.data) {
        const allItems = response.data.data;
        
        console.log('🔍 calculateInventoryStats - allItems from API:', allItems.length);
        
        // Calculate statistics
        const stats = {
          totalItems: allItems.length,
          activeItems: allItems.filter(item => item.status === 'active').length,
          itemsWithStock: allItems.filter(item => Number(item.remaining_quantity1) > 0).length,
          totalValue: allItems.reduce((sum, item) => {
            const price = parseFloat(item.cost_price) || 0;
            const qty = Number(item.remaining_quantity1) || 0;
            return sum + (price * qty);
          }, 0),
          categories: {}
        };
        
        // Categorize items
        allItems.forEach(item => {
          const name = item.product_name || 'ไม่ระบุ';
          let category = 'อื่นๆ';
          
          if (name.includes('เครื่องซักผ้า')) category = 'เครื่องซักผ้า';
          else if (name.includes('ตู้เย็น') || name.includes('ตู้แช่')) category = 'ตู้เย็น/ตู้แช่';
          else if (name.includes('เตียง')) category = 'เตียงนอน';
          else if (name.includes('ที่นอน')) category = 'ที่นอน';
          else if (name.includes('ตู้เสื้อผ้า')) category = 'ตู้เสื้อผ้า';
          else if (name.includes('โต๊ะ')) category = 'โต๊ะ';
          else if (name.includes('ทีวี')) category = 'ทีวี';
          else if (name.includes('พัดลม')) category = 'พัดลม';
          else if (name.includes('เตาแก๊ส')) category = 'เตาแก๊ส';
          else if (name.includes('เครื่องเสียง')) category = 'เครื่องเสียง';
          
          if (!stats.categories[category]) {
            stats.categories[category] = {
              count: 0,
              value: 0
            };
          }
          
          const price = parseFloat(item.cost_price) || 0;
          const qty = Number(item.remaining_quantity1) || 0;
          
          stats.categories[category].count += qty;
          stats.categories[category].value += (price * qty);
        });
        
        // เพิ่มข้อมูลสัญญา - ใช้ contractDetails state แทน contractMap
        console.log('🔍 calculateInventoryStats - contractDetails:', contractDetails);
        console.log('🔍 calculateInventoryStats - allItems length:', allItems.length);
        stats.contractsCount = Object.keys(contractDetails).length;
        stats.itemsWithContracts = allItems.filter(item => contractDetails[item.id]).length;
        
        console.log('🔍 Creating soldItems - contractDetails keys:', Object.keys(contractDetails));
        console.log('🔍 Creating soldItems - allItems IDs:', allItems.map(item => item.id));
        
        // เพิ่มสินค้าที่ทำสัญญาไปแล้วเข้าไปในรายการสินค้า
        const soldItems = Object.entries(contractDetails)
          .map(([productId, contract]) => ({
            id: parseInt(productId),
            product_name: contract.productName,
            display_name: contract.productName,
            shop_name: '-',
            contract_number: contract.contractNumber,
            cost_price: 0,
            receive_date: contract.createdAt,
            remarks: `ขายไปแล้ว - สัญญา ${contract.contractNumber}`,
            remaining_quantity1: 0,
            received_quantity: 1,
            sold_quantity: 1,
            remaining_quantity2: 0,
            status: 'sold',
            sequence: `S${productId}`,
            isSoldItem: true // เพิ่ม flag เพื่อระบุว่าเป็นสินค้าที่ขายไปแล้ว
          }));
        
        console.log('🔍 Created soldItems:', soldItems);
        
        // คำนวณสถิติที่ถูกต้อง
        stats.soldItemsCount = soldItems.length;
        stats.totalContractedItems = stats.itemsWithContracts + stats.soldItemsCount;
        
        // รวมสินค้าคงเหลือและสินค้าที่ขายไปแล้ว
        const allProductsWithSold = [...allItems, ...soldItems];
        stats.totalItemsWithSold = allProductsWithSold.length;
        
        // เรียงลำดับตามวันที่รับ (เก่าไปใหม่) และชื่อสินค้า
        const sortedAllProducts = allProductsWithSold.sort((a, b) => {
          // เรียงลำดับตามวันที่รับ (เก่าไปใหม่)
          if (a.receive_date && b.receive_date) {
            return new Date(a.receive_date) - new Date(b.receive_date);
          }
          // ถ้าไม่มีวันที่รับ ให้เรียงตามชื่อสินค้า
          if (a.display_name && b.display_name) {
            return a.display_name.localeCompare(b.display_name, 'th');
          }
          return 0;
        });
        
        // อัปเดต products state ให้รวมสินค้าที่ขายไปแล้ว
        console.log('🔍 Final products state - allItems:', allItems.length, 'soldItems:', soldItems.length);
        console.log('🔍 Final products state - total:', sortedAllProducts.length);
        setProducts(sortedAllProducts);
        
        setInventoryStats(stats);
      }
    } catch (error) {
      console.error('Error calculating inventory stats:', error);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    (product.display_name && product.display_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.product_code && product.product_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.shop_name && product.shop_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.contract_number && product.contract_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic (prefer backend total when available)
  const effectiveTotal = searchTerm ? filteredProducts.length : (totalItems || filteredProducts.length);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts; // server returns a page already
  const totalPages = searchTerm 
    ? Math.ceil(Math.max(effectiveTotal, 1) / itemsPerPage)
    : (totalPagesFromApi || Math.ceil(Math.max(effectiveTotal, 1) / itemsPerPage));

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Reset to first page when page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Sync page input with current/total changes
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    const clamped = Math.max(1, Math.min(totalPages || 1, pageNumber));
    setCurrentPage(clamped);
  };

  const handleFirst = () => handlePageChange(1);
  const handleLast = () => handlePageChange(totalPages || 1);
  const handlePrev = () => handlePageChange(currentPage - 1);
  const handleNext = () => handlePageChange(currentPage + 1);

  const handleContractClick = (contractNumber) => {
    // แสดง Swal confirmation ก่อนไปหน้าของเช็คเกอร์
    Swal.fire({
      title: 'ไปดูตารางผ่อน',
      html: `
        <div class="text-left">
          <p>คุณต้องการไปดูตารางผ่อนของสัญญา</p>
          <p><strong>${contractNumber}</strong> ในหน้าของเช็คเกอร์หรือไม่?</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ไปดู',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // เก็บข้อมูลสัญญาใน localStorage เพื่อส่งไปยังหน้าของเช็คเกอร์
        localStorage.setItem('selectedContractForChecker', contractNumber);
        
        // แสดง Swal แจ้งให้ไปหน้าของเช็คเกอร์
        Swal.fire({
          icon: 'info',
          title: 'ไปหน้าของเช็คเกอร์',
          html: `
            <div class="text-left">
              <p>กรุณาไปที่ <strong>เมนู "รายงานค่างวด"</strong> ในหน้าของเช็คเกอร์</p>
              <p>ระบบจะแสดงตารางผ่อนของสัญญา <strong>${contractNumber}</strong> ให้อัตโนมัติ</p>
            </div>
          `,
          confirmButtonText: 'เข้าใจแล้ว',
          confirmButtonColor: '#7c3aed'
        });
      }
    });
  };

  const addProduct = async (productData) => {
    try {
      setSubmitting(true);
      
      const inventoryData = {
        product_name: productData.productName,
        product_code: productData.productCode,
        shop_name: productData.shopName,
        contract_number: productData.contract,
        cost_price: parseFloat(productData.costPrice?.replace(/,/g, '')),
        receive_date: productData.receiveDate,
        remarks: productData.remarks,
        branch_id: selectedBranch,
        status: 'active',
        remaining_quantity1: 1,
        sold_quantity1: 0
      };
      
      const response = await inventoryService.create(inventoryData);
      
      if (response.data.success) {
        // Reload products to get the updated list
        const reloadResponse = await inventoryService.getAll({
          branchId: selectedBranch,
          page: currentPage,
          limit: itemsPerPage
        });
        
        if (reloadResponse.data.success) {
          const total = reloadResponse.data.total || reloadResponse.data.pagination?.totalItems || reloadResponse.data.count || 0;
          if (total) setTotalItems(total);
          const apiPages = reloadResponse.data.pagination?.totalPages || 0;
          if (apiPages) setTotalPagesFromApi(apiPages);
          // Get product names from installments table
          const productsWithNames = reloadResponse.data.data.map(product => {
            // Find matching contract to get product name
            const matchingContract = contracts.find(contract => 
              contract.product_id === product.id
            );
            
            return {
              ...product,
              display_name: matchingContract?.product_name || product.product_name
            };
          });
          
          // เรียงลำดับตามวันที่รับ (เก่าไปใหม่) และชื่อสินค้า
          const sortedProducts = productsWithNames.sort((a, b) => {
            // เรียงลำดับตามวันที่รับ (เก่าไปใหม่)
            if (a.receive_date && b.receive_date) {
              return new Date(a.receive_date) - new Date(b.receive_date);
            }
            // ถ้าไม่มีวันที่รับ ให้เรียงตามชื่อสินค้า
            if (a.display_name && b.display_name) {
              return a.display_name.localeCompare(b.display_name, 'th');
            }
            return 0;
          });
          
          setProducts(sortedProducts);
        }
        
        // Recalculate statistics after adding product
        await calculateInventoryStats();
        
        // Reload contract details
        await loadContractDetails();
        
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'เพิ่มสินค้าเรียบร้อยแล้ว',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#10b981'
        });
      } else {
        throw new Error(response.data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถเพิ่มสินค้าได้',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (productId) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณต้องการลบสินค้านี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const response = await inventoryService.delete(productId);
        
        if (response.data.success) {
          // Reload products to get the updated list
          const reloadResponse = await inventoryService.getAll({
            branchId: selectedBranch,
            page: currentPage,
            limit: itemsPerPage
          });
          
          if (reloadResponse.data.success) {
            const total = reloadResponse.data.total || reloadResponse.data.pagination?.totalItems || reloadResponse.data.count || 0;
            if (total) setTotalItems(total);
            const apiPages = reloadResponse.data.pagination?.totalPages || 0;
            if (apiPages) setTotalPagesFromApi(apiPages);
            // Get product names from installments table
            const productsWithNames = reloadResponse.data.data.map(product => {
              // Find matching contract to get product name
              const matchingContract = contracts.find(contract => 
                contract.product_id === product.id
              );
              
              return {
                ...product,
                display_name: matchingContract?.product_name || product.product_name
              };
            });
            
            // เรียงลำดับตามวันที่รับ (เก่าไปใหม่) และชื่อสินค้า
            const sortedProducts = productsWithNames.sort((a, b) => {
              // เรียงลำดับตามวันที่รับ (เก่าไปใหม่)
              if (a.receive_date && b.receive_date) {
                return new Date(a.receive_date) - new Date(b.receive_date);
              }
              // ถ้าไม่มีวันที่รับ ให้เรียงตามชื่อสินค้า
              if (a.display_name && b.display_name) {
                return a.display_name.localeCompare(b.display_name, 'th');
              }
              return 0;
            });
            
            setProducts(sortedProducts);
        }
        
        // Recalculate statistics after deleting product
        await calculateInventoryStats();
        
        // Reload contract details
        await loadContractDetails();
        
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'ลบสินค้าเรียบร้อยแล้ว',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#10b981'
        });
        } else {
          throw new Error(response.data.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถลบสินค้าได้',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
  };

  const updateProduct = async (updatedData) => {
    try {
      setSubmitting(true);
      
      const inventoryData = {
        product_name: updatedData.productName || editingProduct.product_name,
        product_code: updatedData.productCode || editingProduct.product_code,
        shop_name: updatedData.shopName || editingProduct.shop_name,
        contract_number: updatedData.contract || editingProduct.contract_number,
        cost_price: parseFloat(updatedData.costPrice?.replace(/,/g, '')) || editingProduct.cost_price,
        receive_date: updatedData.receiveDate || editingProduct.receive_date,
        remarks: updatedData.remarks || editingProduct.remarks
      };
      
      const response = await inventoryService.update(editingProduct.id, inventoryData);
      
      if (response.data.success) {
        // Reload products to get the updated list
        const reloadResponse = await inventoryService.getAll({
          branchId: selectedBranch,
          page: currentPage,
          limit: itemsPerPage
        });
        
        if (reloadResponse.data.success) {
          const total = reloadResponse.data.total || reloadResponse.data.pagination?.totalItems || reloadResponse.data.count || 0;
          if (total) setTotalItems(total);
          const apiPages = reloadResponse.data.pagination?.totalPages || 0;
          if (apiPages) setTotalPagesFromApi(apiPages);
          // Get product names from installments table
          const productsWithNames = reloadResponse.data.data.map(product => {
            // Find matching contract to get product name
            const matchingContract = contracts.find(contract => 
              contract.product_id === product.id
            );
            
            return {
              ...product,
              display_name: matchingContract?.product_name || product.product_name
            };
          });
          
          // เรียงลำดับตามวันที่รับ (เก่าไปใหม่) และชื่อสินค้า
          const sortedProducts = productsWithNames.sort((a, b) => {
            // เรียงลำดับตามวันที่รับ (เก่าไปใหม่)
            if (a.receive_date && b.receive_date) {
              return new Date(a.receive_date) - new Date(b.receive_date);
            }
            // ถ้าไม่มีวันที่รับ ให้เรียงตามชื่อสินค้า
            if (a.display_name && b.display_name) {
              return a.display_name.localeCompare(b.display_name, 'th');
            }
            return 0;
          });
          
          setProducts(sortedProducts);
        }
        
        // Recalculate statistics after updating product
        await calculateInventoryStats();
        
        // Reload contract details
        await loadContractDetails();
        
        setEditingProduct(null);
        
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: 'แก้ไขสินค้าเรียบร้อยแล้ว',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#10b981'
        });
      } else {
        throw new Error(response.data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถแก้ไขสินค้าได้',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const cancelEdit = async () => {
    const result = await Swal.fire({
      title: 'ยืนยันการยกเลิก',
      text: 'คุณต้องการยกเลิกการแก้ไขหรือไม่? ข้อมูลที่แก้ไขจะหายไป',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6b7280',
      cancelButtonColor: '#10b981',
      confirmButtonText: 'ยกเลิก',
      cancelButtonText: 'แก้ไขต่อ'
    });

    if (result.isConfirmed) {
      setEditingProduct(null);
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
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">กำลังโหลดข้อมูลสินค้า...</span>
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
          <span>สินค้าทั้งหมด: {effectiveTotal} รายการ</span>
        </div>
      </div>

      {/* Inventory Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">สินค้าทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalItemsWithSold || inventoryStats.totalItems}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">สินค้าที่มี Stock</p>
              <p className="text-2xl font-bold text-green-600">{inventoryStats.itemsWithStock}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">มูลค่าทั้งหมด</p>
              <p className="text-2xl font-bold text-purple-600">฿{inventoryStats.totalValue.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">สินค้า Active</p>
              <p className="text-2xl font-bold text-orange-600">{inventoryStats.activeItems}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">สินค้าที่ทำสัญญา (คงเหลือ)</p>
              <p className="text-2xl font-bold text-indigo-600">{inventoryStats.itemsWithContracts}</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">สินค้าที่ทำสัญญา (ขายแล้ว)</p>
              <p className="text-2xl font-bold text-blue-600">{inventoryStats.soldItemsCount || 0}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">รวมสินค้าที่ทำสัญญา</p>
              <p className="text-2xl font-bold text-green-600">{inventoryStats.totalContractedItems || 0}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(inventoryStats.categories).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">สรุปตามหมวดหมู่</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(inventoryStats.categories)
              .sort(([,a], [,b]) => b.count - a.count)
              .map(([category, data]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{category}</p>
                    <p className="text-sm text-gray-600">{data.count} ชิ้น</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">฿{data.value.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">มูลค่า</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Contract Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">สรุปสัญญา</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">สินค้าคงเหลือ</p>
              <p className="text-sm text-gray-600">{inventoryStats.totalItems} รายการ</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-blue-600">100%</p>
              <p className="text-xs text-gray-500">ของคลัง</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">สินค้าที่ทำสัญญา</p>
              <p className="text-sm text-gray-600">{inventoryStats.itemsWithContracts} รายการ</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-green-600">
                {inventoryStats.totalItems > 0 ? ((inventoryStats.itemsWithContracts / inventoryStats.totalItems) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-gray-500">ของคลัง</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">สินค้าที่ขายไปแล้ว</p>
              <p className="text-sm text-gray-600">{inventoryStats.soldItemsCount || 0} รายการ</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-red-600">
                {inventoryStats.contractsCount > 0 ? (((inventoryStats.soldItemsCount || 0) / inventoryStats.contractsCount) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-gray-500">ของสัญญา</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">สัญญาทั้งหมด</p>
              <p className="text-sm text-gray-600">{inventoryStats.contractsCount} รายการ</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-purple-600">100%</p>
              <p className="text-xs text-gray-500">ของสัญญา</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Form Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <Building2 className="w-4 h-4" />
                <span>สินค้าจะถูกเพิ่มในสาขา: <strong>{currentBranch?.name}</strong></span>
              </div>
            </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
        </h2>
        {editingProduct ? (
          <div className="space-y-4">
            <ProductForm 
              onAddProduct={updateProduct} 
              submitting={submitting}
              contracts={contracts}
              initialData={{
                productCode: editingProduct.product_code || '',
                productName: editingProduct.display_name || editingProduct.product_name || '',
                shopName: editingProduct.shop_name || '',
                contract: editingProduct.contract_number || '',
                costPrice: editingProduct.cost_price ? editingProduct.cost_price.toString() : '',
                receiveDate: editingProduct.receive_date ? editingProduct.receive_date.split('T')[0] : '',
                remarks: editingProduct.remarks || ''
              }}
            />
            <div className="flex gap-2">
              <Button
                onClick={cancelEdit}
                variant="outline"
                className="flex-1"
              >
                ยกเลิก
              </Button>
            </div>
          </div>
        ) : (
          <ProductForm onAddProduct={addProduct} submitting={submitting} contracts={contracts} />
        )}
        </div>
        
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="ค้นหาสินค้า รหัส ร้านค้า หรือสัญญา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            กรอง
                  </Button>
                </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ว.ด.ป./รับ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสสินค้า</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้า</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ร้านค้า</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สัญญา</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคาต้นทุน</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ว.ด.ป./ขาย</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ต้นทุนขาย</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คงเหลือ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รับ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ขาย</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คงเหลือ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมายเหตุ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <motion.tr
                      key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`transition-colors ${
                    product.isSoldItem 
                      ? 'bg-blue-50 hover:bg-blue-100' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {product.isSoldItem ? (
                      <span className="text-blue-600 font-medium">S{product.id}</span>
                    ) : (
                      product.sequence
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {product.isSoldItem ? (
                      <span className="text-blue-600 font-medium">
                        {product.receive_date ? new Date(product.receive_date).toLocaleDateString('th-TH') : '-'}
                            </span>
                    ) : (
                      product.receive_date ? new Date(product.receive_date).toLocaleDateString('th-TH') : '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {product.isSoldItem ? (
                      <span className="text-blue-600 font-medium">S{product.id}</span>
                    ) : (
                      product.product_code || '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={product.display_name}>
                    {product.isSoldItem ? (
                      <span className="text-blue-600 font-medium">{product.display_name}</span>
                    ) : (
                      product.display_name
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {product.isSoldItem ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      product.shop_name || '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {(() => {
                      if (product.isSoldItem) {
                        return (
                          <div className="space-y-1">
                            <div className="font-medium text-blue-600">
                              {product.contract_number}
                            </div>
                            <div className="text-xs text-blue-600">
                              ทำสัญญาแล้ว
                            </div>
                          </div>
                        );
                      }
                      
                      const contractInfo = contractDetails[product.id];
                      if (contractInfo) {
                        return (
                          <div className="space-y-1">
                            <div className="font-medium text-blue-600">
                              {contractInfo.contractNumber || 'ไม่มีเลขสัญญา'}
                            </div>
                            {contractInfo.customerName && (
                              <div className="text-xs text-gray-600">
                                ลูกค้า: {contractInfo.customerName}
                              </div>
                            )}
                            {contractInfo.totalAmount && (
                              <div className="text-xs text-green-600">
                                ฿{parseFloat(contractInfo.totalAmount).toLocaleString()}
                              </div>
                            )}
                            <div className="text-xs text-blue-600">
                              ทำสัญญาแล้ว
                            </div>
                          </div>
                        );
                      } else if (product.contract_number && product.contract_number !== '-') {
                        return (
                          <div className="space-y-1">
                            <div className="font-medium text-blue-600">
                              {product.contract_number}
                            </div>
                            <div className="text-xs text-blue-600">
                              ทำสัญญาแล้ว
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-gray-500 text-xs">
                            ยังไม่ได้ทำสัญญา
                          </div>
                        );
                      }
                    })()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {product.isSoldItem ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      product.cost_price ? product.cost_price.toLocaleString() : '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {product.isSoldItem ? (
                      <span className="text-blue-600 font-medium">
                        {product.receive_date ? new Date(product.receive_date).toLocaleDateString('th-TH') : '-'}
                      </span>
                    ) : (
                      product.sell_date ? new Date(product.sell_date).toLocaleDateString('th-TH') : '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {product.isSoldItem ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      product.cost_price ? product.cost_price.toLocaleString() : '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {product.isSoldItem ? (
                      <span className="text-blue-600 font-medium">0</span>
                    ) : (
                      product.remaining_quantity1
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {product.isSoldItem ? (
                      <span className="text-gray-600">1</span>
                    ) : (
                      product.received_quantity
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {product.isSoldItem ? (
                      <span className="text-blue-600 font-medium">1</span>
                    ) : (
                      product.sold_quantity || '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {product.isSoldItem ? (
                      <span className="text-blue-600 font-medium">0</span>
                    ) : (
                      product.remaining_quantity2
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={product.remarks}>
                    {product.isSoldItem ? (
                      <span className="text-blue-600 font-medium">
                        ทำสัญญาแล้ว - {product.contract_number}
                      </span>
                    ) : product.remarks ? (
                      <span className="text-gray-600">
                        {product.remarks}
                            </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {(() => {
                      // ตรวจสอบว่าสินค้านี้มีสัญญาหรือไม่
                      const contractInfo = contractDetails[product.id];
                      const hasContract = contractInfo || (product.contract_number && product.contract_number !== '-');
                      
                      if (product.isSoldItem || hasContract) {
                        return (
                          <div className="text-center">
                            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                              ทำสัญญาแล้ว
                            </span>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editProduct(product)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                        );
                      }
                    })()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {currentProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบสินค้า</h3>
            <p className="text-gray-500">ลองเปลี่ยนคำค้นหาหรือเพิ่มสินค้าใหม่</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700">
                แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, effectiveTotal)} จาก {effectiveTotal} รายการ
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">ต่อหน้า:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {[10, 15, 20, 25, 50, 100].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* First/Prev */}
              <Button variant="outline" size="sm" onClick={handleFirst} disabled={currentPage === 1}>
                ≪ First
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentPage === 1} className="flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              
              {/* Page list with ellipsis */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const max = totalPages;
                  const addBtn = (p) => pages.push(
                    <Button key={p} variant={p === currentPage ? 'default' : 'outline'} size="sm" onClick={() => handlePageChange(p)} className="w-8 h-8 p-0">{p}</Button>
                  );
                  const addDots = (k) => pages.push(<span key={k} className="px-2 text-gray-500">…</span>);

                  if (max <= 9) {
                    for (let p = 1; p <= max; p++) addBtn(p);
                  } else {
                    addBtn(1);
                    if (currentPage > 4) addDots('s');
                    const start = Math.max(2, currentPage - 2);
                    const end = Math.min(max - 1, currentPage + 2);
                    for (let p = start; p <= end; p++) addBtn(p);
                    if (currentPage < max - 3) addDots('e');
                    addBtn(max);
                  }
                  return pages;
                })()}
              </div>
              
              {/* Next/Last */}
              <Button variant="outline" size="sm" onClick={handleNext} disabled={currentPage === totalPages} className="flex items-center gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLast} disabled={currentPage === totalPages}>
                Last ≫
              </Button>

              {/* Page input */}
              <div className="flex items-center gap-2 ml-2 text-sm">
                <span>Page</span>
                <input
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={(e) => { if (e.key === 'Enter') handlePageChange(parseInt(pageInput || '1')); }}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button variant="outline" size="sm" onClick={() => handlePageChange(parseInt(pageInput || '1'))}>Go</Button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;