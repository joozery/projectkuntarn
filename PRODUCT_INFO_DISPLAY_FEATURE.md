# การเพิ่มฟีเจอร์แสดงข้อมูลสินค้าในฟอร์มสร้างสัญญา

## ฟีเจอร์ที่เพิ่ม

### 📋 **การแสดงข้อมูลสินค้าที่เลือก**
เพิ่มการแสดงข้อมูลรายละเอียดของสินค้าที่เลือกในฟอร์มสร้างสัญญา

#### ข้อมูลที่แสดง:
1. **ร้านค้า** - แสดงชื่อร้านค้าที่สินค้าอยู่
2. **วันที่รับ** - แสดงวันที่รับสินค้าเข้ามาในคลัง
3. **คงเหลือ** - แสดงจำนวนสินค้าที่เหลืออยู่ในคลัง
4. **รหัสสินค้า** - แสดงรหัสสินค้า
5. **หมายเหตุ** - แสดงหมายเหตุของสินค้า (ถ้ามี)
6. **สถานะ** - แสดงสถานะของสินค้า (พร้อมขาย/ไม่พร้อมขาย)

## การทำงาน

### 1. **การแสดงข้อมูลเมื่อเลือกสินค้า**
```jsx
{/* แสดงข้อมูลสินค้าที่เลือก */}
{contractForm.productId && (() => {
  const selectedProduct = allInventory.find(item => item.id == contractForm.productId);
  if (selectedProduct) {
    return (
      <div className="col-span-full bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-blue-900 flex items-center gap-2">
          <Package className="w-4 h-4" />
          ข้อมูลสินค้าที่เลือก
        </h4>
        {/* แสดงข้อมูลสินค้า */}
      </div>
    );
  }
  return null;
})()}
```

