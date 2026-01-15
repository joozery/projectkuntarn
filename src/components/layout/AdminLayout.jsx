import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import AdminContent from '@/components/layout/AdminContent';

const AdminLayout = ({
  branches,
  setBranches,
  selectedBranch,
  setSelectedBranch,
  currentUser,
  onLogout
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customerData, setCustomerData] = useState(null);

  const currentBranch = branches.find(branch => branch.id === selectedBranch) || branches[0];

  // Get active tab from URL path
  const getActiveTabFromPath = (pathname) => {
    if (pathname.includes('/checkers/') && pathname.includes('/customers')) {
      return 'checker-customers';
    }
    if (pathname.includes('/checkers/') && pathname.includes('/report')) {
      return 'checker-report';
    }
    const path = pathname.split('/').filter(Boolean)[0] || 'dashboard';
    return path;
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  const handleTabChange = (tab) => {
    navigate(`/${tab}`);
  };

  const handleBack = () => {
    navigate('/checkers');
    setCustomerData(null);
  };

  const handleViewPaymentSchedule = (customer) => {
    setCustomerData(customer);
    navigate('/payment-schedule');
  };

  // Note: Data filtering is now handled by individual pages using API calls
  // with branchId parameter instead of client-side filtering

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        currentBranch={currentBranch}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
        <AdminHeader
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          branches={branches}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          currentBranch={currentBranch}
          currentUser={currentUser}
          onLogout={onLogout}
        />

        <AdminContent
          activeTab={activeTab}
          selectedBranch={selectedBranch}
          currentBranch={currentBranch}
          customerData={customerData}
          onBack={handleBack}
          onViewPaymentSchedule={handleViewPaymentSchedule}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default AdminLayout;