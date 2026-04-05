import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Info, Check, Bell, PartyPopper } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MobileLayout from '../components/MobileLayout';
import { saveUserQuestionnaire, getUserInfo } from '../Api/User';

// Scroll Wheel Picker Component
const ScrollWheelPicker = ({ items, value, onChange, width = 'w-20' }) => {
  const containerRef = useRef(null);
  const itemHeight = 48; // height of each item in px
  const visibleItems = 5; // show 5 items (2 above, 1 center, 2 below)
  
  const selectedIndex = items.indexOf(value);
  
  useEffect(() => {
    if (containerRef.current && selectedIndex >= 0) {
      containerRef.current.scrollTop = selectedIndex * itemHeight;
    }
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
      if (items[clampedIndex] !== value) {
        onChange(items[clampedIndex]);
      }
    }
  };

  const handleItemClick = (index) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: 'smooth'
      });
    }
  };



  return (
    <div className={`relative ${width}`} style={{ height: itemHeight * visibleItems }}>
      {/* Highlight bar for selected item */}
      <div 
        className="absolute left-0 right-0 pointer-events-none z-10 border-t-2 border-b-2 border-[#6CD2D9]"
        style={{ 
          top: itemHeight * 2, 
          height: itemHeight 
        }}
      />
      
      {/* Fade overlay top */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
      
      {/* Fade overlay bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
      
      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory"
        onScroll={handleScroll}
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {/* Padding items at top */}
        <div style={{ height: itemHeight * 2 }} />
        
        {items.map((item, index) => {
          const isSelected = item === value;
          return (
            <div
              key={index}
              onClick={() => handleItemClick(index)}
              className={`flex items-center justify-center cursor-pointer snap-center transition-all duration-150 ${
                isSelected 
                  ? 'text-[#6CD2D9] font-bold text-xl' 
                  : 'text-slate-300 text-lg'
              }`}
              style={{ height: itemHeight }}
            >
              {item}
            </div>
          );
        })}
        
        {/* Padding items at bottom */}
        <div style={{ height: itemHeight * 2 }} />
      </div>
    </div>
  );
};

