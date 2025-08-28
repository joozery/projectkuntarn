# การแก้ไขการแสดงสินค้าที่ขายไปแล้วในหน้าจัดการสินค้า

## ปัญหาที่พบ

### 🔍 **การวิเคราะห์ข้อมูล**:
1. **สินค้าในคลัง**: 75 รายการ (ID: 47-136)
2. **สัญญาที่ทำไปแล้ว**: 52 รายการ (productId: 12-63)
3. **ไม่มีการเชื่อมโยง**: productId ในสัญญา (12-63) ไม่ตรงกับ ID ในคลัง (47-136)

### ❌ **ปัญหาที่เกิดขึ้น**:
- สินค้าที่ทำสัญญาไปแล้วไม่แสดงในหน้าจัดการสินค้า
- ไม่เห็นรายการสินค้าที่ขายไปแล้ว
- การแสดงสถิติไม่ครบถ้วน

## การแก้ไข

### 1. **เพิ่มการสร้างสินค้าที่ขายไปแล้ว**
```javascript
// เพิ่มสินค้าที่ทำสัญญาไปแล้วเข้าไปในรายการสินค้า
const soldItems = Object.entries(contractMap)
  .filter(([productId, contract]) => !allItems.find(item => item.id == productId))
  .map(([productId, contract]) => ({
    id: parseInt(productId),
    product_name: contract.productName,
    display_name: contract.productName,
    shop_name: '-',
    contract_number: contract.contractNumber,
    cost_price: 0,
    receive_date: contract.createdAt,
    remarks: `ขายไปแล้ว - สัญญา ${contract.contractNumber}`,
    remaining_quantity1: 0,
    received_quantity: 1,
    sold_quantity: 1,
    remaining_quantity2: 0,
    status: 'sold',
    sequence: `S${productId}`,
    isSoldItem: true // เพิ่ม flag เพื่อระบุว่าเป็นสินค้าที่ขายไปแล้ว
  }));

// รวมสินค้าคงเหลือและสินค้าที่ขายไปแล้ว
const allProductsWithSold = [...allItems, ...soldItems];
stats.totalItemsWithSold = allProductsWithSold.length;

// อัปเดต products state ให้รวมสินค้าที่ขายไปแล้ว
setProducts(allProductsWithSold);
```

### 2. **อัปเดตการแสดงผลในตาราง**

#### 📋 **ลำดับ**:
```jsx
<td className="px-4 py-3 text-sm text-gray-900 font-medium">
  {product.isSoldItem ? (
    <span className="text-red-600 font-medium">S{product.id}</span>
  ) : (
    product.sequence
  )}
</td>
```

#### 📅 **วันที่รับ**:
```jsx
<td className="px-4 py-3 text-sm text-gray-900">
  {product.isSoldItem ? (
    <span className="text-red-600 font-medium">
      {product.receive_date ? new Date(product.receive_date).toLocaleDateString('th-TH') : '-'}
    </span>
  ) : (
    product.receive_date ? new Date(product.receive_date).toLocaleDateString('th-TH') : '-'
  )}
</td>
```

#### 🏷️ **รหัสสินค้า**:
```jsx
<td className="px-4 py-3 text-sm text-gray-900">
  {product.isSoldItem ? (
    <span className="text-red-600 font-medium">S{product.id}</span>
  ) : (
    product.product_code || '-'
  )}
</td>
```

#### 📦 **ชื่อสินค้า**:
```jsx
<td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={product.display_name}>
  {product.isSoldItem ? (
    <span className="text-red-600 font-medium">{product.display_name}</span>
  ) : (
    product.display_name
  )}
</td>
```

#### 🏪 **ร้านค้า**:
```jsx
<td className="px-4 py-3 text-sm text-gray-900">
  {product.isSoldItem ? (
    <span className="text-gray-500">-</span>
  ) : (
    product.shop_name || '-'
  )}
</td>
```

#### 📄 **สัญญา**:
```jsx
<td className="px-4 py-3 text-sm">
  {(() => {
    if (product.isSoldItem) {
      return (
        <div className="space-y-1">
          <div className="font-medium text-red-600">
            {product.contract_number}
          </div>
          <div className="text-xs text-gray-600">
            ขายไปแล้ว
          </div>
        </div>
      );
    }
    // ... existing code for other cases
  })()}
</td>
```

#### 💰 **ราคาต้นทุน**:
```jsx
<td className="px-4 py-3 text-sm text-gray-900">
  {product.isSoldItem ? (
    <span className="text-gray-500">-</span>
  ) : (
    product.cost_price ? product.cost_price.toLocaleString() : '-'
  )}
</td>
```

#### 📅 **วันที่ขาย**:
```jsx
<td className="px-4 py-3 text-sm text-gray-900">
  {product.isSoldItem ? (
    <span className="text-red-600 font-medium">
      {product.receive_date ? new Date(product.receive_date).toLocaleDateString('th-TH') : '-'}
    </span>
  ) : (
    product.sell_date ? new Date(product.sell_date).toLocaleDateString('th-TH') : '-'
  )}
</td>
```

