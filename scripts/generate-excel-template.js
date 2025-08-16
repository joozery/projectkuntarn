import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// สร้างไฟล์ template Excel
function generateExcelTemplate() {
  const wb = XLSX.utils.book_new();

  // Sheet 1: คำแนะนำ (Instructions)
  const instructionsData = [
    ['คำแนะนำการใช้งาน Template สำหรับ Import ข้อมูลระบบผ่อนสินค้า'],
    [''],
    ['1. กรอกข้อมูลตามลำดับ Sheet ที่กำหนด'],
    ['2. ห้ามเปลี่ยนชื่อคอลัมน์ในไฟล์ template'],
    ['3. กรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน'],
    ['4. ใช้รูปแบบวันที่: YYYY-MM-DD (เช่น 2024-01-15)'],
    ['5. ใช้รูปแบบตัวเลข: ไม่ใส่เครื่องหมายคอมมา (เช่น 25000.50)'],
    [''],
    ['สำหรับข้อมูลที่มีการผ่อนอยู่แล้ว:'],
    ['- กรอกข้อมูลใน Sheet Installments สำหรับข้อมูลสัญญาพื้นฐาน'],
    ['- กรอกข้อมูลใน Sheet Payments ทุกงวด (ทั้งที่ชำระแล้วและยังไม่ชำระ)'],
    ['- กรอกข้อมูลใน Sheet Collections เฉพาะงวดที่ชำระแล้ว'],
    [''],
    ['รูปแบบสถานะ:'],
    ['- สถานะการชำระ: paid, pending, overdue, cancelled'],
    ['- สถานะสัญญา: active, completed, cancelled, overdue'],
    [''],
    ['ข้อควรระวัง:'],
    ['- รหัสต่างๆ (customer_code, contract_number) ต้องไม่ซ้ำกัน'],
    ['- เลขบัตรประชาชนต้องเป็น 13 หลักและไม่ซ้ำกัน'],
    ['- ตรวจสอบความถูกต้องของข้อมูลก่อน import']
  ];
  const instructionsWS = XLSX.utils.aoa_to_sheet(instructionsData);
  XLSX.utils.book_append_sheet(wb, instructionsWS, 'คำแนะนำ');

  // Sheet 2: Branches (สาขา)
  const branchesData = [
    ['branch_code*', 'branch_name*', 'address', 'phone', 'manager'],
    ['BR001', 'สาขาหลัก', '123 ถนนสุขุมวิท กรุงเทพฯ 10110', '02-123-4567', 'คุณสมชาย ใจดี'],
    ['BR002', 'สาขารามคำแหง', '456 ถนนรามคำแหง กรุงเทพฯ 10240', '02-234-5678', 'คุณสมหญิง รักดี'],
    ['BR003', 'สาขาลาดพร้าว', '789 ถนนลาดพร้าว กรุงเทพฯ 10310', '02-345-6789', 'คุณประยุทธ มั่นคง']
  ];
  const branchesWS = XLSX.utils.aoa_to_sheet(branchesData);
  XLSX.utils.book_append_sheet(wb, branchesWS, 'Branches');

  // Sheet 3: Checkers (เช็คเกอร์)
  const checkersData = [
    ['checker_code*', 'name*', 'surname', 'phone', 'email', 'branch_code*'],
    ['CHK001', 'อนุชิต', '', '081-111-1111', 'anuchit@example.com', 'BR001'],
    ['CHK002', 'อุดมศักดิ์', 'ประถมทอง', '081-222-2222', 'udomsak@example.com', 'BR001'],
    ['CHK003', 'เสกศักดิ์', 'โตทอง', '081-333-3333', 'seksak@example.com', 'BR002'],
    ['CHK004', 'สมชาย', 'ใจดี', '081-444-4444', 'somchai@example.com', 'BR002'],
    ['CHK005', 'สมหญิง', 'รักดี', '081-555-5555', 'somying@example.com', 'BR003']
  ];
  const checkersWS = XLSX.utils.aoa_to_sheet(checkersData);
  XLSX.utils.book_append_sheet(wb, checkersWS, 'Checkers');

  // Sheet 4: Customers (ลูกค้า)
  const customersData = [
    ['customer_code*', 'name*', 'surname', 'id_card*', 'nickname', 'phone', 'email', 'address', 'guarantor_name', 'guarantor_id_card', 'guarantor_phone', 'guarantor_address', 'branch_code*', 'checker_code*'],
    ['CUST001', 'สมชาย', 'ใจดี', '1234567890123', 'สมชาย', '082-111-1111', 'customer1@example.com', '123 ถนนสุขุมวิท กรุงเทพฯ', 'สมหญิง รักดี', '9876543210987', '082-222-2222', '456 ถนนรามคำแหง กรุงเทพฯ', 'BR001', 'CHK001'],
    ['CUST002', 'สมหญิง', 'รักดี', '9876543210987', 'สมหญิง', '082-222-2222', 'customer2@example.com', '456 ถนนรามคำแหง กรุงเทพฯ', 'สมชาย ใจดี', '1234567890123', '082-111-1111', '123 ถนนสุขุมวิท กรุงเทพฯ', 'BR001', 'CHK001'],
    ['CUST003', 'ประยุทธ', 'มั่นคง', '1122334455667', 'ประยุทธ', '082-333-3333', 'customer3@example.com', '789 ถนนลาดพร้าว กรุงเทพฯ', '', '', '', '', 'BR002', 'CHK003']
  ];
  const customersWS = XLSX.utils.aoa_to_sheet(customersData);
  XLSX.utils.book_append_sheet(wb, customersWS, 'Customers');

  // Sheet 5: Products (สินค้า)
  const productsData = [
    ['product_code*', 'product_name*', 'description', 'price*', 'branch_code*'],
    ['PROD001', 'โทรศัพท์มือถือ Samsung Galaxy S21', 'สมาร์ทโฟนรุ่นใหม่จาก Samsung', '25000.00', 'BR001'],
    ['PROD002', 'โน้ตบุ๊ค Dell Inspiron 15', 'แล็ปท็อปสำหรับงานและเรียน', '35000.00', 'BR001'],
    ['PROD003', 'ทีวี LG 55 นิ้ว', 'ทีวี Smart TV ขนาด 55 นิ้ว', '45000.00', 'BR002'],
    ['PROD004', 'ตู้เย็น Samsung 2 ประตู', 'ตู้เย็นขนาดใหญ่ 2 ประตู', '28000.00', 'BR002'],
    ['PROD005', 'เครื่องซักผ้า Panasonic', 'เครื่องซักผ้าอัตโนมัติ', '18000.00', 'BR003']
  ];
  const productsWS = XLSX.utils.aoa_to_sheet(productsData);
  XLSX.utils.book_append_sheet(wb, productsWS, 'Products');

  // Sheet 6: Installments (สัญญาผ่อน)
  const installmentsData = [
    ['contract_number*', 'customer_code*', 'product_code', 'product_name*', 'total_amount*', 'installment_amount*', 'installment_period*', 'start_date*', 'end_date*', 'status*', 'branch_code*', 'salesperson_name'],
    ['CT2401001', 'CUST001', 'PROD001', 'โทรศัพท์มือถือ Samsung Galaxy S21', '25000.00', '2500.00', '10', '2024-01-01', '2024-10-01', 'active', 'BR001', 'คุณสมชาย'],
    ['CT2401002', 'CUST002', 'PROD002', 'โน้ตบุ๊ค Dell Inspiron 15', '35000.00', '3500.00', '10', '2024-01-15', '2024-10-15', 'active', 'BR001', 'คุณสมหญิง'],
    ['CT2401003', 'CUST003', 'PROD003', 'ทีวี LG 55 นิ้ว', '45000.00', '4500.00', '10', '2024-02-01', '2024-11-01', 'active', 'BR002', 'คุณประยุทธ']
  ];
  const installmentsWS = XLSX.utils.aoa_to_sheet(installmentsData);
  XLSX.utils.book_append_sheet(wb, installmentsWS, 'Installments');

  // Sheet 7: Payments (การชำระเงิน)
  const paymentsData = [
    ['contract_number*', 'payment_sequence*', 'amount*', 'due_date*', 'payment_date', 'status*', 'notes'],
    ['CT2401001', '1', '2500.00', '2024-01-01', '2024-01-01', 'paid', 'เก็บเงินงวดที่ 1'],
    ['CT2401001', '2', '2500.00', '2024-02-01', '2024-02-01', 'paid', 'เก็บเงินงวดที่ 2'],
    ['CT2401001', '3', '2500.00', '2024-03-01', '', 'pending', ''],
    ['CT2401001', '4', '2500.00', '2024-04-01', '', 'pending', ''],
    ['CT2401001', '5', '2500.00', '2024-05-01', '', 'pending', ''],
    ['CT2401001', '6', '2500.00', '2024-06-01', '', 'pending', ''],
    ['CT2401001', '7', '2500.00', '2024-07-01', '', 'pending', ''],
    ['CT2401001', '8', '2500.00', '2024-08-01', '', 'pending', ''],
    ['CT2401001', '9', '2500.00', '2024-09-01', '', 'pending', ''],
    ['CT2401001', '10', '2500.00', '2024-10-01', '', 'pending', ''],
    ['CT2401002', '1', '3500.00', '2024-01-15', '2024-01-15', 'paid', 'เก็บเงินงวดที่ 1'],
    ['CT2401002', '2', '3500.00', '2024-02-15', '', 'pending', ''],
    ['CT2401002', '3', '3500.00', '2024-03-15', '', 'pending', ''],
    ['CT2401003', '1', '4500.00', '2024-02-01', '2024-02-01', 'paid', 'เก็บเงินงวดที่ 1'],
    ['CT2401003', '2', '4500.00', '2024-03-01', '', 'pending', '']
  ];
  const paymentsWS = XLSX.utils.aoa_to_sheet(paymentsData);
  XLSX.utils.book_append_sheet(wb, paymentsWS, 'Payments');

  // Sheet 8: Collections (การเก็บเงิน)
  const collectionsData = [
    ['contract_number*', 'payment_sequence*', 'checker_code*', 'amount_collected*', 'collection_date*', 'notes'],
    ['CT2401001', '1', 'CHK001', '2500.00', '2024-01-01', 'เก็บเงินงวดที่ 1'],
    ['CT2401001', '2', 'CHK001', '2500.00', '2024-02-01', 'เก็บเงินงวดที่ 2'],
    ['CT2401002', '1', 'CHK001', '3500.00', '2024-01-15', 'เก็บเงินงวดที่ 1'],
    ['CT2401003', '1', 'CHK003', '4500.00', '2024-02-01', 'เก็บเงินงวดที่ 1']
  ];
  const collectionsWS = XLSX.utils.aoa_to_sheet(collectionsData);
  XLSX.utils.book_append_sheet(wb, collectionsWS, 'Collections');

  // บันทึกไฟล์
  const outputPath = path.join(__dirname, '..', 'public', 'templates', 'import_template.xlsx');
  XLSX.writeFile(wb, outputPath);
  
  console.log('✅ สร้างไฟล์ template Excel สำเร็จ:', outputPath);
  console.log('📋 ไฟล์ประกอบด้วย 8 sheets:');
  console.log('   1. คำแนะนำ - คำแนะนำการใช้งาน');
  console.log('   2. Branches - ข้อมูลสาขา');
  console.log('   3. Checkers - ข้อมูลเช็คเกอร์');
  console.log('   4. Customers - ข้อมูลลูกค้า');
  console.log('   5. Products - ข้อมูลสินค้า');
  console.log('   6. Installments - สัญญาผ่อน');
  console.log('   7. Payments - การชำระเงิน');
  console.log('   8. Collections - การเก็บเงิน');
}

// รันสคริปต์
generateExcelTemplate();

export { generateExcelTemplate };