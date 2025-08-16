import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { excelImportService } from '@/services/excelImportService';

const ImportDataPage = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [importResults, setImportResults] = useState(null);
  const [step, setStep] = useState('select'); // select, validate, import, complete
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
        setValidationErrors([]);
        setImportResults(null);
        setStep('validate');
        validateFile(selectedFile);
      } else {
        toast({
          title: "ไฟล์ไม่ถูกต้อง",
          description: "กรุณาเลือกไฟล์ Excel (.xlsx หรือ .xls)",
          variant: "destructive"
        });
      }
    }
  };

  const validateFile = async (file) => {
    try {
      setImporting(true);
      setProgressText('กำลังตรวจสอบไฟล์...');
      setProgress(20);

      const sheets = await excelImportService.readExcelFile(file);
      setProgress(50);
      setProgressText('กำลังตรวจสอบข้อมูล...');

      const errors = excelImportService.validateData(sheets);
      setProgress(100);
      setProgressText('ตรวจสอบเสร็จสิ้น');

      if (errors.length > 0) {
        setValidationErrors(errors);
        setStep('validate');
      } else {
        setValidationErrors([]);
        setStep('ready');
      }

    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive"
      });
      setStep('select');
    } finally {
      setImporting(false);
      setProgress(0);
      setProgressText('');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setImporting(true);
      setStep('import');
      setProgress(0);

      const sheets = await excelImportService.readExcelFile(file);
      
      const results = await excelImportService.importData(sheets, (text) => {
        setProgressText(text);
        setProgress(prev => Math.min(prev + 10, 90));
      });

      setProgress(100);
      setProgressText('Import เสร็จสิ้น!');
      setImportResults(results);
      setStep('complete');

      if (results.success) {
        toast({
          title: "Import สำเร็จ",
          description: "ข้อมูลถูก import เข้าระบบเรียบร้อยแล้ว",
          variant: "default"
        });
      }

    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาดในการ Import",
        description: error.message,
        variant: "destructive"
      });
      setStep('ready');
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    excelImportService.downloadTemplate();
    toast({
      title: "ดาวน์โหลดสำเร็จ",
      description: "ไฟล์ template ถูกดาวน์โหลดแล้ว",
      variant: "default"
    });
  };

  const resetImport = () => {
    setFile(null);
    setImporting(false);
    setProgress(0);
    setProgressText('');
    setValidationErrors([]);
    setImportResults(null);
    setStep('select');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Import ข้อมูลจากระบบเก่า</h1>
            <p className="text-gray-600 mt-2">นำเข้าข้อมูลลูกค้าและสัญญาผ่อนจากไฟล์ Excel</p>
          </div>
        </div>

        {/* Step 1: Download Template */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-600" />
              ขั้นตอนที่ 1: ดาวน์โหลด Template
            </CardTitle>
            <CardDescription>
              ดาวน์โหลดไฟล์ template Excel และกรอกข้อมูลตามรูปแบบที่กำหนด
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
                variant="outline"
              >
                <FileSpreadsheet className="h-4 w-4" />
                ดาวน์โหลด Template Excel
              </Button>
              <div className="text-sm text-gray-600">
                <p>• ไฟล์ template มี 7 sheets: Branches, Checkers, Customers, Products, Installments, Payments, Collections</p>
                <p>• กรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน</p>
                <p>• ใช้รูปแบบวันที่: YYYY-MM-DD</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Upload File */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-600" />
              ขั้นตอนที่ 2: อัปโหลดไฟล์
            </CardTitle>
            <CardDescription>
              เลือกไฟล์ Excel ที่กรอกข้อมูลแล้วเพื่อตรวจสอบและ import
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <FileSpreadsheet className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      คลิกเพื่อเลือกไฟล์ Excel
                    </p>
                    <p className="text-sm text-gray-500">
                      รองรับไฟล์ .xlsx และ .xls เท่านั้น
                    </p>
                  </div>
                </label>
              </div>

              {file && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">{file.name}</p>
                    <p className="text-sm text-blue-600">
                      ขนาด: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetImport}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    เปลี่ยนไฟล์
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {importing && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="font-medium">{progressText}</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Card className="mb-6 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                พบข้อผิดพลาดในข้อมูล
              </CardTitle>
              <CardDescription>
                กรุณาแก้ไขข้อผิดพลาดต่อไปนี้ก่อนทำการ import
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {validationErrors.map((error, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ready to Import */}
        {step === 'ready' && (
          <Card className="mb-6 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                ข้อมูลถูกต้อง พร้อม Import
              </CardTitle>
              <CardDescription>
                ข้อมูลในไฟล์ผ่านการตรวจสอบแล้ว สามารถทำการ import ได้
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleImport}
                  disabled={importing}
                  className="flex items-center gap-2"
                >
                  {importing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  เริ่ม Import ข้อมูล
                </Button>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    การ import อาจใช้เวลาสักครู่ กรุณารอจนกว่าจะเสร็จสิ้น
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import Results */}
        {importResults && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                ผลการ Import
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {importResults.summary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(importResults.summary).map(([key, result]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600 capitalize">
                          {key}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {result.success} รายการ
                        </p>
                        {result.errors && result.errors.length > 0 && (
                          <p className="text-sm text-red-600">
                            {result.errors.length} ข้อผิดพลาด
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {importResults.errors && importResults.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">ข้อผิดพลาด:</h4>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {importResults.errors.map((error, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertDescription className="text-sm">{error}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button onClick={resetImport} variant="outline">
                    Import ไฟล์ใหม่
                  </Button>
                  <Button onClick={onBack}>
                    กลับสู่หน้าหลัก
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              คำแนะนำการใช้งาน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">สำหรับข้อมูลที่มีการผ่อนอยู่แล้ว:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>กรอกข้อมูลใน Sheet "Installments" สำหรับข้อมูลสัญญาพื้นฐาน</li>
                  <li>กรอกข้อมูลใน Sheet "Payments" ทุกงวด (ทั้งที่ชำระแล้วและยังไม่ชำระ)</li>
                  <li>กรอกข้อมูลใน Sheet "Collections" เฉพาะงวดที่ชำระแล้ว</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">รูปแบบข้อมูล:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>วันที่: YYYY-MM-DD (เช่น 2024-01-15)</li>
                  <li>ตัวเลข: ไม่ใส่เครื่องหมายคอมมา (เช่น 25000.50)</li>
                  <li>สถานะการชำระ: paid, pending, overdue, cancelled</li>
                  <li>สถานะสัญญา: active, completed, cancelled, overdue</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">ข้อควรระวัง:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>ห้ามเปลี่ยนชื่อคอลัมน์ในไฟล์ template</li>
                  <li>ข้อมูลที่มีเครื่องหมาย * จำเป็นต้องกรอก</li>
                  <li>รหัสต่างๆ (customer_code, contract_number) ต้องไม่ซ้ำกัน</li>
                  <li>เลขบัตรประชาชนต้องเป็น 13 หลักและไม่ซ้ำกัน</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImportDataPage;