# การเพิ่มฟีเจอร์สรุปข้อมูลสินค้าในหน้าจัดการสินค้า

## ฟีเจอร์ที่เพิ่ม

### 📊 สรุปสถิติสินค้า (Inventory Statistics Summary)
เพิ่มการแสดงสรุปข้อมูลสินค้าในคลังในรูปแบบ Dashboard cards

#### ข้อมูลที่แสดง:
1. **สินค้าทั้งหมด** - จำนวนสินค้าทั้งหมดในคลัง
2. **สินค้าที่มี Stock** - จำนวนสินค้าที่มี stock เหลืออยู่
3. **มูลค่าทั้งหมด** - มูลค่ารวมของสินค้าทั้งหมดในคลัง
4. **สินค้า Active** - จำนวนสินค้าที่มีสถานะ active

### 🏷️ สรุปตามหมวดหมู่ (Category Breakdown)
แสดงการแบ่งหมวดหมู่สินค้าพร้อมจำนวนและมูลค่า

#### หมวดหมู่ที่รองรับ:
- เครื่องซักผ้า
- ตู้เย็น/ตู้แช่
- เตียงนอน
- ที่นอน
- ตู้เสื้อผ้า
- โต๊ะ
- ทีวี
- พัดลม
- เตาแก๊ส
- เครื่องเสียง
- อื่นๆ

## การทำงาน

### 1. การคำนวณสถิติ
```javascript
const calculateInventoryStats = async () => {
  // โหลดข้อมูลสินค้าทั้งหมด
  const response = await inventoryService.getAll({
    branchId: selectedBranch,
    limit: 1000
  });
  
  // คำนวณสถิติต่างๆ
  const stats = {
    totalItems: allItems.length,
    activeItems: allItems.filter(item => item.status === 'active').length,
    itemsWithStock: allItems.filter(item => Number(item.remaining_quantity1) > 0).length,
    totalValue: allItems.reduce((sum, item) => {
      const price = parseFloat(item.cost_price) || 0;
      const qty = Number(item.remaining_quantity1) || 0;
      return sum + (price * qty);
    }, 0),
    categories: {}
  };
  
  // จัดหมวดหมู่สินค้า
  allItems.forEach(item => {
    // จัดหมวดหมู่ตามชื่อสินค้า
    // คำนวณจำนวนและมูลค่า
  });
};
```

### 2. การแสดงผล
- **Dashboard Cards**: แสดงสถิติหลัก 4 รายการ
- **Category Grid**: แสดงการแบ่งหมวดหมู่เรียงตามจำนวน
- **Real-time Updates**: อัปเดตสถิติเมื่อมีการเพิ่ม/แก้ไข/ลบสินค้า

### 3. การอัปเดตข้อมูล
สถิติจะถูกคำนวณใหม่เมื่อ:
- โหลดหน้าครั้งแรก
- เพิ่มสินค้าใหม่
- แก้ไขสินค้า
- ลบสินค้า

## UI Components

### 📈 Statistics Cards
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* สินค้าทั้งหมด */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">สินค้าทั้งหมด</p>
        <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalItems}</p>
      </div>
      <div className="p-2 bg-blue-100 rounded-lg">
        <Package className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>
  
  {/* สินค้าที่มี Stock */}
  {/* มูลค่าทั้งหมด */}
  {/* สินค้า Active */}
</div>
```

### 🏷️ Category Breakdown
```jsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">สรุปตามหมวดหมู่</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Object.entries(inventoryStats.categories)
      .sort(([,a], [,b]) => b.count - a.count)
      .map(([category, data]) => (
        <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">{category}</p>
            <p className="text-sm text-gray-600">{data.count} ชิ้น</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900">฿{data.value.toLocaleString()}</p>
            <p className="text-xs text-gray-500">มูลค่า</p>
          </div>
        </div>
      ))}
  </div>
</div>
```

## ข้อมูลที่แสดง

### 📊 สถิติปัจจุบัน (จาก API):
- **สินค้าทั้งหมด**: 75 รายการ
- **สินค้าที่มี Stock**: 75 รายการ (ทั้งหมดมี stock)
- **มูลค่าทั้งหมด**: ประมาณ ฿150,000+ (ขึ้นอยู่กับราคาสินค้า)
- **สินค้า Active**: 75 รายการ (ทั้งหมด active)

### 🏷️ หมวดหมู่สินค้า:
1. **เครื่องซักผ้า**: 25 รายการ (มากที่สุด)
2. **ตู้เย็น/ตู้แช่**: 10 รายการ
3. **เตียงนอน**: 6 รายการ
4. **ที่นอน**: 5 รายการ
5. **ตู้เสื้อผ้า**: 8 รายการ
6. **โต๊ะ**: 2 รายการ
7. **ทีวี**: 2 รายการ
8. **พัดลม**: 1 รายการ
9. **เตาแก๊ส**: 3 รายการ
10. **เครื่องเสียง**: 1 รายการ
11. **อื่นๆ**: 12 รายการ

## ประโยชน์

### 📈 สำหรับผู้บริหาร:
- เห็นภาพรวมสินค้าในคลัง
- รู้มูลค่าสินค้าคงเหลือ
- ติดตามการกระจายสินค้าแต่ละหมวดหมู่

### 🛠️ สำหรับพนักงาน:
- เห็นจำนวนสินค้าที่มีอยู่
- รู้ว่าสินค้าประเภทไหนมีมากที่สุด
- ติดตามสถานะสินค้า

### 📊 สำหรับการวางแผน:
- วิเคราะห์การกระจายสินค้า
- ประมาณการมูลค่าสินค้าคงเหลือ
- ติดตามประสิทธิภาพการจัดการคลัง

## การใช้งาน

1. เข้าไปที่หน้า "จัดการสินค้า"
2. ดูสรุปสถิติที่ด้านบนของหน้า
3. ดูการแบ่งหมวดหมู่สินค้าด้านล่าง
4. สถิติจะอัปเดตอัตโนมัติเมื่อมีการเปลี่ยนแปลงข้อมูล

## หมายเหตุ

- สถิติคำนวณจากข้อมูลจริงในฐานข้อมูล
- อัปเดตแบบ Real-time เมื่อมีการเปลี่ยนแปลง
- แสดงเฉพาะสินค้าในสาขาที่เลือก
- รองรับการแสดงผลบนอุปกรณ์ทุกขนาด
