# การแก้ไขปัญหาฟอร์มแก้ไขสัญญา

## ปัญหาที่พบ

### 1. วันที่เก็บเงินแสดงเป็น timestamp เต็ม
**ปัญหา:** ฟิลด์ "เก็บทุกวันที่" แสดงเป็น `2568-09-10T00:00:00.000Z` แทนที่จะเป็นวันที่แบบ `2568-09-10`

**สาเหตุ:** API ส่งข้อมูล `collection_date` กลับมาเป็น timestamp เต็ม แต่ frontend ไม่ได้แปลงเป็นรูปแบบวันที่ที่เหมาะสม

### 2. สายไม่แสดงข้อมูลที่เลือกไว้ตอนสร้างสัญญา
**ปัญหา:** ฟิลด์ "สาย *" แสดงเป็น placeholder "--เลือกสาย--" แทนที่จะแสดงข้อมูลที่เลือกไว้ตอนสร้างสัญญา

**สาเหตุ:** 
- API ไม่ได้ส่งข้อมูล `line` และ `collector_id` กลับมาใน response
- Frontend ไม่มีการจัดการกรณีที่สายที่บันทึกไว้ไม่อยู่ในรายการพนักงานปัจจุบัน

## การแก้ไข

### 1. แก้ไข Backend API (backendkuntarn/routes/installments.js)

#### เพิ่มข้อมูลใน GET /:id endpoint
```javascript
// เพิ่ม collectionDate ใน plan object
plan: {
  downPayment: results[0].downPayment,
  monthlyPayment: results[0].monthlyPayment,
  months: results[0].months,
  collectionDate: results[0].collectionDate  // เพิ่มบรรทัดนี้
}

// เพิ่ม line และ collectorId ใน response
const result = {
  ...results[0],
  // Ensure line and collector_id are included
  line: results[0].line || '',
  collectorId: results[0].collectorId || '',
  // ... existing code
};
```

#### เพิ่มข้อมูลใน GET / endpoint (all installments)
```javascript
plan: {
  downPayment: result.downPayment,
  monthlyPayment: result.monthlyPayment,
  months: result.months,
  collectionDate: result.collectionDate
},
// Ensure line and collector_id are included
line: result.line || '',
collectorId: result.collectorId || ''
```

### 2. แก้ไข Frontend (src/components/forms/ContractEditForm.jsx)

#### แก้ไขการแสดงผลวันที่
```javascript
<InputField 
  label="เก็บทุกวันที่" 
  type="date"
  value={contractForm.plan.collectionDate ? contractForm.plan.collectionDate.split('T')[0] : ''} 
  onChange={(e) => handleDetailChange('plan', 'collectionDate', e.target.value)} 
  placeholder="ว-ด-ป เช่น 31-12-2564"
/>
```

**การเปลี่ยนแปลง:**
- เพิ่ม `type="date"` เพื่อให้แสดงเป็น date picker
- ใช้ `split('T')[0]` เพื่อแปลง timestamp เป็นรูปแบบวันที่

#### แก้ไขการแสดงผลสาย
```javascript
// สร้าง collector จำลองสำหรับสายที่บันทึกไว้แต่ไม่อยู่ในรายการปัจจุบัน
let virtualCollector = null;
if (contractForm.line && !selectedCollector) {
  virtualCollector = {
    id: `line_${contractForm.line}`,
    name: contractForm.line,
    full_name: contractForm.line,
    code: contractForm.line,
    position: 'collector',
    isVirtual: true
  };
}

// รวม options โดยให้สายที่บันทึกไว้อยู่ข้างหน้า
let collectorOptions = allCollectors;
if (selectedCollector && !allCollectors.some(emp => String(emp.id) === String(selectedCollector.id))) {
  collectorOptions = [selectedCollector, ...allCollectors];
} else if (virtualCollector) {
  collectorOptions = [virtualCollector, ...allCollectors];
}
```

**การเปลี่ยนแปลง:**
- สร้าง virtual collector สำหรับสายที่บันทึกไว้แต่ไม่อยู่ในรายการปัจจุบัน
- รวม virtual collector ใน options เพื่อให้ผู้ใช้เห็นสายที่เลือกไว้

#### แก้ไขการจัดการ onChange ของสาย
```javascript
onChange={(e) => {
  const selectedId = e.target.value;
  if (selectedId.startsWith('line_')) {
    // ถ้าเลือกสายจำลอง ให้ใช้ line แทน collectorId
    handleSelectChange('line', selectedId.replace('line_', ''));
    handleSelectChange('collectorId', '');
  } else {
    // ถ้าเลือกพนักงานจริง
    const selectedEmp = allCollectors.find(emp => String(emp.id) === String(selectedId));
    if (selectedEmp) {
      handleSelectChange('collectorId', selectedEmp.id);
      handleSelectChange('line', selectedEmp.code || selectedEmp.name || '');
    }
  }
}}
```

**การเปลี่ยนแปลง:**
- แยกการจัดการระหว่างสายจำลองและพนักงานจริง
- อัปเดต `line` และ `collectorId` ตามการเลือก

## ผลลัพธ์ที่คาดหวัง

### 1. วันที่เก็บเงิน
- ✅ แสดงเป็นรูปแบบวันที่ที่อ่านง่าย (YYYY-MM-DD)
- ✅ มี date picker สำหรับเลือกวันที่ใหม่
- ✅ ไม่แสดง timestamp เต็มอีกต่อไป

### 2. สาย
- ✅ แสดงข้อมูลที่เลือกไว้ตอนสร้างสัญญา
- ✅ มีตัวเลือกสายที่บันทึกไว้แม้จะไม่อยู่ในรายการพนักงานปัจจุบัน
- ✅ สามารถเลือกสายใหม่ได้
- ✅ อัปเดตข้อมูล `line` และ `collectorId` ตามการเลือก

## การทดสอบ

สร้างไฟล์ `test_contract_edit_fixed.js` เพื่อทดสอบการแก้ไข:

```bash
node test_contract_edit_fixed.js
```

**ทดสอบ:**
1. ✅ การแปลง collection_date จาก timestamp เป็นวันที่
2. ✅ การ mapping line และ collector_id
3. ✅ การสร้าง virtual collector สำหรับสายที่มีอยู่

## หมายเหตุ

- การแก้ไขนี้จะทำให้ข้อมูลที่บันทึกไว้ในสัญญาแสดงผลได้ถูกต้อง
- ผู้ใช้จะเห็นข้อมูลที่เลือกไว้ตอนสร้างสัญญาในฟอร์มแก้ไข
- ระบบจะรองรับกรณีที่สายที่บันทึกไว้ไม่อยู่ในรายการพนักงานปัจจุบัน
