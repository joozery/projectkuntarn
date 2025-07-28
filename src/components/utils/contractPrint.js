export const printContract = (contract) => {
  const printWindow = window.open('', '_blank');
  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>ใบสัญญาผ่อนชำระ - ${contract.contractNumber}</title>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: 'Sarabun', sans-serif; 
            margin: 20px; 
            line-height: 1.6;
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .contract-number { 
            font-size: 18px; 
            font-weight: bold; 
            color: #666;
            margin-bottom: 10px;
          }
          .title { 
            font-size: 24px; 
            font-weight: bold; 
            margin-bottom: 10px;
          }
          .section { 
            margin-bottom: 25px; 
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          .section-title { 
            font-size: 16px; 
            font-weight: bold; 
            margin-bottom: 15px;
            color: #444;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .info-row { 
            display: flex; 
            margin-bottom: 8px; 
          }
          .info-label { 
            width: 150px; 
            font-weight: bold; 
          }
          .info-value { 
            flex: 1; 
          }
          .payment-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px;
          }
          .payment-table th, .payment-table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: center; 
          }
          .payment-table th { 
            background-color: #f5f5f5; 
            font-weight: bold;
          }
          .signature-section { 
            margin-top: 40px; 
            display: flex; 
            justify-content: space-between; 
          }
          .signature-box { 
            text-align: center; 
            width: 200px; 
          }
          .signature-line { 
            border-top: 1px solid #333; 
            margin-top: 50px; 
            padding-top: 5px; 
          }
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="contract-number">เลขที่สัญญา: ${contract.contractNumber}</div>
          <div class="title">ใบสัญญาผ่อนชำระสินค้า</div>
          <div>สาขา: ${contract.branchName}</div>
        </div>

        <div class="section">
          <div class="section-title">ข้อมูลลูกค้า</div>
          <div class="info-row">
            <div class="info-label">ชื่อลูกค้า:</div>
            <div class="info-value">${contract.customerName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">เบอร์โทร:</div>
            <div class="info-value">${contract.customerPhone}</div>
          </div>
          <div class="info-row">
            <div class="info-label">ที่อยู่:</div>
            <div class="info-value">${contract.customerAddress || '-'}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">ข้อมูลสินค้า</div>
          <div class="info-row">
            <div class="info-label">ชื่อสินค้า:</div>
            <div class="info-value">${contract.productName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">ราคาสินค้า:</div>
            <div class="info-value">฿${contract.productPrice?.toLocaleString()}</div>
          </div>
          <div class="info-row">
            <div class="info-label">เงินดาวน์:</div>
            <div class="info-value">฿${contract.downPayment?.toLocaleString()}</div>
          </div>
          <div class="info-row">
            <div class="info-label">ยอดผ่อน:</div>
            <div class="info-value">฿${((contract.productPrice || 0) - (contract.downPayment || 0)).toLocaleString()}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">เงื่อนไขการผ่อนชำระ</div>
          <div class="info-row">
            <div class="info-label">ระยะเวลา:</div>
            <div class="info-value">${contract.months} เดือน</div>
          </div>
          <div class="info-row">
            <div class="info-label">อัตราดอกเบี้ย:</div>
            <div class="info-value">${contract.interestRate}% ต่อปี</div>
          </div>
          <div class="info-row">
            <div class="info-label">ผ่อนต่อเดือน:</div>
            <div class="info-value">฿${contract.monthlyPayment?.toLocaleString()}</div>
          </div>
          <div class="info-row">
            <div class="info-label">ยอดรวมทั้งหมด:</div>
            <div class="info-value">฿${contract.totalAmount?.toLocaleString()}</div>
          </div>
          <div class="info-row">
            <div class="info-label">ดอกเบี้ยรวม:</div>
            <div class="info-value">฿${contract.totalInterest?.toLocaleString()}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">ตารางการชำระเงิน</div>
          <table class="payment-table">
            <thead>
              <tr>
                <th>งวดที่</th>
                <th>วันที่ครบกำหนด</th>
                <th>จำนวนเงิน</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              ${(contract.payments || []).map(payment => `
                <tr>
                  <td>${payment.month}</td>
                  <td>${new Date(payment.dueDate).toLocaleDateString('th-TH')}</td>
                  <td>฿${payment.amount?.toLocaleString()}</td>
                  <td>${payment.status === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">ข้อมูลการทำสัญญา</div>
          <div class="info-row">
            <div class="info-label">วันที่ทำสัญญา:</div>
            <div class="info-value">${new Date(contract.contractDate).toLocaleDateString('th-TH')}</div>
          </div>
          <div class="info-row">
            <div class="info-label">พนักงานผู้ทำรายการ:</div>
            <div class="info-value">${contract.employeeName}</div>
          </div>
          ${contract.notes ? `
          <div class="info-row">
            <div class="info-label">หมายเหตุ:</div>
            <div class="info-value">${contract.notes}</div>
          </div>
          ` : ''}
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">ลายเซ็นลูกค้า</div>
            <div>(${contract.customerName})</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">ลายเซ็นพนักงาน</div>
            <div>(${contract.employeeName})</div>
          </div>
        </div>

        <div class="footer">
          <div>พิมพ์เมื่อ: ${new Date().toLocaleString('th-TH')}</div>
          <div>ระบบผ่อนสินค้า - พัฒนาโดย wooyou creative</div>
        </div>
      </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};