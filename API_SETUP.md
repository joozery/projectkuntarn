# การตั้งค่า API สำหรับ Frontend

## 🚀 การเชื่อมต่อกับ Backend API

### 📡 API Base URL
```
https://backendkuntarn-e0ddf979d118.herokuapp.com/api
```

### 📁 โครงสร้างไฟล์ API

```
src/
├── lib/
│   └── api.js              # Axios configuration
└── services/
    ├── branchesService.js   # API สำหรับจัดการสาขา
    ├── checkersService.js   # API สำหรับจัดการเช็คเกอร์
    ├── customersService.js  # API สำหรับจัดการลูกค้า
    └── installmentsService.js # API สำหรับจัดการแผนการผ่อน
```

## 🔧 การใช้งาน

### 1. การเรียกใช้ API ใน Component

```jsx
import { checkersService } from '@/services/checkersService';

// ดึงข้อมูลเช็คเกอร์ทั้งหมด
const loadCheckers = async () => {
  try {
    const response = await checkersService.getAll({ branchId: 1 });
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// เพิ่มเช็คเกอร์ใหม่
const addChecker = async (checkerData) => {
  try {
    const response = await checkersService.create(checkerData);
    console.log('Created:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 2. การจัดการ Error

```jsx
import { toast } from '@/components/ui/use-toast';

const handleError = (error) => {
  if (error.response) {
    // Server error
    toast({
      title: "เกิดข้อผิดพลาด",
      description: error.response.data.message || "ไม่สามารถดำเนินการได้",
      variant: "destructive"
    });
  } else if (error.request) {
    // Network error
    toast({
      title: "ข้อผิดพลาดเครือข่าย",
      description: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
      variant: "destructive"
    });
  } else {
    // Other error
    toast({
      title: "เกิดข้อผิดพลาด",
      description: error.message,
      variant: "destructive"
    });
  }
};
```

## 📋 API Endpoints

### Branches (สาขา)
- `GET /branches` - ดึงรายการสาขาทั้งหมด
- `GET /branches/:id` - ดึงข้อมูลสาขาตาม ID
- `POST /branches` - เพิ่มสาขาใหม่
- `PUT /branches/:id` - แก้ไขข้อมูลสาขา
- `DELETE /branches/:id` - ลบสาขา
- `GET /branches/:id/statistics` - ดึงสถิติของสาขา
- `GET /branches/:id/checkers` - ดึงเช็คเกอร์ในสาขา
- `GET /branches/:id/customers` - ดึงลูกค้าในสาขา
- `GET /branches/:id/installments` - ดึงสัญญาผ่อนชำระในสาขา
- `GET /branches/:id/collections` - ดึงประวัติการเก็บเงินในสาขา

### Checkers (เช็คเกอร์)
- `GET /checkers` - ดึงรายการเช็คเกอร์ทั้งหมด
- `GET /checkers/:id` - ดึงข้อมูลเช็คเกอร์ตาม ID
- `POST /checkers` - เพิ่มเช็คเกอร์ใหม่
- `PUT /checkers/:id` - แก้ไขข้อมูลเช็คเกอร์
- `DELETE /checkers/:id` - ลบเช็คเกอร์
- `GET /checkers/:id/collections` - ดึงประวัติการเก็บเงินของเช็คเกอร์
- `POST /checkers/:id/collections` - บันทึกการเก็บเงินใหม่
- `GET /checkers/:id/reports` - ดึงรายงานการเก็บเงินรายเดือน

### Customers (ลูกค้า)
- `GET /customers` - ดึงรายการลูกค้าทั้งหมด
- `GET /customers/:id` - ดึงข้อมูลลูกค้าตาม ID
- `GET /customers/:id/installments` - ดึงสัญญาผ่อนชำระของลูกค้า

### Installments (แผนการผ่อน)
- `GET /installments` - ดึงรายการสัญญาผ่อนชำระทั้งหมด
- `GET /installments/:id` - ดึงข้อมูลสัญญาผ่อนชำระตาม ID
- `GET /installments/:id/payments` - ดึงตารางชำระเงินของสัญญา
- `GET /installments/:id/collections` - ดึงประวัติการเก็บเงินของสัญญา
- `PUT /installments/:id` - อัปเดตสถานะสัญญาผ่อนชำระ

## 🔄 การอัปเดต Component

### ตัวอย่างการอัปเดต CheckersPage

```jsx
import React, { useState, useEffect } from 'react';
import { checkersService } from '@/services/checkersService';
import { toast } from '@/components/ui/use-toast';

const CheckersPage = ({ selectedBranch, currentBranch }) => {
  const [checkers, setCheckers] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลจาก API
  useEffect(() => {
    loadCheckers();
  }, [selectedBranch]);

  const loadCheckers = async () => {
    try {
      setLoading(true);
      const response = await checkersService.getAll({ branchId: selectedBranch });
      setCheckers(response.data || []);
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addChecker = async (checkerData) => {
    try {
      const response = await checkersService.create({
        ...checkerData,
        branchId: selectedBranch
      });
      setCheckers(prev => [...prev, response.data]);
      toast({
        title: "สำเร็จ",
        description: "เพิ่มเช็คเกอร์เรียบร้อยแล้ว"
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มเช็คเกอร์ได้",
        variant: "destructive"
      });
    }
  };

  // ... rest of component
};
```

## 🛠️ การติดตั้ง

1. **ติดตั้ง axios** (ถ้ายังไม่ได้ติดตั้ง)
```bash
npm install axios
```

2. **ตรวจสอบการเชื่อมต่อ**
```bash
# ทดสอบ API health check
curl https://backendkuntarn-e0ddf979d118.herokuapp.com/api/health
```

3. **รัน frontend**
```bash
npm run dev
```

## 🔍 การ Debug

### 1. ตรวจสอบ Network Tab
- เปิด Developer Tools
- ไปที่ Network tab
- ดูการเรียก API และ response

### 2. ตรวจสอบ Console
- ดู error messages
- ตรวจสอบ response data

### 3. ทดสอบ API ด้วย Postman
- ทดสอบ endpoints ต่างๆ
- ตรวจสอบ request/response format

## 📝 หมายเหตุ

- API ใช้ CORS สำหรับการเชื่อมต่อจาก frontend
- Timeout ตั้งไว้ที่ 10 วินาที
- Error handling ครอบคลุม network errors และ server errors
- ข้อมูลแยกตาม branchId เพื่อความปลอดภัย

## 🆘 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **CORS Error**
   - ตรวจสอบ API base URL
   - ตรวจสอบ CORS configuration ใน backend

2. **Network Error**
   - ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
   - ตรวจสอบ API server status

3. **Authentication Error**
   - ตรวจสอบ token (ถ้ามี)
   - ตรวจสอบ API permissions

4. **Data Format Error**
   - ตรวจสอบ request/response format
   - ตรวจสอบ data validation 