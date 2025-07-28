# การแก้ไขปัญหาฟอร์มแก้ไขสัญญา

## ปัญหา: ฟอร์มแก้ไขไม่โหลดข้อมูล

### สาเหตุที่เป็นไปได้:

1. **API Response Structure ไม่ตรงกัน**
   - Backend ส่งข้อมูลในรูปแบบ `camelCase` (เช่น `contractNumber`)
   - Frontend คาดหวังข้อมูลในรูปแบบ `snake_case` (เช่น `contract_number`)

2. **API Endpoint ไม่ถูกต้อง**
   - ตรวจสอบว่า endpoint `/api/installments/:id` ทำงานถูกต้อง

3. **Network Error**
   - ตรวจสอบการเชื่อมต่อ API
   - ตรวจสอบ CORS settings

### วิธีการแก้ไข:

#### 1. ตรวจสอบ Console Logs
เปิด Developer Tools (F12) และดู Console tab:
```javascript
// ควรเห็น logs เหล่านี้:
🔍 Loading contract with ID: [contract_id]
🔍 API Response: [response_object]
🔍 Contract data: [contract_data]
🔍 Mapped form data: [form_data]
```

#### 2. ตรวจสอบ Network Tab
ใน Developer Tools > Network tab:
- ดู request ไปยัง `/api/installments/:id`
- ตรวจสอบ response status (ควรเป็น 200)
- ตรวจสอบ response data structure

#### 3. ตรวจสอบ API Response Structure
Backend ส่งข้อมูลในรูปแบบนี้:
```javascript
{
  success: true,
  data: {
    id: 1,
    contractNumber: "CT250729533",
    contractDate: "2025-07-29",
    customerId: 1,
    customerName: "สาวลินนา",
    customerPhone: "0805394282",
    // ... other fields
    customerDetails: {
      title: "นางสาว",
      name: "สาวลินนา",
      // ... other customer details
    },
    productDetails: {
      name: "เตียงนอน 5 ฟุต",
      // ... other product details
    },
    plan: {
      downPayment: 200,
      monthlyPayment: 100,
      months: 10
    }
  }
}
```

#### 4. ตรวจสอบ Database
ตรวจสอบว่าข้อมูลในตาราง `installments` มีอยู่จริง:
```sql
SELECT * FROM installments WHERE id = [contract_id];
```

### การ Debug เพิ่มเติม:

#### 1. เพิ่ม Debug Info
ใน development mode ฟอร์มจะแสดง debug info ที่ด้านบน:
- Contract ID
- Contract Number
- Customer Name
- Product Name
- Total Amount

#### 2. ใช้ Test Script
รัน script ใน browser console:
```javascript
// Copy and paste test_edit_form.js content
```

#### 3. ตรวจสอบ State
ใน React DevTools:
- ตรวจสอบ `contractForm` state
- ตรวจสอบ `loadingContract` state
- ตรวจสอบ `contractId` prop

### การแก้ไขที่ทำแล้ว:

1. **ปรับปรุง Data Mapping**
   - เพิ่มการรองรับทั้ง `camelCase` และ `snake_case` field names
   - เพิ่ม fallback values สำหรับทุก field

2. **เพิ่ม Error Handling**
   - แสดง error message เมื่อไม่สามารถโหลดข้อมูลได้
   - เพิ่ม loading state ที่ชัดเจน

3. **เพิ่ม Debug Logs**
   - Console logs สำหรับติดตามการทำงาน
   - Debug info panel ใน development mode

### การทดสอบ:

1. **ทดสอบการโหลดข้อมูล**
   - คลิกปุ่ม "แก้ไข" ในตาราง
   - ตรวจสอบว่า loading spinner แสดง
   - ตรวจสอบว่าข้อมูลปรากฏในฟอร์ม

2. **ทดสอบการบันทึก**
   - แก้ไขข้อมูลในฟอร์ม
   - คลิกปุ่ม "บันทึกการแก้ไข"
   - ตรวจสอบว่าแสดง success message

3. **ทดสอบการกลับ**
   - คลิกปุ่ม "กลับ"
   - ตรวจสอบว่าฟอร์มหายไป

### หากยังมีปัญหา:

1. **ตรวจสอบ Backend Logs**
   ```bash
   # ใน backend directory
   npm run dev
   # หรือ
   heroku logs --tail
   ```

2. **ตรวจสอบ Database Schema**
   ```sql
   DESCRIBE installments;
   ```

3. **ทดสอบ API โดยตรง**
   ```bash
   curl -X GET http://localhost:3000/api/installments/1
   ```

### หมายเหตุ:
- ฟอร์มแก้ไขใช้ API endpoint เดียวกับฟอร์มสร้างใหม่
- ข้อมูลจะถูกแปลงจาก backend structure เป็น frontend structure
- Debug info จะแสดงเฉพาะใน development mode 