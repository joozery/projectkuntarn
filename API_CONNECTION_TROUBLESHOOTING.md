# การแก้ไขปัญหา API Connection

## ปัญหา: API เชื่อมต่อไม่ได้หมดเลย

### สาเหตุ:
- เปลี่ยน API URL เป็น localhost แต่ backend รันใน Heroku
- Heroku backend อาจจะไม่ทำงานหรือไม่มีข้อมูล

### การแก้ไขที่ทำแล้ว:

#### 1. แก้ไข API URL กลับมาเป็น Heroku
```javascript
// เปลี่ยนกลับมาเป็น
const API_BASE_URL = 'https://backendkuntarn-e0ddf979d118.herokuapp.com/api';
```

### วิธีการทดสอบ:

#### 1. ทดสอบ Heroku API จาก Frontend
เปิด Developer Tools (F12) และรัน:
```javascript
// Copy และ paste ไฟล์ test_heroku_api.js ลงใน console
```

**ผลลัพธ์ที่คาดหวัง:**
```
🔍 Testing Heroku API...

1. Testing Heroku health endpoint...
✅ Health status: 200
✅ Health data: {status: "OK", message: "Backend API is running"}

2. Testing Heroku installments endpoint...
✅ Installments status: 200
✅ Installments count: 6

3. Testing Heroku contract 9...
✅ Contract status: 200
✅ Contract data: {success: true, id: 9, contractNumber: "CT2401001", ...}
```

#### 2. ทดสอบ Heroku API จาก Backend
```bash
cd backendkuntarn
node test_heroku_database.js
```

**ผลลัพธ์ที่คาดหวัง:**
```
🔍 Testing Heroku Database...

1. Testing health endpoint...
✅ Health status: 200
✅ Health data: {status: "OK", message: "Backend API is running"}

2. Testing installments endpoint...
✅ Installments status: 200
✅ Total contracts: 6
📋 Available contracts:
   ID 1: CT2401001 (สมชาย ใจดี)
   ID 2: CT2401002 (สมหญิง รักดี)
   ...

3. Testing contract ID 9...
✅ Contract 9 status: 200
📋 Contract 9 data:
   - ID: 9
   - Contract Number: CT2401001
   - Customer Name: สมชาย ใจดี
   - Product Name: โทรศัพท์มือถือ Samsung Galaxy S21
   - Total Amount: 25000
```

#### 3. ตรวจสอบ Heroku Logs
```bash
heroku logs --tail --app backendkuntarn-e0ddf979d118
```

**Logs ที่ควรเห็น:**
```
🚀 Server running on port 5000
📡 API available at /api
✅ Database connected successfully!
```

### หากยังมีปัญหา:

#### 1. ตรวจสอบ Heroku App Status
```bash
heroku ps --app backendkuntarn-e0ddf979d118
```

#### 2. รีสตาร์ท Heroku App
```bash
heroku restart --app backendkuntarn-e0ddf979d118
```

#### 3. ตรวจสอบ Database Connection
```bash
heroku config --app backendkuntarn-e0ddf979d118
```

#### 4. รัน Seed Data ใน Heroku
```bash
heroku run node db/seed_data.sql --app backendkuntarn-e0ddf979d118
```

### การทดสอบ Frontend:

#### 1. รีเฟรชหน้าเว็บ
#### 2. เปิด Developer Tools (F12)
#### 3. ดู Console logs:
```
🔍 Loading checkers for branch: 1
✅ Checkers response: {data: {success: true, data: Array(12)}}
🔍 Loading contract: 9
✅ Contract response: {data: {success: true, data: {...}}}
```

#### 4. ตรวจสอบ Network tab:
- ดูว่า API calls ไปที่ Heroku URL
- ดู response status เป็น 200
- ดู response data มีข้อมูล

### หาก Heroku ไม่ทำงาน:

#### 1. ใช้ Localhost แทน
```javascript
// ใน projectkuntarn/src/lib/api.js
const API_BASE_URL = 'http://localhost:5000/api';
```

#### 2. รัน Backend ใน Localhost
```bash
cd backendkuntarn
npm run dev
```

#### 3. รัน Database ใน Localhost
```bash
mysql -u root -p installment_db < db/seed_data.sql
```

### หมายเหตุ:
- Frontend ใช้ Heroku URL: `https://backendkuntarn-e0ddf979d118.herokuapp.com/api`
- Backend รันใน Heroku ที่ port 5000
- Database ต้องมีข้อมูลจาก seed_data.sql
- หาก Heroku ไม่ทำงาน ให้ใช้ localhost แทน 