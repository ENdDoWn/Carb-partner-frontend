import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLoginButton';
import LineLoginButton from '../components/LineLoginButton';
import PrivacyModal from '../components/PrivacyModal';
import api from '../api';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isPrivacyAccepted, setIsPrivacyAccepted] = useState(false);
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

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!isPrivacyAccepted) {
        setErrorMessage("กรุณายอมรับนโยบายความเป็นส่วนตัวก่อนสร้างบัญชี");
        return;
    }

    try {
      const res = await api.post('/signup', { 
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword
      });
      navigate('/signin');

    } catch (error) {
      console.error("Register Error:", error);
      const msg = error.response?.data?.detail || "เกิดข้อผิดพลาดในการสมัครสมาชิก";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans text-slate-800 relative">
      
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <span className="text-cyan-500 font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold text-slate-900">Carb Partner</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">สร้างบัญชีใหม่</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        
        {errorMessage && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center border border-red-100 animate-pulse">
                {errorMessage}
            </div>
        )}

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">อีเมล</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-slate-600"
            required
          />
        </div>

        {/* ❌ ตัดช่อง Username ออกไปแล้วครับ */}

        {/* Password */}
        <div className="space-y-1 relative">
          <label className="text-sm font-semibold text-slate-700">รหัสผ่าน</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="กำหนดรหัสผ่าน"
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

        {/* Confirm Password */}
        <div className="space-y-1 relative">
          <label className="text-sm font-semibold text-slate-700">ยืนยันรหัสผ่าน</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="ใส่รหัสผ่านอีกครั้ง"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-slate-600 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Checkbox Privacy */}
        <div className="flex items-start mt-2">
            <div className="flex items-center h-5">
                <input
                    id="privacy-checkbox-signup"
                    type="checkbox"
                    checked={isPrivacyAccepted}
                    onChange={(e) => setIsPrivacyAccepted(e.target.checked)}
                    className="w-4 h-4 text-[#6CD2D9] border-slate-300 rounded focus:ring-[#6CD2D9] cursor-pointer"
                />
            </div>
            <div className="ml-2 text-sm leading-5">
                <label htmlFor="privacy-checkbox-signup" className="text-slate-600 cursor-pointer">
                    ฉันยอมรับให้เก็บรวบรวมข้อมูล เพื่อยืนยันตัวตนตาม
                </label>
                <button 
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    className="text-[#6CD2D9] font-bold hover:underline ml-1 focus:outline-none"
                >
                    นโยบายความเป็นส่วนตัว
                </button>
            </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full font-bold py-3 rounded-full shadow-sm transition duration-200 mt-6 ${isPrivacyAccepted ? 'bg-[#6CD2D9] hover:bg-[#5bc0c7] text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        >
          สร้างบัญชีใหม่
        </button>
      </form>

      <div className="w-full max-w-sm flex items-center gap-4 my-6">
        <div className="h-[1px] bg-slate-200 flex-1"></div>
        <span className="text-slate-400 text-sm">หรือ</span>
        <div className="h-[1px] bg-slate-200 flex-1"></div>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <GoogleLoginButton />
        <SocialButton icon={<FacebookIcon />} text="ลงทะเบียนด้วย Facebook" />
        <LineLoginButton />
      </div>

      <div className="mt-8 text-slate-500 text-sm">
        มีบัญชีอยู่แล้ว?{" "}
        <Link to="/signin" className="text-[#6CD2D9] font-bold hover:underline">
          เข้าสู่ระบบ
        </Link>
      </div>

      <PrivacyModal 
        isOpen={showPrivacy} 
        onClose={() => setShowPrivacy(false)} 
      />

    </div>
  );
};

// ... (SocialButton และ Icons เหมือนเดิม)
const SocialButton = ({ icon, text }) => (
  <button 
    type="button" 
    className="w-full border border-slate-200 bg-white hover:bg-slate-50 py-3 rounded-full flex items-center justify-center gap-3 transition duration-200"
  >
    <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
    <span className="text-slate-700 font-medium text-sm">{text}</span>
  </button>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <path fill="#039BE5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z" />
    <path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-1.437,0.406-2.695,1.632-2.695l2.437-0.011v-5.08c-0.411-0.062-1.82-0.186-3.473-0.186c-4.231,0-7.154,2.568-7.154,7.32v3.382h-4.518v4.995h4.518v12.443c1.789,0.274,3.626,0.274,5.415,0V29.036z" />
  </svg>
);

export default SignUpPage;