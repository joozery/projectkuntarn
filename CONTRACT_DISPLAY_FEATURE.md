# การเพิ่มฟีเจอร์แสดงข้อมูลสัญญาในหน้าจัดการสินค้า

## ฟีเจอร์ที่เพิ่ม

### 📋 **การแสดงข้อมูลสัญญาในตารางสินค้า**
เพิ่มการแสดงรายละเอียดสัญญาที่เชื่อมโยงกับสินค้าในตาราง

#### ข้อมูลที่แสดง:
1. **เลขสัญญา** - แสดงเลขสัญญาที่ทำกับสินค้านั้น
2. **ชื่อลูกค้า** - แสดงชื่อลูกค้าที่ทำสัญญา
3. **มูลค่าสัญญา** - แสดงมูลค่าสัญญา
4. **สถานะ** - แสดงสถานะของสัญญา

### 📊 **สถิติสัญญาใน Dashboard**
เพิ่มการแสดงสถิติเกี่ยวกับสัญญาในส่วนสรุปข้อมูล

#### สถิติที่เพิ่ม:
1. **สินค้าที่ทำสัญญา** - จำนวนสินค้าที่มีสัญญาแล้ว
2. **สรุปสัญญา** - แสดงเปอร์เซ็นต์สินค้าที่ทำสัญญาแล้ว

## การทำงาน

### 1. การโหลดข้อมูลสัญญา
```javascript
const loadContractDetails = async () => {
  // โหลดข้อมูลสัญญาทั้งหมด
  const response = await contractsService.getAll(selectedBranch);
  
  // สร้าง mapping ระหว่าง product_id และ contract details
  const contractMap = {};
  contractsData.forEach(contract => {
    if (contract.product_id) {
      contractMap[contract.product_id] = {
        contractNumber: contract.contract_number,
        customerName: contract.customer_name,
        totalAmount: contract.total_amount,
        status: contract.status,
        createdAt: contract.created_at
      };
    }
  });
  
  setContractDetails(contractMap);
};
```

### 2. การแสดงผลในตาราง
```jsx
<td className="px-4 py-3 text-sm">
  {(() => {
    const contractInfo = contractDetails[product.id];
    if (contractInfo) {
      return (
        <div className="space-y-1">
          <div className="font-medium text-blue-600">
            {contractInfo.contractNumber}
          </div>
          <div className="text-xs text-gray-600">
            ลูกค้า: {contractInfo.customerName}
          </div>
          <div className="text-xs text-green-600">
            ฿{parseFloat(contractInfo.totalAmount).toLocaleString()}
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-gray-500 text-xs">
          ยังไม่ได้ทำสัญญา
        </div>
      );
    }
  })()}
</td>
```

### 3. การคำนวณสถิติสัญญา
```javascript
// เพิ่มข้อมูลสัญญาในสถิติ
stats.contractsCount = Object.keys(contractMap).length;
stats.itemsWithContracts = allItems.filter(item => contractMap[item.id]).length;
```

## UI Components

### 📋 **Contract Display in Table**
```jsx
<div className="space-y-1">
  <div className="font-medium text-blue-600">
    เลขสัญญา: {contractInfo.contractNumber}
  </div>
  <div className="text-xs text-gray-600">
    ลูกค้า: {contractInfo.customerName}
  </div>
  <div className="text-xs text-green-600">
    มูลค่า: ฿{contractInfo.totalAmount}
  </div>
</div>
```

### 📊 **Contract Statistics Card**
```jsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">สินค้าที่ทำสัญญา</p>
      <p className="text-2xl font-bold text-indigo-600">{inventoryStats.itemsWithContracts}</p>
    </div>
    <div className="p-2 bg-indigo-100 rounded-lg">
      <DollarSign className="w-6 h-6 text-indigo-600" />
    </div>
  </div>
</div>
```

### 📈 **Contract Summary Section**
```jsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">สรุปสัญญา</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* สินค้าทั้งหมด */}
    {/* สินค้าที่ทำสัญญา */}
    {/* สินค้าคงเหลือ */}
  </div>
</div>
```

## ข้อมูลที่แสดง

### 📊 **สถิติปัจจุบัน (จาก API)**:
- **สินค้าทั้งหมด**: 75 รายการ
- **สินค้าที่ทำสัญญา**: 0 รายการ (ยังไม่มีการเชื่อมโยง)
- **สินค้าคงเหลือ**: 75 รายการ (100%)
- **สัญญาทั้งหมด**: 52 รายการ (แต่ไม่เชื่อมโยงกับสินค้า)

### 🔗 **สถานะการเชื่อมโยง**:
- **ปัญหาที่พบ**: สัญญา 52 รายการมี `product_id = null`
- **สินค้า 75 รายการ**: มี `contract_number = "-"`
- **ไม่มีการเชื่อมโยง**: ระหว่างสัญญาและสินค้า

### 📋 **การแสดงผลในตาราง**:
1. **สินค้าที่มีสัญญา**: แสดงเลขสัญญา, ชื่อลูกค้า, มูลค่า
2. **สินค้าที่ไม่มีสัญญา**: แสดง "ยังไม่ได้ทำสัญญา"
3. **สินค้าที่มี contract_number เก่า**: แสดงเป็นปุ่มคลิกได้

## ประโยชน์

### 📈 **สำหรับผู้บริหาร**:
- เห็นภาพรวมสินค้าที่ทำสัญญาแล้ว
- รู้จำนวนสินค้าคงเหลือที่พร้อมขาย
- ติดตามประสิทธิภาพการขาย

### 🛠️ **สำหรับพนักงาน**:
- เห็นรายละเอียดสัญญาของแต่ละสินค้า
- รู้ว่าสินค้าไหนทำสัญญากับใคร
- ติดตามสถานะสัญญา

### 📊 **สำหรับการวางแผน**:
- วิเคราะห์อัตราการขายสินค้า
- ประมาณการรายได้จากสัญญา
- ติดตามประสิทธิภาพการจัดการคลัง

## การใช้งาน

1. เข้าไปที่หน้า "จัดการสินค้า"
2. ดูสถิติสัญญาในส่วน Dashboard
3. ดูรายละเอียดสัญญาในตารางสินค้า
4. ดูสรุปสัญญาในส่วนล่าง

## การอัปเดตข้อมูล

สถิติสัญญาจะถูกคำนวณใหม่เมื่อ:
- โหลดหน้าครั้งแรก
- เพิ่มสินค้าใหม่
- แก้ไขสินค้า
- ลบสินค้า
- มีการเปลี่ยนแปลงข้อมูลสัญญา

## หมายเหตุ

- ข้อมูลสัญญาคำนวณจากข้อมูลจริงในฐานข้อมูล
- อัปเดตแบบ Real-time เมื่อมีการเปลี่ยนแปลง
- แสดงเฉพาะสัญญาในสาขาที่เลือก
- รองรับการแสดงผลบนอุปกรณ์ทุกขนาด
- เตรียมพร้อมสำหรับการเชื่อมโยงข้อมูลสัญญาในอนาคต
