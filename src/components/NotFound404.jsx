import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound404 = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-500 rounded-full blur-2xl opacity-30"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="relative bg-white rounded-full p-6 shadow-2xl"
              animate={{ 
                boxShadow: [
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  "0 25px 50px -12px rgba(239, 68, 68, 0.5)",
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <AlertTriangle className="w-16 h-16 text-red-600 mx-auto" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            หน้าที่คุณกำลังมองหาไม่พบ
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 font-medium">
            ขออภัย หน้าที่คุณต้องการอาจถูกลบหรือย้ายไปที่อื่นแล้ว
          </p>
        </motion.div>

        {/* Error Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-md mx-auto mb-6">
            <div className="flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <span className="font-semibold text-gray-800">URL ที่ไม่พบ</span>
            </div>
            <motion.p 
              className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {window.location.pathname}
            </motion.p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleGoHome}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5 mr-2" />
                กลับหน้าหลัก
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                กลับหน้าก่อนหน้า
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">หรือลองดูหน้านี้</h3>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <motion.a
              href="/"
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 block"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-blue-600 mb-2">
                <Home className="w-6 h-6 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">หน้าหลัก</h4>
              <p className="text-sm text-gray-600">กลับไปที่หน้าแรกของเว็บไซต์</p>
            </motion.a>

            <motion.a
              href="/dashboard"
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 block"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-green-600 mb-2">
                <Search className="w-6 h-6 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">แดชบอร์ด</h4>
              <p className="text-sm text-gray-600">เข้าสู่ระบบจัดการข้อมูล</p>
            </motion.a>

            <motion.a
              href="/settings"
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 block"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-purple-600 mb-2">
                <AlertTriangle className="w-6 h-6 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">ตั้งค่า</h4>
              <p className="text-sm text-gray-600">จัดการการตั้งค่าระบบ</p>
            </motion.a>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center mb-8"
        >
          <motion.p 
            className="text-gray-600 mb-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            หากคุณคิดว่านี่เป็นข้อผิดพลาด กรุณาติดต่อทีมสนับสนุน
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <motion.a
              href="tel:+66123456789"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              animate={{ 
                boxShadow: [
                  "0 10px 25px -5px rgba(34, 197, 94, 0.3)",
                  "0 10px 25px -5px rgba(34, 197, 94, 0.6)",
                  "0 10px 25px -5px rgba(34, 197, 94, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>โทร: 012-345-6789</span>
            </motion.a>
            <motion.a
              href="mailto:support@example.com"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              animate={{ 
                boxShadow: [
                  "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                  "0 10px 25px -5px rgba(59, 130, 246, 0.6)",
                  "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <span>อีเมล: support@example.com</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <motion.div 
            className="flex items-center justify-center text-gray-500 text-sm"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ขออภัยในความไม่สะดวก
            </motion.span>
            <motion.span 
              className="mx-2"
              animate={{ 
                x: [0, 5, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              ขอบคุณที่เข้าใจ
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-red-200/30 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-16 h-16 bg-orange-200/30 rounded-full blur-xl"
            animate={{
              y: [0, 20, 0],
              x: [0, -15, 0],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-24 h-24 bg-yellow-200/30 rounded-full blur-xl"
            animate={{
              y: [0, -15, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound404;
