import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Calculator, TrendingUp } from 'lucide-react';
import CustomerSelector from '@/components/forms/CustomerSelector';
import ProductSelector from '@/components/forms/ProductSelector';
import EmployeeSelector from '@/components/forms/EmployeeSelector';
import InstallmentDetails from '@/components/forms/InstallmentDetails';

const InstallmentPlan = ({ products = [], customers = [], employees = [], onAddPlanAndContract, existingPlans = [] }) => {
  console.log('InstallmentPlan props:', { 
    customersCount: customers?.length || 0, 
    productsCount: products?.length || 0, 
    employeesCount: employees?.length || 0,
    customers: customers
  });
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [contractDate, setContractDate] = useState(new Date().toISOString().split('T')[0]);
  const [months, setMonths] = useState(24);
  const [interestRate, setInterestRate] = useState(1.25);
  const [downPayment, setDownPayment] = useState(0);

  const selectedProductData = products.find(p => p.id === selectedProduct);
  const selectedCustomerData = customers.find(c => c.id === selectedCustomer);
  const selectedEmployeeData = employees.find(e => e.id === selectedEmployee);
  
  const calculateInstallment = () => {
    if (!selectedProductData) return null;
    
    const principal = selectedProductData.price - downPayment;
    const monthlyInterestRate = interestRate / 100;
    const totalInterest = principal * monthlyInterestRate * (months / 12);
    const totalPayment = principal + totalInterest;
    const monthlyPayment = totalPayment / months;
    
    return {
      monthlyPayment: Math.ceil(monthlyPayment / 10) * 10,
      totalAmount: Math.ceil((monthlyPayment * months + downPayment) / 10) * 10,
      totalInterest: Math.ceil(totalInterest / 10) * 10,
      principal: Math.round(principal)
    };
  };

  const calculation = calculateInstallment();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedProduct || !selectedCustomer || !selectedEmployee) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "กรุณาเลือกสินค้า ลูกค้า และพนักงานขาย",
        variant: "destructive"
      });
      return;
    }

    if (downPayment >= selectedProductData.price) {
      toast({
        title: "เงินดาวน์ไม่ถูกต้อง",
        description: "เงินดาวน์ต้องน้อยกว่าราคาสินค้า",
        variant: "destructive"
      });
      return;
    }

    const payments = [];
    const startDate = new Date(contractDate);
    
    for (let i = 0; i < months; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      
      payments.push({
        month: i + 1,
        amount: calculation.monthlyPayment,
        dueDate: dueDate.toISOString(),
        status: 'pending'
      });
    }

    const plan = {
      productId: selectedProduct,
      productName: selectedProductData.name,
      productPrice: selectedProductData.price,
      months: months,
      interestRate: interestRate,
      downPayment: downPayment,
      monthlyPayment: calculation.monthlyPayment,
      totalAmount: calculation.totalAmount,
      totalInterest: calculation.totalInterest,
      payments: payments,
      customerId: selectedCustomer,
      employeeId: selectedEmployee,
    };

    const contract = {
      contractNumber: `F${Math.floor(1000 + Math.random() * 9000)}`,
      customer: selectedCustomerData,
      product: selectedProductData,
      plan: plan,
      salesperson: selectedEmployeeData,
      inspector: { name: 'เสกศักดิ์ โตทอง' },
      contractDate: contractDate,
    };

    onAddPlanAndContract(plan, contract);
    
    setSelectedProduct('');
    setSelectedCustomer('');
    setSelectedEmployee('');
    setContractDate(new Date().toISOString().split('T')[0]);
    setMonths(24);
    setInterestRate(1.25);
    setDownPayment(0);
  };

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          สร้างสัญญาและแผนการผ่อน
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CustomerSelector
              customers={customers}
              selectedCustomerId={selectedCustomer}
              onCustomerChange={setSelectedCustomer}
            />

            <ProductSelector
              products={products}
              selectedProductId={selectedProduct}
              onProductChange={setSelectedProduct}
            />

            <EmployeeSelector
              employees={employees}
              selectedEmployeeId={selectedEmployee}
              onEmployeeChange={setSelectedEmployee}
            />
          </div>

          <InstallmentDetails
            contractDate={contractDate}
            months={months}
            interestRate={interestRate}
            downPayment={downPayment}
            maxDownPayment={selectedProductData?.price || 0}
            onContractDateChange={setContractDate}
            onMonthsChange={setMonths}
            onInterestRateChange={setInterestRate}
            onDownPaymentChange={setDownPayment}
          />

          <Button
            type="submit"
            disabled={!selectedProduct || !selectedCustomer || !selectedEmployee}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calculator className="w-5 h-5 mr-2" />
            สร้างสัญญาและแผนการผ่อน
          </Button>
        </form>
      </motion.div>

      {selectedProduct && calculation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="payment-card"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            ตัวอย่างการคำนวณ
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/80">ราคาสินค้า:</span>
                <span className="font-semibold">฿{selectedProductData.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">เงินดาวน์:</span>
                <span className="font-semibold">฿{downPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">ยอดจัด:</span>
                <span className="font-semibold">฿{calculation.principal.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/80">ผ่อนต่อเดือน:</span>
                <span className="font-bold text-xl">฿{calculation.monthlyPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">ดอกเบี้ยรวม:</span>
                <span className="font-semibold">฿{calculation.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">ยอดรวมทั้งหมด:</span>
                <span className="font-bold text-xl">฿{calculation.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InstallmentPlan;