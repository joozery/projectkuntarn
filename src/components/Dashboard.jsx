import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  CreditCard, 
  DollarSign, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  PieChart,
  Users,
  UserCheck,
  Shield
} from 'lucide-react';

const Dashboard = ({ products, installmentPlans, customers, employees, checkers }) => {
  const totalProducts = products?.length || 0;
  const totalPlans = installmentPlans?.length || 0;
  const totalCustomers = customers?.length || 0;
  const totalEmployees = employees?.length || 0;
  const totalCheckers = checkers?.length || 0;
  const checkedInEmployees = employees?.filter(emp => emp.isCheckedIn).length || 0;
  
  const totalValue = products?.reduce((sum, product) => sum + product.price, 0) || 0;
  
  const allPayments = installmentPlans?.flatMap(plan => plan.payments) || [];
  const paidPayments = allPayments.filter(payment => payment.status === 'paid');
  const pendingPayments = allPayments.filter(payment => payment.status === 'pending');
  const overduePayments = allPayments.filter(payment => {
    if (payment.status === 'paid') return false;
    return new Date(payment.dueDate) < new Date();
  });

  const totalPaid = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);

  const stats = [
    {
      title: 'สินค้าทั้งหมด',
      value: totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'แผนการผ่อน',
      value: totalPlans,
      icon: CreditCard,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'ลูกค้าทั้งหมด',
      value: totalCustomers,
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'พนักงานเข้างาน',
      value: `${checkedInEmployees}/${totalEmployees}`,
      icon: UserCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'มูลค่ารวม',
      value: `฿${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'ยอดที่ชำระแล้ว',
      value: `฿${totalPaid.toLocaleString()}`,
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'ผู้ตรวจสอบ',
      value: totalCheckers,
      icon: Shield,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const paymentStats = [
    {
      title: 'ชำระแล้ว',
      count: paidPayments.length,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'รอชำระ',
      count: pendingPayments.length,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'เกินกำหนด',
      count: overduePayments.length,
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">แดชบอร์ด</h1>
        <p className="text-gray-600">ภาพรวมและสถิติของระบบผ่อนสินค้า</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {installmentPlans && installmentPlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            สถานะการชำระเงิน
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${stat.bgColor} mb-3`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {stat.count}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.title}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {installmentPlans && installmentPlans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            แผนการผ่อนล่าสุด
          </h3>
          
          <div className="space-y-4">
            {installmentPlans.slice(0, 3).map((plan, index) => {
              const paidCount = plan.payments.filter(p => p.status === 'paid').length;
              const progress = (paidCount / plan.payments.length) * 100;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{plan.productName}</h4>
                      <p className="text-gray-600 text-sm">
                        ผ่อน {plan.months} งวด × ฿{plan.monthlyPayment.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">ความคืบหน้า</div>
                      <div className="font-semibold">{paidCount}/{plan.payments.length}</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    {progress.toFixed(1)}% เสร็จสิ้น
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {(!products || products.length === 0) && (!installmentPlans || installmentPlans.length === 0) && (!customers || customers.length === 0) && (!employees || employees.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
        >
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-600 mb-4">
            ยินดีต้อนรับสู่ระบบผ่อนสินค้า! 🎉
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            เริ่มต้นใช้งานโดยการเพิ่มสินค้าแรกของคุณ จากนั้นสร้างแผนการผ่อนที่เหมาะสม
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
              <Package className="w-4 h-4" />
              เพิ่มสินค้า
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
              <CreditCard className="w-4 h-4" />
              สร้างแผนผ่อน
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4" />
              ติดตามการชำระ
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;