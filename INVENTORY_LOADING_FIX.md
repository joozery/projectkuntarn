# การแก้ไขปัญหาการโหลดข้อมูลสินค้าในฟอร์มทำสัญญา

## ปัญหาที่พบ

ฟอร์มทำสัญญาไม่แสดงข้อมูลสินค้าทั้งหมดที่เหลืออยู่ในคลังในช่อง "ชนิดสินค้า *" แม้ว่าจะมีข้อมูลสินค้าในระบบ

## สาเหตุของปัญหา

### 1. Backend API ไม่มีการ Filter ข้อมูลสินค้าที่มี Stock
- API ส่งข้อมูลสินค้าทั้งหมดมาให้ frontend
- ไม่มีการ filter ข้อมูลสินค้าที่มี status = 'active' และ remaining_quantity1 > 0

### 2. Frontend มีการ Comment Filter ออก
- ใน ContractForm มีการ comment filter ออกไป
- ทำให้แสดงข้อมูลสินค้าทั้งหมดรวมถึงสินค้าที่ไม่มี stock

### 3. การจัดการข้อมูลไม่เหมาะสม
- ไม่มีการแยกข้อมูลสินค้าที่สามารถขายได้
- ไม่มีการตรวจสอบ stock ก่อนแสดงในตัวเลือก

## การแก้ไข

### 1. แก้ไข Backend API (backendkuntarn/routes/inventory.js)

#### เพิ่ม Default Filter สำหรับข้อมูลสินค้าที่มี Stock
```javascript
if (status && status !== 'all') {
  whereClause += ' AND i.status = ?';
  whereParams.push(status);
} else {
  // Default filter: only show active items with stock
  whereClause += ' AND i.status = "active" AND i.remaining_quantity1 > 0';
}
```

**การเปลี่ยนแปลง:**
- เพิ่ม default filter ที่จะแสดงเฉพาะสินค้าที่มี status = 'active' และ remaining_quantity1 > 0
- ถ้ามีการส่ง status parameter มา จะใช้ filter ตามที่ส่งมา
- ถ้าไม่มีการส่ง status parameter มา จะใช้ default filter

### 2. แก้ไข Frontend (src/components/forms/ContractForm.jsx)

#### เปิดใช้งาน Filter ใน Frontend
```javascript
// เดิม (comment ออก)
// .filter(item => item.status === 'active' && Number(item.remaining_quantity1) > 0)

// ใหม่ (เปิดใช้งาน)
.filter(item => item.status === 'active' && Number(item.remaining_quantity1) > 0)
```

**การเปลี่ยนแปลง:**
- เปิดใช้งาน filter ที่ comment ออกไป
- ตรวจสอบ status = 'active' และ remaining_quantity1 > 0
- แสดงเฉพาะสินค้าที่สามารถขายได้

#### เพิ่ม Debug Logging
```javascript
console.log('🔍 ContractForm: Rendering product SearchableSelectField with:', {
  allInventoryCount: allInventory?.length || 0,
  filteredInventory: allInventory.filter(item => item.status === 'active' && Number(item.remaining_quantity1) > 0),
  activeWithQtyCount: allInventory.filter(item => item.status === 'active' && Number(item.remaining_quantity1) > 0).length,
  // ... more debug info
});
```

**การเปลี่ยนแปลง:**
- เพิ่ม debug logging เพื่อติดตามการทำงาน
- แสดงจำนวนข้อมูลก่อนและหลัง filter
- ช่วยในการ troubleshoot ปัญหา

## ผลลัพธ์ที่คาดหวัง

### 1. การแสดงผลสินค้า
- ✅ แสดงเฉพาะสินค้าที่มี status = 'active'
- ✅ แสดงเฉพาะสินค้าที่มี remaining_quantity1 > 0
- ✅ ไม่แสดงสินค้าที่ไม่มี stock หรือ inactive

### 2. การค้นหาสินค้า
- ✅ สามารถค้นหาสินค้าที่มี stock ได้
- ✅ แสดงข้อมูลสินค้าครบถ้วน: ชื่อ, รหัส, ราคา
- ✅ ไม่แสดงสินค้าที่ไม่มี stock ในผลการค้นหา

### 3. การจัดการข้อมูล
- ✅ Backend ส่งข้อมูลที่ถูก filter แล้ว
- ✅ Frontend ตรวจสอบข้อมูลอีกครั้ง
- ✅ ข้อมูลที่แสดงถูกต้องและครบถ้วน

## การทดสอบ

### 1. ทดสอบการแสดงผลสินค้า
1. เปิดฟอร์มทำสัญญา
2. ตรวจสอบว่าช่อง "ชนิดสินค้า" แสดงข้อมูลสินค้าที่มี stock
3. ตรวจสอบว่าไม่แสดงสินค้าที่ไม่มี stock หรือ inactive

### 2. ทดสอบการค้นหาสินค้า
1. คลิกที่ช่อง "ชนิดสินค้า"
2. พิมพ์ชื่อสินค้าเพื่อค้นหา
3. ตรวจสอบว่าผลการค้นหาแสดงเฉพาะสินค้าที่มี stock

### 3. ทดสอบ Debug Logging
1. เปิด Developer Tools (F12)
2. ดู Console tab
3. ตรวจสอบ debug logs สำหรับข้อมูลสินค้า

## ข้อมูลเพิ่มเติม

### Backend API Endpoint
- **URL**: `/api/inventory`
- **Method**: GET
- **Parameters**:
  - `branchId`: ID ของสาขา
  - `status`: สถานะสินค้า (optional)
  - `search`: คำค้นหา (optional)
  - `page`: หน้าข้อมูล (optional)
  - `limit`: จำนวนข้อมูลต่อหน้า (optional)

### Frontend Component
- **File**: `src/components/forms/ContractForm.jsx`
- **Component**: `SearchableSelectField` สำหรับ "ชนิดสินค้า"
- **Filter**: `item.status === 'active' && Number(item.remaining_quantity1) > 0`

### Database Schema
- **Table**: `inventory`
- **Columns**:
  - `status`: สถานะสินค้า ('active', 'inactive', 'sold')
  - `remaining_quantity1`: จำนวนสินค้าที่เหลือ
  - `product_name`: ชื่อสินค้า
  - `product_code`: รหัสสินค้า

## หมายเหตุ

- การแก้ไขนี้จะทำให้แสดงเฉพาะสินค้าที่สามารถขายได้
- ระบบจะไม่แสดงสินค้าที่ไม่มี stock หรือ inactive
- Debug logging จะช่วยในการ troubleshoot ปัญหาในอนาคต
- การ filter ทั้งใน backend และ frontend จะช่วยให้ข้อมูลถูกต้องและปลอดภัย