#### 📊 **จำนวนคงเหลือ**:
```jsx
<td className="px-4 py-3 text-sm text-gray-900">
  {product.isSoldItem ? (
    <span className="text-red-600 font-medium">0</span>
  ) : (
    product.remaining_quantity1
  )}
</td>
```

#### 📦 **จำนวนรับ**:
```jsx
<td className="px-4 py-3 text-sm text-gray-900">
  {product.isSoldItem ? (
    <span className="text-gray-600">1</span>
  ) : (
    product.received_quantity
  )}
</td>
```

#### 🛒 **จำนวนขาย**:
```jsx
<td className="px-4 py-3 text-sm text-gray-900">
  {product.isSoldItem ? (
    <span className="text-red-600 font-medium">1</span>
  ) : (
    product.sold_quantity || '-'
  )}
</td>
```

#### 📝 **หมายเหตุ**:
```jsx
<td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={product.remarks}>
  {product.isSoldItem ? (
    <span className="text-red-600 font-medium">
      ขายไปแล้ว - สัญญา {product.contract_number}
    </span>
  ) : product.remarks ? (
    <span className={product.remarks.includes('มาวันที่') ? 'text-red-600' : ''}>
      {product.remarks}
    </span>
  ) : (
    '-'
  )}
</td>
```

#### ⚙️ **จัดการ**:
```jsx
<td className="px-4 py-3 text-sm">
  {product.isSoldItem ? (
    <div className="text-center">
      <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
        ขายแล้ว
      </span>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => editProduct(product)}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => deleteProduct(product.id)}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )}
</td>
```

### 3. **อัปเดตสีของแถว**
```jsx
<motion.tr
  key={product.id}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className={`transition-colors ${
    product.isSoldItem 
      ? 'bg-red-50 hover:bg-red-100' 
      : 'hover:bg-gray-50'
  }`}
>
```

### 4. **อัปเดตสถิติ**
```jsx
// อัปเดตการแสดงจำนวนสินค้าทั้งหมด
<p className="text-2xl font-bold text-gray-900">
  {inventoryStats.totalItemsWithSold || inventoryStats.totalItems}
</p>
```

## ผลลัพธ์ที่ได้

### 📊 **สถิติที่แสดง**:
- **สินค้าทั้งหมด**: 127 รายการ (75 + 52)
- **สินค้าคงเหลือ**: 75 รายการ (ในคลังปัจจุบัน)
- **สินค้าที่ทำสัญญา**: 0 รายการ (ยังไม่มีการเชื่อมโยง)
- **สินค้าที่ขายไปแล้ว**: 52 รายการ (สัญญาที่ทำไปแล้ว)

### 🎨 **การแสดงผล**:
- **สินค้าคงเหลือ**: แสดงปกติ (พื้นหลังขาว)
- **สินค้าที่ขายไปแล้ว**: แสดงด้วยสีแดง (พื้นหลังแดงอ่อน)
- **ลำดับ**: S12, S13, S14, ... สำหรับสินค้าที่ขายไปแล้ว
- **หมายเหตุ**: "ขายไปแล้ว - สัญญา F5379"

### 📋 **ข้อมูลที่แสดง**:
- **สินค้าคงเหลือ**: แสดงข้อมูลครบถ้วน
- **สินค้าที่ขายไปแล้ว**: แสดงเฉพาะข้อมูลที่จำเป็น
  - ชื่อสินค้า
  - เลขสัญญา
  - วันที่รับ
  - จำนวนรับ: 1, จำนวนขาย: 1, คงเหลือ: 0

## ประโยชน์

### 📈 **สำหรับผู้บริหาร**:
- เห็นภาพรวมสินค้าทั้งหมด (คงเหลือ + ขายไปแล้ว)
- รู้จำนวนสินค้าที่ขายไปแล้ว
- ติดตามประสิทธิภาพการขาย

### 🛠️ **สำหรับพนักงาน**:
- เห็นรายการสินค้าที่ขายไปแล้ว
- รู้ว่าสินค้าไหนขายไปแล้ว
- ติดตามสถานะคลังสินค้า

### 📊 **สำหรับการวางแผน**:
- วิเคราะห์อัตราการขายสินค้า
- ประมาณการรายได้จากสัญญา
- ติดตามประสิทธิภาพการจัดการคลัง

## การใช้งาน

1. เข้าไปที่หน้า "จัดการสินค้า"
2. ดูสินค้าคงเหลือ (พื้นหลังขาว)
3. ดูสินค้าที่ขายไปแล้ว (พื้นหลังแดงอ่อน)
4. ดูสถิติสินค้าทั้งหมดในส่วน Dashboard

## หมายเหตุ

- **สินค้าคงเหลือ**: 75 รายการที่พร้อมขาย
- **สินค้าที่ขายไปแล้ว**: 52 รายการ (ไม่อยู่ในคลังแล้ว)
- **การแสดงผล**: แยกสีชัดเจนระหว่างสินค้าคงเหลือและที่ขายไปแล้ว
- **การจัดการ**: สินค้าที่ขายไปแล้วไม่สามารถแก้ไขหรือลบได้
- **สถิติ**: อัปเดตแบบ Real-time เมื่อมีการเปลี่ยนแปลง
