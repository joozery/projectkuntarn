# การแก้ไขปัญหา Column count doesn't match value count

## ปัญหา:
```
Error: Column count doesn't match value count at row 1
code: 'ER_WRONG_VALUE_COUNT_ON_ROW'
```

## สาเหตุ:
1. **Database schema ไม่ตรงกับ INSERT query**
2. **คอลัมน์ใน customers table ไม่ครบ** ตามที่ INSERT query ต้องการ
3. **VALUES มี 25 placeholders แต่ params มี 24 values**

## การแก้ไข:

### 1. **รัน SQL Script เพื่ออัปเดต Schema**
```bash
# ใน backendkuntarn directory
mysql -u username -p database_name < db/fix_customers_schema.sql
```

### 2. **ตรวจสอบ Schema ที่ถูกต้อง**
```sql
DESCRIBE customers;
```

ควรเห็นคอลัมน์เหล่านี้:
```
id, code, title, name, surname, full_name, nickname, age, id_card, 
address, moo, road, subdistrict, district, province,
phone1, phone2, phone3, email,
guarantor_name, guarantor_id_card, guarantor_nickname, guarantor_phone, guarantor_address,
status, branch_id, checker_id
```

### 3. **ตรวจสอบ INSERT Query**
```sql
INSERT INTO customers (
  code, title, name, surname, full_name, nickname, age, id_card, address,
  moo, road, subdistrict, district, province, phone1, phone2, phone3, email,
  guarantor_name, guarantor_id_card, guarantor_nickname, guarantor_phone, guarantor_address,
  status, branch_id, checker_id
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
```

**Columns**: 25 columns
**Values**: 25 placeholders (?)

### 4. **ตรวจสอบ Params Array**
```javascript
const params = [
  code, title || 'นาย', name, surname, fullName, nickname, age, idCard, address,
  moo, road, subdistrict, district, province, phone1, phone2, phone3, email,
  guarantorName, guarantorIdCard, guarantorNickname, guarantorPhone, guarantorAddress,
  status || 'active', branchId, checkerId
];
```

**Params**: 25 values

## การตรวจสอบ:

### **ก่อนแก้ไข:**
```
❌ Column count doesn't match value count at row 1
❌ VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) - 24 placeholders
❌ Params array - 24 values
```

### **หลังแก้ไข:**
```
✅ VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) - 25 placeholders
✅ Params array - 25 values
✅ Schema มีคอลัมน์ครบ 25 columns
```

## วิธีการแก้ไข:

### **ขั้นตอนที่ 1: รัน Schema Fix Script**
```bash
# เข้า MySQL
mysql -u root -p

# เลือก database
USE your_database_name;

# รัน script
source /path/to/backendkuntarn/db/fix_customers_schema.sql;
```

### **ขั้นตอนที่ 2: ตรวจสอบ Schema**
```sql
DESCRIBE customers;
```

### **ขั้นตอนที่ 3: รีสตาร์ท Backend**
```bash
# รีสตาร์ท backend server
npm start
# หรือ
node server.js
```

### **ขั้นตอนที่ 4: ทดสอบสร้าง Customer**
1. ไปที่หน้า "จัดการลูกค้า"
2. เพิ่มลูกค้าใหม่
3. ตรวจสอบว่าไม่มี error

## ผลลัพธ์ที่คาดหวัง:

### **Schema ที่ถูกต้อง:**
```
+----------------------+--------------+------+-----+-------------------+----------------+
| Field                | Type         | Null | Key | Default           | Extra          |
+----------------------+--------------+------+-----+-------------------+----------------+
| id                   | bigint       | NO   | PRI | NULL              | auto_increment |
| code                 | varchar(50)  | NO   | UNI | NULL              |                |
| title                | varchar(10)  | YES  |     | นาย               |                |
| name                 | varchar(255) | NO   |     | NULL              |                |
| surname              | varchar(255) | YES  |     | NULL              |                |
| full_name            | varchar(255) | NO   |     | NULL              |                |
| nickname             | varchar(100) | YES  |     | NULL              |                |
| age                  | int          | YES  |     | NULL              |                |
| id_card              | varchar(13)  | NO   | UNI | NULL              |                |
| address              | text         | YES  |     | NULL              |                |
| moo                  | varchar(50)  | YES  |     | NULL              |                |
| road                 | varchar(255) | YES  |     | NULL              |                |
| subdistrict          | varchar(255) | YES  |     | NULL              |                |
| district             | varchar(255) | YES  |     | NULL              |                |
| province             | varchar(255) | YES  |     | NULL              |                |
| phone1               | varchar(20)  | YES  |     | NULL              |                |
| phone2               | varchar(20)  | YES  |     | NULL              |                |
| phone3               | varchar(20)  | YES  |     | NULL              |                |
| email                | varchar(255) | YES  |     | NULL              |                |
| guarantor_name       | varchar(255) | YES  |     | NULL              |                |
| guarantor_id_card    | varchar(13)  | YES  |     | NULL              |                |
| guarantor_nickname   | varchar(100) | YES  |     | NULL              |                |
| guarantor_phone      | varchar(20)  | YES  |     | NULL              |                |
| guarantor_address    | text         | YES  |     | NULL              |                |
| status               | enum(...)    | YES  |     | active            |                |
| branch_id            | bigint       | YES  | MUL | NULL              |                |
| checker_id           | bigint       | YES  | MUL | NULL              |                |
+----------------------+--------------+------+-----+-------------------+----------------+
```

### **API Response ที่ถูกต้อง:**
```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "id": 1,
    "code": "CUST003",
    "title": "นาย",
    "name": "ธรรมดา",
    "surname": "แสนวิเศษ",
    "full_name": "ธรรมดา แสนวิเศษ",
    "nickname": "แจ๊คกี้เอม",
    "age": 30,
    "id_card": "1199000023177",
    "address": "553",
    "moo": "5",
    "road": "",
    "subdistrict": "กัญญา",
    "district": "เมือง",
    "province": "สมุทปราการ",
    "phone1": "0887766534",
    "phone2": "",
    "phone3": "",
    "email": "",
    "guarantor_name": null,
    "guarantor_id_card": null,
    "guarantor_nickname": null,
    "guarantor_phone": null,
    "guarantor_address": null,
    "status": "active",
    "branch_id": 1,
    "checker_id": null
  }
}
```

## หมายเหตุ:
- ปัญหานี้เกิดจาก schema ที่ไม่ตรงกันระหว่าง database และ code
- การรัน schema fix script จะแก้ปัญหาได้
- หากยังมีปัญหา ให้ตรวจสอบว่า script รันสำเร็จหรือไม่ 