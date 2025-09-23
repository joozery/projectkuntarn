import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Clock, RefreshCw, Zap, Shield, Sparkles } from 'lucide-react';

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
                <Trash2 className="w-16 h-16 text-red-600 mx-auto" />
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
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            กำลังลบไฟล์เซฟเวอร์ออกเพื่อติดตั้งใหม่
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium">
            เรากำลังลบไฟล์เก่าออกจากเซฟเวอร์เพื่อติดตั้งระบบใหม่ทั้งหมด
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <RefreshCw className="w-5 h-5 text-red-500 animate-spin" />
            <span className="text-red-600 font-medium">กำลังลบไฟล์...</span>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 h-3 rounded-full relative"
              animate={{ 
                width: ["0%", "20%", "50%", "75%", "90%", "95%", "100%", "0%"]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut",
                times: [0, 0.1, 0.3, 0.5, 0.7, 0.85, 0.95, 1]
              }}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          

          {/* Loading Dots */}
          <div className="flex justify-center space-x-1 mb-6">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
            ))}
          </div>

          {/* Rotating Loading Ring */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-orange-500 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Pulsing Status Text */}
          <motion.div
            className="text-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-red-600 font-medium">
              🗑️ กำลังลบไฟล์เซฟเวอร์...
            </p>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">ประโยชน์ของการติดตั้งใหม่</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-blue-600 mb-3 flex justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Zap className="w-6 h-6" />
              </motion.div>
              <h3 className="font-semibold text-gray-800 mb-2">ระบบสะอาดใหม่</h3>
              <p className="text-sm text-gray-600">ลบไฟล์เก่าและติดตั้งระบบใหม่ทั้งหมดเพื่อประสิทธิภาพสูงสุด</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-blue-600 mb-3 flex justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <Shield className="w-6 h-6" />
              </motion.div>
              <h3 className="font-semibold text-gray-800 mb-2">ความปลอดภัยใหม่</h3>
              <p className="text-sm text-gray-600">ติดตั้งระบบรักษาความปลอดภัยใหม่ล่าสุดและแข็งแกร่งกว่าเดิม</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-blue-600 mb-3 flex justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 2 }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
              <h3 className="font-semibold text-gray-800 mb-2">เทคโนโลยีใหม่</h3>
              <p className="text-sm text-gray-600">ใช้เทคโนโลยีและฟีเจอร์ใหม่ล่าสุดที่ทันสมัยและเสถียรกว่า</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Time Estimate */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-md mx-auto mb-8"
          animate={{ 
            boxShadow: [
              "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              "0 10px 25px -5px rgba(251, 146, 60, 0.3)",
              "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center justify-center mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-5 h-5 text-orange-500 mr-2" />
            </motion.div>
            <span className="font-semibold text-gray-800">เวลาที่คาดว่าจะเสร็จสิ้น</span>
          </div>
          <motion.p 
            className="text-2xl font-bold text-orange-600 mb-2"
            animate={{ 
              scale: [1, 1.05, 1],
              color: ["#ea580c", "#f97316", "#ea580c"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            30-60 นาที
          </motion.p>
          <motion.p 
            className="text-sm text-gray-600"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            การติดตั้งใหม่จะใช้เวลานานกว่าเล็กน้อย แต่จะได้ระบบที่ดีกว่า
          </motion.p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mb-8"
        >
          <motion.p 
            className="text-gray-600 mb-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            หากมีข้อสงสัยหรือต้องการความช่วยเหลือเร่งด่วน
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
          transition={{ duration: 0.8, delay: 1.6 }}
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
              ขอบคุณที่รอคอย
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
              เราจะกลับมาเร็วๆ นี้!
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
          <motion.div
            className="absolute top-60 left-1/2 w-12 h-12 bg-pink-200/20 rounded-full blur-lg"
            animate={{
              y: [0, -30, 0],
              x: [0, 25, 0],
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-40 right-1/3 w-18 h-18 bg-yellow-200/25 rounded-full blur-lg"
            animate={{
              y: [0, 25, 0],
              x: [0, -20, 0],
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleMaintenance;
