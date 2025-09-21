import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Clock, RefreshCw, Zap, Shield, Sparkles } from 'lucide-react';

const SimpleMaintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-6 shadow-2xl">
              <Wrench className="w-16 h-16 text-blue-600 mx-auto" />
            </div>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            กำลังปรับปรุงระบบ
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium">
            เรากำลังอัพเดทเวอร์ชั่นใหม่เพื่อประสบการณ์ที่ดีกว่า
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
            <span className="text-blue-600 font-medium">กำลังดำเนินการ...</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
          <p className="text-sm text-gray-500">ความคืบหน้า: 75%</p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">สิ่งที่จะได้รับในเวอร์ชั่นใหม่</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-blue-600 mb-3 flex justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">ประสิทธิภาพที่ดีขึ้น</h3>
              <p className="text-sm text-gray-600">ปรับปรุงความเร็วและการตอบสนองของระบบ</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-blue-600 mb-3 flex justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">ความปลอดภัยเพิ่มขึ้น</h3>
              <p className="text-sm text-gray-600">เสริมความแข็งแกร่งของระบบรักษาความปลอดภัย</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-blue-600 mb-3 flex justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">ฟีเจอร์ใหม่</h3>
              <p className="text-sm text-gray-600">เพิ่มฟีเจอร์ใหม่ๆ ที่น่าสนใจและใช้งานง่ายขึ้น</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Time Estimate */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-md mx-auto mb-8"
        >
          <div className="flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-orange-500 mr-2" />
            <span className="font-semibold text-gray-800">เวลาที่คาดว่าจะเสร็จสิ้น</span>
          </div>
          <p className="text-2xl font-bold text-orange-600 mb-2">15-30 นาที</p>
          <p className="text-sm text-gray-600">
            เราจะกลับมาให้บริการโดยเร็วที่สุด
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mb-8"
        >
          <p className="text-gray-600 mb-4">
            หากมีข้อสงสัยหรือต้องการความช่วยเหลือเร่งด่วน
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <a
              href="tel:+66123456789"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>โทร: 012-345-6789</span>
            </a>
            <a
              href="mailto:support@example.com"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>อีเมล: support@example.com</span>
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <span>ขอบคุณที่รอคอย</span>
            <span className="mx-2 animate-pulse">→</span>
            <span>เราจะกลับมาเร็วๆ นี้!</span>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 rounded-full blur-xl"
            animate={{
              y: [0, 20, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl"
            animate={{
              y: [0, -15, 0],
              x: [0, 20, 0],
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

export default SimpleMaintenance;
