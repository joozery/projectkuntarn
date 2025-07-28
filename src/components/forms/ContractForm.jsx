import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
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
  const [contractForm, setContractForm] = useState({
    customerId: '',
    customerDetails: {
      title: 'นาย',
      name: '',
      nickname: '',
      age: '',
      idCard: '',
      address: '',
      moo: '',
      road: '',
      subdistrict: '',
      district: '',
      province: '',
      phone1: '', phone2: '', phone3: ''
    },
    guarantorId: '',
    guarantorDetails: {
      title: 'นาย',
      name: '',
      nickname: '',
      age: '',
      idCard: '',
      address: '',
      moo: '',
      road: '',
      subdistrict: '',
      district: '',
      province: '',
      phone1: '', phone2: '', phone3: ''
    },
    productId: '',
    productDetails: {
      price: '',
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
    contractDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (contractForm.customerId) {
      const customer = customers.find(c => c.id === contractForm.customerId);
      if (customer) {
        setContractForm(prev => ({
          ...prev,
          customerDetails: {
            ...prev.customerDetails,
            name: customer.name,
            nickname: customer.nickname || '',
            idCard: customer.idCard || '',
            address: customer.address || '',
            phone1: customer.phone || '',
          }
        }));
      }
    }
  }, [contractForm.customerId, customers]);

  useEffect(() => {
    if (contractForm.guarantorId) {
        const guarantor = customers.find(c => c.id === contractForm.guarantorId);
        if (guarantor) {
            setContractForm(prev => ({
                ...prev,
                guarantorDetails: {
                    ...prev.guarantorDetails,
                    name: guarantor.name,
                    nickname: guarantor.nickname || '',
                    idCard: guarantor.idCard || '',
                    address: guarantor.address || '',
                    phone1: guarantor.phone || '',
                }
            }));
        }
    }
  }, [contractForm.guarantorId, customers]);

  useEffect(() => {
    if (contractForm.productId) {
      const product = products.find(p => p.id === contractForm.productId);
      if (product) {
        setContractForm(prev => ({
          ...prev,
          productDetails: {
            ...prev.productDetails,
            price: product.price,
            model: product.model || '',
            serialNumber: product.serialNumber || ''
          }
        }));
      }
    }
  }, [contractForm.productId, products]);

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
    setContractForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contractForm.customerId || !contractForm.productId || !contractForm.salespersonId || !contractForm.inspectorId) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ลูกค้า, สินค้า, พนักงานขาย และผู้ตรวจสอบเป็นข้อมูลที่จำเป็น",
        variant: "destructive"
      });
      return;
    }
    onSubmit(contractForm);
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
              <SelectField label="ค้นหาลูกค้า 1" value={contractForm.customerId} onChange={(e) => handleSelectChange('customerId', e.target.value)} options={customers} placeholder="--พิมพ์ค้นหาลูกค้า--" required/>
              <SelectField label="ค้นหาลูกค้า 2" value={''} onChange={()=>{}} options={customers} placeholder="--พิมพ์ค้นหาลูกค้า--"/>
          </div>
          <InputField label="วันที่" type="date" value={contractForm.contractDate} onChange={(e) => handleSelectChange('contractDate', e.target.value)} />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <SelectField label="ค้นหาผู้ค้ำ 1" value={contractForm.guarantorId} onChange={(e) => handleSelectChange('guarantorId', e.target.value)} options={customers} placeholder="--พิมพ์ค้นหาผู้ค้ำ--" />
              <SelectField label="ค้นหาผู้ค้ำ 2" value={''} onChange={()=>{}} options={customers} placeholder="--พิมพ์ค้นหาผู้ค้ำ--"/>
          </div>
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
              <SelectField label="ชนิดสินค้า" value={contractForm.productId} onChange={(e) => handleSelectChange('productId', e.target.value)} options={products} placeholder="--พิมพ์ค้นหาสินค้า--" required/>
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
                <SelectField label="พนักงานขาย" value={contractForm.salespersonId} onChange={(e) => handleSelectChange('salespersonId', e.target.value)} options={employees} placeholder="--เลือกพนักงานขาย--" required/>
                <SelectField label="ผู้ตรวจสอบ" value={contractForm.inspectorId} onChange={(e) => handleSelectChange('inspectorId', e.target.value)} options={employees} placeholder="--เลือกผู้ตรวจสอบ--" required/>
                <SelectField label="สาย" value={''} onChange={()=>{}} options={[]} placeholder="--พิมพ์ค้นหาสาย--"/>
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