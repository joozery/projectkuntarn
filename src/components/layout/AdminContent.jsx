import React from 'react';
import Dashboard from '@/components/Dashboard';
import ProductsPage from '@/components/pages/ProductsPage';
import CustomersPage from '@/components/pages/CustomersPage';
import EmployeesPage from '@/components/pages/EmployeesPage';
import CheckersPage from '@/components/pages/CheckersPage';
import SalesIndexPage from '@/components/pages/SalesIndexPage';
import InstallmentsPage from '@/components/pages/InstallmentsPage';
import ContractsPage from '@/components/pages/ContractsPage';
import PaymentsPage from '@/components/pages/PaymentsPage';
import ReturnsPage from '@/components/pages/ReturnsPage';
import ReportsPage from '@/components/pages/ReportsPage';
import AnalyticsPage from '@/components/pages/AnalyticsPage';
import BranchesPage from '@/components/pages/BranchesPage';
import SettingsPage from '@/components/pages/SettingsPage';

const AdminContent = ({ 
  activeTab, 
  selectedBranch,
  currentBranch
}) => {

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'products':
        return (
          <ProductsPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'customers':
        return (
          <CustomersPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'employees':
        return (
          <EmployeesPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'checkers':
        return (
          <CheckersPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'sales-index':
        return (
          <SalesIndexPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'installments':
        return (
          <InstallmentsPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'contracts':
        return (
          <ContractsPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'payments':
        return (
          <PaymentsPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'returns':
        return (
          <ReturnsPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'reports':
        return (
          <ReportsPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'analytics':
        return (
          <AnalyticsPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'branches':
        return (
          <BranchesPage 
            selectedBranch={selectedBranch}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <Dashboard 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminContent;