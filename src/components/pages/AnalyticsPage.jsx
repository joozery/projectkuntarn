import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Users, Package, Calendar } from 'lucide-react';

const AnalyticsPage = ({ 
  products = [], 
  installmentPlans = [], 
  customers = [], 
  employees = [],
  selectedBranch,
  currentBranch
}) => {
  const branchPlans = installmentPlans.filter(plan => plan.branchId === selectedBranch);
  const branchCustomers = customers.filter(customer => customer.branchId === selectedBranch);
  const branchEmployees = employees.filter(employee => employee.branchId === selectedBranch);
  const branchProducts = products.filter(product => product.branchId === selectedBranch);

  const totalRevenue = branchPlans.reduce((sum, plan) => {
    const paidPayments = plan.payments?.filter(p => p.status === 'paid') || [];
    return sum + paidPayments.reduce((pSum, payment) => pSum + (payment.amount || 0), 0);
  }, 0);

  const pendingRevenue = branchPlans.reduce((sum, plan) => {
    const pendingPayments = plan.payments?.filter(p => p.status === 'pending') || [];
    return sum + pendingPayments.reduce((pSum, payment) => pSum + (payment.amount || 0), 0);
  }, 0);

  const stats = [
    {
      title: 'รายได้ทั้งหมด',
      value: `฿${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'รายได้ค้างรับ',
      value: `฿${pendingRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'ลูกค้าทั้งหมด',
      value: branchCustomers.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'สินค้าทั้งหมด',
      value: branchProducts.length,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const totalPaidPayments = branchPlans.reduce((sum, plan) => 
    sum + (plan.payments?.filter(p => p.status === 'paid').length || 0), 0
  );

  const totalPendingPayments = branchPlans.reduce((sum, plan) => 
    sum + (plan.payments?.filter(p => p.status === 'pending').length || 0), 0
  );

  const checkedInEmployees = branchEmployees.filter(emp => emp.isCheckedIn).length;
  const checkedOutEmployees = branchEmployees.filter(emp => !emp.isCheckedIn).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายงานและวิเคราะห์</h1>
          <p className="text-gray-600">ภาพรวมและสถิติของระบบ - {currentBranch?.name || 'ทุกสาขา'}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <BarChart3 className="w-4 h-4" />
          <span>อัพเดทล่าสุด: {new Date().toLocaleDateString('th-TH')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">สรุปข้อมูลระบบ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">การผ่อนชำระ</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">แผนการผ่อนทั้งหมด:</span>
                <span className="font-medium">{branchPlans.length} แผน</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">งวดที่ชำระแล้ว:</span>
                <span className="font-medium text-green-600">{totalPaidPayments} งวด</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">งวดค้างชำระ:</span>
                <span className="font-medium text-red-600">{totalPendingPayments} งวด</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">พนักงาน</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">พนักงานทั้งหมด:</span>
                <span className="font-medium">{branchEmployees.length} คน</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">เข้างานวันนี้:</span>
                <span className="font-medium text-green-600">{checkedInEmployees} คน</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ออกงานแล้ว:</span>
                <span className="font-medium text-gray-600">{checkedOutEmployees} คน</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">กราฟและชาร์ตเพิ่มเติม</h3>
          <p className="text-gray-500">🚧 ฟีเจอร์นี้ยังไม่ได้ใช้งาน—แต่ไม่ต้องกังวล! คุณสามารถขอให้เพิ่มในข้อความถัดไป! 🚀</p>
        </div>
      </div>

      {branchPlans.length === 0 && branchCustomers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
        >
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            ยังไม่มีข้อมูลสำหรับการวิเคราะห์
          </h3>
          <p className="text-gray-500">
            เพิ่มลูกค้าและสร้างแผนการผ่อนก่อนเพื่อดูรายงานและวิเคราะห์
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsPage;