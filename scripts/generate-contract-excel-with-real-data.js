import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Configuration
const API_BASE_URL = "https://72-60-43-104.sslip.io/kuntarn/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ฟังก์ชันสำหรับดึงข้อมูลจาก API
async function fetchDataFromAPI() {
  console.log('🔄 กำลังดึงข้อมูลจาก API...');
  
  try {
    // ดึงข้อมูลทั้งหมดแบบ parallel
    const [branchesRes, employeesRes, customersRes, productsRes, collectorsRes, checkersRes] = await Promise.all([
      api.get('/branches'),
      api.get('/employees'),
      api.get('/customers'),
      api.get('/products'),
      api.get('/collectors'),
      api.get('/checkers')
    ]);

    console.log('✅ ดึงข้อมูลจาก API สำเร็จ');
    
    return {
      branches: branchesRes.data?.data || branchesRes.data || [],
      employees: employeesRes.data?.data || employeesRes.data || [],
      customers: customersRes.data?.data || customersRes.data || [],
      products: productsRes.data?.data || productsRes.data || [],
      collectors: collectorsRes.data?.data || collectorsRes.data || [],
      checkers: checkersRes.data?.data || checkersRes.data || []
    };
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการดึงข้อมูลจาก API:', error.message);
    console.log('🔄 ใช้ข้อมูลตัวอย่างแทน...');
    
    // ใช้ข้อมูลตัวอย่างถ้า API ไม่ทำงาน
    return {
      branches: [
        { id: 1, code: 'BR001', name: 'สาขาหลัก', address: '123 ถนนสุขุมวิท กรุงเทพฯ 10110', phone: '02-123-4567' }
      ],
      employees: [
        { id: 1, code: 'EMP001', name: 'สมชาย', surname: 'ใจดี', position: 'พนักงานขาย', phone: '081-111-1111', branch_id: 1 },
        { id: 2, code: 'EMP002', name: 'สมหญิง', surname: 'รักดี', position: 'ผู้ตรวจสอบ', phone: '081-222-2222', branch_id: 1 }
      ],
      customers: [
        { id: 1, code: 'CUST001', name: 'สมชาย', surname: 'ใจดี', id_card: '1234567890123', phone: '082-111-1111', address: '123 ถนนสุขุมวิท กรุงเทพฯ', branch_id: 1 }
      ],
      products: [
        { id: 1, code: 'PROD001', name: 'โทรศัพท์มือถือ Samsung Galaxy S21', price: 25000, category: 'โทรศัพท์', branch_id: 1 }
      ],
      collectors: [
        { id: 1, code: 'COL001', name: 'ประยุทธ', surname: 'มั่นคง', phone: '081-333-3333', branch_id: 1 }
      ],
      checkers: [
        { id: 1, code: 'CHK001', name: 'อนุชิต', surname: '', phone: '081-444-4444', branch_id: 1 }
      ]
    };
  }
}

// ฟังก์ชันสำหรับสร้าง Excel template ด้วยข้อมูลจริง
async function generateContractExcelWithRealData() {
  console.log('🚀 เริ่มสร้าง Excel template ด้วยข้อมูลจริง...');
  
  // ดึงข้อมูลจาก API
  const data = await fetchDataFromAPI();
  
  console.log('📊 ข้อมูลที่ได้:');
  console.log(`   - สาขา: ${data.branches.length} รายการ`);
  console.log(`   - พนักงาน: ${data.employees.length} รายการ`);
  console.log(`   - ลูกค้า: ${data.customers.length} รายการ`);
  console.log(`   - สินค้า: ${data.products.length} รายการ`);
  console.log(`   - พนักงานเก็บเงิน: ${data.collectors.length} รายการ`);
  console.log(`   - เช็คเกอร์: ${data.checkers.length} รายการ`);
  
  const wb = XLSX.utils.book_new();

  // Sheet 1: คำแนะนำ (Instructions)
  const instructionsData = [
    ['คำแนะนำการใช้งาน Template สำหรับสร้างสัญญาหลายๆ อัน'],
    [''],
    ['📋 วิธีการใช้งาน:'],
    ['1. กรอกข้อมูลใน Sheet "สัญญา" ตามลำดับ'],
    ['2. ห้ามเปลี่ยนชื่อคอลัมน์ในไฟล์ template'],
    ['3. กรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน'],
    ['4. ใช้รูปแบบวันที่: YYYY-MM-DD (เช่น 2024-01-15)'],
    ['5. ใช้รูปแบบตัวเลข: ไม่ใส่เครื่องหมายคอมมา (เช่น 25000.50)'],
    [''],
    ['📝 ข้อมูลที่จำเป็น:'],
    ['- ข้อมูลลูกค้า: รหัส, ชื่อ, นามสกุล, เลขบัตรประชาชน, เบอร์โทร'],
    ['- ข้อมูลสินค้า: รหัสสินค้า, ชื่อสินค้า, ราคา'],
    ['- ข้อมูลพนักงาน: รหัสพนักงานขาย, ผู้ตรวจสอบ, พนักงานเก็บเงิน'],
    ['- ข้อมูลการผ่อน: เงินดาวน์, งวดผ่อน, จำนวนงวด, วันที่เก็บเงิน'],
    [''],
    ['⚠️ ข้อควรระวัง:'],
    ['- รหัสสัญญา (contract_number) ต้องไม่ซ้ำกัน'],
    ['- เลขบัตรประชาชนต้องเป็น 13 หลัก'],
    ['- ตรวจสอบความถูกต้องของข้อมูลก่อนนำเข้า'],
    ['- ข้อมูลลูกค้าและสินค้าต้องมีอยู่ในระบบแล้ว'],
    [''],
    ['💡 เคล็ดลับ:'],
    ['- สามารถคัดลอกแถวเพื่อสร้างสัญญาหลายๆ อันได้'],
    ['- ใช้ AutoFill เพื่อกรอกข้อมูลที่คล้ายกัน'],
    ['- บันทึกไฟล์เป็น .xlsx ก่อนนำเข้า'],
    [''],
    ['📊 ข้อมูลอ้างอิง:'],
    [`- สาขาที่มีในระบบ: ${data.branches.length} สาขา`],
    [`- พนักงานที่มีในระบบ: ${data.employees.length} คน`],
    [`- ลูกค้าที่มีในระบบ: ${data.customers.length} คน`],
    [`- สินค้าที่มีในระบบ: ${data.products.length} รายการ`],
    [`- พนักงานเก็บเงิน: ${data.collectors.length} คน`],
    [`- เช็คเกอร์: ${data.checkers.length} คน`]
  ];
  const instructionsWS = XLSX.utils.aoa_to_sheet(instructionsData);
  XLSX.utils.book_append_sheet(wb, instructionsWS, 'คำแนะนำ');

  // Sheet 2: สัญญา (Contracts) - หลัก
  const contractsData = [
    // Header row
    [
      'contract_number*',           // รหัสสัญญา
      'contract_date*',             // วันที่ทำสัญญา
      'customer_code*',             // รหัสลูกค้า
      'customer_name*',             // ชื่อลูกค้า
      'customer_surname*',          // นามสกุลลูกค้า
      'customer_id_card*',          // เลขบัตรประชาชน
      'customer_phone*',            // เบอร์โทรศัพท์
      'customer_address',           // ที่อยู่
      'guarantor_name',             // ชื่อผู้ค้ำ
      'guarantor_surname',          // นามสกุลผู้ค้ำ
      'guarantor_id_card',          // เลขบัตรประชาชนผู้ค้ำ
      'guarantor_phone',            // เบอร์โทรผู้ค้ำ
      'product_code*',              // รหัสสินค้า
      'product_name*',              // ชื่อสินค้า
      'product_price*',             // ราคาสินค้า
      'down_payment*',              // เงินดาวน์
      'monthly_payment*',           // งวดผ่อนต่อเดือน
      'installment_months*',        // จำนวนงวด
      'collection_date*',           // วันที่เก็บเงิน
      'salesperson_code*',          // รหัสพนักงานขาย
      'inspector_code*',            // รหัสผู้ตรวจสอบ
      'collector_code*',            // รหัสพนักงานเก็บเงิน
      'branch_code*',               // รหัสสาขา
      'notes'                       // หมายเหตุ
    ]
  ];

  // เพิ่มข้อมูลตัวอย่างจากข้อมูลจริง (สูงสุด 3 ตัวอย่าง)
  const sampleCustomers = data.customers.slice(0, 3);
  const sampleProducts = data.products.slice(0, 3);
  const sampleEmployees = data.employees.slice(0, 3);
  const sampleCollectors = data.collectors.slice(0, 3);
  const sampleCheckers = data.checkers.slice(0, 3);
  const sampleBranches = data.branches.slice(0, 1);

  sampleCustomers.forEach((customer, index) => {
    const product = sampleProducts[index] || sampleProducts[0];
    const employee = sampleEmployees[index] || sampleEmployees[0];
    const collector = sampleCollectors[index] || sampleCollectors[0];
    const checker = sampleCheckers[index] || sampleCheckers[0];
    const branch = sampleBranches[0];

    if (customer && product && employee && collector && checker && branch) {
      const contractNumber = `CT${new Date().getFullYear()}${String(index + 1).padStart(3, '0')}`;
      const contractDate = new Date().toISOString().split('T')[0];
      const productPrice = parseFloat(product.price) || 25000;
      const downPayment = Math.round(productPrice * 0.2); // 20% ของราคาสินค้า
      const monthlyPayment = Math.round((productPrice - downPayment) / 10); // ผ่อน 10 งวด
      const collectionDate = String(15 + index); // วันที่ 15, 16, 17

      contractsData.push([
        contractNumber,                    // รหัสสัญญา
        contractDate,                      // วันที่ทำสัญญา
        customer.code || `CUST${String(index + 1).padStart(3, '0')}`, // รหัสลูกค้า
        customer.name || 'สมชาย',          // ชื่อลูกค้า
        customer.surname || 'ใจดี',        // นามสกุลลูกค้า
        customer.id_card || '1234567890123', // เลขบัตรประชาชน
        customer.phone || '082-111-1111',  // เบอร์โทรศัพท์
        customer.address || '123 ถนนสุขุมวิท กรุงเทพฯ', // ที่อยู่
        '',                                // ชื่อผู้ค้ำ (ว่าง)
        '',                                // นามสกุลผู้ค้ำ (ว่าง)
        '',                                // เลขบัตรประชาชนผู้ค้ำ (ว่าง)
        '',                                // เบอร์โทรผู้ค้ำ (ว่าง)
        product.code || `PROD${String(index + 1).padStart(3, '0')}`, // รหัสสินค้า
        product.name || 'โทรศัพท์มือถือ Samsung Galaxy S21', // ชื่อสินค้า
        productPrice,                      // ราคาสินค้า
        downPayment,                       // เงินดาวน์
        monthlyPayment,                    // งวดผ่อนต่อเดือน
        '10',                              // จำนวนงวด
        collectionDate,                    // วันที่เก็บเงิน
        employee.code || 'EMP001',         // รหัสพนักงานขาย
        checker.code || 'CHK001',          // รหัสผู้ตรวจสอบ
        collector.code || 'COL001',        // รหัสพนักงานเก็บเงิน
        branch.code || 'BR001',            // รหัสสาขา
        `สัญญาผ่อน${product.name || 'สินค้า'}` // หมายเหตุ
      ]);
    }
  });

  const contractsWS = XLSX.utils.aoa_to_sheet(contractsData);
  XLSX.utils.book_append_sheet(wb, contractsWS, 'สัญญา');

  // Sheet 3: ข้อมูลอ้างอิง - ลูกค้า (Reference - Customers)
  const customersRefData = [
    ['customer_code*', 'name*', 'surname*', 'id_card*', 'phone*', 'address', 'branch_code*']
  ];
  
  data.customers.forEach(customer => {
    const branch = data.branches.find(b => b.id === customer.branch_id);
    customersRefData.push([
      customer.code || `CUST${customer.id}`,
      customer.name || '',
      customer.surname || '',
      customer.id_card || '',
      customer.phone || '',
      customer.address || '',
      branch?.code || 'BR001'
    ]);
  });
  
  const customersRefWS = XLSX.utils.aoa_to_sheet(customersRefData);
  XLSX.utils.book_append_sheet(wb, customersRefWS, 'ข้อมูลลูกค้า');

  // Sheet 4: ข้อมูลอ้างอิง - สินค้า (Reference - Products)
  const productsRefData = [
    ['product_code*', 'product_name*', 'price*', 'category', 'branch_code*']
  ];
  
  data.products.forEach(product => {
    const branch = data.branches.find(b => b.id === product.branch_id);
    productsRefData.push([
      product.code || `PROD${product.id}`,
      product.name || '',
      product.price || 0,
      product.category || '',
      branch?.code || 'BR001'
    ]);
  });
  
  const productsRefWS = XLSX.utils.aoa_to_sheet(productsRefData);
  XLSX.utils.book_append_sheet(wb, productsRefWS, 'ข้อมูลสินค้า');

  // Sheet 5: ข้อมูลอ้างอิง - พนักงาน (Reference - Employees)
  const employeesRefData = [
    ['employee_code*', 'name*', 'surname*', 'position*', 'phone', 'branch_code*']
  ];
  
  data.employees.forEach(employee => {
    const branch = data.branches.find(b => b.id === employee.branch_id);
    employeesRefData.push([
      employee.code || `EMP${employee.id}`,
      employee.name || '',
      employee.surname || '',
      employee.position || '',
      employee.phone || '',
      branch?.code || 'BR001'
    ]);
  });
  
  const employeesRefWS = XLSX.utils.aoa_to_sheet(employeesRefData);
  XLSX.utils.book_append_sheet(wb, employeesRefWS, 'ข้อมูลพนักงาน');

  // Sheet 6: ข้อมูลอ้างอิง - พนักงานเก็บเงิน (Reference - Collectors)
  const collectorsRefData = [
    ['collector_code*', 'name*', 'surname*', 'phone', 'branch_code*']
  ];
  
  data.collectors.forEach(collector => {
    const branch = data.branches.find(b => b.id === collector.branch_id);
    collectorsRefData.push([
      collector.code || `COL${collector.id}`,
      collector.name || '',
      collector.surname || '',
      collector.phone || '',
      branch?.code || 'BR001'
    ]);
  });
  
  const collectorsRefWS = XLSX.utils.aoa_to_sheet(collectorsRefData);
  XLSX.utils.book_append_sheet(wb, collectorsRefWS, 'ข้อมูลพนักงานเก็บเงิน');

  // Sheet 7: ข้อมูลอ้างอิง - เช็คเกอร์ (Reference - Checkers)
  const checkersRefData = [
    ['checker_code*', 'name*', 'surname*', 'phone', 'branch_code*']
  ];
  
  data.checkers.forEach(checker => {
    const branch = data.branches.find(b => b.id === checker.branch_id);
    checkersRefData.push([
      checker.code || `CHK${checker.id}`,
      checker.name || '',
      checker.surname || '',
      checker.phone || '',
      branch?.code || 'BR001'
    ]);
  });
  
  const checkersRefWS = XLSX.utils.aoa_to_sheet(checkersRefData);
  XLSX.utils.book_append_sheet(wb, checkersRefWS, 'ข้อมูลเช็คเกอร์');

  // Sheet 8: ข้อมูลอ้างอิง - สาขา (Reference - Branches)
  const branchesRefData = [
    ['branch_code*', 'branch_name*', 'address', 'phone', 'manager']
  ];
  
  data.branches.forEach(branch => {
    branchesRefData.push([
      branch.code || `BR${branch.id}`,
      branch.name || '',
      branch.address || '',
      branch.phone || '',
      branch.manager || ''
    ]);
  });
  
  const branchesRefWS = XLSX.utils.aoa_to_sheet(branchesRefData);
  XLSX.utils.book_append_sheet(wb, branchesRefWS, 'ข้อมูลสาขา');

  // บันทึกไฟล์
  const outputPath = path.join(__dirname, '..', 'public', 'templates', 'contract_bulk_template_real_data.xlsx');
  XLSX.writeFile(wb, outputPath);
  
  console.log('✅ สร้างไฟล์ template Excel ด้วยข้อมูลจริงสำเร็จ:', outputPath);
  console.log('📋 ไฟล์ประกอบด้วย 8 sheets:');
  console.log('   1. คำแนะนำ - คำแนะนำการใช้งาน');
  console.log('   2. สัญญา - ข้อมูลสัญญาหลัก (กรอกข้อมูลที่นี่)');
  console.log('   3. ข้อมูลลูกค้า - ข้อมูลอ้างอิงลูกค้าจริง');
  console.log('   4. ข้อมูลสินค้า - ข้อมูลอ้างอิงสินค้าจริง');
  console.log('   5. ข้อมูลพนักงาน - ข้อมูลอ้างอิงพนักงานจริง');
  console.log('   6. ข้อมูลพนักงานเก็บเงิน - ข้อมูลอ้างอิงพนักงานเก็บเงินจริง');
  console.log('   7. ข้อมูลเช็คเกอร์ - ข้อมูลอ้างอิงเช็คเกอร์จริง');
  console.log('   8. ข้อมูลสาขา - ข้อมูลอ้างอิงสาขาจริง');
  console.log('');
  console.log('💡 วิธีการใช้งาน:');
  console.log('   1. เปิดไฟล์ contract_bulk_template_real_data.xlsx');
  console.log('   2. กรอกข้อมูลใน Sheet "สัญญา"');
  console.log('   3. ใช้ข้อมูลจาก Sheet อ้างอิงเพื่อความถูกต้อง');
  console.log('   4. บันทึกไฟล์และนำเข้าผ่านระบบ');
  console.log('');
  console.log('📊 สรุปข้อมูลที่ใช้:');
  console.log(`   - สาขา: ${data.branches.length} รายการ`);
  console.log(`   - พนักงาน: ${data.employees.length} รายการ`);
  console.log(`   - ลูกค้า: ${data.customers.length} รายการ`);
  console.log(`   - สินค้า: ${data.products.length} รายการ`);
  console.log(`   - พนักงานเก็บเงิน: ${data.collectors.length} รายการ`);
  console.log(`   - เช็คเกอร์: ${data.checkers.length} รายการ`);
}

// รันสคริปต์
generateContractExcelWithRealData().catch(console.error);

export { generateContractExcelWithRealData };

