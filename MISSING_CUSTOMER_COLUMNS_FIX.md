# การแก้ไขปัญหา Missing Customer Columns

## ปัญหา:
ข้อมูลลูกค้าบางส่วนไม่แสดงในฟอร์มแก้ไข:
- **เลขบัตรประชาชน** (idCard)
- **ชื่อเล่น** (nickname)

## สาเหตุ:
**ไม่มีคอลัมน์ `customer_id_card` และ `customer_nickname` ใน MySQL table**

### ข้อมูลที่หายไป:
```sql
-- ❌ ไม่มีใน installments table
customer_id_card VARCHAR(20)
customer_nickname VARCHAR(50)
```

### ข้อมูลที่มีอยู่:
```sql
-- ✅ มีใน installments table
guarantor_id_card VARCHAR(20)
guarantor_nickname VARCHAR(50)
```

## การแก้ไข:

### 1. **เพิ่มคอลัมน์ใน MySQL Database**
รัน SQL script:
```sql
-- Add missing customer columns
ALTER TABLE installments 
ADD COLUMN customer_id_card VARCHAR(20) AFTER customer_email;

ALTER TABLE installments 
ADD COLUMN customer_nickname VARCHAR(50) AFTER customer_id_card;

ALTER TABLE installments 
ADD COLUMN customer_name VARCHAR(100) AFTER customer_id_card;

ALTER TABLE installments 
ADD COLUMN customer_surname VARCHAR(100) AFTER customer_name;
```

### 2. **อัปเดต Backend API**
เพิ่มคอลัมน์ใน SELECT query:
```javascript
// ใน routes/installments.js
i.customer_id_card as customerIdCard,
i.customer_nickname as customerNickname,
```

### 3. **อัปเดต Frontend Data Mapping**
เพิ่ม fallback values:
```javascript
// ใน ContractEditForm.jsx
nickname: contract.customerDetails?.nickname || contract.customerNickname || '',
idCard: contract.customerDetails?.idCard || contract.customerIdCard || '',
```

## วิธีการแก้ไข:

### ขั้นตอนที่ 1: **รัน SQL Script**
```bash
# ใน backendkuntarn directory
mysql -u username -p database_name < db/add_missing_customer_columns.sql
```

### ขั้นตอนที่ 2: **รีสตาร์ท Backend**
```bash
# รีสตาร์ท backend server
npm start
# หรือ
node server.js
```

### ขั้นตอนที่ 3: **รีเฟรช Frontend**
1. เปิด Developer Tools (F12)
2. คลิกขวาที่ปุ่ม Refresh
3. เลือก **"Empty Cache and Hard Reload"**

### ขั้นตอนที่ 4: **ทดสอบ**
1. กดปุ่มแก้ไขในหน้า "รายการสัญญา"
2. ตรวจสอบว่าข้อมูลแสดงครบหรือไม่

## ผลลัพธ์ที่คาดหวัง:

### **ก่อนแก้ไข:**
```
📋 Customer Data:
   - ID: 1
   - Name: สาวลินนา
   - Surname: กล่อมเกลี้ยง
   - Age: 25
   - Phone: 0805394282
   - Email: thejonoii@hotmail.com
   - ID Card: null
   - Nickname: null
```

### **หลังแก้ไข:**
```
📋 Customer Data:
   - ID: 1
   - Name: สาวลินนา
   - Surname: กล่อมเกลี้ยง
   - Age: 25
   - Phone: 0805394282
   - Email: thejonoii@hotmail.com
   - ID Card: 1234567890123
   - Nickname: ลินนา
```

## การตรวจสอบ:

### 1. **ตรวจสอบ Database Schema**
```sql
DESCRIBE installments;
```

ควรเห็น:
```
customer_id_card    VARCHAR(20)
customer_nickname   VARCHAR(50)
customer_name       VARCHAR(100)
customer_surname    VARCHAR(100)
```

### 2. **ตรวจสอบ API Response**
```bash
curl -X GET "https://backendkuntarn-e0ddf979d118.herokuapp.com/api/installments/9"
```

ควรเห็น:
```json
{
  "customerIdCard": "1234567890123",
  "customerNickname": "ลินนา",
  "customerName": "สาวลินนา",
  "customerSurname": "กล่อมเกลี้ยง"
}
```

### 3. **ตรวจสอบ Frontend Form**
ในฟอร์มแก้ไข ควรแสดง:
- ✅ **เลขบัตรประชาชน**: 1234567890123
- ✅ **ชื่อเล่น**: ลินนา

## หมายเหตุ:
- ข้อมูลเก่าที่เป็น `null` จะยังคงเป็น `null` จนกว่าจะอัปเดต
- ข้อมูลใหม่ที่สร้างหลังจากแก้ไขจะมีข้อมูลครบ
- หากต้องการอัปเดตข้อมูลเก่า ต้องทำ manual update ใน database 