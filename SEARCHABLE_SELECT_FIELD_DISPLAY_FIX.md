# การแก้ไขการแสดงผลใน SearchableSelectField

## ปัญหาที่พบ

### ❌ **ข้อมูลไม่แสดงใน dropdown**:
- ข้อมูลร้านค้า, วันที่รับ, คงเหลือ ไม่แสดงใน dropdown
- แสดงเฉพาะชื่อสินค้าเท่านั้น
- ไม่เห็นข้อมูลเพิ่มเติมที่เราสร้างขึ้น

### 🔍 **สาเหตุ**:
- `SearchableSelectField` component ใช้ `option.name` หรือ `option.product_name`
- ไม่ได้ใช้ `option.displayName` ที่เราสร้างขึ้น
- การค้นหาไม่ได้ใช้ `displayName`

## การแก้ไข

### 1. **แก้ไขการแสดงผลใน dropdown**
```jsx
// เดิม
<div className="font-medium">{option.name || option.product_name || option.full_name || option.fullName || option.nickname}</div>

// ใหม่
<div className="font-medium">{option.displayName || option.name || option.product_name || option.full_name || option.fullName || option.nickname}</div>
```

### 2. **แก้ไขการแสดงผลในช่อง input**
```jsx
// เดิม
value={isOpen ? searchTerm : (selectedOption?.name || selectedOption?.product_name || selectedOption?.full_name || selectedOption?.fullName || selectedOption?.nickname || '')}

// ใหม่
value={isOpen ? searchTerm : (selectedOption?.displayName || selectedOption?.name || selectedOption?.product_name || selectedOption?.full_name || selectedOption?.fullName || selectedOption?.nickname || '')}
```

### 3. **แก้ไขการค้นหา**
```jsx
// เดิม
const filtered = options.filter(option => 
  option.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  option.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  // ... other fields
);

// ใหม่
const filtered = options.filter(option => 
  option.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  option.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  option.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  // ... other fields
);
```

## การทำงาน

### 📋 **การสร้าง displayName**:
```javascript
displayName: `${item.product_name || ''}${item.shop_name ? ` | ร้าน: ${item.shop_name}` : ''}${item.receive_date ? ` | รับ: ${new Date(item.receive_date).toLocaleDateString('th-TH')}` : ''}${item.remaining_quantity1 ? ` | คงเหลือ: ${item.remaining_quantity1} ชิ้น` : ''}`
```

### 🎯 **การแสดงผล**:
1. **ใน dropdown**: แสดง `displayName` ที่มีข้อมูลครบถ้วน
2. **ในช่อง input**: แสดง `displayName` เมื่อเลือกสินค้าแล้ว
3. **การค้นหา**: ค้นหาจาก `displayName` เป็นอันดับแรก

### 🔍 **ลำดับการค้นหา**:
1. `displayName` - ข้อมูลที่เราสร้างขึ้น (ร้านค้า, วันที่รับ, คงเหลือ)
2. `name` - ชื่อสินค้า
3. `product_name` - ชื่อสินค้า (alternate)
4. `full_name` - ชื่อเต็ม
5. `fullName` - ชื่อเต็ม (alternate)
6. `phone` - เบอร์โทรศัพท์
7. `nickname` - ชื่อเล่น
8. `product_code` - รหัสสินค้า
9. `surname` - นามสกุล

## ผลลัพธ์ที่ได้

### ✨ **ข้อมูลที่แสดงใน dropdown**:
- **ชื่อสินค้า** - ชื่อสินค้าหลัก
- **ร้านค้า** - ชื่อร้านที่สินค้าอยู่
- **วันที่รับ** - วันที่รับสินค้าเข้ามา
- **คงเหลือ** - จำนวนสินค้าที่เหลือ

### 📝 **ตัวอย่างการแสดงผล**:
```
เครื่องซักผ้า 10 Kg Lg | ร้าน: ร้าน A | รับ: 15/8/2567 | คงเหลือ: 1 ชิ้น
ที่นอน 6 ฟุต ยางอัด ผ้านอก | ร้าน: ร้าน B | รับ: 20/8/2567 | คงเหลือ: 2 ชิ้น
ตู้เย็น 5.9 คิว 2 ประตู ชาร์ป | ร้าน: ร้าน C | รับ: 25/8/2567 | คงเหลือ: 1 ชิ้น
```

### 🔍 **การค้นหา**:
- **ค้นหาจากชื่อสินค้า**: "เครื่องซักผ้า" → แสดงสินค้าที่มีชื่อนี้
- **ค้นหาจากร้านค้า**: "ร้าน A" → แสดงสินค้าของร้านนี้
- **ค้นหาจากวันที่**: "15/8" → แสดงสินค้าที่รับในวันที่นี้
- **ค้นหาจากจำนวน**: "1 ชิ้น" → แสดงสินค้าที่เหลือ 1 ชิ้น

## ประโยชน์

### 👀 **เห็นข้อมูลครบถ้วน**:
- เห็นข้อมูลสินค้าทั้งหมดใน dropdown
- ไม่ต้องคลิกเลือกเพื่อดูข้อมูลเพิ่มเติม
- ตัดสินใจเลือกสินค้าได้ง่ายขึ้น

### 🔍 **ค้นหาได้หลากหลาย**:
- ค้นหาจากชื่อสินค้า
- ค้นหาจากร้านค้า
- ค้นหาจากวันที่รับ
- ค้นหาจากจำนวนคงเหลือ

### 📱 **ประหยัดพื้นที่**:
- ข้อมูลแสดงในบรรทัดเดียว
- ไม่ต้องใช้พื้นที่เพิ่มสำหรับแสดงข้อมูล
- ฟอร์มกระชับและใช้งานง่าย

## การใช้งาน

### 1. **การเลือกสินค้า**:
- คลิกที่ช่อง "ชนิดสินค้า"
- เห็นข้อมูลครบถ้วนใน dropdown
- เลือกสินค้าที่ต้องการ

### 2. **การค้นหาสินค้า**:
- พิมพ์คำค้นหาในช่อง
- ค้นหาได้จากหลายฟิลด์
- เห็นผลลัพธ์ที่ตรงกัน

### 3. **การตรวจสอบข้อมูล**:
- ดูข้อมูลสินค้าทั้งหมดใน dropdown
- ตรวจสอบร้านค้า, วันที่รับ, คงเหลือ
- เลือกสินค้าที่เหมาะสม

## หมายเหตุ

- **ข้อมูลอัปเดต**: แบบ Real-time เมื่อเปลี่ยนสินค้า
- **การแสดงผล**: ใน dropdown และช่อง input
- **การค้นหา**: ค้นหาจาก `displayName` เป็นอันดับแรก
- **รูปแบบ**: ข้อความต่อเนื่องที่อ่านง่าย
- **การจัดการ**: รองรับข้อมูลที่ไม่มีค่า (แสดง "ไม่ระบุ")
