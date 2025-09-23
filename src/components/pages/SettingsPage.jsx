import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Database, Bell, Shield, Palette, Globe, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const [is404Mode, setIs404Mode] = useState(false);

  // Check 404 status on load
  useEffect(() => {
    const status404 = localStorage.getItem('simple_404_mode');
    setIs404Mode(status404 === 'true');
  }, []);

  const handle404Toggle = () => {
    const newStatus = !is404Mode;
    setIs404Mode(newStatus);
    localStorage.setItem('simple_404_mode', newStatus.toString());
    
    toast({
      title: newStatus ? "🚫 เปิดโหมด 404 แล้ว" : "✅ ปิดโหมด 404 แล้ว",
      description: newStatus ? "ผู้ใช้จะเห็นหน้า 404" : "ระบบกลับสู่การใช้งานปกติ",
      variant: "default"
    });

    // Refresh page after 2 seconds to show 404 mode
    if (newStatus) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleSettingChange = (setting) => {
    toast({
      title: "🚧 ฟีเจอร์นี้ยังไม่ได้ใช้งาน—แต่ไม่ต้องกังวล! คุณสามารถขอให้เพิ่มในข้อความถัดไป! 🚀",
      description: `กำลังอัพเดทการตั้งค่า: ${setting}`,
    });
  };

  const settingCategories = [
    {
      title: 'ระบบทั่วไป',
      icon: Settings,
      settings: [
        { name: 'ชื่อระบบ', value: 'ระบบผ่อนสินค้า', type: 'text' },
        { name: 'เขตเวลา', value: 'Asia/Bangkok', type: 'select' },
        { name: 'สกุลเงิน', value: 'THB (บาท)', type: 'select' }
      ]
    },
    {
      title: 'การแจ้งเตือน',
      icon: Bell,
      settings: [
        { name: 'แจ้งเตือนการชำระเงิน', value: true, type: 'toggle' },
        { name: 'แจ้งเตือนงวดเกินกำหนด', value: true, type: 'toggle' },
        { name: 'แจ้งเตือนทางอีเมล', value: false, type: 'toggle' }
      ]
    },
    {
      title: 'ความปลอดภัย',
      icon: Shield,
      settings: [
        { name: 'การยืนยันตัวตนสองขั้นตอน', value: false, type: 'toggle' },
        { name: 'บันทึกการเข้าสู่ระบบ', value: true, type: 'toggle' },
        { name: 'หมดอายุเซสชัน (นาที)', value: '30', type: 'number' }
      ]
    },
    {
      title: 'ฐานข้อมูล',
      icon: Database,
      settings: [
        { name: 'สำรองข้อมูลอัตโนมัติ', value: true, type: 'toggle' },
        { name: 'ความถี่การสำรอง (ชั่วโมง)', value: '24', type: 'number' },
        { name: 'เก็บข้อมูลสำรอง (วัน)', value: '30', type: 'number' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ตั้งค่าระบบ</h1>
          <p className="text-gray-600">จัดการการตั้งค่าและการกำหนดค่าระบบ</p>
        </div>
      </div>

      <div className="grid gap-6">
        {settingCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {category.title}
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {category.settings.map((setting, settingIndex) => (
                  <div key={setting.name} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-gray-900">{setting.name}</div>
                      {setting.type !== 'toggle' && (
                        <div className="text-sm text-gray-500">ค่าปัจจุบัน: {setting.value}</div>
                      )}
                    </div>
                    
                    <div>
                      {setting.type === 'toggle' ? (
                        <Button
                          variant={setting.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleSettingChange(setting.name)}
                          className={setting.value ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {setting.value ? 'เปิด' : 'ปิด'}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSettingChange(setting.name)}
                        >
                          แก้ไข
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Maintenance Mode Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            โหมด 404
          </h2>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-gray-900">เปิด/ปิดหน้า 404</div>
              <div className="text-sm text-gray-500">
                เมื่อเปิด ผู้ใช้จะเห็นหน้า 404 Not Found (Admin ยังเข้าได้ปกติ)
              </div>
            </div>
            
            <Button
              variant={is404Mode ? "default" : "outline"}
              onClick={handle404Toggle}
              className={`${
                is404Mode 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "border-red-300 text-red-600 hover:bg-red-50"
              }`}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {is404Mode ? 'ปิด 404' : 'เปิด 404'}
            </Button>
          </div>
          
          {is404Mode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">โหมด 404 เปิดอยู่</span>
              </div>
              <p className="text-sm text-red-600 mt-1">
                ผู้ใช้ทั่วไปจะเห็นหน้า 404 Not Found แต่ Admin ยังสามารถเข้าใช้งานระบบได้ปกติ
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">การดำเนินการระบบ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            onClick={() => handleSettingChange('สำรองข้อมูล')}
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <Database className="w-6 h-6" />
            <span>สำรองข้อมูล</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleSettingChange('ล้างแคช')}
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <Settings className="w-6 h-6" />
            <span>ล้างแคช</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleSettingChange('ตรวจสอบระบบ')}
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <Shield className="w-6 h-6" />
            <span>ตรวจสอบระบบ</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;