import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ClipboardList, Plus, Search, Loader2, X, User, Package, DollarSign, Calendar, Shield } from 'lucide-react';
import ContractForm from '@/components/forms/ContractForm';
import ContractEditForm from '@/components/forms/ContractEditForm';
import ContractsTable from '@/components/tables/ContractsTable';
import ContractDetailModal from '@/components/ContractDetailModal';
import { contractsService } from '@/services/contractsService';
import { customersService } from '@/services/customersService';
import { inventoryService } from '@/services/inventoryService';
import { employeesService } from '@/services/employeesService';
import Swal from 'sweetalert2';

const ContractsPage = ({ selectedBranch, currentBranch }) => {
  const [contracts, setContracts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingContractId, setEditingContractId] = useState(null);

  useEffect(() => {
    if (selectedBranch) {
      loadData();
    } else {
      setContracts([]);
      setCustomers([]);
      setInventory([]);
      setEmployees([]);
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
        setContracts([]);
        setCustomers([]);
        setProducts([]);
        setEmployees([]);
        return;
      }
      
      // Load all data in parallel
      const [contractsRes, customersRes, inventoryRes, employeesRes] = await Promise.all([
        contractsService.getAll(selectedBranch),
        customersService.getAll(selectedBranch),
        inventoryService.getAll({ branchId: selectedBranch }),
        employeesService.getAll(selectedBranch)
      ]);

      console.log('API responses:', { contractsRes, customersRes, inventoryRes, employeesRes });

      // Handle different response formats
      const contractsData = contractsRes.data?.success ? contractsRes.data.data : (contractsRes.data || []);
      const customersData = customersRes.data?.success ? customersRes.data.data : (customersRes.data || []);
      const inventoryData = inventoryRes.data?.success ? inventoryRes.data.data : (inventoryRes.data || []);
      const employeesData = employeesRes.data?.success ? employeesRes.data.data : (employeesRes.data || []);

      console.log('Processed data:', { 
        contracts: contractsData.length, 
        customers: customersData.length, 
        inventory: inventoryData.length, 
        employees: employeesData.length 
      });

      setContracts(contractsData);
      setCustomers(customersData);
      setInventory(inventoryData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive"
      });
      // Set empty arrays on error
      setContracts([]);
      setCustomers([]);
      setProducts([]);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const generateContractNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CT${year}${month}${random}`;
  };

  const handleContractSubmit = async (formData) => {
    try {
      setSubmitting(true);
      
      const contractData = {
        ...formData,
        branchId: selectedBranch,
        status: 'active'
      };
      
      const response = await contractsService.create(contractData);
      const newContract = response.data;
      
      setContracts(prev => [newContract, ...prev]);
      setShowForm(false);
      
      // Show success message
      toast({
        title: "สำเร็จ",
        description: "สร้างสัญญาเรียบร้อยแล้ว",
      });
      
      // Show warning if contract number was changed
      if (response.warning) {
        toast({
          title: "แจ้งเตือน",
          description: response.warning,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างสัญญาได้",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const printContract = (contract) => {
    // Implement print functionality
    console.log('Printing contract:', contract);
    toast({
      title: "พิมพ์สัญญา",
      description: "ฟังก์ชันพิมพ์จะถูกเพิ่มในภายหลัง",
    });
  };

  const handleViewContract = (contract) => {
    setSelectedContract(contract);
    setShowDetailModal(true);
  };

  const handleEditContract = (contract) => {
    setEditingContractId(contract.id);
    setShowEditForm(true);
  };

  const handleDeleteContract = async (contract) => {
    // Show confirmation dialog with SweetAlert2
    const result = await Swal.fire({
      title: 'ยืนยันการลบสัญญา',
      html: `
        <div class="text-left">
          <p class="mb-2">คุณต้องการลบสัญญา <strong>${contract.contractNumber}</strong> ใช่หรือไม่?</p>
          <div class="bg-gray-100 p-3 rounded-lg text-sm">
            <p><strong>ลูกค้า:</strong> ${contract.customerName || 'ไม่ระบุ'}</p>
            <p><strong>สินค้า:</strong> ${contract.productName || 'ไม่ระบุ'}</p>
            <p><strong>วันที่:</strong> ${new Date(contract.contractDate).toLocaleDateString('th-TH')}</p>
          </div>
          <p class="text-red-600 text-sm mt-2">⚠️ การลบสัญญาจะไม่สามารถกู้คืนได้</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'ลบสัญญา',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-lg',
        confirmButton: 'rounded-md',
        cancelButton: 'rounded-md'
      }
    });

    if (result.isConfirmed) {
      try {
        // Show loading state
        Swal.fire({
          title: 'กำลังลบสัญญา...',
          text: 'กรุณารอสักครู่',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await contractsService.delete(contract.id);
        
        if (response.data?.success) {
          // Remove the contract from the list
          setContracts(prev => prev.filter(c => c.id !== contract.id));
          
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'ลบสัญญาเรียบร้อยแล้ว',
            text: `สัญญา ${contract.contractNumber} ถูกลบออกจากระบบแล้ว`,
            confirmButtonColor: '#059669',
            confirmButtonText: 'ตกลง'
          });
        } else {
          throw new Error(response.data?.message || 'เกิดข้อผิดพลาด');
        }
      } catch (error) {
        console.error('Error deleting contract:', error);
        
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.message || "ไม่สามารถลบสัญญาได้",
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'ตกลง'
        });
      }
    }
  };

  const handleEditSuccess = (updatedContract) => {
    // Update the contract in the list
    setContracts(prev => prev.map(contract => 
      contract.id === updatedContract.id ? updatedContract : contract
    ));
    setShowEditForm(false);
    setEditingContractId(null);
    toast({
      title: "สำเร็จ",
      description: "แก้ไขสัญญาเรียบร้อยแล้ว",
    });
  };

  const handleBackFromEdit = () => {
    setShowEditForm(false);
    setEditingContractId(null);
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.salespersonName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'active', label: 'ใช้งาน' },
    { value: 'completed', label: 'เสร็จสิ้น' },
    { value: 'cancelled', label: 'ยกเลิก' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">รายการสัญญา</h1>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">กำลังโหลดข้อมูลสัญญา...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายการสัญญา</h1>
          <p className="text-gray-600">จัดการสัญญาผ่อนชำระและพิมพ์ใบสัญญา - {currentBranch?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ClipboardList className="w-4 h-4" />
            <span>สัญญาทั้งหมด: {filteredContracts.length} สัญญา</span>
          </div>
          <Button 
            onClick={() => {
              console.log('🔍 ContractsPage: Toggle showForm from', showForm, 'to', !showForm);
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            สร้างสัญญา
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาเลขสัญญา, ลูกค้า, สินค้า, หรือพนักงาน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <>
          {console.log('🔍 ContractsPage: Rendering ContractForm with props:', {
            customersCount: customers?.length || 0,
            inventoryCount: inventory?.length || 0,
            employeesCount: employees?.length || 0,
            selectedBranch,
            currentBranch,
            showForm
          })}
          <ContractForm
            customers={customers}
            inventory={inventory}
            employees={employees}
            onSubmit={handleContractSubmit}
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
            submitting={submitting}
          />
        </>
      )}

      {showEditForm && editingContractId && (
        <ContractEditForm
          contractId={editingContractId}
          selectedBranch={selectedBranch}
          onBack={handleBackFromEdit}
          onSuccess={handleEditSuccess}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">รายการสัญญาทั้งหมด</h2>
        </div>
        
        <div className="p-6">
          <ContractsTable
            contracts={filteredContracts}
            onPrint={printContract}
            onView={handleViewContract}
            onEdit={handleEditContract}
            onDelete={handleDeleteContract}
          />
        </div>
      </div>

      {showDetailModal && selectedContract && (
        <ContractDetailModal
          contract={selectedContract}
          onClose={() => setShowDetailModal(false)}
          onEdit={handleEditContract}
          onPrint={printContract}
        />
      )}
    </div>
  );
};

export default ContractsPage;