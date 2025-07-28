# การแก้ไขปัญหา Contract Edit - Data Mapping

## ปัญหา: ข้อมูลที่แสดงในฟอร์มแก้ไขไม่ตรงกับข้อมูลจริงใน API

### สาเหตุ:
- API response มีข้อมูลจริงที่แตกต่างจากที่คาดหวัง
- Data mapping ไม่ตรงกับ API response structure

### ข้อมูลจริงจาก API (Contract ID 9):
```json
{
  "id": 9,
  "contractNumber": "CT250729533",
  "customerName": "สาวลินนา",
  "customerSurname": "กล่อมเกลี้ยง", 
  "customerFullName": "นาง สาวลินนา",
  "productName": "เตียงนอน 5 ฟุต",
  "totalAmount": "1200.00",
  "customerDetails": {
    "title": "นาง",
    "age": 25,
    "phone1": "0805394282",
    "email": "thejonoii@hotmail.com"
  },
  "productDetails": {
    "description": "รุ่น:  | S/N:  | รุ่น:  | S/N:  | บานเลื่อน",
    "category": "เฟอร์นิเจอร์"
  },
  "plan": {
    "downPayment": "200.00",
    "monthlyPayment": "100.00",
    "months": 10
  }
}
```

### การแก้ไขที่ทำแล้ว:

#### 1. เพิ่ม Debug Logs
```javascript
console.log('🔍 Contract data:', contract);
console.log('🔍 Contract customerDetails:', contract?.customerDetails);
console.log('🔍 Contract productDetails:', contract?.productDetails);
console.log('🔍 Contract plan:', contract?.plan);
```

#### 2. สร้างไฟล์ทดสอบ Data Mapping
- `test_data_mapping.js` - ทดสอบ mapping จากข้อมูลจริง

### วิธีการทดสอบ:

#### 1. ทดสอบ Data Mapping
เปิด Developer Tools (F12) และรัน:
```javascript
// Copy และ paste ไฟล์ test_data_mapping.js ลงใน console
```

**ผลลัพธ์ที่คาดหวัง:**
```
🔍 Testing Data Mapping from Real API Response...

📋 Original contract data:
  - ID: 9
  - Contract Number: CT250729533
  - Customer Name: สาวลินนา
  - Customer Full Name: นาง สาวลินนา
  - Product Name: เตียงนอน 5 ฟุต
  - Total Amount: 1200.00

✅ Mapped form data:
  - Contract Number: CT250729533
  - Customer Name: สาวลินนา
  - Customer Surname: กล่อมเกลี้ยง
  - Customer Phone: 0805394282
  - Product Name: เตียงนอน 5 ฟุต
  - Product Price: 1200.00
  - Total Amount: 1200.00
  - Down Payment: 200.00
  - Monthly Payment: 100.00
  - Months: 10
```

#### 2. ตรวจสอบ Console Logs
เมื่อกดปุ่มแก้ไข ควรเห็น:
```
🔍 ContractEditForm rendered with props: {contractId: 9, selectedBranch: 1}
🔍 Loading contract with ID: 9
🔍 installmentsService.getById called with id: 9
✅ installmentsService.getById response: {data: {success: true, data: {...}}}
🔍 Contract data: {id: 9, contractNumber: "CT250729533", ...}
🔍 Contract customerDetails: {title: "นาง", age: 25, ...}
🔍 Contract productDetails: {description: "รุ่น:  | S/N:  | ...", ...}
🔍 Contract plan: {downPayment: "200.00", monthlyPayment: "100.00", ...}
🔍 Mapped form data: {contractNumber: "CT250729533", ...}
```

#### 3. ตรวจสอบ Debug Info Panel
ควรแสดง:
```
Debug Info:
Contract ID: 9
Contract Number: CT250729533
Customer Name: สาวลินนา
Product Name: เตียงนอน 5 ฟุต
Total Amount: 1200
Branch ID: 1
Loading States:
- Contract: Loaded
- Customers: Loaded (2)
- Products: Loaded (1)
- Employees: Loaded (33)
- Checkers: Loaded (12)
```

### หากยังมีปัญหา:

#### 1. ตรวจสอบ API Response
```bash
curl -X GET "https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/9"
```

#### 2. ตรวจสอบ Data Mapping ใน Console
```javascript
// ทดสอบ mapping ใน console
const contract = {
  contractNumber: "CT250729533",
  customerName: "สาวลินนา",
  productName: "เตียงนอน 5 ฟุต",
  totalAmount: "1200.00"
};

const formData = {
  contractNumber: contract.contractNumber,
  customerDetails: {
    name: contract.customerName
  },
  productDetails: {
    name: contract.productName,
    price: contract.totalAmount
  },
  totalAmount: contract.totalAmount
};

console.log('Mapped form data:', formData);
```

#### 3. ตรวจสอบ Form Fields
ในฟอร์มแก้ไข ควรแสดง:
- **เลขสัญญา**: CT250729533
- **ชื่อลูกค้า**: สาวลินนา
- **สินค้า**: เตียงนอน 5 ฟุต
- **ราคา**: 1,200.00
- **เงินดาวน์**: 200.00
- **ผ่อนชำระ**: 100.00
- **จำนวนเดือน**: 10

### การแก้ไขเพิ่มเติม:

#### 1. ตรวจสอบ Date Format
```javascript
// แปลง date format
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// ใช้ใน mapping
contractDate: formatDate(contract.contractDate),
startDate: formatDate(contract.startDate),
endDate: formatDate(contract.endDate)
```

#### 2. ตรวจสอบ Number Format
```javascript
// แปลง number format
const formatNumber = (value) => {
  if (!value) return '';
  return parseFloat(value).toLocaleString('th-TH');
};

// ใช้ใน mapping
totalAmount: formatNumber(contract.totalAmount),
price: formatNumber(contract.productPrice)
```

### หมายเหตุ:
- API response มีข้อมูลจริงที่แตกต่างจาก seed data
- Data mapping ต้องตรงกับ API response structure
- ข้อมูลที่แสดงในฟอร์มต้องตรงกับข้อมูลใน database
- Debug logs ช่วยในการตรวจสอบ data flow 