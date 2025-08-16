import * as XLSX from 'xlsx';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

class ExcelImportService {
  constructor() {
    this.requiredSheets = [
      'Branches',
      'Checkers', 
      'Customers',
      'Products',
      'Installments',
      'Payments',
      'Collections'
    ];
  }

  /**
   * อ่านไฟล์ Excel และแปลงเป็น JSON
   */
  async readExcelFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheets = {};
          
          // อ่านข้อมูลจากแต่ละ Sheet
          this.requiredSheets.forEach(sheetName => {
            if (workbook.SheetNames.includes(sheetName)) {
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                header: 1,
                defval: ''
              });
              
              // แปลงข้อมูลเป็น object array
              if (jsonData.length > 1) {
                const headers = jsonData[0];
                const rows = jsonData.slice(1);
                
                sheets[sheetName] = rows.map(row => {
                  const obj = {};
                  headers.forEach((header, index) => {
                    obj[header] = row[index] || '';
                  });
                  return obj;
                }).filter(row => {
                  // กรองแถวที่ไม่มีข้อมูลสำคัญ
                  const firstKey = Object.keys(row)[0];
                  return row[firstKey] && row[firstKey].toString().trim() !== '';
                });
              } else {
                sheets[sheetName] = [];
              }
            } else {
              sheets[sheetName] = [];
            }
          });
          
          resolve(sheets);
        } catch (error) {
          reject(new Error(`ไม่สามารถอ่านไฟล์ Excel ได้: ${error.message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('เกิดข้อผิดพลาดในการอ่านไฟล์'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * ตรวจสอบความถูกต้องของข้อมูล
   */
  validateData(sheets) {
    const errors = [];
    
    // ตรวจสอบ Sheet ที่จำเป็น
    this.requiredSheets.forEach(sheetName => {
      if (!sheets[sheetName] || sheets[sheetName].length === 0) {
        if (['Installments', 'Customers'].includes(sheetName)) {
          errors.push(`Sheet "${sheetName}" จำเป็นต้องมีข้อมูล`);
        }
      }
    });

    // ตรวจสอบข้อมูลสาขา
    if (sheets.Branches && sheets.Branches.length > 0) {
      sheets.Branches.forEach((branch, index) => {
        if (!branch.branch_code || !branch.branch_name) {
          errors.push(`Branches แถวที่ ${index + 2}: ต้องมี branch_code และ branch_name`);
        }
      });
    }

    // ตรวจสอบข้อมูลลูกค้า
    if (sheets.Customers && sheets.Customers.length > 0) {
      const customerCodes = new Set();
      const idCards = new Set();
      
      sheets.Customers.forEach((customer, index) => {
        const rowNum = index + 2;
        
        if (!customer.customer_code || !customer.name || !customer.id_card) {
          errors.push(`Customers แถวที่ ${rowNum}: ต้องมี customer_code, name และ id_card`);
        }
        
        // ตรวจสอบรหัสลูกค้าซ้ำ
        if (customer.customer_code) {
          if (customerCodes.has(customer.customer_code)) {
            errors.push(`Customers แถวที่ ${rowNum}: customer_code "${customer.customer_code}" ซ้ำ`);
          }
          customerCodes.add(customer.customer_code);
        }
        
        // ตรวจสอบเลขบัตรประชาชนซ้ำ
        if (customer.id_card) {
          if (idCards.has(customer.id_card)) {
            errors.push(`Customers แถวที่ ${rowNum}: id_card "${customer.id_card}" ซ้ำ`);
          }
          idCards.add(customer.id_card);
        }
        
        // ตรวจสอบเลขบัตรประชาชน 13 หลัก
        if (customer.id_card && customer.id_card.length !== 13) {
          errors.push(`Customers แถวที่ ${rowNum}: id_card ต้องเป็น 13 หลัก`);
        }
      });
    }

    // ตรวจสอบข้อมูลสัญญา
    if (sheets.Installments && sheets.Installments.length > 0) {
      const contractNumbers = new Set();
      
      sheets.Installments.forEach((installment, index) => {
        const rowNum = index + 2;
        
        if (!installment.contract_number || !installment.customer_code || !installment.total_amount) {
          errors.push(`Installments แถวที่ ${rowNum}: ต้องมี contract_number, customer_code และ total_amount`);
        }
        
        // ตรวจสอบเลขที่สัญญาซ้ำ
        if (installment.contract_number) {
          if (contractNumbers.has(installment.contract_number)) {
            errors.push(`Installments แถวที่ ${rowNum}: contract_number "${installment.contract_number}" ซ้ำ`);
          }
          contractNumbers.add(installment.contract_number);
        }
        
        // ตรวจสอบจำนวนเงิน
        if (installment.total_amount && isNaN(parseFloat(installment.total_amount))) {
          errors.push(`Installments แถวที่ ${rowNum}: total_amount ต้องเป็นตัวเลข`);
        }
        
        if (installment.installment_amount && isNaN(parseFloat(installment.installment_amount))) {
          errors.push(`Installments แถวที่ ${rowNum}: installment_amount ต้องเป็นตัวเลข`);
        }
        
        // ตรวจสอบวันที่
        if (installment.start_date && !this.isValidDate(installment.start_date)) {
          errors.push(`Installments แถวที่ ${rowNum}: start_date รูปแบบไม่ถูกต้อง (ใช้ YYYY-MM-DD)`);
        }
        
        if (installment.end_date && !this.isValidDate(installment.end_date)) {
          errors.push(`Installments แถวที่ ${rowNum}: end_date รูปแบบไม่ถูกต้อง (ใช้ YYYY-MM-DD)`);
        }
      });
    }

    // ตรวจสอบข้อมูลการชำระเงิน
    if (sheets.Payments && sheets.Payments.length > 0) {
      sheets.Payments.forEach((payment, index) => {
        const rowNum = index + 2;
        
        if (!payment.contract_number || !payment.amount || !payment.due_date) {
          errors.push(`Payments แถวที่ ${rowNum}: ต้องมี contract_number, amount และ due_date`);
        }
        
        if (payment.amount && isNaN(parseFloat(payment.amount))) {
          errors.push(`Payments แถวที่ ${rowNum}: amount ต้องเป็นตัวเลข`);
        }
        
        if (payment.due_date && !this.isValidDate(payment.due_date)) {
          errors.push(`Payments แถวที่ ${rowNum}: due_date รูปแบบไม่ถูกต้อง (ใช้ YYYY-MM-DD)`);
        }
        
        if (payment.payment_date && payment.payment_date !== '' && !this.isValidDate(payment.payment_date)) {
          errors.push(`Payments แถวที่ ${rowNum}: payment_date รูปแบบไม่ถูกต้อง (ใช้ YYYY-MM-DD)`);
        }
      });
    }

    return errors;
  }

  /**
   * ตรวจสอบรูปแบบวันที่
   */
  isValidDate(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
  }

  /**
   * Import ข้อมูลไปยังระบบ
   */
  async importData(sheets, onProgress) {
    const results = {
      success: 0,
      errors: [],
      summary: {}
    };

    try {
      // 1. Import สาขา
      if (sheets.Branches && sheets.Branches.length > 0) {
        onProgress?.('กำลัง import ข้อมูลสาขา...');
        const branchResult = await this.importBranches(sheets.Branches);
        results.summary.branches = branchResult;
      }

      // 2. Import เช็คเกอร์
      if (sheets.Checkers && sheets.Checkers.length > 0) {
        onProgress?.('กำลัง import ข้อมูลเช็คเกอร์...');
        const checkerResult = await this.importCheckers(sheets.Checkers);
        results.summary.checkers = checkerResult;
      }

      // 3. Import ลูกค้า
      if (sheets.Customers && sheets.Customers.length > 0) {
        onProgress?.('กำลัง import ข้อมูลลูกค้า...');
        const customerResult = await this.importCustomers(sheets.Customers);
        results.summary.customers = customerResult;
      }

      // 4. Import สินค้า
      if (sheets.Products && sheets.Products.length > 0) {
        onProgress?.('กำลัง import ข้อมูลสินค้า...');
        const productResult = await this.importProducts(sheets.Products);
        results.summary.products = productResult;
      }

      // 5. Import สัญญา
      if (sheets.Installments && sheets.Installments.length > 0) {
        onProgress?.('กำลัง import ข้อมูลสัญญา...');
        const installmentResult = await this.importInstallments(sheets.Installments);
        results.summary.installments = installmentResult;
      }

      // 6. Import การชำระเงิน
      if (sheets.Payments && sheets.Payments.length > 0) {
        onProgress?.('กำลัง import ข้อมูลการชำระเงิน...');
        const paymentResult = await this.importPayments(sheets.Payments);
        results.summary.payments = paymentResult;
      }

      // 7. Import การเก็บเงิน
      if (sheets.Collections && sheets.Collections.length > 0) {
        onProgress?.('กำลัง import ข้อมูลการเก็บเงิน...');
        const collectionResult = await this.importCollections(sheets.Collections);
        results.summary.collections = collectionResult;
      }

      onProgress?.('Import เสร็จสิ้น!');
      results.success = 1;

    } catch (error) {
      results.errors.push(`เกิดข้อผิดพลาดในการ import: ${error.message}`);
    }

    return results;
  }

  /**
   * Import ข้อมูลสาขา
   */
  async importBranches(branches) {
    const result = { success: 0, errors: [] };
    
    for (const branch of branches) {
      try {
        const response = await api.post('/branches', {
          name: branch.branch_name,
          address: branch.address || '',
          phone: branch.phone || '',
          manager: branch.manager || ''
        });
        
        if (response.data.success) {
          result.success++;
        } else {
          result.errors.push(`สาขา ${branch.branch_code}: ${response.data.message}`);
        }
      } catch (error) {
        result.errors.push(`สาขา ${branch.branch_code}: ${error.message}`);
      }
    }
    
    return result;
  }

  /**
   * Import ข้อมูลลูกค้า
   */
  async importCustomers(customers) {
    const result = { success: 0, errors: [] };
    
    for (const customer of customers) {
      try {
        const response = await api.post('/customers', {
          code: customer.customer_code,
          name: customer.name,
          surname: customer.surname || '',
          full_name: `${customer.name} ${customer.surname || ''}`.trim(),
          id_card: customer.id_card,
          nickname: customer.nickname || '',
          phone: customer.phone || '',
          email: customer.email || '',
          address: customer.address || '',
          guarantor_name: customer.guarantor_name || '',
          guarantor_id_card: customer.guarantor_id_card || '',
          guarantor_phone: customer.guarantor_phone || '',
          guarantor_address: customer.guarantor_address || ''
        });
        
        if (response.data.success) {
          result.success++;
        } else {
          result.errors.push(`ลูกค้า ${customer.customer_code}: ${response.data.message}`);
        }
      } catch (error) {
        result.errors.push(`ลูกค้า ${customer.customer_code}: ${error.message}`);
      }
    }
    
    return result;
  }

  /**
   * Import ข้อมูลสัญญา
   */
  async importInstallments(installments) {
    const result = { success: 0, errors: [] };
    
    for (const installment of installments) {
      try {
        const response = await api.post('/installments', {
          contract_number: installment.contract_number,
          customer_code: installment.customer_code,
          product_name: installment.product_name,
          total_amount: parseFloat(installment.total_amount),
          installment_amount: parseFloat(installment.installment_amount),
          installment_period: parseInt(installment.installment_period),
          start_date: installment.start_date,
          end_date: installment.end_date,
          status: installment.status || 'active'
        });
        
        if (response.data.success) {
          result.success++;
        } else {
          result.errors.push(`สัญญา ${installment.contract_number}: ${response.data.message}`);
        }
      } catch (error) {
        result.errors.push(`สัญญา ${installment.contract_number}: ${error.message}`);
      }
    }
    
    return result;
  }

  /**
   * Import ข้อมูลการชำระเงิน
   */
  async importPayments(payments) {
    const result = { success: 0, errors: [] };
    
    for (const payment of payments) {
      try {
        const response = await api.post('/payments', {
          contract_number: payment.contract_number,
          amount: parseFloat(payment.amount),
          due_date: payment.due_date,
          payment_date: payment.payment_date || null,
          status: payment.status || 'pending',
          notes: payment.notes || ''
        });
        
        if (response.data.success) {
          result.success++;
        } else {
          result.errors.push(`การชำระ ${payment.contract_number}: ${response.data.message}`);
        }
      } catch (error) {
        result.errors.push(`การชำระ ${payment.contract_number}: ${error.message}`);
      }
    }
    
    return result;
  }

  /**
   * Import ข้อมูลการเก็บเงิน
   */
  async importCollections(collections) {
    const result = { success: 0, errors: [] };
    
    for (const collection of collections) {
      try {
        const response = await api.post('/payment-collections', {
          contract_number: collection.contract_number,
          checker_code: collection.checker_code,
          amount: parseFloat(collection.amount_collected),
          payment_date: collection.collection_date,
          notes: collection.notes || ''
        });
        
        if (response.data.success) {
          result.success++;
        } else {
          result.errors.push(`การเก็บเงิน ${collection.contract_number}: ${response.data.message}`);
        }
      } catch (error) {
        result.errors.push(`การเก็บเงิน ${collection.contract_number}: ${error.message}`);
      }
    }
    
    return result;
  }

  /**
   * สร้างไฟล์ template Excel
   */
  generateTemplate() {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Branches
    const branchesData = [
      ['branch_code*', 'branch_name*', 'address', 'phone', 'manager'],
      ['BR001', 'สาขาหลัก', '123 ถนนสุขุมวิท กรุงเทพฯ 10110', '02-123-4567', 'คุณสมชาย ใจดี'],
      ['BR002', 'สาขารามคำแหง', '456 ถนนรามคำแหง กรุงเทพฯ 10240', '02-234-5678', 'คุณสมหญิง รักดี']
    ];
    const branchesWS = XLSX.utils.aoa_to_sheet(branchesData);
    XLSX.utils.book_append_sheet(wb, branchesWS, 'Branches');

    // Sheet 2: Checkers
    const checkersData = [
      ['checker_code*', 'name*', 'surname', 'phone', 'email', 'branch_code*'],
      ['CHK001', 'อนุชิต', '', '081-111-1111', 'anuchit@example.com', 'BR001'],
      ['CHK002', 'อุดมศักดิ์', 'ประถมทอง', '081-222-2222', 'udomsak@example.com', 'BR001']
    ];
    const checkersWS = XLSX.utils.aoa_to_sheet(checkersData);
    XLSX.utils.book_append_sheet(wb, checkersWS, 'Checkers');

    // Sheet 3: Customers
    const customersData = [
      ['customer_code*', 'name*', 'surname', 'id_card*', 'nickname', 'phone', 'email', 'address', 'guarantor_name', 'guarantor_id_card', 'guarantor_phone', 'guarantor_address', 'branch_code*', 'checker_code*'],
      ['CUST001', 'สมชาย', 'ใจดี', '1234567890123', 'สมชาย', '082-111-1111', 'customer1@example.com', '123 ถนนสุขุมวิท กรุงเทพฯ', 'สมหญิง รักดี', '9876543210987', '082-222-2222', '456 ถนนรามคำแหง กรุงเทพฯ', 'BR001', 'CHK001']
    ];
    const customersWS = XLSX.utils.aoa_to_sheet(customersData);
    XLSX.utils.book_append_sheet(wb, customersWS, 'Customers');

    // Sheet 4: Products
    const productsData = [
      ['product_code*', 'product_name*', 'description', 'price*', 'branch_code*'],
      ['PROD001', 'โทรศัพท์มือถือ Samsung Galaxy S21', 'สมาร์ทโฟนรุ่นใหม่จาก Samsung', '25000.00', 'BR001']
    ];
    const productsWS = XLSX.utils.aoa_to_sheet(productsData);
    XLSX.utils.book_append_sheet(wb, productsWS, 'Products');

    // Sheet 5: Installments
    const installmentsData = [
      ['contract_number*', 'customer_code*', 'product_code', 'product_name*', 'total_amount*', 'installment_amount*', 'installment_period*', 'start_date*', 'end_date*', 'status*', 'branch_code*', 'salesperson_name'],
      ['CT2401001', 'CUST001', 'PROD001', 'โทรศัพท์มือถือ Samsung Galaxy S21', '25000.00', '2500.00', '10', '2024-01-01', '2024-10-01', 'active', 'BR001', 'คุณสมชาย']
    ];
    const installmentsWS = XLSX.utils.aoa_to_sheet(installmentsData);
    XLSX.utils.book_append_sheet(wb, installmentsWS, 'Installments');

    // Sheet 6: Payments
    const paymentsData = [
      ['contract_number*', 'payment_sequence*', 'amount*', 'due_date*', 'payment_date', 'status*', 'notes'],
      ['CT2401001', '1', '2500.00', '2024-01-01', '2024-01-01', 'paid', 'เก็บเงินงวดที่ 1'],
      ['CT2401001', '2', '2500.00', '2024-02-01', '2024-02-01', 'paid', 'เก็บเงินงวดที่ 2'],
      ['CT2401001', '3', '2500.00', '2024-03-01', '', 'pending', ''],
      ['CT2401001', '4', '2500.00', '2024-04-01', '', 'pending', '']
    ];
    const paymentsWS = XLSX.utils.aoa_to_sheet(paymentsData);
    XLSX.utils.book_append_sheet(wb, paymentsWS, 'Payments');

    // Sheet 7: Collections
    const collectionsData = [
      ['contract_number*', 'payment_sequence*', 'checker_code*', 'amount_collected*', 'collection_date*', 'notes'],
      ['CT2401001', '1', 'CHK001', '2500.00', '2024-01-01', 'เก็บเงินงวดที่ 1'],
      ['CT2401001', '2', 'CHK001', '2500.00', '2024-02-01', 'เก็บเงินงวดที่ 2']
    ];
    const collectionsWS = XLSX.utils.aoa_to_sheet(collectionsData);
    XLSX.utils.book_append_sheet(wb, collectionsWS, 'Collections');

    return wb;
  }

  /**
   * ดาวน์โหลดไฟล์ template
   */
  downloadTemplate() {
    const wb = this.generateTemplate();
    XLSX.writeFile(wb, 'import_template.xlsx');
  }
}

export const excelImportService = new ExcelImportService();