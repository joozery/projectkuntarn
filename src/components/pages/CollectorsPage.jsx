import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Edit, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Building2,
  Loader2,
  ChevronUp,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';
import api from '@/lib/api';

const CollectorsPage = ({ selectedBranch, currentBranch }) => {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showEntries, setShowEntries] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCollector, setEditingCollector] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    fullName: '',
    phone: '',
    email: '',
    position: 'collector',
    branchId: selectedBranch || 1,
    status: 'active'
  });

  // Load collectors data
  useEffect(() => {
    loadCollectors();
  }, [selectedBranch, searchTerm, statusFilter]);

  const loadCollectors = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (selectedBranch) {
        params.branchId = selectedBranch;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      const response = await api.get('/employees', { params });
      
      if (response.data?.success) {
        // Filter only collectors
        const collectorsData = response.data.data.filter(emp => 
          emp.position === 'collector' || emp.position === 'พนักงานเก็บเงิน'
        );
        setCollectors(collectorsData);
      } else {
        setCollectors([]);
      }
    } catch (error) {
      console.error('Error loading collectors:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลพนักงานเก็บเงินได้",
        variant: "destructive"
      });
      setCollectors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.fullName) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ชื่อและชื่อ-สกุลเป็นข้อมูลที่จำเป็น",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingCollector) {
        // Update existing collector
        await api.put(`/employees/${editingCollector.id}`, {
          ...formData,
          position: 'collector'
        });
        
        toast({
          title: "อัปเดตสำเร็จ",
          description: "ข้อมูลพนักงานเก็บเงินได้รับการอัปเดตแล้ว",
        });
      } else {
        // Create new collector
        await api.post('/employees', {
          ...formData,
          position: 'collector'
        });
        
        toast({
          title: "เพิ่มสำเร็จ",
          description: "พนักงานเก็บเงินใหม่ถูกเพิ่มแล้ว",
        });
      }
      
      setShowAddForm(false);
      setEditingCollector(null);
      setFormData({
        name: '',
        surname: '',
        fullName: '',
        phone: '',
        email: '',
        position: 'collector',
        branchId: selectedBranch || 1,
        status: 'active'
      });
      
      loadCollectors();
    } catch (error) {
      console.error('Error saving collector:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (collector) => {
    setEditingCollector(collector);
    setFormData({
      name: collector.name || '',
      surname: collector.surname || '',
      fullName: collector.fullName || collector.full_name || '',
      phone: collector.phone || '',
      email: collector.email || '',
      position: 'collector',
      branchId: collector.branchId || collector.branch_id || selectedBranch || 1,
      status: collector.status || 'active'
    });
    setShowAddForm(true);
  };

  const handleDelete = async (collector) => {
    if (!confirm(`คุณต้องการลบพนักงานเก็บเงิน "${collector.fullName || collector.full_name}" ใช่หรือไม่?`)) {
      return;
    }

    try {
      await api.delete(`/employees/${collector.id}`);
      
      toast({
        title: "ลบสำเร็จ",
        description: "พนักงานเก็บเงินถูกลบแล้ว",
      });
      
      loadCollectors();
    } catch (error) {
      console.error('Error deleting collector:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบข้อมูลได้",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "ส่งออกข้อมูล",
      description: "ฟีเจอร์นี้จะเปิดใช้งานเร็วๆ นี้",
    });
  };

  const handlePrint = () => {
    toast({
      title: "พิมพ์รายงาน",
      description: "ฟีเจอร์นี้จะเปิดใช้งานเร็วๆ นี้",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'ทำงาน', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'ไม่ทำงาน', className: 'bg-red-100 text-red-800' },
      suspended: { label: 'ระงับ', className: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const filteredCollectors = collectors;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              จัดการพนักงานเก็บเงิน
            </h1>
            <p className="text-gray-600 mt-1">
              สาขา {currentBranch?.name || 'ทั้งหมด'} | พนักงานเก็บเงินทั้งหมด: {collectors.length} คน
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={loadCollectors}
              variant="outline"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              รีเฟรช
            </Button>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มพนักงานเก็บเงิน
            </Button>
            <Button
              onClick={handlePrint}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Printer className="w-4 h-4 mr-2" />
              พิมพ์รายงาน
            </Button>
            <Button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              ส่งออก
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Show Entries */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              แสดง
            </label>
            <select
              value={showEntries}
              onChange={(e) => setShowEntries(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10 entries</option>
              <option value={25}>25 entries</option>
              <option value={50}>50 entries</option>
              <option value={100}>100 entries</option>
            </select>
          </div>

          {/* สถานะ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานะ
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">ทั้งหมด</option>
              <option value="active">ทำงาน</option>
              <option value="inactive">ไม่ทำงาน</option>
              <option value="suspended">ระงับ</option>
            </select>
          </div>

          {/* ค้นหา */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ค้นหา
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, เบอร์โทร, อีเมล..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCollector ? 'แก้ไขพนักงานเก็บเงิน' : 'เพิ่มพนักงานเก็บเงินใหม่'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ชื่อ"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  สกุล
                </label>
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({...formData, surname: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="สกุล"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ-สกุล *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ชื่อ-สกุล"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทร
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="081-234-5678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  สถานะ
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">ทำงาน</option>
                  <option value="inactive">ไม่ทำงาน</option>
                  <option value="suspended">ระงับ</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                {editingCollector ? 'อัปเดต' : 'เพิ่มพนักงานเก็บเงิน'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingCollector(null);
                  setFormData({
                    name: '',
                    surname: '',
                    fullName: '',
                    phone: '',
                    email: '',
                    position: 'collector',
                    branchId: selectedBranch || 1,
                    status: 'active'
                  });
                }}
              >
                ยกเลิก
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Collectors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-2">
                    #
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    ชื่อ-สกุล
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    ตำแหน่ง
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    เบอร์โทร
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    อีเมล
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    สาขา
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  <div className="flex items-center gap-2">
                    สถานะ
                    <div className="flex flex-col">
                      <ChevronUp className="w-3 h-3 text-gray-400" />
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      <span>กำลังโหลดข้อมูล...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCollectors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>ไม่พบข้อมูลพนักงานเก็บเงิน</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCollectors.map((collector, index) => (
                  <motion.tr
                    key={collector.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 group"
                  >
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 bg-white sticky left-0 z-10 group-hover:bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {index + 1}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {collector.fullName || collector.full_name}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        พนักงานเก็บเงิน
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {collector.phone || '-'}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {collector.email || '-'}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-gray-400" />
                        {collector.branchName || collector.branch_name || '-'}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getStatusBadge(collector.status)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleEdit(collector)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          แก้ไข
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleDelete(collector)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          ลบ
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{collectors.length}</span> of{' '}
                <span className="font-medium">{collectors.length}</span> entries
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  First
                </Button>
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </Button>
                <Button
                  onClick={() => setCurrentPage(1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Last
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorsPage; 