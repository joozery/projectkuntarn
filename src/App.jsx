import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import AdminLayout from '@/components/layout/AdminLayout';
import LoginPage from '@/components/auth/LoginPage';
import NotFound404 from '@/components/NotFound404';
import { branchesService } from '@/services/branchesService';
import { authService } from '@/services/authService';
import { toast } from '@/components/ui/use-toast';

function App() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [is404Mode, setIs404Mode] = useState(false);

  // Check authentication status and 404 mode on app start
  useEffect(() => {
    checkAuthStatus();
    check404Mode();
  }, []);

  // Check 404 mode periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      check404Mode();
    }, 30000);

    return () => clearInterval(interval);
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

  const check404Mode = () => {
    try {
      const status404 = localStorage.getItem('simple_404_mode') === 'true';
      setIs404Mode(status404);
    } catch (error) {
      console.error('Error checking 404 mode:', error);
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
    console.log('🔑 Login success, user:', user);
    setCurrentUser(user);
    setIsAuthenticated(true);
    console.log('✅ State updated - isAuthenticated:', true, 'currentUser:', user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setBranches([]);
    setSelectedBranch(null);
  };

  // Show login page if not authenticated or not admin
  console.log('🔍 Auth check - isAuthenticated:', isAuthenticated, 'currentUser:', currentUser, 'role:', currentUser?.role);

  if (!isAuthenticated || !currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'super_admin')) {
    console.log('🚫 Showing login page');
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        <Toaster />
      </>
    );
  }

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


  console.log('✅ Showing dashboard - isAuthenticated:', isAuthenticated, 'currentUser:', currentUser);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Routes>
          <Route path="/" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/dashboard" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/branches" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/products" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/customers" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/installments" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/contracts" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/checkers" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/checkers/:checkerId/customers" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/checkers/:checkerId/report" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/collectors" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/reports" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/payments" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/returns" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/employees" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/salespeople" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/all-checker-customers" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/sales-index" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/import-data" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/admin-users" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/settings" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="/payment-schedule" element={
            <AdminLayout
              branches={branches}
              setBranches={setBranches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;