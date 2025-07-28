// Test script for data mapping from real API response
// Run this in browser console

console.log('🔍 Testing Data Mapping from Real API Response...\n');

// Real API response data
const contract = {
  "id": 9,
  "contractNumber": "CT250729533",
  "contractDate": "2025-07-29T00:00:00.000Z",
  "customerId": 1,
  "productId": 1,
  "productName": "เตียงนอน 5 ฟุต",
  "totalAmount": "1200.00",
  "installmentAmount": "100.00",
  "remainingAmount": "1000.00",
  "installmentPeriod": 10,
  "startDate": "2025-07-29T00:00:00.000Z",
  "endDate": "2026-05-29T00:00:00.000Z",
  "branchId": 1,
  "salespersonId": 26,
  "inspectorId": 14,
  "line": "1",
  "customerTitle": "นาง",
  "customerAge": 25,
  "customerMoo": "ม.8",
  "customerRoad": null,
  "customerSubdistrict": "ต.บางสะพาน",
  "customerDistrict": "อ.บางสะพานน้อย",
  "customerProvince": "จ.ประจวบคีรีขันธ์",
  "customerPhone1": "0805394282",
  "customerPhone2": null,
  "customerPhone3": null,
  "customerEmail": "thejonoii@hotmail.com",
  "guarantorId": 2,
  "guarantorTitle": "นาย",
  "guarantorName": "สมใจ",
  "guarantorSurname": "อย่างยิ่ง",
  "guarantorNickname": "เพจจี้",
  "guarantorAge": 30,
  "guarantorIdCard": "1234567890123",
  "guarantorAddress": "555/2222 4 บางลุมุด อ.บางใหญ่ จ.สมดุล 4 บางลุมุด อ.บางใหญ่ จ.สมดุล",
  "guarantorMoo": "4",
  "guarantorRoad": null,
  "guarantorSubdistrict": "บางลุมุด",
  "guarantorDistrict": "อ.บางใหญ่",
  "guarantorProvince": "จ.สมดุล",
  "guarantorPhone1": "0887651234",
  "guarantorPhone2": "0887651234",
  "guarantorPhone3": null,
  "guarantorEmail": "eamil@ooo.com",
  "productDescription": "รุ่น:  | S/N:  | รุ่น:  | S/N:  | บานเลื่อน",
  "productCategory": "เฟอร์นิเจอร์",
  "productModel": null,
  "productSerialNumber": null,
  "downPayment": "200.00",
  "monthlyPayment": "100.00",
  "months": 10,
  "collectionDate": "2567-07-30T00:00:00.000Z",
  "status": "active",
  "createdAt": "2025-07-28T19:17:02.000Z",
  "updatedAt": "2025-07-28T19:17:02.000Z",
  "customerName": "สาวลินนา",
  "customerSurname": "กล่อมเกลี้ยง",
  "customerFullName": "นาง สาวลินนา",
  "customerPhone": "0805394282",
  "customerAddress": "43/5 ม.8 ต.บางสะพาน อ.บางสะพานน้อย จ.ประจวบคีรีขันธ์",
  "productPrice": "1200.00",
  "branchName": "สาขาประจวบคีรีขันธ์",
  "salespersonName": "รณไชยธรรม",
  "salespersonSurname": "กลิ่นทอง",
  "salespersonFullName": "รณไชยธรรม กลิ่นทอง",
  "customerDetails": {
    "title": "นาง",
    "age": 25,
    "moo": "ม.8",
    "road": null,
    "subdistrict": "ต.บางสะพาน",
    "district": "อ.บางสะพานน้อย",
    "province": "จ.ประจวบคีรีขันธ์",
    "phone1": "0805394282",
    "phone2": null,
    "phone3": null,
    "email": "thejonoii@hotmail.com"
  },
  "guarantorDetails": {
    "id": 2,
    "title": "นาย",
    "name": "สมใจ",
    "surname": "อย่างยิ่ง",
    "nickname": "เพจจี้",
    "age": 30,
    "idCard": "1234567890123",
    "address": "555/2222 4 บางลุมุด อ.บางใหญ่ จ.สมดุล 4 บางลุมุด อ.บางใหญ่ จ.สมดุล",
    "moo": "4",
    "road": null,
    "subdistrict": "บางลุมุด",
    "district": "อ.บางใหญ่",
    "province": "จ.สมดุล",
    "phone1": "0887651234",
    "phone2": "0887651234",
    "phone3": null,
    "email": "eamil@ooo.com"
  },
  "productDetails": {
    "description": "รุ่น:  | S/N:  | รุ่น:  | S/N:  | บานเลื่อน",
    "category": "เฟอร์นิเจอร์",
    "model": null,
    "serialNumber": null
  },
  "plan": {
    "downPayment": "200.00",
    "monthlyPayment": "100.00",
    "months": 10
  }
};

