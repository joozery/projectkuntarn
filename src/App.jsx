import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import AdminLayout from '@/components/layout/AdminLayout';
import LoginPage from '@/components/auth/LoginPage';
import { branchesService } from '@/services/branchesService';
import { authService } from '@/services/authService';
import { toast } from '@/components/ui/use-toast';

function App() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Load branches when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadBranches();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

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

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setBranches([]);
    setSelectedBranch(null);
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

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminLayout 
        branches={branches}
        setBranches={setBranches}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <Toaster />
    </div>
  );
}

export default App;