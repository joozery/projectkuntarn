import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ClipboardList, Plus, Search, Loader2 } from 'lucide-react';
import ContractForm from '@/components/forms/ContractForm';
import ContractsTable from '@/components/tables/ContractsTable';
import { contractsService } from '@/services/contractsService';
import { customersService } from '@/services/customersService';
import { productsService } from '@/services/productsService';
import { employeesService } from '@/services/employeesService';

const ContractsPage = ({ selectedBranch, currentBranch }) => {
  const [contracts, setContracts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedBranch]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [contractsRes, customersRes, productsRes, employeesRes] = await Promise.all([
        contractsService.getAll(selectedBranch),
        customersService.getAll(selectedBranch),
        productsService.getAll(selectedBranch),
        employeesService.getAll(selectedBranch)
      ]);

      setContracts(contractsRes.data || []);
      setCustomers(customersRes.data || []);
      setProducts(productsRes.data || []);
      setEmployees(employeesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive"
      });
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
        contractNumber: generateContractNumber(),
        branchId: selectedBranch,
        status: 'active'
      };
      
      const response = await contractsService.create(contractData);
      const newContract = response.data;
      
      setContracts(prev => [newContract, ...prev]);
      setShowForm(false);
      
      toast({
        title: "สำเร็จ",
        description: "สร้างสัญญาเรียบร้อยแล้ว",
      });
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
            onClick={() => setShowForm(!showForm)}
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
        <ContractForm
          customers={customers}
          products={products}
          employees={employees}
          onSubmit={handleContractSubmit}
          selectedBranch={selectedBranch}
          currentBranch={currentBranch}
          submitting={submitting}
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
          />
        </div>
      </div>

      {showDetailModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                รายละเอียดสัญญา {selectedContract.contractNumber}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    ข้อมูลลูกค้า
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ชื่อ:</span>
                      <span className="font-medium">{selectedContract.customerDetails.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">โทรศัพท์:</span>
                      <span className="font-medium">{selectedContract.customerDetails.phone1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ที่อยู่:</span>
                      <span className="font-medium text-right">{selectedContract.customerDetails.address || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    ข้อมูลสินค้า
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">สินค้า:</span>
                      <span className="font-medium">{selectedContract.product?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ราคา:</span>
                      <span className="font-medium">฿{selectedContract.productDetails.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">พนักงานขาย:</span>
                      <span className="font-medium">{selectedContract.salesperson?.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedContract.guarantorDetails && (selectedContract.guarantorDetails.name || selectedContract.guarantorDetails.phone1) && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    ข้อมูลผู้ค้ำประกัน
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ชื่อ:</span>
                      <span className="font-medium">{selectedContract.guarantorDetails.name || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ชื่อเล่น:</span>
                      <span className="font-medium">{selectedContract.guarantorDetails.nickname || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">โทรศัพท์:</span>
                      <span className="font-medium">{selectedContract.guarantorDetails.phone1 || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ที่อยู่:</span>
                      <span className="font-medium">{selectedContract.guarantorDetails.address || '-'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  รายละเอียดการผ่อน
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-600">วันที่ทำสัญญา</span>
                    <span className="font-medium">{new Date(selectedContract.contractDate).toLocaleDateString('th-TH')}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">เงินดาวน์</span>
                    <span className="font-medium">฿{selectedContract.plan.downPayment?.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">ผ่อนต่อเดือน</span>
                    <span className="font-medium text-green-600">฿{selectedContract.plan.monthlyPayment?.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">จำนวนงวด</span>
                    <span className="font-medium">{selectedContract.plan.months} เดือน</span>
                  </div>
                </div>
              </div>

              {selectedContract.payments && selectedContract.payments.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    ตารางการชำระเงิน
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3">งวดที่</th>
                          <th className="text-left py-2 px-3">กำหนดชำระ</th>
                          <th className="text-left py-2 px-3">จำนวนเงิน</th>
                          <th className="text-left py-2 px-3">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedContract.payments.slice(0, 6).map((payment, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-2 px-3">{payment.month}</td>
                            <td className="py-2 px-3">{new Date(payment.dueDate).toLocaleDateString('th-TH')}</td>
                            <td className="py-2 px-3">฿{payment.amount.toLocaleString()}</td>
                            <td className="py-2 px-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                payment.status === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {payment.status === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {selectedContract.payments.length > 6 && (
                      <div className="text-center py-2 text-gray-500 text-sm">
                        และอีก {selectedContract.payments.length - 6} งวด...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedContract.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">หมายเหตุ</h3>
                  <p className="text-gray-700">{selectedContract.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowDetailModal(false)}
              >
                ปิด
              </Button>
              <Button
                onClick={() => printContract(selectedContract)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                พิมพ์สัญญา
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContractsPage;