import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Swal from 'sweetalert2';
import { customersService } from '@/services/customersService';
import { inventoryService } from '@/services/inventoryService';
import { employeesService } from '@/services/employeesService';
import { checkersService } from '@/services/checkersService';
import { 
  FileText, 
  User, 
  Shield, 
  Package, 
  DollarSign, 
  Calendar, 
  Percent,
  Check,
  UserCheck,
  Search
} from 'lucide-react';

const FormSection = ({ title, icon, children }) => {
  const Icon = icon;
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-purple-600" />
        {title}
      </h3>
      {children}
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder, type = 'text', required = false }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1 block">{label}{required && ' *'}</label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange} 
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm" 
      placeholder={placeholder}
      required={required}
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, placeholder, required = false }) => (
   <div>
    <label className="text-sm font-medium text-gray-700 mb-1 block">{label}{required && ' *'}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
      required={required}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

const SearchableSelectField = ({ label, value, onChange, options, placeholder, required = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);

  console.log(`🔍 SearchableSelectField [${label}]:`, { 
    optionsCount: options?.length || 0, 
    options: options,
    value,
    isOpen,
    searchTerm,
    optionsType: typeof options,
    isArray: Array.isArray(options),
    // เพิ่ม debug สำหรับ options
    optionsSample: options?.slice(0, 3),
    optionsKeys: options?.[0] ? Object.keys(options[0]) : [],
    optionsStatuses: options?.map(item => ({ id: item.id, status: item.status, qty: item.remaining_quantity1, name: item.product_name || item.name })),
    // เพิ่ม debug สำหรับ options ที่มีข้อมูล
    optionsWithData: options?.filter(item => item.product_name || item.name),
    // เพิ่ม debug สำหรับ options ที่ไม่มีข้อมูล
    optionsWithoutData: options?.filter(item => !item.product_name && !item.name),
    // เพิ่ม debug สำหรับ options ที่มีข้อมูลและ status = 'active'
    optionsWithDataAndActive: options?.filter(item => item.status === 'active' && (item.product_name || item.name)),
    // เพิ่ม debug สำหรับ options ที่มีข้อมูลและ qty > 0
    optionsWithDataAndQty: options?.filter(item => Number(item.remaining_quantity1) > 0 && (item.product_name || item.name))
  });

  useEffect(() => {
    console.log(`🔍 SearchableSelectField [${label}] useEffect:`, {
      options,
      searchTerm,
      optionsLength: options?.length || 0,
      // เพิ่ม debug สำหรับ options
      optionsSample: options?.slice(0, 3),
      optionsKeys: options?.[0] ? Object.keys(options[0]) : [],
      // เพิ่ม debug สำหรับ options ที่มีข้อมูล
      optionsWithData: options?.filter(item => item.product_name || item.name),
      // เพิ่ม debug สำหรับ options ที่ไม่มีข้อมูล
      optionsWithoutData: options?.filter(item => !item.product_name && !item.name),
      // เพิ่ม debug สำหรับ options ที่มีข้อมูลและ status = 'active'
      optionsWithDataAndActive: options?.filter(item => item.status === 'active' && (item.product_name || item.name)),
      // เพิ่ม debug สำหรับ options ที่มีข้อมูลและ qty > 0
      optionsWithDataAndQty: options?.filter(item => Number(item.remaining_quantity1) > 0 && (item.product_name || item.name))
    });
    
    const filtered = options.filter(option => 
      option.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.product_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.surname?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log(`🔍 SearchableSelectField [${label}] filtered:`, {
      filteredCount: filtered.length,
      filtered: filtered,
      // เพิ่ม debug สำหรับ filtered
      filteredSample: filtered.slice(0, 3),
      searchTerm: searchTerm,
      // เพิ่ม debug สำหรับ filtered ที่มีข้อมูล
      filteredWithData: filtered.filter(item => item.product_name || item.name),
      // เพิ่ม debug สำหรับ filtered ที่ไม่มีข้อมูล
      filteredWithoutData: filtered.filter(item => !item.product_name && !item.name),
      // เพิ่ม debug สำหรับ filtered ที่มีข้อมูลและ status = 'active'
      filteredWithDataAndActive: filtered.filter(item => item.status === 'active' && (item.product_name || item.name)),
      // เพิ่ม debug สำหรับ filtered ที่มีข้อมูลและ qty > 0
      filteredWithDataAndQty: filtered.filter(item => Number(item.remaining_quantity1) > 0 && (item.product_name || item.name))
    });
    
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  const selectedOption = options.find(option => option.id === value);

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}{required && ' *'}</label>
      <div className="relative">
        <input
          type="text"
          value={isOpen ? searchTerm : (selectedOption?.displayName || selectedOption?.name || selectedOption?.product_name || selectedOption?.full_name || selectedOption?.fullName || selectedOption?.nickname || '')}
          onChange={(e) => {
            if (isOpen) {
              setSearchTerm(e.target.value);
            }
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm('');
          }}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 200);
          }}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          required={required}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {console.log(`🔍 SearchableSelectField [${label}] rendering dropdown with:`, {
              filteredOptionsCount: filteredOptions?.length || 0,
              filteredOptions: filteredOptions,
              // เพิ่ม debug สำหรับ filteredOptions
              filteredOptionsSample: filteredOptions?.slice(0, 3),
              filteredOptionsKeys: filteredOptions?.[0] ? Object.keys(filteredOptions[0]) : [],
              searchTerm: searchTerm,
              isOpen: isOpen,
              // เพิ่ม debug สำหรับ filteredOptions ที่มีข้อมูล
              filteredOptionsWithData: filteredOptions?.filter(item => item.product_name || item.name),
              // เพิ่ม debug สำหรับ filteredOptions ที่ไม่มีข้อมูล
              filteredOptionsWithoutData: filteredOptions?.filter(item => !item.product_name && !item.name),
              // เพิ่ม debug สำหรับ options ที่ส่งมา
              originalOptions: options,
              originalOptionsCount: options?.length || 0,
              // เพิ่ม debug สำหรับ options ที่มีข้อมูล
              originalOptionsWithData: options?.filter(item => item.product_name || item.name),
              // เพิ่ม debug สำหรับ options ที่ไม่มีข้อมูล
              originalOptionsWithoutData: options?.filter(item => !item.product_name && !item.name),
              // เพิ่ม debug สำหรับ options ที่มีข้อมูลและ status = 'active'
              originalOptionsWithDataAndActive: options?.filter(item => item.status === 'active' && (item.product_name || item.name)),
              // เพิ่ม debug สำหรับ options ที่มีข้อมูลและ qty > 0
              originalOptionsWithDataAndQty: options?.filter(item => Number(item.remaining_quantity1) > 0 && (item.product_name || item.name))
            })}
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    onChange({ target: { value: option.id } });
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <div className="font-medium">{option.displayName || option.name || option.product_name || option.full_name || option.fullName || option.nickname}</div>
                  {option.phone && <div className="text-xs text-gray-500">{option.phone}</div>}
                  {option.product_code && <div className="text-xs text-gray-500">{option.product_code}</div>}
                  {option.surname && <div className="text-xs text-gray-500">{option.surname}</div>}
                  {option.position && <div className="text-xs text-gray-400">{option.position}</div>}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">ไม่พบข้อมูล</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const RadioGroup = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
    <div className="flex gap-4">
      {options.map(option => (
        <label key={option} className="flex items-center gap-2 text-sm">
          <input 
            type="radio" 
            name={label} 
            value={option} 
            checked={value === option} 
            onChange={(e) => onChange(e.target.value)} 
          />
          {option}
        </label>
      ))}
    </div>
  </div>
);

