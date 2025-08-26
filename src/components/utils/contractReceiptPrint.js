export const printContractReceipt = (contract, payments = []) => {
  const printWindow = window.open('', '_blank');
  const formatTH = (d) => d ? new Date(d).toLocaleDateString('th-TH') : '';

  const rows = Array.from({ length: 30 }).map((_, idx) => {
    const p = payments[idx];
    return `
      <tr>
        <td>${idx + 1}</td>
        <td>${p ? formatTH(p.dueDate || p.payment_date) : ''}</td>
        <td>${p ? (p.receiptNumber || p.receipt_number || '') : ''}</td>
        <td>${p ? (Number(p.amount || 0).toLocaleString()) : ''}</td>
        <td>${p ? (p.remaining?.toLocaleString?.() || '') : ''}</td>
      </tr>
    `;
  }).join('');

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>สัญญา ${contract?.contractNumber || ''}</title>
      <style>
        @page { size: 90mm auto; margin: 6mm; }
        body { font-family: 'Sarabun', system-ui, sans-serif; color: #111; }
        .sheet { width: 90mm; }
        .row { display: flex; gap: 6px; margin: 4px 0; }
        .label { width: 26mm; font-weight: 600; font-size: 12px; }
        .value { flex: 1; font-size: 12px; border-bottom: 1px solid #999; padding-bottom: 2px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .brand { font-weight: 800; font-size: 14px; }
        .small { font-size: 11px; color: #444; }
        .box { border: 1px solid #888; padding: 6px; margin-top: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 6px; }
        th, td { border: 1px solid #999; font-size: 11px; padding: 4px; text-align: center; }
      </style>
    </head>
    <body onload="window.print(); setTimeout(() => window.close(), 300);">
      <div class="sheet">
        <div class="header">
          <div>
            <div class="brand">เอฟซี เฟอร์นิเจอร์</div>
            <div class="small">116 หมู่ 3 ต.ห้วงน้อย อ.เมือง จ.ประจวบคีรีขันธ์ 77000 | โทร. 092-2856965</div>
          </div>
          <div class="small">เลขที่: ${contract?.contractNumber || '-'}</div>
        </div>

        <div class="box">
          <div class="row"><div class="label">ชื่อลูกค้า</div><div class="value">${contract?.customerName || ''} โทร ${contract?.customerPhone || ''}</div></div>
          <div class="row"><div class="label">ที่อยู่</div><div class="value">${contract?.customerAddress || ''}</div></div>
          <div class="row"><div class="label">ผู้ค้ำ</div><div class="value">${contract?.guarantorName || ''} โทร ${contract?.guarantorPhone || ''}</div></div>
          <div class="row"><div class="label">ที่อยู่ผู้ค้ำ</div><div class="value">${contract?.guarantorAddress || ''}</div></div>
        </div>

        <div class="box">
          <div class="row"><div class="label">ชนิดสินค้า</div><div class="value">${contract?.productName || ''}</div></div>
          <div class="row"><div class="label">รุ่น</div><div class="value">${contract?.productModel || ''}</div></div>
          <div class="row"><div class="label">S/N</div><div class="value">${contract?.productSerialNumber || ''}</div></div>
          <div class="row"><div class="label">ราคารวม</div><div class="value">${Number(contract?.totalAmount || contract?.productPrice || 0).toLocaleString()}</div></div>
          <div class="row"><div class="label">ดาวน์</div><div class="value">${Number(contract?.downPayment || 0).toLocaleString()}</div></div>
          <div class="row"><div class="label">ผ่อน/เดือน</div><div class="value">${Number(contract?.monthlyPayment || contract?.installmentAmount || 0).toLocaleString()}</div></div>
          <div class="row"><div class="label">จำนวนงวด</div><div class="value">${contract?.months || contract?.installmentPeriod || ''} เดือน</div></div>
          <div class="row"><div class="label">เก็บทุกวันที่</div><div class="value">${contract?.collectionDate || ''}</div></div>
          <div class="row"><div class="label">วันที่ทำสัญญา</div><div class="value">${formatTH(contract?.contractDate || contract?.startDate)}</div></div>
          <div class="row"><div class="label">พนักงานขาย</div><div class="value">${contract?.salespersonName || contract?.employeeName || ''}</div></div>
        </div>

        <div class="box">
          <table>
            <thead>
              <tr>
                <th>งวด</th>
                <th>ว/ด/ป</th>
                <th>เลขที่ใบเสร็จ</th>
                <th>จำนวนเงิน</th>
                <th>ยอดคงเหลือ</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </body>
  </html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
};


