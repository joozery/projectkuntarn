# การแก้ไขปัญหาหน้าแก้ไขสัญญา - ชนิดสินค้าและข้อมูลสาย

## ปัญหาที่พบ
เมื่อกดปุ่มแก้ไขในหน้ารายการสัญญา ข้อมูลต่อไปนี้ไม่ถูกแสดง:
1. **ชนิดสินค้า** - ไม่แสดงสินค้าที่บันทึกไว้
2. **ข้อมูลสาย** - ไม่แสดงสายที่บันทึกไว้

## สาเหตุของปัญหา
1. **ชนิดสินค้า**: การ mapping ข้อมูล `productId` ระหว่าง backend และ frontend ไม่ถูกต้อง
2. **ข้อมูลสาย**: การ mapping ข้อมูล `line` และ `collectorId` ไม่ถูกต้อง

## การแก้ไขที่ทำ

### 1. แก้ไขการ mapping ข้อมูล productId
```javascript
// เดิม
productId: contract.productId || '',

// ใหม่ - เพิ่ม fallback สำหรับ product_id
productId: contract.productId || contract.product_id || '',
```

### 2. เพิ่มการ debug logging
เพิ่ม console.log เพื่อติดตามการทำงานของระบบ:

#### การโหลดข้อมูลสัญญา
```javascript
console.log('🔍 Contract productId:', contract?.productId);
console.log('🔍 Contract product_id:', contract?.product_id);
console.log('🔍 Contract line:', contract?.line);
```

#### การโหลดข้อมูล inventory
```javascript
console.log('🔍 All inventory IDs:', inventoryData.map(item => item.id));
console.log('🔍 Sample inventory items:', inventoryData.slice(0, 3).map(item => ({ id: item.id, product_name: item.product_name, status: item.status })));
```

#### การโหลดข้อมูล collectors
```javascript
console.log('🔍 All collector IDs:', collectorsData.map(emp => emp.id));
console.log('🔍 Sample collectors:', collectorsData.slice(0, 3).map(emp => ({ id: emp.id, name: emp.name, position: emp.position, code: emp.code })));
```

#### การ auto-fill ข้อมูลสินค้า
```javascript
console.log('🔍 Auto-fill effect triggered - productId:', contractForm.productId, 'allInventory length:', allInventory.length);
console.log('🔍 Looking for productId:', contractForm.productId, 'in inventory');
console.log('🔍 Found inventory item:', selectedInventory);
```

#### การ mapping ข้อมูลสาย
```javascript
console.log('🔍 Collector mapping effect triggered - line:', contractForm.line, 'collectorId:', contractForm.collectorId, 'allCollectors length:', allCollectors.length);
console.log('🔍 Looking for collector with line:', contractForm.line);
console.log('🔍 Found collector:', foundCollector);
```

### 3. แก้ไขการแสดงผลในฟอร์ม
เพิ่มการ debug logging ในส่วนการ render:
```javascript
{console.log('🔍 Rendering product section - contractForm.productId:', contractForm.productId, 'allInventory length:', allInventory.length)}
{console.log('🔍 Rendering collector section - contractForm.collectorId:', contractForm.collectorId, 'contractForm.line:', contractForm.line, 'allCollectors length:', allCollectors.length)}
```

## วิธีการทดสอบ

### 1. ทดสอบผ่าน Browser Console
1. เปิดหน้ารายการสัญญา
2. กดปุ่มแก้ไขในสัญญาใดสัญญาหนึ่ง
3. เปิด Developer Tools (F12)
4. ดู Console tab เพื่อดู debug logs

### 2. ทดสอบผ่าน Test Script
ใช้ไฟล์ `test_contract_edit_fixed.js` ที่สร้างไว้:
```bash
npx playwright test test_contract_edit_fixed.js
```

## ผลลัพธ์ที่คาดหวัง
หลังจากแก้ไขแล้ว:
1. **ชนิดสินค้า** จะแสดงสินค้าที่บันทึกไว้ในสัญญา
2. **ข้อมูลสาย** จะแสดงสายที่บันทึกไว้ในสัญญา
3. **Debug logs** จะแสดงข้อมูลการทำงานของระบบอย่างละเอียด

## ข้อมูลเพิ่มเติม
- Backend API endpoint: `/api/installments/:id`
- ข้อมูลสินค้าอยู่ในตาราง `inventory`
- ข้อมูลสาย/collector อยู่ในตาราง `employees` (position = 'collector')
- ข้อมูลสัญญาอยู่ในตาราง `installments`

## การแก้ไขเพิ่มเติมที่อาจจำเป็น
หากปัญหายังคงอยู่ ให้ตรวจสอบ:
1. **Backend API response** - ตรวจสอบว่าส่งข้อมูล `productId` และ `line` มาถูกต้องหรือไม่
2. **Database schema** - ตรวจสอบว่าคอลัมน์ `product_id` และ `line` มีข้อมูลถูกต้องหรือไม่
3. **Frontend state management** - ตรวจสอบว่า state ถูก update ถูกต้องหรือไม่

## หมายเหตุ
การแก้ไขนี้เพิ่ม debug logging เพื่อช่วยในการ troubleshoot ปัญหาในอนาคต หากปัญหาได้รับการแก้ไขแล้ว สามารถลบ debug logs เหล่านี้ออกได้
