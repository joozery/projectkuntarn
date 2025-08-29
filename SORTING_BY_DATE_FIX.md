# การเพิ่มการเรียงลำดับตามวันที่

## 🎯 **วัตถุประสงค์**
เพิ่มการเรียงลำดับสินค้าตามวันที่รับ (ใหม่ไปเก่า) ในทุกส่วนของระบบ

## 📍 **ตำแหน่งที่เพิ่มการเรียงลำดับ**

### 1. **ContractForm.jsx - ฟอร์มสร้างสัญญา**
```jsx
// เพิ่มการเรียงลำดับใน options ของ SearchableSelectField
options={allInventory
  .filter(item => item.status === 'active' && Number(item.remaining_quantity1) > 0)
  .sort((a, b) => {
    // เรียงลำดับตามวันที่รับ (เก่าไปใหม่)
    if (a.receive_date && b.receive_date) {
      return new Date(a.receive_date) - new Date(b.receive_date);
    }
    // ถ้าไม่มีวันที่รับ ให้เรียงตามชื่อสินค้า
    if (a.product_name && b.product_name) {
      return a.product_name.localeCompare(b.product_name, 'th');
    }
    return 0;
  })
  .map(item => ({
    ...item,
    displayName: `${item.product_name || ''}${item.shop_name ? ` | ร้าน: ${item.shop_name}` : ''}${item.receive_date ? ` | รับ: ${new Date(item.receive_date).toLocaleDateString('th-TH')}` : ''}${item.remaining_quantity1 ? ` | คงเหลือ: ${item.remaining_quantity1} ชิ้น` : ''}`,
    searchText: `${item.product_name || ''} ${item.product_code || ''} ${item.shop_name || ''}`.trim()
  }))
}
```

### 2. **ProductsPage.jsx - หน้าจัดการสินค้า**

#### **A. loadData function - โหลดข้อมูลสินค้า**
```jsx
// เรียงลำดับตามวันที่รับ (เก่าไปใหม่) และชื่อสินค้า
const sortedProducts = productsWithNames.sort((a, b) => {
  // เรียงลำดับตามวันที่รับ (เก่าไปใหม่)
  if (a.receive_date && b.receive_date) {
    return new Date(a.receive_date) - new Date(b.receive_date);
  }
  // ถ้าไม่มีวันที่รับ ให้เรียงตามชื่อสินค้า
  if (a.display_name && b.display_name) {
    return a.display_name.localeCompare(b.display_name, 'th');
  }
  return 0;
});

setProducts(sortedProducts);
```

#### **B. addProduct function - เพิ่มสินค้า**
```jsx
// เรียงลำดับตามวันที่รับ (เก่าไปใหม่) และชื่อสินค้า
const sortedProducts = productsWithNames.sort((a, b) => {
  // เรียงลำดับตามวันที่รับ (เก่าไปใหม่)
  if (a.receive_date && b.receive_date) {
    return new Date(a.receive_date) - new Date(b.receive_date);
  }
  // ถ้าไม่มีวันที่รับ ให้เรียงตามชื่อสินค้า
  if (a.display_name && b.display_name) {
    return a.display_name.localeCompare(b.display_name, 'th');
  }
  return 0;
});

setProducts(sortedProducts);
```

#### **C. deleteProduct function - ลบสินค้า**
```jsx
// เรียงลำดับตามวันที่รับ (เก่าไปใหม่) และชื่อสินค้า
const sortedProducts = productsWithNames.sort((a, b) => {
  // เรียงลำดับตามวันที่รับ (เก่าไปใหม่)
  if (a.receive_date && b.receive_date) {
    return new Date(a.receive_date) - new Date(b.receive_date);
  }
  // ถ้าไม่มีวันที่รับ ให้เรียงตามชื่อสินค้า
  if (a.display_name && b.display_name) {
    return a.display_name.localeCompare(b.display_name, 'th');
  }
  return 0;
});

setProducts(sortedProducts);
```

#### **D. updateProduct function - แก้ไขสินค้า**
```jsx
// เรียงลำดับตามวันที่รับ (เก่าไปใหม่) และชื่อสินค้า
const sortedProducts = productsWithNames.sort((a, b) => {
  // เรียงลำดับตามวันที่รับ (เก่าไปใหม่)
  if (a.receive_date && b.receive_date) {
    return new Date(a.receive_date) - new Date(b.receive_date);
  }
  // ถ้าไม่มีวันที่รับ ให้เรียงตามชื่อสินค้า
  if (a.display_name && b.display_name) {
    return a.display_name.localeCompare(b.display_name, 'th');
  }
  return 0;
});

setProducts(sortedProducts);
```

#### **E. calculateInventoryStats function - คำนวณสถิติคลัง**
```jsx
// รวมสินค้าคงเหลือและสินค้าที่ขายไปแล้ว
const allProductsWithSold = [...allItems, ...soldItems];
stats.totalItemsWithSold = allProductsWithSold.length;

// เรียงลำดับตามวันที่รับ (เก่าไปใหม่) และชื่อสินค้า
const sortedAllProducts = allProductsWithSold.sort((a, b) => {
  // เรียงลำดับตามวันที่รับ (เก่าไปใหม่)
  if (a.receive_date && b.receive_date) {
    return new Date(a.receive_date) - new Date(b.receive_date);
  }
  // ถ้าไม่มีวันที่รับ ให้เรียงตามชื่อสินค้า
  if (a.display_name && b.display_name) {
    return a.display_name.localeCompare(b.display_name, 'th');
  }
  return 0;
});

// อัปเดต products state ให้รวมสินค้าที่ขายไปแล้ว
setProducts(sortedAllProducts);
```

