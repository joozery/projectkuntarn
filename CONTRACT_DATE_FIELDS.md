# วันที่ในหน้าสร้างสัญญาใหม่

## คำถาม: วันที่มีการบันทึกในฐานข้อมูลด้วยไหม?

**คำตอบ: ✅ ใช่ มีการบันทึกในฐานข้อมูล**

## วันที่ที่บันทึกในฐานข้อมูล:

### 1. **contract_date** (วันที่สัญญา)
- **Frontend**: `<InputField label="วันที่" type="date" value={contractForm.contractDate} />`
- **Backend**: `contract_date DATE` ใน installments table
- **การบันทึก**: ✅ บันทึกในฐานข้อมูล
- **ตำแหน่ง**: Line 682 ใน ContractForm.jsx

### 2. **start_date** (วันที่เริ่มต้น)
- **Frontend**: คำนวณจาก `contractDate` + `months`
- **Backend**: `start_date DATE NOT NULL` ใน installments table
- **การบันทึก**: ✅ บันทึกในฐานข้อมูล
- **การคำนวณ**:
```javascript
startDate: contractForm.contractDate,
endDate: (() => {
  const start = new Date(contractForm.contractDate);
  const months = parseInt(contractForm.plan.months) || 12;
  start.setMonth(start.getMonth() + months);
  return start.toISOString().split('T')[0];
})()
```

### 3. **end_date** (วันที่สิ้นสุด)
- **Frontend**: คำนวณอัตโนมัติจาก start_date + จำนวนเดือน
- **Backend**: `end_date DATE NOT NULL` ใน installments table
- **การบันทึก**: ✅ บันทึกในฐานข้อมูล

### 4. **collection_date** (วันที่เก็บเงิน)
- **Frontend**: `<InputField label="เก็บทุกวันที่" value={contractForm.plan.collectionDate} />`
- **Backend**: `collection_date DATE` ใน installments table
- **การบันทึก**: ✅ บันทึกในฐานข้อมูล
- **ตำแหน่ง**: Line 739 ใน ContractForm.jsx

## Database Schema:

```sql
CREATE TABLE installments (
  -- Basic contract information
  contract_date DATE,           -- ✅ วันที่สัญญา
  start_date DATE NOT NULL,     -- ✅ วันที่เริ่มต้น
  end_date DATE NOT NULL,       -- ✅ วันที่สิ้นสุด
  
  -- Plan details
  collection_date DATE,         -- ✅ วันที่เก็บเงิน
  
  -- System fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- ✅ วันที่สร้าง
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- ✅ วันที่อัปเดต
);
```

## การส่งข้อมูลจาก Frontend:

### **ContractForm.jsx - handleSubmit:**
```javascript
const contractData = {
  ...contractForm,
  startDate: contractForm.contractDate,  // ✅ ส่งวันที่สัญญา
  endDate: (() => {
    const start = new Date(contractForm.contractDate);
    const months = parseInt(contractForm.plan.months) || 12;
    start.setMonth(start.getMonth() + months);
    return start.toISOString().split('T')[0];  // ✅ คำนวณวันที่สิ้นสุด
  })(),
  plan: {
    ...contractForm.plan,
    collectionDate: contractForm.plan.collectionDate  // ✅ ส่งวันที่เก็บเงิน
  }
};
```

## การบันทึกใน Backend:

### **installments.js - POST /api/installments:**
```javascript
const params = [
  finalContractNumber, 
  contractDate,        // ✅ วันที่สัญญา
  customerId, 
  productId, 
  productName, 
  totalAmount,
  monthlyPayment, 
  remainingAmount, 
  installmentPeriod, 
  startDate,           // ✅ วันที่เริ่มต้น
  endDate,             // ✅ วันที่สิ้นสุด
  // ... other fields
  collectionDate       // ✅ วันที่เก็บเงิน
];
```

## การแสดงผลในหน้าแก้ไข:

### **ContractEditForm.jsx:**
```javascript
const formData = {
  contractDate: contract.contractDate || contract.startDate || '',  // ✅ ดึงวันที่สัญญา
  startDate: contract.startDate || '',                              // ✅ ดึงวันที่เริ่มต้น
  endDate: contract.endDate || '',                                  // ✅ ดึงวันที่สิ้นสุด
  plan: {
    collectionDate: contract.plan?.collectionDate || contract.collectionDate || ''  // ✅ ดึงวันที่เก็บเงิน
  }
};
```

## การแสดงผลในตาราง:

### **ContractsTable.jsx:**
```javascript
{new Date(contract.contractDate).toLocaleDateString('th-TH')}  // ✅ แสดงวันที่สัญญา
```

## การแสดงผลในหน้า Detail:

### **ContractDetailModal.jsx:**
```javascript
<span className="font-medium">{formatDate(contract.contractDate)}</span>  // ✅ วันที่สัญญา
<span className="font-medium">{formatDate(contract.startDate)}</span>     // ✅ วันที่เริ่มต้น
<span className="font-medium">{formatDate(contract.endDate)}</span>       // ✅ วันที่สิ้นสุด
<span className="font-medium">{contract.planDetails?.collectionDate || '-'}</span>  // ✅ วันที่เก็บเงิน
```

## สรุป:

### **วันที่ที่บันทึกในฐานข้อมูล:**
1. ✅ **contract_date** - วันที่สัญญา (ผู้ใช้กรอก)
2. ✅ **start_date** - วันที่เริ่มต้น (คำนวณจาก contract_date)
3. ✅ **end_date** - วันที่สิ้นสุด (คำนวณจาก start_date + months)
4. ✅ **collection_date** - วันที่เก็บเงิน (ผู้ใช้กรอก)
5. ✅ **created_at** - วันที่สร้างสัญญา (ระบบสร้างอัตโนมัติ)
6. ✅ **updated_at** - วันที่อัปเดตสัญญา (ระบบอัปเดตอัตโนมัติ)

### **การใช้งาน:**
- **หน้าสร้างสัญญา**: ผู้ใช้กรอก `contract_date` และ `collection_date`
- **ระบบคำนวณ**: `start_date` และ `end_date` คำนวณอัตโนมัติ
- **การแสดงผล**: แสดงในตาราง, หน้าแก้ไข, และหน้า detail
- **การอัปเดต**: สามารถแก้ไขได้ในหน้าแก้ไขสัญญา

**ดังนั้น วันที่มีการบันทึกในฐานข้อมูลครบถ้วนและใช้งานได้จริง** 