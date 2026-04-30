import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerificationCode } from '../Api/User';
import CarbIcon from '../assets/images/carb-icon.png';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    const state = location.state;
    if (state?.email) {
      setEmail(state.email);
    } else {
      navigate('/signup');
    }
  }, [location, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setErrorMessage('กรุณากรอกรหัสยืนยัน 6 หลัก');
      return;
    }

    setIsLoading(true);
    try {
      await verifyEmail(email, verificationCode);
      setSuccessMessage('ยืนยันเมลสำเร็จ! กำลังไปยังหน้าเข้าสู่ระบบ...');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      console.error('Verify Error:', error);
      const msg = error.response?.data?.detail || 'เกิดข้อผิดพลาด กรุณาลองใหม่';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      await resendVerificationCode(email);
      setSuccessMessage('ส่งรหัสใหม่ไปที่เมลของคุณแล้ว');
      setCode(['', '', '', '', '', '']);
      setResendTimer(60);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend Error:', error);
      const msg = error.response?.data?.detail || 'เกิดข้อผิดพลาด กรุณาลองใหม่';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      {/* Logo Section */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <img src={CarbIcon} alt="Carb Partner Logo" className="w-10 h-10" />
          </div>
          <span className="text-xl font-bold text-slate-900">Carb Partner</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">ยืนยันอีเมล</h1>
      </div>

      {/* Email Info */}
      <div className="w-full max-w-sm mb-6">
        <p className="text-center text-slate-600 text-sm">
          เราส่งรหัสยืนยัน 6 หลักไปที่
        </p>
        <p className="text-center text-slate-900 font-semibold text-sm mt-1">
          {email}
        </p>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="w-full max-w-sm bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center border border-red-100 mb-4">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="w-full max-w-sm bg-green-50 text-green-600 text-sm p-3 rounded-lg text-center border border-green-100 mb-4">
          {successMessage}
        </div>
      )}

      {/* Verification Code Input */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="flex justify-center gap-3 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-2xl font-bold rounded-lg border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full font-bold py-3 rounded-full shadow-sm transition duration-200 ${
            isLoading
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-cyan-400 hover:bg-cyan-500 text-white'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'กำลังยืนยัน...' : 'ยืนยันเมล'}
        </button>
      </form>

      {/* Resend Section */}
      <div className="w-full max-w-sm text-center mt-6">
        <p className="text-slate-600 text-sm mb-3">ไม่ได้รับรหัสหรือ</p>
        <button
          onClick={handleResend}
          disabled={resendTimer > 0 || isLoading}
          className={`text-sm font-semibold transition duration-200 ${
            resendTimer > 0 || isLoading
              ? 'text-slate-400 cursor-not-allowed'
              : 'text-cyan-500 hover:text-cyan-600'
          }`}
        >
          {resendTimer > 0 ? `ส่งรหัสใหม่ใน ${resendTimer} วินาที` : 'ส่งรหัสใหม่'}
        </button>
      </div>

      {/* Back to Sign In */}
      <div className="w-full max-w-sm text-center mt-6">
        <p className="text-slate-600 text-sm">
          มีบัญชีแล้ว?{' '}
          <button
            onClick={() => navigate('/signin')}
            className="text-cyan-500 hover:text-cyan-600 font-semibold"
          >
            เข้าสู่ระบบ
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
