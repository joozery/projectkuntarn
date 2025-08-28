# การแก้ไขปัญหาการแสดงผลสินค้าในฟอร์มแก้ไขสัญญา

## ปัญหาที่พบ

เมื่อกดปุ่มแก้ไขสัญญา ข้อมูลสินค้าที่ทำสัญญาไม่ถูกแสดงในช่อง "สินค้า" แม้ว่าจะมีการบันทึกข้อมูลไว้แล้ว

## สาเหตุของปัญหา

### 1. Backend API Naming Conflict
ใน backend API มีการ JOIN กับตาราง `inventory` แต่ข้อมูลที่ส่งกลับมามีปัญหาเรื่อง naming conflict:

```sql
-- ปัญหา: มีชื่อ field ซ้ำกัน
i.product_name as productName,        -- จากตาราง installments
inv.product_name as productName,      -- จากตาราง inventory (ทับข้อมูลก่อน)
```

ข้อมูลจากตาราง `inventory` จะทับข้อมูลจากตาราง `installments` ทำให้ข้อมูลสินค้าที่บันทึกไว้ในสัญญาหายไป

### 2. Frontend ไม่มีการ Fallback
Frontend พยายามหาสินค้าจาก `allInventory` แต่ถ้าไม่เจอ จะไม่แสดงข้อมูลใดๆ เลย

## การแก้ไข

### 1. แก้ไข Backend API (backendkuntarn/routes/installments.js)

#### แก้ไข GET /:id endpoint
```sql
-- เดิม (มีปัญหา)
inv.product_name as productName,

-- ใหม่ (แก้ไขแล้ว)
inv.product_name as inventoryProductName,
```

#### แก้ไข GET / endpoint (all installments)
```sql
-- เดิม (มีปัญหา)
inv.product_name as productName,

-- ใหม่ (แก้ไขแล้ว)
inv.product_name as inventoryProductName,
```

#### แก้ไข Search Query
```sql
-- เดิม
sqlQuery += ' AND (i.contract_number LIKE ? OR c.full_name LIKE ? OR inv.product_name LIKE ?)';

-- ใหม่ (เพิ่มการค้นหาจาก i.product_name ด้วย)
sqlQuery += ' AND (i.contract_number LIKE ? OR c.full_name LIKE ? OR i.product_name LIKE ? OR inv.product_name LIKE ?)';
```

### 2. แก้ไข Frontend (src/components/forms/ContractEditForm.jsx)

#### แก้ไขการ Mapping ข้อมูลสินค้า
```javascript
// เดิม
name: contract.productName || '',

// ใหม่ (เพิ่ม fallback)
name: contract.productName || contract.inventoryProductName || '',
```

#### เพิ่ม Fallback สำหรับการแสดงผลสินค้า
```javascript
if (selectedProduct) {
  // แสดงข้อมูลจาก inventory
  return (
    <div className="space-y-2">
      {/* แสดงข้อมูลสินค้าจาก inventory */}
    </div>
  );
} else {
  // Fallback: แสดงข้อมูลจาก contractForm.productDetails
  if (contractForm.productDetails.name) {
    return (
      <div className="space-y-2">
        {/* แสดงข้อมูลสินค้าจาก contract */}
      </div>
    );
  } else {
    return (
      <div>ยังไม่ได้เลือกสินค้า</div>
    );
  }
}
```

#### เพิ่ม Debug Logging
```javascript
console.log('🔍 Product display debug:');
console.log('  - contractForm.productId:', contractForm.productId);
console.log('  - allInventory length:', allInventory.length);
console.log('  - selectedProduct:', selectedProduct);
console.log('  - contractForm.productDetails:', contractForm.productDetails);
```

## โครงสร้าง UI ใหม่

### แถวแรก: สินค้าและค้นหา
```
┌─────────────────────────────────────────────────────────────┐
│ สินค้า *                    │ ค้นหาสินค้า *                │
│ ┌─────────────────────────┐ │ ┌─────────────────────────┐ │
│ │ 📦 เครื่องปรับอากาศ     │ │ │ [พิมพ์ค้นหาสินค้า...]   │ │
│ │ รุ่น: TT10NARG          │ │ │                         │ │
│ │ S/N: 410WSFN1K203      │ │ │                         │ │
│ │ ราคา: ฿15,000          │ │ │                         │ │
│ └─────────────────────────┘ │ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### แถวที่สอง: รายละเอียดสินค้าอื่นๆ
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ ราคารวม     │ รุ่น        │ S/N         │ ดาวน์       │
│ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │
│ │ 15000   │ │ │TT10NARG │ │ │410WSFN..│ │ │ 1350    │ │
│ └─────────┘ │ └─────────┘ │ └─────────┘ │ └─────────┘ │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

## ผลลัพธ์ที่คาดหวัง

### 1. การแสดงผลสินค้า
- ✅ แสดงข้อมูลสินค้าที่บันทึกไว้ในสัญญาได้ถูกต้อง
- ✅ มี fallback สำหรับสินค้าที่ไม่อยู่ใน inventory ปัจจุบัน
- ✅ แสดงข้อมูลครบถ้วน: ชื่อ, รุ่น, S/N, ราคา

### 2. การค้นหาสินค้า
- ✅ สามารถค้นหาและเลือกสินค้าใหม่ได้
- ✅ รวมสินค้าที่บันทึกไว้ในสัญญาในตัวเลือก
- ✅ รองรับสินค้าที่ไม่อยู่ใน inventory ปัจจุบัน

### 3. การจัดการข้อมูล
- ✅ แยกข้อมูลสินค้าจาก installments และ inventory ได้ถูกต้อง
- ✅ ไม่มี naming conflict ใน API response
- ✅ ข้อมูลถูกส่งกลับมาครบถ้วน

## การทดสอบ

### 1. ทดสอบการแสดงผลสินค้า
1. เปิดหน้ารายการสัญญา
2. กดปุ่มแก้ไขในสัญญาที่มีข้อมูลสินค้า
3. ตรวจสอบว่าช่อง "สินค้า" แสดงข้อมูลถูกต้อง
4. ตรวจสอบว่าช่อง "ค้นหาสินค้า" มีตัวเลือกครบถ้วน

### 2. ทดสอบการค้นหาสินค้า
1. ในฟอร์มแก้ไขสัญญา
2. คลิกที่ช่อง "ค้นหาสินค้า"
3. พิมพ์ชื่อสินค้าเพื่อค้นหา
4. เลือกสินค้าใหม่
5. ตรวจสอบว่าช่อง "สินค้า" อัปเดตข้อมูลใหม่

### 3. ทดสอบ Debug Logging
1. เปิด Developer Tools (F12)
2. ดู Console tab
3. ตรวจสอบ debug logs สำหรับข้อมูลสินค้า

## หมายเหตุ

- การแก้ไขนี้จะทำให้ข้อมูลสินค้าที่บันทึกไว้ในสัญญาแสดงผลได้ถูกต้อง
- ระบบจะรองรับกรณีที่สินค้าที่บันทึกไว้ไม่อยู่ใน inventory ปัจจุบัน
- UI ใหม่จะแยกการแสดงผลสินค้าและการค้นหาสินค้าให้ชัดเจน
- Debug logging จะช่วยในการ troubleshoot ปัญหาในอนาคต