const ContractForm = ({ 
  customers = [], 
  products = [], 
  employees = [], 
  onSubmit,
  selectedBranch,
  currentBranch,
  submitting = false
}) => {
  const [allCustomers, setAllCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [allInventory, setAllInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [allCheckers, setAllCheckers] = useState([]);
  const [loadingCheckers, setLoadingCheckers] = useState(false);
  const [allCollectors, setAllCollectors] = useState([]);
  const [loadingCollectors, setLoadingCollectors] = useState(false);

  console.log('ContractForm props:', { 
    customersCount: customers?.length || 0, 
    inventoryCount: products?.length || 0, 
    employeesCount: employees?.length || 0,
    selectedBranch,
    currentBranch,
    customers: customers
  });

  console.log('🔍 ContractForm selectedBranch check:', {
    selectedBranch,
    hasSelectedBranch: !!selectedBranch,
    type: typeof selectedBranch
  });

  console.log('🔍 ContractForm state:', {
    allCustomersCount: allCustomers?.length || 0,
    allInventoryCount: allInventory?.length || 0,
    allEmployeesCount: allEmployees?.length || 0,
    allCheckersCount: allCheckers?.length || 0,
    allCollectorsCount: allCollectors?.length || 0,
    loadingCustomers,
    loadingInventory,
    loadingEmployees,
    loadingCheckers,
    loadingCollectors,
    // เพิ่ม debug สำหรับ inventory
    allInventorySample: allInventory?.slice(0, 3),
    allInventoryStatuses: allInventory?.map(item => ({ id: item.id, status: item.status, qty: item.remaining_quantity1 })),
    // เพิ่ม debug สำหรับ inventory ที่จะใช้ใน SearchableSelectField
    inventoryForProductSelect: allInventory?.map(item => ({
      ...item,
      displayName: item.product_name || item.name || '',
      searchText: `${item.product_name || ''} ${item.product_code || ''}`.trim()
    })),
    // เพิ่ม debug สำหรับ inventory ที่มีข้อมูล
    inventoryWithData: allInventory?.filter(item => item.product_name || item.name),
    // เพิ่ม debug สำหรับ inventory ที่ไม่มีข้อมูล
    inventoryWithoutData: allInventory?.filter(item => !item.product_name && !item.name),
    // เพิ่ม debug สำหรับ inventory ที่มี status = 'active'
    activeInventory: allInventory?.filter(item => item.status === 'active'),
    // เพิ่ม debug สำหรับ inventory ที่มี qty > 0
    inventoryWithQty: allInventory?.filter(item => Number(item.remaining_quantity1) > 0)
  });

  console.log('ContractForm allCheckers data:', allCheckers);

  // Load customers from API
  useEffect(() => {
    const loadCustomers = async () => {
      if (!selectedBranch) return;
      
      try {
        setLoadingCustomers(true);
        console.log('Loading customers from API for branch:', selectedBranch);
        
        const response = await customersService.getAll(selectedBranch);
        console.log('Customers API response:', response);
        
        // Handle different response formats
        let customersData = [];
        if (response.data?.success && Array.isArray(response.data.data)) {
          customersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          customersData = response.data;
        } else if (response.data && Array.isArray(response.data)) {
          customersData = response.data;
        }
        
        console.log('Processed customers data:', customersData);
        setAllCustomers(customersData);
      } catch (error) {
        console.error('Error loading customers:', error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลลูกค้าได้",
          variant: "destructive"
        });
        setAllCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomers();
  }, [selectedBranch]);

  // Load inventory from API
  useEffect(() => {
    const loadInventory = async () => {
      if (!selectedBranch) return;
      
      try {
        setLoadingInventory(true);
        console.log('🔍 Loading inventory from API for branch:', selectedBranch);
        console.log('🔍 API call params:', { branchId: selectedBranch, limit: 1000 });
        
        const response = await inventoryService.getAll({ 
          branchId: selectedBranch,
          limit: 1000 // ใช้ limit สูงแทน getAll=true เพื่อให้ได้ข้อมูลทั้งหมด
        });
        console.log('🔍 Inventory API response:', response);
        console.log('🔍 Inventory API response.data:', response.data);
        console.log('🔍 Inventory API response.data.success:', response.data?.success);
        console.log('🔍 Inventory API response.data.data:', response.data?.data);
        console.log('🔍 Inventory API response.data.data length:', response.data?.data?.length);
        
        // Handle different response formats
        let inventoryData = [];
        if (response.data?.success && Array.isArray(response.data.data)) {
          inventoryData = response.data.data;
          console.log('🔍 Using response.data.data format');
        } else if (Array.isArray(response.data)) {
          inventoryData = response.data;
          console.log('🔍 Using response.data array format');
        } else if (response.data && Array.isArray(response.data)) {
          inventoryData = response.data;
          console.log('🔍 Using response.data array format (fallback)');
        } else {
          console.log('⚠️ Unknown response format:', response);
        }
        
        console.log('🔍 Processed inventory data:', inventoryData);
        console.log('🔍 Processed inventory data length:', inventoryData.length);
        console.log('🔍 Pagination info:', response.data?.pagination);
        if (inventoryData.length > 0) {
          console.log('🔍 Sample inventory item:', inventoryData[0]);
        }
        console.log('🔍 All inventory items count:', inventoryData.length);
        console.log('🔍 Active inventory items:', inventoryData.filter(item => item.status === 'active').length);
        console.log('🔍 Items with stock > 0:', inventoryData.filter(item => Number(item.remaining_quantity1) > 0).length);
        setAllInventory(inventoryData);
      } catch (error) {
        console.error('❌ Error loading inventory:', error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลสินค้าได้",
          variant: "destructive"
        });
        setAllInventory([]);
      } finally {
        setLoadingInventory(false);
      }
    };

    loadInventory();
  }, [selectedBranch]);

  // Load employees from API
  useEffect(() => {
    const loadEmployees = async () => {
      if (!selectedBranch) return;
      
      try {
        setLoadingEmployees(true);
        console.log('Loading employees from API for branch:', selectedBranch);
        
        const response = await employeesService.getAll(selectedBranch);
        console.log('Employees API response:', response);
        
        // Handle different response formats
        let employeesData = [];
        if (response.data?.success && Array.isArray(response.data.data)) {
          employeesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          employeesData = response.data;
        } else if (response.data && Array.isArray(response.data)) {
          employeesData = response.data;
        }
        
        console.log('Processed employees data:', employeesData);
        setAllEmployees(employeesData);
      } catch (error) {
        console.error('Error loading employees:', error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลพนักงานได้",
          variant: "destructive"
        });
        setAllEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, [selectedBranch]);

  // Load checkers from API
  useEffect(() => {
    console.log('🚀 Checkers useEffect triggered with selectedBranch:', selectedBranch);
    
    const loadCheckers = async () => {
      console.log('🔍 loadCheckers called with selectedBranch:', selectedBranch);
      
      if (!selectedBranch) {
        console.log('❌ No selectedBranch, skipping loadCheckers');
        return;
      }
      
      try {
        setLoadingCheckers(true);
        console.log('🔄 Loading checkers from API for branch:', selectedBranch);
        
        const response = await checkersService.getAll(selectedBranch);
        console.log('✅ Checkers API response:', response);
        
        // Handle different response formats
        let checkersData = [];
        if (response.data?.success && Array.isArray(response.data.data)) {
          checkersData = response.data.data;
          console.log('📊 Using response.data.data format');
        } else if (Array.isArray(response.data)) {
          checkersData = response.data;
          console.log('📊 Using response.data array format');
        } else if (response.data && Array.isArray(response.data)) {
          checkersData = response.data;
          console.log('📊 Using response.data array format (fallback)');
        } else {
          console.log('⚠️ Unknown response format:', response);
        }
        
        console.log('📋 Processed checkers data:', checkersData);
        console.log('📋 Sample checker item:', checkersData[0]);
        setAllCheckers(checkersData);
      } catch (error) {
        console.error('❌ Error loading checkers:', error);
        console.error('❌ Error details:', {
          message: error.message,
          stack: error.stack,
          response: error.response
        });
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลผู้ตรวจสอบได้",
          variant: "destructive"
        });
        setAllCheckers([]);
      } finally {
        setLoadingCheckers(false);
        console.log('🏁 loadCheckers completed');
      }
    };

    console.log('🚀 Setting up loadCheckers useEffect for selectedBranch:', selectedBranch);
    loadCheckers();
  }, [selectedBranch]);

  // Load collectors from API
  useEffect(() => {
    const loadCollectors = async () => {
      if (!selectedBranch) return;
      
      try {
        setLoadingCollectors(true);
        console.log('Loading collectors from API for branch:', selectedBranch);
        
        // Use the same API as CollectorsPage
        const response = await employeesService.getAll(selectedBranch);
        console.log('Collectors API response:', response);
        
        // Handle different response formats
        let employeesData = [];
        if (response.data?.success && Array.isArray(response.data.data)) {
          employeesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          employeesData = response.data;
        } else if (response.data && Array.isArray(response.data)) {
          employeesData = response.data;
        }
        
        // Filter only collectors (same logic as CollectorsPage)
        const collectorsData = employeesData.filter(emp => 
          emp.position === 'collector' || emp.position === 'พนักงานเก็บเงิน'
        );
        
        console.log('Processed collectors data:', collectorsData);
        setAllCollectors(collectorsData);
      } catch (error) {
        console.error('Error loading collectors:', error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลพนักงานเก็บเงินได้",
          variant: "destructive"
        });
        setAllCollectors([]);
      } finally {
        setLoadingCollectors(false);
      }
    };

    loadCollectors();
  }, [selectedBranch]);

  const [contractForm, setContractForm] = useState({
    contractNumber: '',
    customerId: '',
    customerDetails: {
      title: 'นาย',
      name: '',
      surname: '',
      nickname: '',
      age: '',
      idCard: '',
      address: '',
      moo: '',
      road: '',
      subdistrict: '',
      district: '',
      province: '',
      phone1: '', phone2: '', phone3: '',
      email: ''
    },
    guarantorId: '',
    guarantorDetails: {
      title: 'นาย',
      name: '',
      surname: '',
      nickname: '',
      age: '',
      idCard: '',
      address: '',
      moo: '',
      road: '',
      subdistrict: '',
      district: '',
      province: '',
      phone1: '', phone2: '', phone3: '',
      email: ''
    },
    productId: '',
    productDetails: {
      name: '',
      description: '',
      price: '',
      category: '',
      model: '',
      serialNumber: ''
    },
    plan: {
      downPayment: '',
      monthlyPayment: '',
      months: '',
      collectionDate: ''
    },
          salespersonId: '',
      inspectorId: '',
      collectorId: '',
    contractDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (contractForm.customerId) {
      const customer = allCustomers.find(c => c.id === contractForm.customerId);
      if (customer) {
        console.log('Auto-filling customer details:', customer);
        setContractForm(prev => ({
          ...prev,
          customerDetails: {
            ...prev.customerDetails,
            title: customer.title || 'นาย',
            name: customer.name || '',
            surname: customer.surname || '',
            nickname: customer.nickname || '',
            age: customer.age || '',
            idCard: customer.id_card || customer.idCard || '',
            address: customer.address || '',
            moo: customer.moo || '',
            road: customer.road || '',
            subdistrict: customer.subdistrict || '',
            district: customer.district || '',
            province: customer.province || '',
            phone1: customer.phone1 || customer.phone || '',
            phone2: customer.phone2 || '',
            phone3: customer.phone3 || '',
            email: customer.email || ''
          }
        }));
        
        toast({
          title: "ข้อมูลลูกค้าถูกกรอกอัตโนมัติ",
          description: `ข้อมูลของ ${customer.name || customer.full_name} ถูกกรอกเรียบร้อยแล้ว`,
        });
      }
    }
  }, [contractForm.customerId, allCustomers]);

  useEffect(() => {
    if (contractForm.guarantorId) {
      console.log('🔍 Guarantor useEffect triggered with guarantorId:', contractForm.guarantorId);
      const guarantor = allCustomers.find(c => c.id === contractForm.guarantorId);
      console.log('🔍 Found guarantor:', guarantor);
      
      if (guarantor) {
        console.log('Auto-filling guarantor details:', guarantor);
        setContractForm(prev => {
          console.log('🔍 Previous contractForm state:', prev);
          const newState = {
            ...prev,
            guarantorDetails: {
              ...prev.guarantorDetails,
              title: guarantor.title || 'นาย',
              name: guarantor.name || '',
              surname: guarantor.surname || '',
              nickname: guarantor.nickname || '',
              age: guarantor.age || '',
              idCard: guarantor.id_card || guarantor.idCard || '',
              address: guarantor.address || '',
              moo: guarantor.moo || '',
              road: guarantor.road || '',
              subdistrict: guarantor.subdistrict || '',
              district: guarantor.district || '',
              province: guarantor.province || '',
              phone1: guarantor.phone1 || guarantor.phone || '',
              phone2: guarantor.phone2 || '',
              phone3: guarantor.phone3 || '',
              email: guarantor.email || ''
            }
          };
          console.log('🔍 New contractForm state:', newState);
          return newState;
        });
        
        toast({
          title: "ข้อมูลผู้ค้ำประกันถูกกรอกอัตโนมัติ",
          description: `ข้อมูลของ ${guarantor.name || guarantor.full_name} ถูกกรอกเรียบร้อยแล้ว`,
        });
      }
    }
  }, [contractForm.guarantorId, allCustomers]);



  useEffect(() => {
    if (contractForm.productId) {
      const inventory = allInventory.find(p => p.id === contractForm.productId);
      if (inventory) {
        console.log('Auto-filling inventory details:', inventory);
        setContractForm(prev => ({
          ...prev,
          productDetails: {
            ...prev.productDetails,
            name: inventory.product_name || '',
            description: inventory.remarks || '',
            price: '', // ไม่ดึงราคามา ให้กรอกเอง
            category: inventory.product_code || '',
            model: inventory.product_code || '',
            serialNumber: inventory.sequence || ''
          }
        }));
        
        toast({
          title: "ข้อมูลสินค้าถูกกรอกอัตโนมัติ",
          description: `ข้อมูลของ ${inventory.product_name} ถูกกรอกเรียบร้อยแล้ว`,
        });
      }
    }
  }, [contractForm.productId, allInventory]);

  const handleDetailChange = (section, field, value) => {
    setContractForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  const handleSelectChange = (field, value) => {
    console.log('🔍 handleSelectChange called:', { field, value });
    console.log('🔍 Previous contractForm state:', contractForm);
    
    setContractForm(prev => {
      const newState = { ...prev, [field]: value };
      console.log('🔍 New contractForm state after handleSelectChange:', newState);
      return newState;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🔍 ContractForm handleSubmit - contractForm:', contractForm);
    console.log('🔍 Product ID in form:', contractForm.productId);
    console.log('🔍 Product ID type:', typeof contractForm.productId);
    console.log('🔍 Product ID in form:', contractForm.productId);
    console.log('🔍 Product ID type:', typeof contractForm.productId);
    
    if (!contractForm.customerId || !contractForm.productId || !contractForm.salespersonId || !contractForm.inspectorId || !contractForm.collectorId) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        text: 'ลูกค้า, สินค้า, พนักงานขาย, ผู้ตรวจสอบ และพนักงานเก็บเงินเป็นข้อมูลที่จำเป็น',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#7c3aed'
      });
      return;
    }

    // ตรวจสอบข้อมูลการผ่อนชำระ
    if (!contractForm.plan.monthlyPayment || !contractForm.plan.months) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกข้อมูลการผ่อนชำระ',
        text: 'ผ่อนต่อเดือนและจำนวนงวดเป็นข้อมูลที่จำเป็น',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#7c3aed'
      });
      return;
    }

    // ตรวจสอบว่ามีการคำนวณราคาขายจริงแล้ว
    const downPayment = parseFloat(contractForm.plan.downPayment) || 0;
    const monthlyPayment = parseFloat(contractForm.plan.monthlyPayment) || 0;
    const months = parseInt(contractForm.plan.months) || 0;
    const totalInstallment = monthlyPayment * months;
    const totalAmount = downPayment + totalInstallment;

    if (totalAmount <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกข้อมูลการผ่อนชำระให้ถูกต้อง',
        text: 'ไม่สามารถคำนวณราคาขายจริงได้',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#7c3aed'
      });
      return;
    }

    // Prepare data for API
    const selectedInventory = allInventory.find(p => p.id === contractForm.productId);
    console.log('🔍 Selected inventory:', selectedInventory);
    console.log('🔍 All inventory:', allInventory);
    console.log('🔍 ราคาต้นทุนจากสินค้า:', selectedInventory?.cost_price || 0);
    
    const selectedCustomer = allCustomers.find(c => c.id === contractForm.customerId);
    const selectedCollector = allCollectors.find(c => c.id === contractForm.collectorId);
    
    // ราคาขายจริง = ดาวน์ + (ผ่อนต่อเดือน × จำนวนงวด)
    const installmentAmount = monthlyPayment;
    const remainingAmount = totalAmount - downPayment;

    // Calculate end date
    const startDate = new Date(contractForm.contractDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);
    
    const contractData = {
      // Contract basic info
      contractNumber: contractForm.contractNumber || undefined,
      contractDate: contractForm.contractDate,
      customerId: contractForm.customerId,
      productId: contractForm.productId,
      productName: selectedInventory?.product_name || '',
      totalAmount: totalAmount,
      installmentAmount: installmentAmount,
      remainingAmount: remainingAmount,
      installmentPeriod: months,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      branchId: selectedBranch,
      salespersonId: contractForm.salespersonId,
      inspectorId: contractForm.inspectorId,
      line: selectedCollector?.code || selectedCollector?.name || '',

      // Customer details (mapped to individual fields)
      customerTitle: contractForm.customerDetails.title,
      customerAge: parseInt(contractForm.customerDetails.age) || null,
      customerMoo: contractForm.customerDetails.moo,
      customerRoad: contractForm.customerDetails.road,
      customerSubdistrict: contractForm.customerDetails.subdistrict,
      customerDistrict: contractForm.customerDetails.district,
      customerProvince: contractForm.customerDetails.province,
      customerPhone1: contractForm.customerDetails.phone1,
      customerPhone2: contractForm.customerDetails.phone2,
      customerPhone3: contractForm.customerDetails.phone3,
      customerEmail: contractForm.customerDetails.email,
      customerIdCard: contractForm.customerDetails.idCard,
      customerName: contractForm.customerDetails.name,
      customerSurname: contractForm.customerDetails.surname,
      customerNickname: contractForm.customerDetails.nickname,
      // Additional customer fields
      customerAddress: contractForm.customerDetails.address,

      // Guarantor details (mapped to individual fields)
      guarantorId: contractForm.guarantorId,
      guarantorTitle: contractForm.guarantorDetails.title,
      guarantorName: contractForm.guarantorDetails.name,
      guarantorSurname: contractForm.guarantorDetails.surname,
      guarantorNickname: contractForm.guarantorDetails.nickname,
      guarantorAge: parseInt(contractForm.guarantorDetails.age) || null,
      guarantorIdCard: contractForm.guarantorDetails.idCard,
      guarantorAddress: contractForm.guarantorDetails.address,
      guarantorMoo: contractForm.guarantorDetails.moo,
      guarantorRoad: contractForm.guarantorDetails.road,
      guarantorSubdistrict: contractForm.guarantorDetails.subdistrict,
      guarantorDistrict: contractForm.guarantorDetails.district,
      guarantorProvince: contractForm.guarantorDetails.province,
      guarantorPhone1: contractForm.guarantorDetails.phone1,
      guarantorPhone2: contractForm.guarantorDetails.phone2,
      guarantorPhone3: contractForm.guarantorDetails.phone3,
      guarantorEmail: contractForm.guarantorDetails.email,

      // Product details
      productDescription: contractForm.productDetails.description,
      productCategory: contractForm.productDetails.category,
      productModel: contractForm.productDetails.model,
      productSerialNumber: contractForm.productDetails.serialNumber,
      // Additional product fields from form
      productName: contractForm.productDetails.name || selectedInventory?.product_name || '',
      
      // ราคาต้นทุน (ต้นทุนขาย) - ดึงจากราคาต้นทุนของสินค้าใน inventory
      costPrice: selectedInventory?.cost_price || 0,

      // Payment plan
      downPayment: downPayment,
      monthlyPayment: monthlyPayment,
      months: months,
      collectionDate: contractForm.plan.collectionDate,

      // Status
      status: 'active'
    };

    console.log('🔍 ContractForm handleSubmit - prepared contractData:', contractData);
    
    // แสดง Swal confirmation ก่อนสร้างสัญญา
    Swal.fire({
      title: 'ยืนยันการสร้างสัญญา',
      html: `
        <div class="text-left">
          <p><strong>ลูกค้า:</strong> ${selectedCustomer?.name || 'ไม่ระบุ'}</p>
          <p><strong>สินค้า:</strong> ${selectedInventory?.product_name || 'ไม่ระบุ'}</p>
          <p><strong>ราคาขายจริง:</strong> ${totalAmount.toLocaleString()} บาท</p>
          <p><strong>เงินดาวน์:</strong> ${downPayment.toLocaleString()} บาท</p>
          <p><strong>ผ่อนต่อเดือน:</strong> ${monthlyPayment.toLocaleString()} บาท</p>
          <p><strong>จำนวนงวด:</strong> ${months} งวด</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'สร้างสัญญา',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // แสดง loading
        Swal.fire({
          title: 'กำลังสร้างสัญญา...',
          text: 'กรุณารอสักครู่',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // เรียก onSubmit
        onSubmit(contractData);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-600" />
        สร้างสัญญาใหม่
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Customer Section */}
        <FormSection title="รายละเอียดลูกค้า" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <SearchableSelectField 
              label="ค้นหาลูกค้า" 
              value={contractForm.customerId} 
              onChange={(e) => handleSelectChange('customerId', e.target.value)} 
              options={allCustomers} 
              placeholder={loadingCustomers ? "กำลังโหลดข้อมูล..." : "--พิมพ์ค้นหาลูกค้า--"} 
              required
            />
            <SearchableSelectField 
              label="ค้นหาผู้ค้ำ" 
              value={contractForm.guarantorId} 
              onChange={(e) => handleSelectChange('guarantorId', e.target.value)} 
              options={allCustomers} 
              placeholder={loadingCustomers ? "กำลังโหลดข้อมูล..." : "--พิมพ์ค้นหาผู้ค้ำ--"}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <InputField 
                  label="เลขสัญญา (ไม่บังคับ)" 
                  value={contractForm.contractNumber} 
                  onChange={(e) => handleSelectChange('contractNumber', e.target.value)} 
                  placeholder="พิมพ์เลขสัญญาเอง หรือปล่อยว่างให้ระบบสร้างอัตโนมัติ" 
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={() => {
                    const date = new Date();
                    const year = date.getFullYear().toString().slice(-2);
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                    const generatedNumber = `CT${year}${month}${day}${random}`;
                    handleSelectChange('contractNumber', generatedNumber);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  สร้างอัตโนมัติ
                </Button>
              </div>
            </div>
            <InputField label="วันที่" type="date" value={contractForm.contractDate} onChange={(e) => handleSelectChange('contractDate', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <RadioGroup label="คำนำหน้าชื่อ" value={contractForm.customerDetails.title} onChange={(value) => handleDetailChange('customerDetails', 'title', value)} options={['นาย', 'นาง', 'นางสาว']} />
            <InputField label="ชื่อ-สกุล" value={contractForm.customerDetails.name} onChange={(e) => handleDetailChange('customerDetails', 'name', e.target.value)} placeholder="ชื่อ-สกุล" required/>
            <InputField label="ชื่อเล่น" value={contractForm.customerDetails.nickname} onChange={(e) => handleDetailChange('customerDetails', 'nickname', e.target.value)} placeholder="ชื่อเล่น"/>
            <InputField label="อายุ" value={contractForm.customerDetails.age} onChange={(e) => handleDetailChange('customerDetails', 'age', e.target.value)} placeholder="อายุ" type="number"/>
            <InputField label="เลขบัตรประชาชน" value={contractForm.customerDetails.idCard} onChange={(e) => handleDetailChange('customerDetails', 'idCard', e.target.value)} placeholder="เลขบัตรประชาชน"/>
            <InputField label="บ้านเลขที่" value={contractForm.customerDetails.address} onChange={(e) => handleDetailChange('customerDetails', 'address', e.target.value)} placeholder="บ้านเลขที่"/>
            <InputField label="หมู่ที่" value={contractForm.customerDetails.moo} onChange={(e) => handleDetailChange('customerDetails', 'moo', e.target.value)} placeholder="หมู่ที่"/>
            <InputField label="ถนน" value={contractForm.customerDetails.road} onChange={(e) => handleDetailChange('customerDetails', 'road', e.target.value)} placeholder="ถนน"/>
            <InputField label="ตำบล/แขวง" value={contractForm.customerDetails.subdistrict} onChange={(e) => handleDetailChange('customerDetails', 'subdistrict', e.target.value)} placeholder="ตำบล/แขวง"/>
            <InputField label="อำเภอ/เขต" value={contractForm.customerDetails.district} onChange={(e) => handleDetailChange('customerDetails', 'district', e.target.value)} placeholder="อำเภอ/เขต"/>
            <InputField label="จังหวัด" value={contractForm.customerDetails.province} onChange={(e) => handleDetailChange('customerDetails', 'province', e.target.value)} placeholder="จังหวัด"/>
            <InputField label="โทรศัพท์ 1" value={contractForm.customerDetails.phone1} onChange={(e) => handleDetailChange('customerDetails', 'phone1', e.target.value)} placeholder="เบอร์โทรศัพท์" required/>
            <InputField label="โทรศัพท์ 2" value={contractForm.customerDetails.phone2} onChange={(e) => handleDetailChange('customerDetails', 'phone2', e.target.value)} placeholder="เบอร์โทรศัพท์สำรอง"/>
            <InputField label="โทรศัพท์ 3" value={contractForm.customerDetails.phone3} onChange={(e) => handleDetailChange('customerDetails', 'phone3', e.target.value)} placeholder="เบอร์โทรศัพท์บ้าน"/>
          </div>
        </FormSection>

        {/* Guarantor Section */}
        <FormSection title="รายละเอียดผู้ค้ำ" icon={Shield}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <RadioGroup label="คำนำหน้าชื่อ" value={contractForm.guarantorDetails.title} onChange={(value) => handleDetailChange('guarantorDetails', 'title', value)} options={['นาย', 'นาง', 'นางสาว']} />
            <InputField label="ชื่อ-สกุล" value={contractForm.guarantorDetails.name} onChange={(e) => handleDetailChange('guarantorDetails', 'name', e.target.value)} placeholder="ชื่อ-สกุล" />
            <InputField label="ชื่อเล่น" value={contractForm.guarantorDetails.nickname} onChange={(e) => handleDetailChange('guarantorDetails', 'nickname', e.target.value)} placeholder="ชื่อเล่น"/>
            <InputField label="อายุ" value={contractForm.guarantorDetails.age} onChange={(e) => handleDetailChange('guarantorDetails', 'age', e.target.value)} placeholder="อายุ" type="number"/>
            <InputField label="เลขบัตรประชาชน" value={contractForm.guarantorDetails.idCard} onChange={(e) => handleDetailChange('guarantorDetails', 'idCard', e.target.value)} placeholder="เลขบัตรประชาชน"/>
            <InputField label="บ้านเลขที่" value={contractForm.guarantorDetails.address} onChange={(e) => handleDetailChange('guarantorDetails', 'address', e.target.value)} placeholder="บ้านเลขที่"/>
            <InputField label="หมู่ที่" value={contractForm.guarantorDetails.moo} onChange={(e) => handleDetailChange('guarantorDetails', 'moo', e.target.value)} placeholder="หมู่ที่"/>
            <InputField label="ถนน" value={contractForm.guarantorDetails.road} onChange={(e) => handleDetailChange('guarantorDetails', 'road', e.target.value)} placeholder="ถนน"/>
            <InputField label="ตำบล/แขวง" value={contractForm.guarantorDetails.subdistrict} onChange={(e) => handleDetailChange('guarantorDetails', 'subdistrict', e.target.value)} placeholder="ตำบล/แขวง"/>
            <InputField label="อำเภอ/เขต" value={contractForm.guarantorDetails.district} onChange={(e) => handleDetailChange('guarantorDetails', 'district', e.target.value)} placeholder="อำเภอ/เขต"/>
            <InputField label="จังหวัด" value={contractForm.guarantorDetails.province} onChange={(e) => handleDetailChange('guarantorDetails', 'province', e.target.value)} placeholder="จังหวัด"/>
            <InputField label="โทรศัพท์ 1" value={contractForm.guarantorDetails.phone1} onChange={(e) => handleDetailChange('guarantorDetails', 'phone1', e.target.value)} placeholder="เบอร์โทรศัพท์"/>
            <InputField label="โทรศัพท์ 2" value={contractForm.guarantorDetails.phone2} onChange={(e) => handleDetailChange('guarantorDetails', 'phone2', e.target.value)} placeholder="เบอร์โทรศัพท์สำรอง"/>
            <InputField label="โทรศัพท์ 3" value={contractForm.guarantorDetails.phone3} onChange={(e) => handleDetailChange('guarantorDetails', 'phone3', e.target.value)} placeholder="เบอร์โทรศัพท์บ้าน"/>
          </div>
        </FormSection>

        {/* Product Section */}
        <FormSection title="รายละเอียดสินค้าและแผนการผ่อน" icon={Package}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {console.log('🔍 ContractForm: Rendering product SearchableSelectField with:', {
                allInventoryCount: allInventory?.length || 0,
                allInventory: allInventory,
                filteredInventory: allInventory.filter(item => item.status === 'active' && Number(item.remaining_quantity1) > 0),
                activeWithQtyCount: allInventory.filter(item => item.status === 'active' && Number(item.remaining_quantity1) > 0).length,
                // เพิ่ม debug สำหรับ options ที่จะส่งไป SearchableSelectField
                optionsToSend: allInventory.map(item => ({
                  ...item,
                  displayName: item.product_name || item.name || '',
                  searchText: `${item.product_name || ''} ${item.product_code || ''}`.trim()
                })),
                // เพิ่ม debug สำหรับ inventory statuses
                inventoryStatuses: allInventory?.map(item => ({ 
                  id: item.id, 
                  status: item.status, 
                  qty: item.remaining_quantity1,
                  name: item.product_name || item.name 
                })),
                // เพิ่ม debug สำหรับ inventory ที่มี status = 'active'
                activeInventory: allInventory?.filter(item => item.status === 'active'),
                // เพิ่ม debug สำหรับ inventory ที่มี qty > 0
                inventoryWithQty: allInventory?.filter(item => Number(item.remaining_quantity1) > 0),
                // เพิ่ม debug สำหรับ inventory ที่มีข้อมูล
                inventoryWithData: allInventory?.filter(item => item.product_name || item.name),
                // เพิ่ม debug สำหรับ inventory ที่ไม่มีข้อมูล
                inventoryWithoutData: allInventory?.filter(item => !item.product_name && !item.name),
                // เพิ่ม debug สำหรับ inventory ที่มีข้อมูลและ status = 'active'
                activeInventoryWithData: allInventory?.filter(item => item.status === 'active' && (item.product_name || item.name)),
                // เพิ่ม debug สำหรับ inventory ที่มีข้อมูลและ qty > 0
                inventoryWithDataAndQty: allInventory?.filter(item => Number(item.remaining_quantity1) > 0 && (item.product_name || item.name))
              })}
              <SearchableSelectField 
                label="ชนิดสินค้า" 
                value={contractForm.productId} 
                onChange={(e) => handleSelectChange('productId', e.target.value)} 
                options={allInventory
                  .filter(item => item.status === 'active' && Number(item.remaining_quantity1) > 0)
                  .map(item => ({
                    ...item,
                    displayName: `${item.product_name || ''}${item.shop_name ? ` | ร้าน: ${item.shop_name}` : ''}${item.receive_date ? ` | รับ: ${new Date(item.receive_date).toLocaleDateString('th-TH')}` : ''}${item.remaining_quantity1 ? ` | คงเหลือ: ${item.remaining_quantity1} ชิ้น` : ''}`,
                    searchText: `${item.product_name || ''} ${item.product_code || ''} ${item.shop_name || ''}`.trim()
                  }))
                } 
                placeholder={loadingInventory ? "กำลังโหลดข้อมูล..." : "--พิมพ์ค้นหาสินค้า--"} 
                required
              />
              

              <InputField 
                label="ราคาขายจริง" 
                value={(() => {
                  const downPayment = parseFloat(contractForm.plan.downPayment) || 0;
                  const monthlyPayment = parseFloat(contractForm.plan.monthlyPayment) || 0;
                  const months = parseInt(contractForm.plan.months) || 0;
                  const totalInstallment = monthlyPayment * months;
                  const grandTotal = downPayment + totalInstallment;
                  return grandTotal > 0 ? grandTotal.toString() : '';
                })()} 
                onChange={(e) => handleDetailChange('productDetails', 'price', e.target.value)} 
                placeholder="คำนวณอัตโนมัติ" 
                type="number" 
                required 
                disabled
              />

              <InputField label="รุ่น" value={contractForm.productDetails.model} onChange={(e) => handleDetailChange('productDetails', 'model', e.target.value)} placeholder="รุ่น"/>
              <InputField label="S/N" value={contractForm.productDetails.serialNumber} onChange={(e) => handleDetailChange('productDetails', 'serialNumber', e.target.value)} placeholder="Serial Number"/>
              <InputField label="ดาวน์" value={contractForm.plan.downPayment} onChange={(e) => handleDetailChange('plan', 'downPayment', e.target.value)} placeholder="เงินดาวน์" type="number"/>
              <InputField label="ผ่อน/เดือน" value={contractForm.plan.monthlyPayment} onChange={(e) => handleDetailChange('plan', 'monthlyPayment', e.target.value)} placeholder="ผ่อนต่อเดือน" type="number" required/>
              <InputField label="จำนวนงวด" value={contractForm.plan.months} onChange={(e) => handleDetailChange('plan', 'months', e.target.value)} placeholder="จำนวนเดือน" type="number" required/>
              <InputField label="เก็บทุกวันที่" value={contractForm.plan.collectionDate} onChange={(e) => handleDetailChange('plan', 'collectionDate', e.target.value)} placeholder="ว-ด-ป เช่น 31-12-2564"/>
          </div>
        </FormSection>
        
        {/* Employee Section */}
        <FormSection title="พนักงาน" icon={UserCheck}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SearchableSelectField 
                  label="พนักงานขาย" 
                  value={contractForm.salespersonId} 
                  onChange={(e) => handleSelectChange('salespersonId', e.target.value)} 
                  options={allEmployees} 
                  placeholder={loadingEmployees ? "กำลังโหลดข้อมูล..." : "--เลือกพนักงานขาย--"} 
                  required
                />
                <SearchableSelectField 
                  label="ผู้ตรวจสอบ" 
                  value={contractForm.inspectorId} 
                  onChange={(e) => handleSelectChange('inspectorId', e.target.value)} 
                  options={allCheckers} 
                  placeholder={loadingCheckers ? "กำลังโหลดข้อมูล..." : "--เลือกผู้ตรวจสอบ--"} 
                  required
                />
                <SearchableSelectField 
                  label="สาย (พนักงานเก็บเงิน)" 
                  value={contractForm.collectorId} 
                  onChange={(e) => handleSelectChange('collectorId', e.target.value)} 
                  options={allCollectors} 
                  placeholder={loadingCollectors ? "กำลังโหลดข้อมูล..." : "--เลือกพนักงานเก็บเงิน--"}
                />
            </div>
        </FormSection>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={submitting}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                กำลังสร้างสัญญา...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                สร้างสัญญา
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContractForm;