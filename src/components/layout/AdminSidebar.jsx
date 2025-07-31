import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard,
  Package,
  Calculator,
  Calendar,
  Users,
  UserCheck,
  Settings,
  BarChart3,
  CreditCard,
  FileText,
  ChevronLeft,
  ChevronRight,
  Building2,
  RotateCcw,
  ClipboardList,
  Shield,
  TrendingUp
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed, currentBranch }) => {
  const menuItems = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { id: 'branches', label: 'จัดการสาขา', icon: Building2 },
    { id: 'products', label: 'จัดการสินค้า', icon: Package },
    { id: 'contracts', label: 'รายการสัญญา', icon: ClipboardList },
    { id: 'payments', label: 'ค่างวด', icon: Calendar },
    { id: 'returns', label: 'รับคืนสินค้า', icon: RotateCcw },
    { id: 'customers', label: 'ลูกค้า', icon: Users },
    { id: 'employees', label: 'พนักงานขาย', icon: UserCheck },
    { id: 'salespeople', label: 'พนักงานเก็บเงิน', icon: Users },
    { id: 'checkers', label: 'เช็คเกอร์', icon: Shield },
    { id: 'sales-index', label: 'สารบัญการขาย', icon: TrendingUp },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings }
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0, width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-50"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
                  <p className="text-xs text-gray-500">ระบบผ่อนสินค้า</p>
                </div>
              </motion.div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 hover:bg-gray-100"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {!collapsed && currentBranch && (
          <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
            <div className="flex items-start gap-2 text-sm">
              <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-emerald-800 truncate">{currentBranch.name}</div>
                <div className="text-xs text-emerald-600 truncate">{currentBranch.address}</div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto sidebar-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => setActiveTab(item.id)}
                className={`w-full justify-start gap-3 h-10 ${
                  collapsed ? 'px-2' : 'px-3'
                } ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className={`${collapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          {!collapsed && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-600 mb-1">
                ระบบผ่อนสินค้า v1.0
              </div>
              <div className="text-xs text-gray-500">
                พัฒนาโดย wooyou creative
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;