console.log('📋 Original contract data:');
console.log('  - ID:', contract.id);
console.log('  - Contract Number:', contract.contractNumber);
console.log('  - Customer Name:', contract.customerName);
console.log('  - Customer Full Name:', contract.customerFullName);
console.log('  - Product Name:', contract.productName);
console.log('  - Total Amount:', contract.totalAmount);

// Test the current mapping logic
const formData = {
  contractNumber: contract.contractNumber || '',
  contractDate: contract.contractDate || contract.startDate || '',
  customerId: contract.customerId || '',
  customerDetails: {
    title: contract.customerDetails?.title || contract.customerTitle || 'นาย',
    name: contract.customerName || contract.customerFullName || '',
    surname: contract.customerSurname || '',
    nickname: contract.customerDetails?.nickname || '',
    age: contract.customerDetails?.age || contract.customerAge || '',
    idCard: contract.customerDetails?.idCard || '',
    address: contract.customerAddress || '',
    moo: contract.customerDetails?.moo || contract.customerMoo || '',
    road: contract.customerDetails?.road || contract.customerRoad || '',
    subdistrict: contract.customerDetails?.subdistrict || contract.customerSubdistrict || '',
    district: contract.customerDetails?.district || contract.customerDistrict || '',
    province: contract.customerDetails?.province || contract.customerProvince || '',
    phone1: contract.customerDetails?.phone1 || contract.customerPhone1 || contract.customerPhone || '',
    phone2: contract.customerDetails?.phone2 || contract.customerPhone2 || '',
    phone3: contract.customerDetails?.phone3 || contract.customerPhone3 || '',
    email: contract.customerDetails?.email || contract.customerEmail || ''
  },
  guarantorId: contract.guarantorId || '',
  guarantorDetails: {
    title: contract.guarantorDetails?.title || contract.guarantorTitle || 'นาย',
    name: contract.guarantorDetails?.name || contract.guarantorName || '',
    surname: contract.guarantorDetails?.surname || contract.guarantorSurname || '',
    nickname: contract.guarantorDetails?.nickname || contract.guarantorNickname || '',
    age: contract.guarantorDetails?.age || contract.guarantorAge || '',
    idCard: contract.guarantorDetails?.idCard || contract.guarantorIdCard || '',
    address: contract.guarantorDetails?.address || contract.guarantorAddress || '',
    moo: contract.guarantorDetails?.moo || contract.guarantorMoo || '',
    road: contract.guarantorDetails?.road || contract.guarantorRoad || '',
    subdistrict: contract.guarantorDetails?.subdistrict || contract.guarantorSubdistrict || '',
    district: contract.guarantorDetails?.district || contract.guarantorDistrict || '',
    province: contract.guarantorDetails?.province || contract.guarantorProvince || '',
    phone1: contract.guarantorDetails?.phone1 || contract.guarantorPhone1 || '',
    phone2: contract.guarantorDetails?.phone2 || contract.guarantorPhone2 || '',
    phone3: contract.guarantorDetails?.phone3 || contract.guarantorPhone3 || '',
    email: contract.guarantorDetails?.email || contract.guarantorEmail || ''
  },
  productId: contract.productId || '',
  productDetails: {
    name: contract.productName || '',
    description: contract.productDetails?.description || contract.productDescription || '',
    price: contract.productPrice || contract.totalAmount || '',
    category: contract.productDetails?.category || contract.productCategory || '',
    model: contract.productDetails?.model || contract.productModel || '',
    serialNumber: contract.productDetails?.serialNumber || contract.productSerialNumber || ''
  },
  plan: {
    downPayment: contract.plan?.downPayment || contract.downPayment || '',
    monthlyPayment: contract.plan?.monthlyPayment || contract.monthlyPayment || contract.installmentAmount || '',
    months: contract.plan?.months || contract.months || contract.installmentPeriod || '',
    collectionDate: contract.plan?.collectionDate || contract.collectionDate || ''
  },
  salespersonId: contract.salespersonId || '',
  inspectorId: contract.inspectorId || '',
  line: contract.line || '',
  totalAmount: contract.totalAmount || 0,
  installmentPeriod: contract.installmentPeriod || contract.months || 12,
  startDate: contract.startDate || '',
  endDate: contract.endDate || ''
};

console.log('\n✅ Mapped form data:');
console.log('  - Contract Number:', formData.contractNumber);
console.log('  - Customer Name:', formData.customerDetails.name);
console.log('  - Customer Surname:', formData.customerDetails.surname);
console.log('  - Customer Phone:', formData.customerDetails.phone1);
console.log('  - Product Name:', formData.productDetails.name);
console.log('  - Product Price:', formData.productDetails.price);
console.log('  - Total Amount:', formData.totalAmount);
console.log('  - Down Payment:', formData.plan.downPayment);
console.log('  - Monthly Payment:', formData.plan.monthlyPayment);
console.log('  - Months:', formData.plan.months);

console.log('\n🔍 Customer Details:', formData.customerDetails);
console.log('🔍 Product Details:', formData.productDetails);
console.log('🔍 Plan Details:', formData.plan); 