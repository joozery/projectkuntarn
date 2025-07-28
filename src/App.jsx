import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import AdminLayout from '@/components/layout/AdminLayout';
import { branchesService } from '@/services/branchesService';
import { toast } from '@/components/ui/use-toast';

function App() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load branches from API
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      
      const response = await branchesService.getAll();
      const branchesData = response.data || [];
      setBranches(branchesData);
      
      // Set first branch as selected if no branch is selected
      if (!selectedBranch && branchesData.length > 0) {
        setSelectedBranch(branchesData[0].id);
      }
      
      console.log('✅ Branches loaded successfully:', branchesData);
    } catch (error) {
      console.error('❌ Error loading branches:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลสาขาได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminLayout 
        branches={branches}
        setBranches={setBranches}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
      />
      <Toaster />
    </div>
  );
}

export default App;