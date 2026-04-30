import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLoginButton';
import PrivacyModal from '../components/PrivacyModal';
import LineLoginButton from '../components/LineLoginButton';
import api from '../api';
import CarbIcon from '../assets/images/carb-icon.png';

const SignInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const res = await api.post('/signin', { 
          email: formData.usernameOrEmail,
          password: formData.password
      });
      
      localStorage.setItem('access_token', res.data.access_token);
      navigate('/check-profile');

    } catch (error) {
      console.error("Login Error:", error);
      const errorDetail = error.response?.data?.detail || "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";
      
      // Check if email is not verified
      if (errorDetail.includes("not verified") || errorDetail.includes("Email not verified")) {
        navigate('/verify-email', { state: { email: formData.usernameOrEmail } });
        return;
      }
      
      setErrorMessage(errorDetail);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans text-slate-800 relative">
      
      {/* --- Logo Section --- */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <img src={CarbIcon} alt="Carb Partner Logo" className="w-10 h-10" />
          </div>
          <span className="text-xl font-bold text-slate-900">Carb Partner</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">เข้าสู่ระบบ</h1>
      </div>

      {/* --- Form Section --- */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        
        {/* Error Message */}
        {errorMessage && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center border border-red-100 animate-pulse">
                {errorMessage}
            </div>
        )}

        {/* Username / Email */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">อีเมลหรือชื่อผู้ใช้</label>
          <input
            type="text"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            placeholder="ระบุอีเมลหรือชื่อผู้ใช้ของคุณ"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-slate-600"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1 relative">
          <label className="text-sm font-semibold text-slate-700">รหัสผ่าน</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="ระบุรหัสผ่านของคุณ"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-slate-600 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-[#6CD2D9] hover:underline">
            ลืมรหัสผ่าน?
          </Link>
        </div>


        {/* Submit Button */}
        <button
          type="submit"
          className="w-full font-bold py-3 rounded-full shadow-sm transition duration-200 bg-[#6CD2D9] hover:bg-[#5bc0c7] text-white"
        >
          เข้าสู่ระบบ
        </button>
      </form>

      {/* --- Divider --- */}
      <div className="w-full max-w-sm flex items-center gap-4 my-6">
        <div className="h-[1px] bg-slate-200 flex-1"></div>
        <span className="text-slate-400 text-sm">หรือ</span>
        <div className="h-[1px] bg-slate-200 flex-1"></div>
      </div>

      {/* --- Social Login Buttons --- */}
      <div className="w-full max-w-sm space-y-3">
        <GoogleLoginButton />
        <LineLoginButton />
      </div>

      {/* --- Footer Link --- */}
      <div className="mt-8 text-slate-500 text-sm flex flex-col items-center gap-2">
        <p>
            ยังไม่มีบัญชี?{" "}
            <Link to="/signup" className="text-[#6CD2D9] font-bold hover:underline">
            สร้างบัญชีใหม่
            </Link>
        </p>
      </div>

      {/* Privacy Modal */}
      <PrivacyModal 
        isOpen={showPrivacy} 
        onClose={() => setShowPrivacy(false)} 
      />

    </div>
  );
};

export default SignInPage;
