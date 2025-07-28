import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Bell,
  Search,
  User,
  Menu,
  Settings,
  MapPin,
  ChevronDown,
  Building2
} from 'lucide-react';

const AdminHeader = ({ 
  sidebarCollapsed, 
  setSidebarCollapsed, 
  branches, 
  selectedBranch, 
  setSelectedBranch, 
  currentBranch 
}) => {
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);

  const handleBranchChange = (branchId) => {
    setSelectedBranch(branchId);
    setShowBranchDropdown(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              className="branch-selector flex items-center gap-2 min-w-[200px] max-w-[300px] justify-between"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium truncate">{currentBranch?.name || 'เลือกสาขา'}</span>
              </div>
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            </Button>
            
            <AnimatePresence>
              {showBranchDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-full max-w-[400px] bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                >
                  <div className="p-2">
                    {branches.map((branch) => (
                      <Button
                        key={branch.id}
                        variant="ghost"
                        onClick={() => handleBranchChange(branch.id)}
                        className={`w-full justify-start gap-2 h-auto py-2 ${
                          branch.id === selectedBranch ? 'bg-emerald-50 text-emerald-700' : ''
                        }`}
                      >
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <div className="text-left min-w-0 flex-1">
                          <div className="font-medium truncate">{branch.name}</div>
                          <div className="text-xs text-gray-500 truncate">{branch.address}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800">ผู้ดูแลระบบ</div>
              <div className="text-xs text-gray-500">{currentBranch?.name}</div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;