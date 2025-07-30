import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { customersService } from '@/services/customersService';
import { productsService } from '@/services/productsService';
import { employeesService } from '@/services/employeesService';
import { checkersService } from '@/services/checkersService';
import { installmentsService } from '@/services/installmentsService';
import { 
  Calculator, 
  FileText, 
  User, 
  Shield, 
  Package, 
  DollarSign, 
  Calendar, 
  Percent,
  Check,
  UserCheck,
  Search,
  ArrowLeft
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

  useEffect(() => {
    const filtered = options.filter(option => 
      option.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.surname?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  const selectedOption = options.find(option => option.id === value);

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}{required && ' *'}</label>
      <div className="relative">
        <input
          type="text"
          value={isOpen ? searchTerm : (selectedOption?.name || selectedOption?.full_name || selectedOption?.fullName || selectedOption?.nickname || '')}
          onChange={(e) => {
            if (isOpen) {
              setSearchTerm(e.target.value);
            }
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          placeholder={placeholder}
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.map(option => (
            <div
              key={option.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                onChange({ target: { value: option.id } });
                setIsOpen(false);
                setSearchTerm('');
              }}
            >
              {option.name || option.full_name || option.fullName || option.nickname}
              {option.phone && <span className="text-gray-500 ml-2">({option.phone})</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RadioGroup = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
    <div className="flex gap-4">
      {options.map(option => (
        <label key={option} className="flex items-center">
          <input
            type="radio"
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="mr-2"
          />
          <span className="text-sm">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const ContractEditForm = ({ 
  contractId,
  selectedBranch,
  onBack,
  onSuccess
}) => {
  console.log('🔍 ContractEditForm rendered with props:', { contractId, selectedBranch });
  const [allCustomers, setAllCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [allEmployees, setAllEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [allCheckers, setAllCheckers] = useState([]);
  const [loadingCheckers, setLoadingCheckers] = useState(false);
  const [allCollectors, setAllCollectors] = useState([]);
  const [loadingCollectors, setLoadingCollectors] = useState(false);
  const [loadingContract, setLoadingContract] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [contractForm, setContractForm] = useState({
    contractNumber: '',
    contractDate: '',
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
    line: '',
    totalAmount: 0,
    installmentPeriod: 12,
    startDate: '',
    endDate: ''
  });

  // Debug: Log contractForm changes
  useEffect(() => {
    console.log('🔍 contractForm state changed:', contractForm);
    console.log('🔍 contractForm.contractNumber:', contractForm.contractNumber);
    console.log('🔍 contractForm.customerDetails.name:', contractForm.customerDetails.name);
    console.log('🔍 contractForm.productDetails.name:', contractForm.productDetails.name);
    console.log('🔍 contractForm.totalAmount:', contractForm.totalAmount);
  }, [contractForm]);

  // Load contract data
  useEffect(() => {
    const loadContract = async () => {
      if (!contractId) return;
      
      try {
        setLoadingContract(true);
        console.log('🔍 Loading contract with ID:', contractId);
        const response = await installmentsService.getById(contractId);
        
        console.log('🔍 API Response:', response);
        
        let contract;
        if (response.data?.success) {
          contract = response.data.data;
        } else if (response.data) {
          contract = response.data;
        } else {
          contract = response;
        }
        
        console.log('🔍 Contract data:', contract);
        console.log('🔍 Contract data keys:', Object.keys(contract || {}));
        console.log('🔍 Contract contractNumber:', contract?.contractNumber);
        console.log('🔍 Contract customerName:', contract?.customerName);
        console.log('🔍 Contract customerFullName:', contract?.customerFullName);
        console.log('🔍 Contract productName:', contract?.productName);
        console.log('🔍 Contract totalAmount:', contract?.totalAmount);
        console.log('🔍 Contract customerDetails:', contract?.customerDetails);
        console.log('🔍 Contract customerIdCard:', contract?.customerIdCard);
        console.log('🔍 Contract customerNickname:', contract?.customerNickname);
        console.log('🔍 Contract guarantorIdCard:', contract?.guarantorIdCard);
        console.log('🔍 Contract guarantorNickname:', contract?.guarantorNickname);
        console.log('🔍 Contract productDetails:', contract?.productDetails);
        console.log('🔍 Contract plan:', contract?.plan);
        
        if (contract) {
          // Map contract data to form based on backend API structure
          const formData = {
            contractNumber: contract.contractNumber || '',
            contractDate: contract.contractDate || contract.startDate || '',
            customerId: contract.customerId || '',
            customerDetails: {
              title: contract.customerDetails?.title || contract.customerTitle || 'นาย',
              name: contract.customerName || contract.customerFullName || '',
              surname: contract.customerSurname || '',
              nickname: contract.customerDetails?.nickname || contract.customerNickname || '',
              age: contract.customerDetails?.age || contract.customerAge || '',
              idCard: contract.customerDetails?.idCard || contract.customerIdCard || '',
              address: contract.customerAddress || '',
              moo: contract.customerDetails?.moo || contract.customerMoo || '',
              road: contract.customerDetails?.road || contract.customerRoad || '',
              subdistrict: contract.customerDetails?.subdistrict || contract.customerSubdistrict || '',
              district: contract.customerDetails?.district || contract.customerDistrict || '',
              province: contract.customerDetails?.province || contract.customerProvince || '',
              phone1: contract.customerDetails?.phone1 || contract.customerPhone1 || contract.customerPhone || '',
              phone2: contract.customerDetails?.phone2 || contract.customerPhone2 || '',
              phone3: contract.customerDetails?.phone3 || contract.customerPhone3 || '',
              email: contract.customerDetails?.email || contract.customerEmail || ''
            },
            guarantorId: contract.guarantorId || '',
            guarantorDetails: {
              title: contract.guarantorDetails?.title || contract.guarantorTitle || 'นาย',
              name: contract.guarantorDetails?.name || contract.guarantorName || '',
              surname: contract.guarantorDetails?.surname || contract.guarantorSurname || '',
              nickname: contract.guarantorDetails?.nickname || contract.guarantorNickname || '',
              age: contract.guarantorDetails?.age || contract.guarantorAge || '',
              idCard: contract.guarantorDetails?.idCard || contract.guarantorIdCard || '',
              address: contract.guarantorDetails?.address || contract.guarantorAddress || '',
              moo: contract.guarantorDetails?.moo || contract.guarantorMoo || '',
              road: contract.guarantorDetails?.road || contract.guarantorRoad || '',
              subdistrict: contract.guarantorDetails?.subdistrict || contract.guarantorSubdistrict || '',
              district: contract.guarantorDetails?.district || contract.guarantorDistrict || '',
              province: contract.guarantorDetails?.province || contract.guarantorProvince || '',
              phone1: contract.guarantorDetails?.phone1 || contract.guarantorPhone1 || '',
              phone2: contract.guarantorDetails?.phone2 || contract.guarantorPhone2 || '',
              phone3: contract.guarantorDetails?.phone3 || contract.guarantorPhone3 || '',
              email: contract.guarantorDetails?.email || contract.guarantorEmail || ''
            },
            productId: contract.productId || '',
            productDetails: {
              name: contract.productName || '',
              description: contract.productDetails?.description || contract.productDescription || '',
              price: contract.productPrice || contract.totalAmount || '',
              category: contract.productDetails?.category || contract.productCategory || '',
              model: contract.productDetails?.model || contract.productModel || '',
              serialNumber: contract.productDetails?.serialNumber || contract.productSerialNumber || ''
            },
            plan: {
              downPayment: contract.plan?.downPayment || contract.downPayment || '',
              monthlyPayment: contract.plan?.monthlyPayment || contract.monthlyPayment || contract.installmentAmount || '',
              months: contract.plan?.months || contract.months || contract.installmentPeriod || '',
              collectionDate: contract.plan?.collectionDate || contract.collectionDate || ''
            },
            salespersonId: contract.salespersonId || '',
            inspectorId: contract.inspectorId || '',
            collectorId: contract.collectorId || '', // Will be mapped from line if needed
            line: contract.line || '',
            totalAmount: contract.totalAmount || 0,
            installmentPeriod: contract.installmentPeriod || contract.months || 12,
            startDate: contract.startDate || '',
            endDate: contract.endDate || ''
          };
          
          console.log('🔍 Mapped form data:', formData);
          console.log('🔍 Mapped customerDetails:', formData.customerDetails);
          console.log('🔍 Mapped productDetails:', formData.productDetails);
          console.log('🔍 Mapped plan:', formData.plan);
          console.log('🔍 Setting contractForm with:', formData);
          setContractForm(formData);
          console.log('✅ setContractForm called');
        }
      } catch (error) {
        console.error('Error loading contract:', error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลสัญญาได้",
          variant: "destructive"
        });
      } finally {
        setLoadingContract(false);
      }
    };

    loadContract();
  }, [contractId]);

  // Load customers from API
  useEffect(() => {
    const loadCustomers = async () => {
      if (!selectedBranch) return;
      
      try {
        setLoadingCustomers(true);
        console.log('🔍 Loading customers for branch:', selectedBranch);
        const response = await customersService.getAll(selectedBranch);
        
        console.log('🔍 Customers response:', response);
        
        let customersData = [];
        if (response.data?.success && Array.isArray(response.data.data)) {
          customersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          customersData = response.data;
        }
        
        console.log('🔍 Processed customers data:', customersData);
        setAllCustomers(customersData);
      } catch (error) {
        console.error('Error loading customers:', error);
        console.warn('⚠️ Customers loading failed, continuing without customers data');
        setAllCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomers();
  }, [selectedBranch]);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      if (!selectedBranch) return;
      
      try {
        setLoadingProducts(true);
        console.log('🔍 Loading products for branch:', selectedBranch);
        const response = await productsService.getAll(selectedBranch);
        
        console.log('🔍 Products response:', response);
        
        let productsData = [];
        if (response.data?.success && Array.isArray(response.data.data)) {
          productsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          productsData = response.data;
        }
        
        console.log('🔍 Processed products data:', productsData);
        setAllProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
        console.warn('⚠️ Products loading failed, continuing without products data');
        setAllProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [selectedBranch]);

  // Load employees from API
  useEffect(() => {
    const loadEmployees = async () => {
      if (!selectedBranch) return;
      
      try {
        setLoadingEmployees(true);
        console.log('🔍 Loading employees for branch:', selectedBranch);
        const response = await employeesService.getAll(selectedBranch);
        
        console.log('🔍 Employees response:', response);
        
        let employeesData = [];
        if (response.data?.success && Array.isArray(response.data.data)) {
          employeesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          employeesData = response.data;
        }
        
        console.log('🔍 Processed employees data:', employeesData);
        setAllEmployees(employeesData);
      } catch (error) {
        console.error('Error loading employees:', error);
        console.warn('⚠️ Employees loading failed, continuing without employees data');
        setAllEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, [selectedBranch]);

  // Load checkers from API
  useEffect(() => {
    const loadCheckers = async () => {
      if (!selectedBranch) return;
      
      try {
        setLoadingCheckers(true);
        console.log('🔍 Loading checkers for branch:', selectedBranch);
        const response = await checkersService.getAll(selectedBranch);
        
        console.log('🔍 Checkers response:', response);
        
        let checkersData = [];
        if (response.data?.success && Array.isArray(response.data.data)) {
          checkersData = response.data.data;
        } else if (Array.isArray(response.data)) {
          checkersData = response.data;
        }
        
        console.log('🔍 Processed checkers data:', checkersData);
        setAllCheckers(checkersData);
      } catch (error) {
        console.error('Error loading checkers:', error);
        // Don't show error toast for checkers as it's not critical
        console.warn('⚠️ Checkers loading failed, continuing without checkers data');
        setAllCheckers([]);
      } finally {
        setLoadingCheckers(false);
      }
    };

    loadCheckers();
  }, [selectedBranch]);

  // Load collectors from API
  useEffect(() => {
    const loadCollectors = async () => {
      if (!selectedBranch) return;
      
      try {
        setLoadingCollectors(true);
        console.log('🔍 Loading collectors for branch:', selectedBranch);
        
        // Use employeesService and filter for collectors (same as ContractForm)
        const response = await employeesService.getAll(selectedBranch);
        
        console.log('🔍 Collectors response:', response);
        
        let employeesData = [];
        if (response.data?.success && Array.isArray(response.data.data)) {
          employeesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          employeesData = response.data;
        }
        
        // Filter for collectors
        const collectorsData = employeesData.filter(emp => 
          emp.position === 'collector' || emp.position === 'พนักงานเก็บเงิน'
        );
        
        console.log('🔍 Processed collectors data:', collectorsData);
        setAllCollectors(collectorsData);
      } catch (error) {
        console.error('Error loading collectors:', error);
        console.warn('⚠️ Collectors loading failed, continuing without collectors data');
        setAllCollectors([]);
      } finally {
        setLoadingCollectors(false);
      }
    };

    loadCollectors();
  }, [selectedBranch]);

  // Map collectorId from line when collectors data is loaded
  useEffect(() => {
    if (allCollectors.length > 0 && contractForm.line && !contractForm.collectorId) {
      // Try to find collector by line (code or name)
      const foundCollector = allCollectors.find(collector => 
        collector.code === contractForm.line || 
        collector.name === contractForm.line ||
        collector.full_name === contractForm.line
      );
      
      if (foundCollector) {
        console.log('🔍 Mapping collectorId from line:', contractForm.line, 'to collectorId:', foundCollector.id);
        setContractForm(prev => ({
          ...prev,
          collectorId: foundCollector.id
        }));
      }
    }
  }, [allCollectors, contractForm.line, contractForm.collectorId]);

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
    setContractForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔍 ContractEditForm handleSubmit - contractForm:', contractForm);
    
    if (!contractForm.customerId || !contractForm.productId || !contractForm.salespersonId || !contractForm.inspectorId || !contractForm.collectorId) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ลูกค้า, สินค้า, พนักงานขาย, ผู้ตรวจสอบ และพนักงานเก็บเงินเป็นข้อมูลที่จำเป็น",
        variant: "destructive"
      });
      return;
    }

    // Prepare data for API
    const selectedProduct = allProducts.find(p => p.id === contractForm.productId);
    const selectedCollector = allCollectors.find(c => c.id === contractForm.collectorId);
    
    const contractData = {
      ...contractForm,
      productName: selectedProduct?.name || contractForm.productDetails.name,
      line: selectedCollector?.code || selectedCollector?.name || contractForm.line || '',
      totalAmount: parseFloat(contractForm.productDetails.price) || contractForm.totalAmount,
      installmentPeriod: parseInt(contractForm.plan.months) || contractForm.installmentPeriod,
      startDate: contractForm.contractDate,
      endDate: (() => {
        const start = new Date(contractForm.contractDate);
        const months = parseInt(contractForm.plan.months) || contractForm.installmentPeriod;
        start.setMonth(start.getMonth() + months);
        return start.toISOString().split('T')[0];
      })(),
      plan: {
        ...contractForm.plan,
        monthlyPayment: parseFloat(contractForm.plan.monthlyPayment) || 0
      }
    };

    console.log('🔍 ContractEditForm handleSubmit - prepared contractData:', contractData);
    
    try {
      setSubmitting(true);
      const response = await installmentsService.update(contractId, contractData);
      
      if (response.data?.success) {
        toast({
          title: "สำเร็จ",
          description: "แก้ไขสัญญาเรียบร้อยแล้ว",
        });
        onSuccess && onSuccess(response.data.data);
      } else {
        throw new Error(response.data?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error updating contract:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถแก้ไขสัญญาได้",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingContract) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูลสัญญา...</p>
            <p className="text-sm text-gray-500 mt-2">Contract ID: {contractId}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            แก้ไขสัญญา
          </h2>
          <p className="text-sm text-gray-600 mt-1">เลขสัญญา: {contractForm.contractNumber}</p>
        </div>
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับ
        </Button>
      </div>
      
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
            <InputField 
              label="เลขสัญญา" 
              value={contractForm.contractNumber} 
              onChange={(e) => handleSelectChange('contractNumber', e.target.value)} 
              placeholder="เลขสัญญา" 
              required
            />
            <InputField 
              label="วันที่" 
              type="date" 
              value={contractForm.contractDate} 
              onChange={(e) => handleSelectChange('contractDate', e.target.value)} 
              required
            />
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
            <SearchableSelectField 
              label="ชนิดสินค้า" 
              value={contractForm.productId} 
              onChange={(e) => handleSelectChange('productId', e.target.value)} 
              options={allProducts} 
              placeholder={loadingProducts ? "กำลังโหลดข้อมูล..." : "--พิมพ์ค้นหาสินค้า--"} 
              required
            />
            <InputField label="ราคารวม" value={contractForm.productDetails.price} onChange={(e) => handleDetailChange('productDetails', 'price', e.target.value)} placeholder="ราคารวม" type="number" />
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
              label="สาย" 
              value={contractForm.collectorId} 
              onChange={(e) => handleSelectChange('collectorId', e.target.value)} 
              options={allCollectors} 
              placeholder={loadingCollectors ? "กำลังโหลดข้อมูล..." : "--เลือกสาย--"} 
              required
            />
          </div>
        </FormSection>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ยกเลิก
          </Button>
          <Button 
            type="submit" 
            disabled={submitting}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                กำลังแก้ไข...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                บันทึกการแก้ไข
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContractEditForm; 