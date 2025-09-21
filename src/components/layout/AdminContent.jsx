import React from 'react';
import Dashboard from '@/components/Dashboard';
import ProductsPage from '@/components/pages/ProductsPage';
import CustomersPage from '@/components/pages/CustomersPage';
import EmployeesPage from '@/components/pages/EmployeesPage';
import CollectorsPage from '@/components/pages/CollectorsPage';
import CheckersPage from '@/components/pages/CheckersPage';
import CheckerInstallmentReport from '@/components/pages/CheckerInstallmentReport';
import AllCheckerCustomersPage from '@/components/pages/AllCheckerCustomersPage';
import SalesIndexPage from '@/components/pages/SalesIndexPage';
import PaymentSchedulePage from '@/components/pages/PaymentSchedulePage';
import InstallmentIndexPage from '@/components/pages/InstallmentIndexPage';
import ImportDataPage from '@/components/pages/ImportDataPage';
import AdminUsersPage from '@/components/pages/AdminUsersPage';

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
  currentBranch,
  customerData,
  onBack,
  onViewPaymentSchedule,
  currentUser
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
      case 'salespeople':
        return (
          <CollectorsPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'checkers':
        return (
          <CheckersPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
            onViewPaymentSchedule={onViewPaymentSchedule}
          />
        );
      case 'all-checker-customers':
        return (
          <AllCheckerCustomersPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
            onViewPaymentSchedule={onViewPaymentSchedule}
          />
        );
      case 'checker-installment-report':
        return (
          <CheckerInstallmentReport 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
            onBack={onBack}
          />
        );
      case 'sales-index':
        return (
          <SalesIndexPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
          />
        );
      case 'payment-schedule':
        return (
          <PaymentSchedulePage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
            customerData={customerData}
            onBack={onBack}
            onViewPaymentSchedule={onViewPaymentSchedule}
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
          <InstallmentIndexPage 
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
      case 'import-data':
        return (
          <ImportDataPage 
            onBack={() => window.history.back()}
          />
        );
      case 'admin-users':
        return (
          <AdminUsersPage 
            selectedBranch={selectedBranch}
            currentBranch={currentBranch}
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