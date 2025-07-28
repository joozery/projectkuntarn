import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InstallmentPlan from '@/components/InstallmentPlan';
import { Calculator, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { customersService } from '@/services/customersService';
import { productsService } from '@/services/productsService';
import { employeesService } from '@/services/employeesService';
import { contractsService } from '@/services/contractsService';

const InstallmentsPage = ({ selectedBranch, currentBranch }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedBranch) {
      loadData();
    } else {
      setCustomers([]);
      setProducts([]);
      setEmployees([]);
      setContracts([]);
    }
  }, [selectedBranch]);

  // Force refresh when component mounts
  useEffect(() => {
    if (selectedBranch) {
      const timer = setTimeout(() => {
        loadData();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading data for branch:', selectedBranch);
      
      if (!selectedBranch) {
        console.log('No selectedBranch, using empty arrays');
        setCustomers([]);
        setProducts([]);
        setEmployees([]);
        setContracts([]);
        return;
      }
      
      // Load all data in parallel
      const [customersRes, productsRes, employeesRes, contractsRes] = await Promise.all([
        customersService.getAll(selectedBranch),
        productsService.getAll(selectedBranch),
        employeesService.getAll(selectedBranch),
        contractsService.getAll(selectedBranch)
      ]);

      console.log('API responses:', { customersRes, productsRes, employeesRes, contractsRes });

      // Handle different response formats
      const customersData = customersRes.data?.success ? customersRes.data.data : (customersRes.data || []);
      const productsData = productsRes.data?.success ? productsRes.data.data : (productsRes.data || []);
      const employeesData = employeesRes.data?.success ? employeesRes.data.data : (employeesRes.data || []);
      const contractsData = contractsRes.data?.success ? contractsRes.data.data : (contractsRes.data || []);

      console.log('Processed data:', { 
        customers: customersData.length, 
        products: productsData.length, 
        employees: employeesData.length,
        contracts: contractsData.length 
      });

      setCustomers(customersData);
      setProducts(productsData);
      setEmployees(employeesData);
      setContracts(contractsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive"
      });
      // Set empty arrays on error
      setCustomers([]);
      setProducts([]);
      setEmployees([]);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const addInstallmentPlanAndContract = async (plan, contract) => {
    try {
      const contractData = {
        ...contract,
        ...plan,
        branchId: selectedBranch,
        status: 'active'
      };

      const response = await contractsService.create(contractData);
      const newContract = response.data;
      
      setContracts(prev => [newContract, ...prev]);

      toast({
        title: "สร้างสัญญาและแผนผ่อนสำเร็จ! 💳",
        description: `สร้างแผนการผ่อน ${plan.months} งวดสำหรับ ${contract.customerName} แล้ว`,
      });
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างสัญญาได้",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">สร้างสัญญาและแผนการผ่อน</h1>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">กำลังโหลดข้อมูล...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">สร้างสัญญาและแผนการผ่อน</h1>
          <p className="text-gray-600">สร้างสัญญาสำหรับลูกค้าและจัดการแผนการผ่อนชำระ - {currentBranch?.name}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calculator className="w-4 h-4" />
          <span>สัญญาทั้งหมด: {contracts.length} สัญญา</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <InstallmentPlan 
          products={products}
          customers={customers}
          employees={employees}
          onAddPlanAndContract={addInstallmentPlanAndContract}
          existingPlans={contracts}
        />
      </motion.div>
    </div>
  );
};

export default InstallmentsPage;