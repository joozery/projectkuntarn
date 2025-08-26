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
  const [sortField, setSortField] = useState('contractNumber');
  const [sortDirection, setSortDirection] = useState('asc');
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
      let contractsData = contractsRes.data?.success ? contractsRes.data.data : (contractsRes.data || []);
      const customersData = customersRes.data?.success ? customersRes.data.data : (customersRes.data || []);
      const inventoryData = inventoryRes.data?.success ? inventoryRes.data.data : (inventoryRes.data || []);
      const employeesData = employeesRes.data?.success ? employeesRes.data.data : (employeesRes.data || []);

      // ลบข้อมูลสัญญาซ้ำกัน
      const originalLength = contractsData.length;
      contractsData = contractsData.filter((contract, index, self) => 
        index === self.findIndex(c => c.id === contract.id)
      );
      
      if (originalLength !== contractsData.length) {
        console.log('🔍 Removed duplicate contracts:', originalLength - contractsData.length);
        console.log('🔍 Original contracts:', originalLength);
        console.log('🔍 Unique contracts:', contractsData.length);
      }

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
      
      // ปิด loading Swal
      Swal.close();
      
      // Show success message with Swal
      Swal.fire({
        icon: 'success',
        title: 'สร้างสัญญาสำเร็จ!',
        html: `
          <div class="text-left">
            <p><strong>เลขสัญญา:</strong> ${newContract.contractNumber || 'ไม่ระบุ'}</p>
            <p><strong>ลูกค้า:</strong> ${newContract.customerName || 'ไม่ระบุ'}</p>
            <p><strong>สินค้า:</strong> ${newContract.productName || 'ไม่ระบุ'}</p>
            <p><strong>ราคารวม:</strong> ${newContract.totalAmount?.toLocaleString() || '0'} บาท</p>
            <p><strong>วันที่:</strong> ${new Date(newContract.contractDate).toLocaleDateString('th-TH')}</p>
          </div>
        `,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#7c3aed'
      });
      
      // Show warning if contract number was changed
      if (response.warning) {
        Swal.fire({
          icon: 'warning',
          title: 'แจ้งเตือน',
          text: response.warning,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#7c3aed'
        });
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      
      // ปิด loading Swal
      Swal.close();
      
      // Show error message with Swal
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถสร้างสัญญาได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#7c3aed'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const printContract = (contract) => {
    // Implement print functionality
    console.log('Printing contract:', contract);
    Swal.fire({
      icon: 'info',
      title: 'พิมพ์สัญญา',
      text: 'ฟังก์ชันพิมพ์จะถูกเพิ่มในภายหลัง',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#7c3aed'
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
    
    // Show success message with Swal
    Swal.fire({
      icon: 'success',
      title: 'แก้ไขสัญญาสำเร็จ!',
      html: `
        <div class="text-left">
          <p><strong>เลขสัญญา:</strong> ${updatedContract.contractNumber || 'ไม่ระบุ'}</p>
          <p><strong>ลูกค้า:</strong> ${updatedContract.customerName || 'ไม่ระบุ'}</p>
          <p><strong>สินค้า:</strong> ${updatedContract.productName || 'ไม่ระบุ'}</p>
          <p><strong>ราคารวม:</strong> ${updatedContract.totalAmount?.toLocaleString() || '0'} บาท</p>
        </div>
      `,
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#7c3aed'
    });
  };

  const handleBackFromEdit = () => {
    setShowEditForm(false);
    setEditingContractId(null);
  };

  // ฟังก์ชันการเรียงลำดับ
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // ฟังก์ชันเรียงลำดับข้อมูล
  const sortContracts = (contracts) => {
    return [...contracts].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // จัดการกับ null/undefined
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // แปลงเป็น string สำหรับการเปรียบเทียบ
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      // เรียงลำดับเลขสัญญาแบบพิเศษ (CT2401001, CT2401002, etc.)
      if (sortField === 'contractNumber') {
        // แยกตัวอักษรและตัวเลข
        const aMatch = aValue.match(/^([A-Z]+)(\d+)$/);
        const bMatch = bValue.match(/^([A-Z]+)(\d+)$/);
        
        if (aMatch && bMatch) {
          const aPrefix = aMatch[1];
          const bPrefix = bMatch[1];
          const aNumber = parseInt(aMatch[2]);
          const bNumber = parseInt(bMatch[2]);
          
          if (aPrefix === bPrefix) {
            return sortDirection === 'asc' ? aNumber - bNumber : bNumber - aNumber;
          }
          return aPrefix.localeCompare(bPrefix);
        }
      }

      // เรียงลำดับวันที่
      if (sortField === 'contractDate') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }

      // เรียงลำดับตัวเลข
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // เรียงลำดับข้อความ
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // ลบข้อมูลซ้ำกันก่อนกรอง
  const uniqueContracts = contracts.filter((contract, index, self) => 
    index === self.findIndex(c => c.id === contract.id)
  );

  const filteredContracts = uniqueContracts.filter(contract => {
    const matchesSearch = contract.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.salespersonName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // เรียงลำดับข้อมูลตามที่เลือก
  const sortedContracts = sortContracts(filteredContracts);

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
            {contracts.length !== uniqueContracts.length && (
              <span className="text-orange-600">
                (กรองแล้วจาก {contracts.length} สัญญา)
              </span>
            )}
            <span className="text-blue-600">
              | เรียงตาม: {sortField === 'contractNumber' ? 'เลขสัญญา' : 
                           sortField === 'contractDate' ? 'วันที่' : 
                           sortField === 'customerName' ? 'ลูกค้า' : 
                           sortField === 'totalAmount' ? 'ราคา' : 'ไม่ระบุ'} 
              ({sortDirection === 'asc' ? 'น้อย→มาก' : 'มาก→น้อย'})
            </span>
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
          
          {/* ตัวเลือกการเรียงลำดับ */}
          <select
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortField(field);
              setSortDirection(direction);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="contractNumber-asc">เลขสัญญา: น้อย → มาก</option>
            <option value="contractNumber-desc">เลขสัญญา: มาก → น้อย</option>
            <option value="contractDate-asc">วันที่: เก่า → ใหม่</option>
            <option value="contractDate-desc">วันที่: ใหม่ → เก่า</option>
            <option value="customerName-asc">ลูกค้า: ก-ฮ</option>
            <option value="customerName-desc">ลูกค้า: ฮ-ก</option>
            <option value="totalAmount-asc">ราคา: ต่ำ → สูง</option>
            <option value="totalAmount-desc">ราคา: สูง → ต่ำ</option>
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
            contracts={sortedContracts}
            onPrint={printContract}
            onView={handleViewContract}
            onEdit={handleEditContract}
            onDelete={handleDeleteContract}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
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