// Main Component
const SubInfoPage = () => {
  const navigate = useNavigate();
  const CURRENT_CE_YEAR = new Date().getFullYear();
  const CURRENT_BE_YEAR = CURRENT_CE_YEAR + 543;

  // 1. State สำหรับควบคุม Step (1-6)
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [alertMessage, setAlertMessage] = useState('');

  // 2. State สำหรับเก็บข้อมูลทั้งหมด
  const [formData, setFormData] = useState({
    sex: '', // 'male' | 'female'
    active: '', // 'low' | 'medium' | 'high'
    weight: '',
    height: '',
    birth_date: { day: '', month: '', year: '' }
  });

  useEffect(() => {
    // ตรวจสอบก่อนว่าถ้ายังไม่มีข้อมูล ให้ใส่ค่า Default ลงไปเลย
    if (!formData.birth_date.day) updateDate('day', '15');
    if (!formData.birth_date.month) updateDate('month', '9'); // ก.ย.
    if (!formData.birth_date.year) updateDate('year', '1999');
  }, []);
  // --- Handlers ---
  
  const handleNext = () => {
    const validationMessage = validateStep(currentStep, formData);
    if (validationMessage) {
      setAlertMessage(validationMessage);
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/signin');
      }
      // Logic for going back to previous page (e.g., Login)
      console.log("Back to previous page");
    }
  };

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateDate = (field, value) => {
    setFormData(prev => ({
      ...prev,
      birth_date: { ...prev.birth_date, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    const validationMessage = validateStep(totalSteps, formData, true);
    if (validationMessage) {
      setAlertMessage(validationMessage);
      return;
    }

    // 🔥 ส่งข้อมูลไป Backend ตรงนี้
    console.log("Ready to submit:", formData);
    const formattedData = {
      ...formData,
      birth_date: formatThaiDate(formData.birth_date) // Format as dd-mm-yyyy
    }
    console.log("Formatted Data:", formattedData);
    const res = await saveUserQuestionnaire(formattedData);
    navigate('/home');
  };

  const validateStep = (step, data, validateAll = false) => {
    const hasBirthDate = data.birth_date.day && data.birth_date.month && data.birth_date.year;

    if ((step === 1 || validateAll) && !data.sex) {
      return 'กรุณาเลือกเพศของคุณ';
    }

    if ((step === 2 || validateAll) && !data.active) {
      return 'กรุณาเลือกระดับกิจกรรมของคุณ';
    }

    if (step === 3 || validateAll) {
      if (!data.weight) {
        return 'กรุณากรอกน้ำหนักของคุณ';
      }
      if (!data.height) {
        return 'กรุณากรอกส่วนสูงของคุณ';
      }
      if (Number(data.weight) <= 0) {
        return 'น้ำหนักต้องมากกว่า 0';
      }
      if (Number(data.height) <= 0) {
        return 'ส่วนสูงต้องมากกว่า 0';
      }
    }

    if ((step === 4 || validateAll) && !hasBirthDate) {
      return 'กรุณาเลือกวันเกิดของคุณ';
    }

    return '';
  };

  const formatThaiDate = (birth_date) => {
  if (!birth_date.day || !birth_date.month || !birth_date.year) return "";

  const d = birth_date.day.toString().padStart(2, '0');
  const m = birth_date.month.toString().padStart(2, '0');
  const y = parseInt(birth_date.year) + 543;

  return `${d}/${m}/${y}`;
};

  // คำนวณ % ของ Progress Bar
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <MobileLayout>
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col relative overflow-hidden">
      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage('')}
        />
      )}
      
      {/* --- Header & Progress Bar (Hidden on Step 6) --- */}
      {currentStep !== 6 && (
      <div className="pt-6 pb-4 px-4 bg-white z-10">
        {/* Top Nav */}
        <div className="flex items-center mb-4">
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full">
            <ArrowLeft size={24} className="text-slate-700" />
          </button>
          <span className="ml-2 font-bold text-lg text-slate-800">
            {currentStep === 4 || currentStep === 5 ? '' : 'บอกเราเกี่ยวกับตัวคุณหน่อย'}
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>ขั้นตอนที่ {currentStep} จาก {totalSteps}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#6CD2D9] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      )}

      {/* --- Body Content (Switches based on Step) --- */}
      <div className={`flex-1 overflow-y-auto px-6 py-4 pb-24 ${currentStep === 6 ? 'flex items-center justify-center' : ''}`}>
        
        {/* STEP 1: GENDER */}
        {currentStep === 1 && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold mb-2">คุณเป็นเพศอะไร?</h2>
              <p className="text-slate-500">ข้อมูลนี้ช่วยให้เราคำนวณความต้องการโภชนาการของคุณได้แม่นยำขึ้น</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <GenderCard 
                label="ชาย" 
                icon="♂" 
                selected={formData.sex === 'male'} 
                onClick={() => updateData('sex', 'male')} 
              />
              <GenderCard 
                label="หญิง" 
                icon="♀" 
                selected={formData.sex === 'female'} 
                onClick={() => updateData('sex', 'female')} 
              />
            </div>
          </div>
        )}

        {/* STEP 2: ACTIVITY LEVEL */}
        {currentStep === 2 && (
          <div className="animate-fade-in space-y-8">
             <div className="mt-2">
              <h2 className="text-2xl font-bold mb-2">ระดับกิจกรรมของคุณต่อสัปดาห์?</h2>
              <p className="text-slate-500">การออกกำลังกายส่งผลต่อระดับน้ำตาลในเลือด บอกเราเกี่ยวกับกิจวัตรของคุณ</p>
            </div>

            <div className="space-y-4">
              <ActivityOption 
                title="ไม่ค่อยออกกำลังกาย" 
                desc="0-2 วัน/สัปดาห์" 
                icon="🚶"
                selected={formData.active === 'low'}
                onClick={() => updateData('active', 'low')}
              />
              <ActivityOption 
                title="ออกกำลังกายเบาๆ" 
                desc="3-4 วัน/สัปดาห์" 
                icon="🏃"
                selected={formData.active === 'medium'}
                onClick={() => updateData('active', 'medium')}
              />
              <ActivityOption 
                title="ออกกำลังกายสม่ำเสมอ" 
                desc="5+ วัน/สัปดาห์" 
                icon="🏋️"
                selected={formData.active === 'high'}
                onClick={() => updateData('active', 'high')}
              />
            </div>
          </div>
        )}

        {/* STEP 3: PHYSICAL DATA */}
        {currentStep === 3 && (
          <div className="animate-fade-in space-y-8">
            <div className="mt-2">
              <h2 className="text-2xl font-bold mb-2">ข้อมูลร่างกาย</h2>
              <p className="text-slate-500">กรอกข้อมูลพื้นฐานเพื่อปรับแต่งประสบการณ์ของคุณ</p>
            </div>

            <div className="space-y-6">
              {/* Weight */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700">น้ำหนัก</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => updateData('weight', e.target.value)}
                    placeholder="กรอกน้ำหนักของคุณ"
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">กก.</span>
                </div>
              </div>

              {/* Height */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700">ส่วนสูง</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.height}
                    onChange={(e) => updateData('height', e.target.value)}
                    placeholder="กรอกส่วนสูงของคุณ"
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">ซม.</span>
                </div>
              </div>

              {/* Info Note */}
              <div className="flex gap-3 items-start bg-cyan-50 p-4 rounded-xl">
                <Info className="text-[#6CD2D9] shrink-0 mt-1" size={20} />
                <p className="text-sm text-slate-600">ข้อมูลนี้ใช้คำนวณค่า BMI และปรับแต่งแผนสุขภาพของคุณ</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: DATE OF BIRTH */}
        {currentStep === 4 && (
          <div className="animate-fade-in space-y-8 text-center pt-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">วันเกิดของคุณคือ?</h2>
              <p className="text-slate-500">อายุของคุณช่วยให้เราปรับคำแนะนำด้านสุขภาพให้เหมาะสม</p>
            </div>

            {/* Scroll Wheel Date Picker */}
            <div className="flex justify-center gap-2 mt-6">
              <ScrollWheelPicker
                items={Array.from({ length: 31 }, (_, i) => i + 1)}
                value={formData.birth_date.day ? parseInt(formData.birth_date.day) : 15}
                onChange={(val) => updateDate('day', val.toString())}
                width="w-16"
              />
              <ScrollWheelPicker
                items={['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']}
                value={formData.birth_date.month ? getMonthName(parseInt(formData.birth_date.month)) : 'ก.ย.'}
                onChange={(val) => updateDate('month', (getMonthIndex(val) + 1).toString())}
                width="w-20"
              />
              <ScrollWheelPicker
                items={Array.from({ length: 80 }, (_, i) => CURRENT_BE_YEAR - i)}
                value={formData.birth_date.year ? parseInt(formData.birth_date.year) + 543 : 1999 + 543}
                onChange={(val) => updateDate('year', (parseInt(val, 10) - 543).toString())}
                width="w-20"
              />
            </div>
          </div>
        )}

        {/* STEP 5: NOTIFICATIONS */}
        {currentStep === 5 && (
          <div className="animate-fade-in flex flex-col items-center justify-center text-center pt-12">
            {/* Icon Circle */}
            <div className="w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center mb-8">
              <Bell className="text-[#6CD2D9] w-10 h-10" />
            </div>

            {/* Text */}
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              เปิดการแจ้งเตือน
            </h2>
            <p className="text-slate-500 leading-relaxed max-w-xs mb-8">
              รับการแจ้งเตือนสำหรับมื้ออาหาร ยา และการตรวจน้ำตาลในเลือด เพื่อดูแลสุขภาพของคุณอย่างต่อเนื่อง
            </p>
          </div>
        )}

        {/* STEP 6: ALL SET - CELEBRATION */}
        {currentStep === 6 && (
          <div className="animate-fade-in flex flex-col items-center justify-center text-center pt-12 relative">
            {/* Confetti Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    backgroundColor: ['#6CD2D9', '#FCD34D', '#F472B6', '#A78BFA', '#34D399', '#FB923C'][Math.floor(Math.random() * 6)],
                  }}
                />
              ))}
            </div>

            {/* Icon Circle with Animation */}
            <div className="w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center mb-8 animate-bounce-slow">
              <PartyPopper className="text-[#6CD2D9] w-10 h-10 animate-wiggle" />
            </div>

            {/* Text */}
            <h2 className="text-2xl font-bold text-slate-900 mb-4 animate-scale-in">
              พร้อมใช้งานแล้ว!
            </h2>
            <p className="text-slate-500 leading-relaxed max-w-xs mb-8 animate-fade-in-delayed">
              ยินดีที่ตั้งค่าเสร็จสมบูรณ์ การเดินทางดูแลสุขภาพเบาหวานของคุณเริ่มต้นแล้ว
            </p>
          </div>
        )}
      </div>

      {/* --- Footer (Fixed Bottom) --- */}
      <div className={`absolute bottom-0 left-0 w-full p-4 bg-white ${currentStep !== 6 ? 'border-t border-slate-100' : ''}`}>
        {currentStep === 6 ? (
          <button
            onClick={handleSubmit}
            className="w-full bg-[#6CD2D9] hover:bg-[#5bc0c7] text-white font-bold py-4 rounded-full shadow-lg transition duration-200 text-lg"
          >
            เริ่มใช้งาน Carb Partner
          </button>
        ) : currentStep === 5 ? (
          <div className="space-y-3">
            <button
              onClick={handleNext}
              className="w-full bg-[#6CD2D9] hover:bg-[#5bc0c7] text-white font-bold py-4 rounded-full shadow-lg transition duration-200 text-lg"
            >
              อนุญาตการแจ้งเตือน
            </button>
            <button
              onClick={handleNext}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 rounded-full transition duration-200 text-lg"
            >
              ไม่อนุญาต
            </button>
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="w-full bg-[#6CD2D9] hover:bg-[#5bc0c7] text-white font-bold py-4 rounded-full shadow-lg transition duration-200 text-lg"
          >
            ดำเนินการต่อ
          </button>
        )}
      </div>

    </div>
    </MobileLayout>
  );
};

// --- Sub Components ---

const GenderCard = ({ label, icon, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      cursor-pointer h-40 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-200
      ${selected ? 'border-[#6CD2D9] bg-cyan-50' : 'border-slate-200 hover:border-slate-300'}
    `}
  >
    <span className={`text-4xl ${selected ? 'text-[#6CD2D9]' : 'text-slate-400'}`}>{icon}</span>
    <span className={`font-bold ${selected ? 'text-[#6CD2D9]' : 'text-slate-600'}`}>{label}</span>
  </div>
);

const ActivityOption = ({ title, desc, icon, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      cursor-pointer p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-200
      ${selected ? 'border-[#6CD2D9] bg-cyan-50' : 'border-slate-200 hover:border-slate-300'}
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${selected ? 'bg-white' : 'bg-slate-100'}`}>
        {icon}
      </div>
      <div className="text-left">
        <h3 className={`font-bold ${selected ? 'text-slate-900' : 'text-slate-700'}`}>{title}</h3>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
    
    {/* Radio Circle */}
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-[#6CD2D9]' : 'border-slate-300'}`}>
      {selected && <div className="w-3 h-3 rounded-full bg-[#6CD2D9]" />}
    </div>
  </div>
);

const AlertModal = ({ message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50">
        <Info className="text-[#6CD2D9]" size={22} />
      </div>
      <p className="text-slate-700 font-semibold">{message}</p>
      <button
        onClick={onClose}
        className="mt-6 w-full rounded-full bg-[#6CD2D9] py-3 font-bold text-white transition hover:bg-[#5bc0c7]"
      >
        ตกลง
      </button>
    </div>
  </div>
);

// Helper for month name
const getMonthName = (monthNum) => {
    const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    return months[monthNum - 1] || "ก.ย.";
};

// Helper for month index
const getMonthIndex = (monthName) => {
    const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    return months.indexOf(monthName);
};

// Add simple fade-in animation to Tailwind config if not exists, 
// or simply use this inline style hack for the demo
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default SubInfoPage;