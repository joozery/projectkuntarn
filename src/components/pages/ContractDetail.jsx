import React from 'react';

const DetailRow = ({ label, value, boldValue = false, half = false }) => (
  <div className={`flex border-b border-gray-200 py-1.5 ${half ? 'w-1/2' : 'w-full'}`}>
    <p className="w-2/5 text-gray-600">{label}</p>
    <p className={`w-3/5 ${boldValue ? 'font-semibold' : ''} text-gray-800`}>{value || '-'}</p>
  </div>
);

const ContractDetail = React.forwardRef(({ contract }, ref) => {
  if (!contract) return null;

  const {
    contractNumber,
    customer,
    guarantor,
    product,
    plan,
    salesperson,
    inspector,
    createdAt
  } = contract;

  return (
    <div ref={ref} className="p-4 bg-white text-sm font-sans printable-area">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
      <h1 className="text-xl font-bold text-center mb-4">รายการผ่อนชำระ</h1>
      
      <div className="space-y-1">
        <DetailRow label="รหัสลูกค้า :" value={contractNumber} boldValue />
        <div className="flex">
          <DetailRow label="ชื่อลูกค้า :" value={customer?.name} half />
          <DetailRow label="ชื่อเล่น :" value={customer?.nickname || '-'} half />
        </div>
        <DetailRow label="โทร :" value={customer?.phone} />
        <DetailRow label="ที่อยู่ :" value={customer?.address} />
        
        <div className="flex pt-2">
          <DetailRow label="ชื่อผู้ค้ำ :" value={guarantor?.name} half />
          <DetailRow label="ชื่อเล่นผู้ค้ำ :" value={guarantor?.nickname || '-'} half />
        </div>
        <DetailRow label="โทรผู้ค้ำ :" value={guarantor?.phone} />
        <DetailRow label="ที่อยู่ผู้ค้ำ :" value={guarantor?.address} />

        <div className="flex pt-2">
          <DetailRow label="ชนิดสินค้า :" value={product?.name} half />
          <DetailRow label="ราคารวม :" value={`${product?.price?.toLocaleString('th-TH')} บาท`} half />
        </div>
        <div className="flex">
          <DetailRow label="รุ่น :" value={product?.model || '-'} half />
          <DetailRow label="S/N :" value={product?.serialNumber || '-'} half />
        </div>
        
        <div className="flex pt-2">
          <DetailRow label="ดาวน์ :" value={`${plan?.downPayment?.toLocaleString('th-TH')} บาท`} half />
          <DetailRow label="ผ่อน :" value={`${plan?.monthlyPayment?.toLocaleString('th-TH')} บาท`} half />
        </div>
        <DetailRow label="จำนวน :" value={`${plan?.months} เดือน`} />
        
        <DetailRow label="เก็บทุกวันที่ :" value={new Date(createdAt).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })} />
        
        <div className="flex pt-2">
          <DetailRow label="พนักงานขาย :" value={salesperson?.name} half />
          <DetailRow label="สาย :" value={salesperson?.line || '2'} half />
        </div>
        <DetailRow label="ผู้ตรวจสอบ :" value={inspector?.name} />
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-center gap-4">
          <p className="w-1/5 text-gray-600">สถานะ :</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="radio" name="status1" /> กำลังผ่อนชำระ</label>
            <label className="flex items-center gap-2"><input type="radio" name="status1" defaultChecked /> เสร็จสิ้น</label>
            <label className="flex items-center gap-2"><input type="radio" name="status1" /> เสร็จสิ้นครบ</label>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="w-1/5 text-gray-600">สถานะ :</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="radio" name="status2" /> รับคืนสินค้า</label>
            <label className="flex items-center gap-2"><input type="radio" name="status2" /> เร่งรัด</label>
            <label className="flex items-center gap-2"><input type="radio" name="status2" defaultChecked /> ปกติ</label>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="w-1/s text-gray-600">สถานะ :</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2"><input type="radio" name="status3" defaultChecked /> ไม่มีส่วนลด</label>
            <label className="flex items-center gap-2"><input type="radio" name="status3" /> ส่วนลด</label>
          </div>
        </div>
      </div>
    </div>
  );
});

ContractDetail.displayName = 'ContractDetail';
export default ContractDetail;