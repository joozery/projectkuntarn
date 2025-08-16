import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  CreditCard,
  Shield,
  Building2,
  Users,
  TrendingUp,
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { authService } from '@/services/authService';

const LoginPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentFeature, setCurrentFeature] = useState(0);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Building2 className="w-10 h-10" />,
      title: "จัดการสาขา",
      description: "บริหารจัดการสาขาต่างๆ ได้อย่างมีประสิทธิภาพ",
      color: "from-emerald-400 to-green-500"
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "จัดการลูกค้า",
      description: "ดูแลข้อมูลลูกค้าและสัญญาผ่อนชำระ",
      color: "from-teal-400 to-cyan-500"
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "รายงานและสถิติ",
      description: "ติดตามผลการดำเนินงานด้วยรายงานที่ครบถ้วน",
      color: "from-green-400 to-emerald-500"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'กรุณากรอกชื่อผู้ใช้งาน';
    }

    if (!formData.password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(formData.username, formData.password);
      
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: `ยินดีต้อนรับ ${result.user.full_name || result.user.username}`,
        variant: "default"
      });

      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
    } catch (error) {
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-50 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-emerald-300/30 to-green-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-teal-300/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-green-300/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Sparkles */}
        <div className="absolute top-32 left-32 animate-bounce">
          <Sparkles className="w-6 h-6 text-emerald-500" />
        </div>
        <div className="absolute top-64 right-32 animate-bounce delay-1000">
          <Star className="w-4 h-4 text-green-500" />
        </div>
        <div className="absolute bottom-32 left-1/3 animate-bounce delay-500">
          <Zap className="w-5 h-5 text-teal-500" />
        </div>
      </div>

      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="flex flex-col justify-center items-center text-white p-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/50 via-green-500/50 to-teal-500/50 animate-pulse"></div>
              <CreditCard className="w-12 h-12 text-white relative z-10" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              ระบบจัดการผ่อนสินค้า
            </h1>
            <p className="text-xl text-emerald-700 font-medium">
              Admin Panel - Professional Management System
            </p>
          </motion.div>

          {/* Features Carousel */}
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.8 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="text-center"
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${features[currentFeature].color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform hover:scale-110 transition-transform duration-300`}>
                  {features[currentFeature].icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-emerald-800">{features[currentFeature].title}</h3>
                <p className="text-emerald-700 text-lg">{features[currentFeature].description}</p>
              </motion.div>
            </AnimatePresence>

            {/* Feature Indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentFeature ? 'bg-white w-8 scale-125' : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-12 text-center"
          >
            <div className="group">
              <div className="text-3xl font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">50+</div>
              <div className="text-sm text-emerald-700 group-hover:text-emerald-800 transition-colors">สาขา</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors">10K+</div>
              <div className="text-sm text-green-700 group-hover:text-green-800 transition-colors">ลูกค้า</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold text-teal-600 group-hover:text-teal-700 transition-colors">99.9%</div>
              <div className="text-sm text-teal-700 group-hover:text-teal-800 transition-colors">ความแม่นยำ</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-emerald-200">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/30"></div>
            <CardHeader className="text-center pb-8 relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/50 via-green-500/50 to-teal-500/50 animate-pulse"></div>
                <Shield className="w-10 h-10 text-white relative z-10" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-emerald-800 mb-2">
                เข้าสู่ระบบ
              </CardTitle>
              <CardDescription className="text-emerald-600 text-lg">
                กรุณาเข้าสู่ระบบเพื่อเข้าถึงระบบจัดการ
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-semibold text-emerald-800 mb-3">
                    ชื่อผู้ใช้งาน
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 h-5 w-5 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all duration-300 bg-white/80 backdrop-blur-sm text-emerald-900 placeholder-emerald-500 ${
                        errors.username ? 'border-red-400 bg-red-50' : 'border-emerald-300/50 hover:border-emerald-400'
                      }`}
                      placeholder="กรอกชื่อผู้ใช้งาน"
                      disabled={loading}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.username && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-300 text-sm mt-2 flex items-center gap-2"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errors.username}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-sm font-semibold text-emerald-800 mb-3">
                    รหัสผ่าน
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 h-5 w-5 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all duration-300 bg-white/80 backdrop-blur-sm text-emerald-900 placeholder-emerald-500 ${
                        errors.password ? 'border-red-400 bg-red-50' : 'border-emerald-300/50 hover:border-emerald-400'
                      }`}
                      placeholder="กรอกรหัสผ่าน"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500 hover:text-emerald-600 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-300 text-sm mt-2 flex items-center gap-2"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 hover:from-emerald-500 hover:via-green-600 hover:to-teal-600 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 rounded-2xl"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        กำลังเข้าสู่ระบบ...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <LogIn className="h-5 w-5" />
                        เข้าสู่ระบบ
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-8"
          >
            <div className="flex items-center justify-center gap-3 text-sm text-emerald-600">
              <Shield className="h-5 w-5" />
              <span className="font-medium">ระบบปลอดภัยด้วยการยืนยันตัวตน</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;