## 🔄 **ลำดับการเรียงลำดับ**

### **1. วันที่รับ (เก่าไปใหม่)**
```javascript
if (a.receive_date && b.receive_date) {
  return new Date(a.receive_date) - new Date(b.receive_date);
}
```
- **สินค้าที่รับเก่า** จะแสดงก่อน
- **สินค้าที่รับใหม่** จะแสดงหลัง

### **2. ชื่อสินค้า (ภาษาไทย)**
```javascript
if (a.display_name && b.display_name) {
  return a.display_name.localeCompare(b.display_name, 'th');
}
```
- ใช้การเรียงลำดับภาษาไทย
- เรียงตามตัวอักษร A-Z

### **3. ค่าเริ่มต้น**
```javascript
return 0;
```
- ถ้าไม่มีข้อมูลให้เรียงลำดับ

## 📊 **ตัวอย่างการเรียงลำดับ**

### **ข้อมูลสินค้า**:
```
1. เครื่องซักผ้า 10 Kg Lg | ร้าน: ร้าน A | รับ: 25/8/2567 | คงเหลือ: 1 ชิ้น
2. ที่นอน 6 ฟุต ยางอัด ผ้านอก | ร้าน: ร้าน B | รับ: 20/8/2567 | คงเหลือ: 2 ชิ้น
3. ตู้เย็น 5.9 คิว 2 ประตู ชาร์ป | ร้าน: ร้าน C | รับ: 15/8/2567 | คงเหลือ: 1 ชิ้น
4. เครื่องซักผ้า 11 กิโล LGมือ 2 | ร้าน: ร้าน D | รับ: 10/8/2567 | คงเหลือ: 1 ชิ้น
```

### **ผลลัพธ์การเรียงลำดับ**:
```
1. เครื่องซักผ้า 10 Kg Lg | ร้าน: ร้าน A | รับ: 25/8/2567 | คงเหลือ: 1 ชิ้น
2. ที่นอน 6 ฟุต ยางอัด ผ้านอก | ร้าน: ร้าน B | รับ: 20/8/2567 | คงเหลือ: 2 ชิ้น
3. ตู้เย็น 5.9 คิว 2 ประตู ชาร์ป | ร้าน: ร้าน C | รับ: 15/8/2567 | คงเหลือ: 1 ชิ้น
4. เครื่องซักผ้า 11 กิโล LGมือ 2 | ร้าน: ร้าน D | รับ: 10/8/2567 | คงเหลือ: 1 ชิ้น
```

## ✅ **ประโยชน์ที่ได้**

### **👀 สำหรับผู้ใช้**:
- **เห็นสินค้าเก่า** ก่อน
- **ง่ายต่อการค้นหา** สินค้าที่รับเข้ามาเก่า
- **เรียงลำดับเป็นระเบียบ** ตามวันที่

### **🔄 สำหรับระบบ**:
- **ข้อมูลอัปเดต** ทุกครั้งที่มีการเปลี่ยนแปลง
- **การเรียงลำดับสอดคล้อง** ในทุกส่วน
- **ประสิทธิภาพดี** ใช้การเรียงลำดับแบบ in-place

### **📱 สำหรับการใช้งาน**:
- **ฟอร์มสร้างสัญญา**: เห็นสินค้าเก่าก่อน
- **หน้าจัดการสินค้า**: เรียงลำดับตามวันที่รับ
- **การค้นหา**: ผลลัพธ์เรียงลำดับตามวันที่

## 🔧 **การทำงาน**

### **1. การเรียงลำดับ**:
- ใช้ `Array.sort()` method
- เรียงลำดับแบบ in-place (ไม่สร้าง array ใหม่)
- ใช้ `Date` object สำหรับเปรียบเทียบวันที่

### **2. การเปรียบเทียบวันที่**:
```javascript
new Date(a.receive_date) - new Date(b.receive_date)
```
- แปลง string เป็น Date object
- ลบวันที่เพื่อเปรียบเทียบ
- ผลลัพธ์เป็นลบ = a เก่ากว่า b

### **3. การเปรียบเทียบชื่อ**:
```javascript
a.display_name.localeCompare(b.display_name, 'th')
```
- ใช้ `localeCompare` สำหรับภาษาไทย
- รองรับการเรียงลำดับภาษาไทย
- ผลลัพธ์เป็นลบ = a มาก่อน b

## 📝 **หมายเหตุ**

- **การเรียงลำดับ**: เก่าไปใหม่ (เก่าแสดงก่อน)
- **การรองรับ**: ข้อมูลที่ไม่มีวันที่รับ
- **ภาษา**: รองรับภาษาไทย
- **ประสิทธิภาพ**: ใช้การเรียงลำดับแบบ in-place
- **การอัปเดต**: ทุกครั้งที่มีการเปลี่ยนแปลงข้อมูล

## 🎉 **ผลลัพธ์**

ตอนนี้สินค้าทั้งหมดในระบบจะเรียงลำดับตามวันที่รับ (เก่าไปใหม่) แล้ว ทำให้:

1. **เห็นสินค้าเก่า** ก่อน
2. **ง่ายต่อการค้นหา** สินค้าที่รับเข้ามาเก่า
3. **ข้อมูลเป็นระเบียบ** ตามลำดับเวลา
4. **การใช้งานสะดวก** สำหรับผู้ใช้
