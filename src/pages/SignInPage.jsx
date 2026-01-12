import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Ready to send to Backend:", formData);
    // TODO: เชื่อมต่อกับ Backend
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      
      {/* --- Logo Section --- */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <span className="text-cyan-500 font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold text-slate-900">Carb Partner</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">เข้าสู่ระบบ</h1>
      </div>

      {/* --- Form Section --- */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        
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
          className="w-full bg-[#6CD2D9] hover:bg-[#5bc0c7] text-white font-bold py-3 rounded-full shadow-sm transition duration-200"
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
        <SocialButton icon={<GoogleIcon />} text="เข้าสู่ระบบด้วย Google" />
        <SocialButton icon={<FacebookIcon />} text="เข้าสู่ระบบด้วย Facebook" />
        <SocialButton icon={<LineIcon />} text="เข้าสู่ระบบด้วย Line" />
      </div>

      {/* --- Footer Link --- */}
      <div className="mt-8 text-slate-500 text-sm">
        ยังไม่มีบัญชี?{" "}
        <Link to="/signup" className="text-[#6CD2D9] font-bold hover:underline">
          สร้างบัญชีใหม่
        </Link>
      </div>
    </div>
  );
};

// Component ปุ่ม Social
const SocialButton = ({ icon, text }) => (
  <button className="w-full border border-slate-200 bg-white hover:bg-slate-50 py-3 rounded-full flex items-center justify-center gap-3 transition duration-200">
    <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
    <span className="text-slate-700 font-medium text-sm">{text}</span>
  </button>
);

// Icons
const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <path fill="#039BE5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z" />
    <path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-1.437,0.406-2.695,1.632-2.695l2.437-0.011v-5.08c-0.411-0.062-1.82-0.186-3.473-0.186c-4.231,0-7.154,2.568-7.154,7.32v3.382h-4.518v4.995h4.518v12.443c1.789,0.274,3.626,0.274,5.415,0V29.036z" />
  </svg>
);

const LineIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <path fill="#06C755" d="M24 4C14.4 4 6 11.2 6 20c0 4.9 2.6 9.3 6.7 12.1 0.7 0.3 1.5 1 1 2.3l-1.3 4.2c-0.3 1.1-1.3 2.7 1.2 1.4 6.7-3.8 7.3-4.1 8-4.1 0.8 0 1.6 0.1 2.4 0.1 9.6 0 18-7.2 18-16S33.6 4 24 4z" />
    <path fill="#fff" d="M34.8 23h-6.1c-0.6 0-1-0.4-1-1s0.4-1 1-1h5.1v-3h-5.1c-0.6 0-1-0.4-1-1s0.4-1 1-1h6.1c0.6 0 1-0.4 1-1s-0.4-1-1-1h-6.1c-1.7 0-3 1.3-3 3v5c0 1.7 1.3 3 3 3h6.1c0.6 0 1-0.4 1-1S35.3 23 34.8 23zM21.5 15c-0.4-0.4-1-0.5-1.5-0.2 -0.2 0.1-0.4 0.3-0.5 0.5v8.5c0 0.6 0.4 1 1 1 0.2 0 0.5-0.1 0.7-0.3l4.6-6.6V24c0 0.6 0.4 1 1 1s1-0.4 1-1v-9c0-0.4-0.2-0.7-0.6-0.9 -0.4-0.2-0.8-0.1-1.1 0.2L21.5 21V15zM13.2 15c-0.6 0-1 0.4-1 1v8c0 0.6 0.4 1 1 1s1-0.4 1-1v-8C14.2 15.4 13.7 15 13.2 15z" />
  </svg>
);

export default SignInPage;