### 2. **การแสดงข้อมูลในรูปแบบ Grid**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* ร้านค้า */}
  <div className="bg-white rounded-lg p-3 border border-blue-100">
    <div className="text-xs text-blue-600 font-medium mb-1">ร้านค้า</div>
    <div className="text-sm text-gray-900">
      {selectedProduct.shop_name || 'ไม่ระบุ'}
    </div>
  </div>
  
  {/* วันที่รับ */}
  <div className="bg-white rounded-lg p-3 border border-blue-100">
    <div className="text-xs text-blue-600 font-medium mb-1">วันที่รับ</div>
    <div className="text-sm text-gray-900">
      {selectedProduct.receive_date ? new Date(selectedProduct.receive_date).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
    </div>
  </div>
  
  {/* คงเหลือ */}
  <div className="bg-white rounded-lg p-3 border border-blue-100">
    <div className="text-xs text-blue-600 font-medium mb-1">คงเหลือ</div>
    <div className="text-sm text-gray-900">
      {selectedProduct.remaining_quantity1 || 0} ชิ้น
    </div>
  </div>
  
  {/* รหัสสินค้า */}
  <div className="bg-white rounded-lg p-3 border border-blue-100">
    <div className="text-xs text-blue-600 font-medium mb-1">รหัสสินค้า</div>
    <div className="text-sm text-gray-900">
      {selectedProduct.product_code || 'ไม่ระบุ'}
    </div>
  </div>
</div>
```

### 3. **การแสดงข้อมูลเพิ่มเติม**
```jsx
{/* ข้อมูลเพิ่มเติม */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* หมายเหตุ */}
  {selectedProduct.remarks && (
    <div className="bg-white rounded-lg p-3 border border-blue-100">
      <div className="text-xs text-blue-600 font-medium mb-1">หมายเหตุ</div>
      <div className="text-sm text-gray-900">
        {selectedProduct.remarks}
      </div>
    </div>
  )}
  
  {/* สถานะ */}
  <div className="bg-white rounded-lg p-3 border border-blue-100">
    <div className="text-xs text-blue-600 font-medium mb-1">สถานะ</div>
    <div className="text-sm text-gray-900">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        selectedProduct.status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {selectedProduct.status === 'active' ? 'พร้อมขาย' : 'ไม่พร้อมขาย'}
      </span>
    </div>
  </div>
</div>
```

## UI Components

### 🎨 **Product Info Display Box**
```jsx
<div className="col-span-full bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
  <h4 className="font-medium text-blue-900 flex items-center gap-2">
    <Package className="w-4 h-4" />
    ข้อมูลสินค้าที่เลือก
  </h4>
  {/* ข้อมูลสินค้า */}
</div>
```

### 📊 **Info Cards Grid**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Info cards */}
</div>
```

### 🏷️ **Individual Info Card**
```jsx
<div className="bg-white rounded-lg p-3 border border-blue-100">
  <div className="text-xs text-blue-600 font-medium mb-1">ชื่อข้อมูล</div>
  <div className="text-sm text-gray-900">
    ค่าข้อมูล
  </div>
</div>
```

### 🚦 **Status Badge**
```jsx
<span className={`px-2 py-1 rounded-full text-xs font-medium ${
  selectedProduct.status === 'active' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}`}>
  {selectedProduct.status === 'active' ? 'พร้อมขาย' : 'ไม่พร้อมขาย'}
</span>
```

## ข้อมูลที่แสดง

### 📋 **ข้อมูลหลัก**:
1. **ร้านค้า** - `selectedProduct.shop_name`
2. **วันที่รับ** - `selectedProduct.receive_date` (แปลงเป็นวันที่ไทย)
3. **คงเหลือ** - `selectedProduct.remaining_quantity1` + "ชิ้น"
4. **รหัสสินค้า** - `selectedProduct.product_code`

### 📝 **ข้อมูลเพิ่มเติม**:
1. **หมายเหตุ** - `selectedProduct.remarks` (แสดงเฉพาะเมื่อมี)
2. **สถานะ** - `selectedProduct.status` (พร้อมขาย/ไม่พร้อมขาย)

### 🎯 **การแสดงผล**:
- **แสดงเมื่อ**: เลือกสินค้าแล้ว (`contractForm.productId` มีค่า)
- **ซ่อนเมื่อ**: ยังไม่ได้เลือกสินค้า
- **อัปเดต**: แบบ Real-time เมื่อเปลี่ยนสินค้า

## การใช้งาน

### 1. **เลือกสินค้า**:
- คลิกที่ช่อง "ชนิดสินค้า"
- พิมพ์ค้นหาสินค้า
- เลือกสินค้าที่ต้องการ

### 2. **ดูข้อมูลสินค้า**:
- ข้อมูลจะแสดงทันทีเมื่อเลือกสินค้า
- แสดงในกล่องสีน้ำเงินใต้ช่องเลือกสินค้า
- แสดงข้อมูลครบถ้วนของสินค้าที่เลือก

### 3. **ข้อมูลที่ได้**:
- **ร้านค้า**: รู้ว่าสินค้าอยู่ร้านไหน
- **วันที่รับ**: รู้ว่าสินค้าเข้ามาเมื่อไหร่
- **คงเหลือ**: รู้ว่าสินค้าเหลือเท่าไหร่
- **รหัสสินค้า**: รู้รหัสสินค้า
- **หมายเหตุ**: รู้หมายเหตุพิเศษ (ถ้ามี)
- **สถานะ**: รู้ว่าสินค้าพร้อมขายหรือไม่

## ประโยชน์

### 📈 **สำหรับพนักงานขาย**:
- เห็นข้อมูลครบถ้วนของสินค้าที่จะขาย
- รู้ว่าสินค้าอยู่ร้านไหน
- รู้ว่าสินค้าเข้ามาเมื่อไหร่
- รู้ว่าสินค้าเหลือเท่าไหร่

### 🛠️ **สำหรับการจัดการ**:
- ตรวจสอบข้อมูลสินค้าก่อนขาย
- รู้สถานะของสินค้า
- ติดตามการเคลื่อนไหวของสินค้า

### 📊 **สำหรับการวางแผน**:
- วิเคราะห์สินค้าที่ขายดี
- ติดตามสินค้าคงเหลือ
- ประมาณการความต้องการ

## การแสดงผล

### 🎨 **สีและสไตล์**:
- **พื้นหลัง**: สีน้ำเงินอ่อน (`bg-blue-50`)
- **ขอบ**: สีน้ำเงิน (`border-blue-200`)
- **หัวข้อ**: สีน้ำเงินเข้ม (`text-blue-900`)
- **ข้อมูล**: สีเทาเข้ม (`text-gray-900`)
- **ป้ายสถานะ**: สีเขียว (พร้อมขาย) / สีแดง (ไม่พร้อมขาย)

### 📱 **Responsive Design**:
- **Mobile**: 1 คอลัมน์
- **Tablet**: 2 คอลัมน์
- **Desktop**: 4 คอลัมน์ (ข้อมูลหลัก) + 2 คอลัมน์ (ข้อมูลเพิ่มเติม)

## หมายเหตุ

- **ข้อมูลอัปเดต**: แบบ Real-time เมื่อเปลี่ยนสินค้า
- **การแสดงผล**: แสดงเฉพาะเมื่อเลือกสินค้าแล้ว
- **ข้อมูลที่แสดง**: จากข้อมูลจริงในคลังสินค้า
- **การจัดรูปแบบ**: วันที่แสดงในรูปแบบไทย
- **การจัดการข้อผิดพลาด**: แสดง "ไม่ระบุ" เมื่อไม่มีข้อมูล
