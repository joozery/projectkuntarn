# การแก้ไขปัญหา Contract Edit - ไม่ดึงข้อมูลเดิม

## ปัญหา: กดแก้ไขแล้วไม่ดึงค่าดั้งเดิมที่บันทึกขึ้นมา

### สาเหตุที่เป็นไปได้:

1. **API Endpoint 404 Not Found**
2. **Database ไม่มีข้อมูล contract ID 9**
3. **Frontend เรียก API ผิด URL**
4. **Data Mapping ไม่ถูกต้อง**

### การแก้ไขที่ทำแล้ว:

#### 1. แก้ไข API Base URL
```javascript
// เปลี่ยนจาก
const API_BASE_URL = 'https://backendkuntarn-e0ddf979d118.herokuapp.com/api';

// เป็น
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://backendkuntarn-e0ddf979d118.herokuapp.com/api'
  : 'http://localhost:5000/api';
```

#### 2. แก้ไข Data Mapping
```javascript
// Customer Details
name: contract.customerName || contract.customerFullName || '',
surname: contract.customerSurname || '',

// Product Details  
name: contract.productName || '',
price: contract.productPrice || contract.totalAmount || '',
```

#### 3. เพิ่ม Debug Logs
- API endpoint logs
- Database query logs
- Frontend mapping logs

### วิธีการทดสอบ:

#### 1. ทดสอบ Database
```bash
cd backendkuntarn
node check_contract_data.js
```

**ผลลัพธ์ที่คาดหวัง:**
```
🔍 Checking Contract Data in Database...

1. Checking if contract ID 9 exists...
✅ Contract 9 found: true
📋 Contract 9 data: {id: 9, contract_number: "CT2401001", ...}

2. Checking all contracts...
✅ Total contracts: 6
   ID 1: CT2401001 (Customer: 1, Product: 1, Amount: 25000)
   ID 2: CT2401002 (Customer: 2, Product: 2, Amount: 35000)
   ...
```

#### 2. ทดสอบ API Endpoint
```bash
cd backendkuntarn
node test_installment_by_id.js
```

**ผลลัพธ์ที่คาดหวัง:**
```
🔍 Testing Installment by ID API...

1. Testing /api/installments/9...
✅ Response status: 200
✅ Response success: true
📋 Contract data:
  - ID: 9
  - Contract Number: CT2401001
  - Customer Name: สมชาย ใจดี
  - Product Name: โทรศัพท์มือถือ Samsung Galaxy S21
  - Total Amount: 25000
```

#### 3. ทดสอบ Frontend API
เปิด Developer Tools (F12) และรัน:
```javascript
// Copy และ paste ไฟล์ test_api_endpoint.js ลงใน console
```

**ผลลัพธ์ที่คาดหวัง:**
```
🔍 Testing API Endpoint...

1. Testing localhost:5000...
✅ Localhost status: 200
✅ Localhost data: {success: true, data: {...}}

2. Testing Heroku...
✅ Heroku status: 200
✅ Heroku data: {success: true, data: {...}}
```

#### 4. ตรวจสอบ Backend Logs
```bash
# ใน backend directory
npm run dev
# หรือ
heroku logs --tail
```

**Logs ที่ควรเห็น:**
```
🔍 GET /api/installments/:id called with id: 9
🔍 Query results for id 9: 1 records
✅ Installment found and returned
```

#### 5. ตรวจสอบ Frontend Console
เปิด Developer Tools (F12) และดู Console:
```
🔍 Contract data: {id: 9, contractNumber: "CT2401001", ...}
🔍 Contract data keys: ["id", "contractNumber", "customerName", ...]
🔍 Mapped form data: {contractNumber: "CT2401001", ...}
🔍 Mapped customerDetails: {name: "สมชาย ใจดี", ...}
🔍 Mapped productDetails: {name: "โทรศัพท์มือถือ Samsung Galaxy S21", ...}
```

### หากยังมีปัญหา:

#### 1. ตรวจสอบ Backend Server
```bash
# ตรวจสอบว่า backend รันอยู่
curl http://localhost:5000/api/health

# หรือ
npm run dev
```

#### 2. ตรวจสอบ Database Connection
```bash
# ตรวจสอบ .env file
cat .env

# ตรวจสอบ database connection
mysql -u root -p installment_db -e "SELECT COUNT(*) FROM installments;"
```

#### 3. รัน Seed Data ใหม่
```bash
# รัน seed data
mysql -u root -p installment_db < db/seed_data.sql
```

#### 4. ตรวจสอบ CORS
```javascript
// ใน backendkuntarn/server.js
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

### Debug Info Panel:
ควรแสดง:
```
Debug Info:
Contract ID: 9
Contract Number: CT2401001
Customer Name: สมชาย ใจดี
Product Name: โทรศัพท์มือถือ Samsung Galaxy S21
Total Amount: 25000
Branch ID: 1
Loading States:
- Contract: Loaded
- Customers: Loaded (2)
- Products: Loaded (1)
- Employees: Loaded (33)
- Checkers: Loaded (12)
```

### หมายเหตุ:
- Frontend ใช้ localhost:5000 สำหรับ development
- Backend ต้องรันที่ port 5000
- Database ต้องมีข้อมูล contract ID 9
- API response format: `{success: true, data: {...}}` 