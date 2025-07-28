# การแก้ไขปัญหาการแสดงข้อมูลพนักงานในตาราง

## ปัญหา:
ในตาราง "รายการสัญญาทั้งหมด" คอลัมน์ "พนักงาน" ว่างเปล่า ไม่แสดงข้อมูล:
- **พนักงานขาย** (salesperson)
- **ผู้ตรวจสอบ** (inspector/checker)

## สาเหตุ:
1. **Backend API ไม่มี JOIN กับ checkers table**
2. **ไม่มีการส่งข้อมูล inspector ไป Frontend**
3. **Frontend ไม่มีการแสดงข้อมูล inspector**

## การแก้ไข:

### 1. **แก้ไข Backend API (installments.js)**

#### **เพิ่ม JOIN กับ checkers table:**
```sql
-- ก่อนแก้ไข
LEFT JOIN employees e ON i.salesperson_id = e.id

-- หลังแก้ไข
LEFT JOIN employees e ON i.salesperson_id = e.id
LEFT JOIN checkers ch ON i.inspector_id = ch.id
```

#### **เพิ่มข้อมูล inspector ใน SELECT:**
```sql
-- เพิ่มใน SELECT query
ch.name as inspectorName,
ch.surname as inspectorSurname,
ch.full_name as inspectorFullName
```

#### **เพิ่มข้อมูลใน processedResults:**
```javascript
const processedResults = results.map(result => ({
  ...result,
  // Add employee information for frontend
  employeeName: result.salespersonFullName || result.salespersonName || 'ไม่ระบุ',
  inspectorName: result.inspectorFullName || result.inspectorName || 'ไม่ระบุ',
  // ... rest of the mapping
}));
```

### 2. **แก้ไข Frontend (ContractsTable.jsx)**

#### **แสดงข้อมูลพนักงานและผู้ตรวจสอบ:**
```javascript
// ก่อนแก้ไข
<td className="py-3 px-4">
  <div className="text-gray-900">{contract.employeeName}</div>
</td>

// หลังแก้ไข
<td className="py-3 px-4">
  <div className="text-gray-900">
    <div className="font-medium">{contract.employeeName || contract.salespersonFullName || 'ไม่ระบุ'}</div>
    <div className="text-xs text-gray-500">ผู้ตรวจสอบ: {contract.inspectorName || contract.inspectorFullName || 'ไม่ระบุ'}</div>
  </div>
</td>
```

## การตรวจสอบ:

### **ก่อนแก้ไข:**
```
📋 ตาราง "รายการสัญญาทั้งหมด":
   - คอลัมน์ "พนักงาน": ว่างเปล่า
   - ไม่แสดงข้อมูลพนักงานขาย
   - ไม่แสดงข้อมูลผู้ตรวจสอบ
```

### **หลังแก้ไข:**
```
📋 ตาราง "รายการสัญญาทั้งหมด":
   - คอลัมน์ "พนักงาน": แสดงข้อมูลครบ
   - พนักงานขาย: "ชื่อ พนักงานขาย"
   - ผู้ตรวจสอบ: "ชื่อ ผู้ตรวจสอบ"
```

## วิธีการทดสอบ:

### 1. **ตรวจสอบ Backend API**
```bash
# ทดสอบ API
curl -X GET "https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments"
```

ควรเห็น:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "contractNumber": "CT250729567",
      "employeeName": "ชื่อ พนักงานขาย",
      "inspectorName": "ชื่อ ผู้ตรวจสอบ",
      "salespersonFullName": "ชื่อ พนักงานขาย",
      "inspectorFullName": "ชื่อ ผู้ตรวจสอบ"
    }
  ]
}
```

### 2. **ตรวจสอบ Frontend**
1. ไปที่หน้า "รายการสัญญาทั้งหมด"
2. ดูคอลัมน์ "พนักงาน"
3. ควรเห็น:
   - **ชื่อพนักงานขาย** (ตัวหนา)
   - **ผู้ตรวจสอบ: ชื่อผู้ตรวจสอบ** (ตัวเล็ก, สีเทา)

### 3. **ตรวจสอบ Database**
```sql
-- ตรวจสอบข้อมูลใน installments table
SELECT 
  i.id,
  i.contract_number,
  i.salesperson_id,
  i.inspector_id,
  e.full_name as salesperson_name,
  ch.full_name as inspector_name
FROM installments i
LEFT JOIN employees e ON i.salesperson_id = e.id
LEFT JOIN checkers ch ON i.inspector_id = ch.id
LIMIT 5;
```

## ผลลัพธ์ที่คาดหวัง:

### **ในตาราง:**
```
📋 รายการสัญญาทั้งหมด

| เลขสัญญา | วันที่ | ลูกค้า | สินค้า | ผ่อน/เดือน | พนักงาน | สถานะ |
|----------|-------|--------|--------|------------|---------|--------|
| CT250729567 | 29/7/2568 | รรรมดา | เครื่องซักผ้า LG | ฿2,000.00 | **ชื่อ พนักงานขาย**<br>ผู้ตรวจสอบ: **ชื่อ ผู้ตรวจสอบ** | ใช้งาน |
| CT250729533 | 29/7/2568 | สาวลินนา | เตียงนอน 5 ฟุต | ฿100.00 | **ชื่อ พนักงานขาย**<br>ผู้ตรวจสอบ: **ชื่อ ผู้ตรวจสอบ** | ใช้งาน |
```

### **ใน API Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "contractNumber": "CT250729567",
      "contractDate": "2025-07-29",
      "customerName": "รรรมดา",
      "productName": "เครื่องซักผ้า LG 14 กิโล",
      "employeeName": "ชื่อ พนักงานขาย",
      "inspectorName": "ชื่อ ผู้ตรวจสอบ",
      "salespersonFullName": "ชื่อ พนักงานขาย",
      "inspectorFullName": "ชื่อ ผู้ตรวจสอบ",
      "status": "active"
    }
  ]
}
```

## หมายเหตุ:
- การแก้ไขนี้จะแสดงข้อมูลพนักงานขายและผู้ตรวจสอบในตาราง
- หากไม่มีข้อมูล จะแสดง "ไม่ระบุ"
- ข้อมูลจะถูกดึงจาก database ผ่าน JOIN กับ employees และ checkers tables
- การแสดงผลจะแยกพนักงานขายและผู้ตรวจสอบให้ชัดเจน 