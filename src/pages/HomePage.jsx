import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, User, Search, Droplet, ChevronRight, 
  Coffee, Sun, Moon, IceCream, Utensils 
} from 'lucide-react';

import Navigation from '../components/Navigation';
import MobileLayout from '../components/MobileLayout';
import { getUserInfo, updateBloodSugar, allBloodSugarHistory, getDailyCarbTotal } from '../Api/User';

const getBloodSugarMeta = (value) => {
  const sugar = Number(value);

  if (!Number.isFinite(sugar) || sugar <= 0) {
    return {
      status: 'ยังไม่มีข้อมูล',
      badgeClass: 'bg-slate-100 text-slate-500',
    };
  }

  if (sugar >= 70 && sugar <= 100) {
    return {
      status: 'คงที่',
      badgeClass: 'bg-green-100 text-green-700',
    };
  }

  if (sugar >= 101 && sugar <= 125) {
    return {
      status: 'เริ่มสูง',
      badgeClass: 'bg-yellow-100 text-yellow-700',
    };
  }

  return {
    status: 'สูง',
    badgeClass: 'bg-red-100 text-red-700',
  };
};

const HomePage = () => {
  const navigate = useNavigate();
  const [showBloodSugarModal, setShowBloodSugarModal] = useState(false);
  const [bloodSugarInput, setBloodSugarInput] = useState('');
  const [bloodSugarError, setBloodSugarError] = useState('');
  const [userData, setUserData] = useState(null);
  const todayLabel = new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' });
  const bloodSugarMeta = getBloodSugarMeta(userData?.bloodSugar);
  useEffect(() => {
    const fetchUserData = async () => {
      const [data, bloodSugar, dailyCarb] = await Promise.all([
        getUserInfo(),
        allBloodSugarHistory(),
        getDailyCarbTotal(),
      ]);
      const latestSugar = bloodSugar?.length ? bloodSugar[0] : null;
      const dailyTotalCarb = Number(dailyCarb?.totalCarb);

      const user = data?.user ?? data;
      console.log(user);
      setUserData({
        full_name: user?.full_name ?? null,
        carbCurrent: Number.isFinite(dailyTotalCarb) ? dailyTotalCarb : (user?.carbCurrent ?? 0),
        carb_expect: user?.carb_expect ?? user?.carbGoal ?? null,
        bloodSugar: latestSugar?.sugar_level ?? null,
        lastCheck: latestSugar?.created_at
          ? new Date(latestSugar.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric' })
          : null,
        date: todayLabel,
      });
    };
    fetchUserData();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showBloodSugarModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showBloodSugarModal]);

  const buildBloodSugarPayload = (value) => ({
    timestamp: new Date().toISOString(),
    sugar_level: Number(value)
  });

  const handleSaveBloodSugar = async () => {
    const sugarValue = Number(bloodSugarInput);
    if (!Number.isFinite(sugarValue) || sugarValue <= 0) {
      setBloodSugarError('กรุณากรอกค่าน้ำตาลให้ถูกต้อง');
      return;
    }

    setBloodSugarError('');

    const payload = buildBloodSugarPayload(sugarValue);

    try {
      await updateBloodSugar(payload);
      const [refreshedUserInfo, refreshedBloodSugar, refreshedDailyCarb] = await Promise.all([
        getUserInfo(),
        allBloodSugarHistory(),
        getDailyCarbTotal(),
      ]);
      const refreshedLatestSugar = refreshedBloodSugar?.length ? refreshedBloodSugar[0] : null;
      const refreshedDailyTotalCarb = Number(refreshedDailyCarb?.totalCarb);
      const refreshedUser = refreshedUserInfo?.user ?? refreshedUserInfo;

      setUserData({
        full_name: refreshedUser?.full_name ?? null,
        carbCurrent: Number.isFinite(refreshedDailyTotalCarb) ? refreshedDailyTotalCarb : (refreshedUser?.carbCurrent ?? 0),
        carb_expect: refreshedUser?.carb_expect ?? refreshedUser?.carbGoal ?? null,
        bloodSugar: refreshedLatestSugar?.sugar_level ?? sugarValue,
        lastCheck: refreshedLatestSugar?.created_at
          ? new Date(refreshedLatestSugar.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric' })
          : null,
        date: todayLabel,
      });
    } catch (error) {
    } finally {
      setShowBloodSugarModal(false);
      setBloodSugarInput('');
      setBloodSugarError('');
    }
  };

  // Logic คำนวณวงกลม
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const carbCurrent = Number(userData?.carbCurrent ?? 0);
  const carbExpect = Number(userData?.carb_expect ?? 0);
  const progress = carbExpect > 0 ? (carbCurrent / carbExpect) * 100 : 0;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <MobileLayout>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-28 no-scrollbar">
        
        {/* Header Section */}
        <div className=" p-6 pb-4 pt-safe-top relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white overflow-hidden border-2 border-white shadow-sm">
                 <User size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">สวัสดีตอนเช้า,</h1>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">{userData?.full_name ?? 'ผู้ใช้งาน'}</h2>
                <p className="text-xs text-slate-500 mt-1">{userData?.date ?? todayLabel}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-col">
              <button 
                onClick={() => navigate('/profile')}
                className="w-15 h-15 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 border border-slate-100 active:bg-slate-100 shadow-sm"
              >
                 <User size={20} />
              </button>
              <button className="w-15 h-15 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 border border-slate-100 relative active:bg-slate-100 shadow-sm">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>

          {/* Carb Ring */}
          <div className="flex justify-center my-4 relative">
            <div className="relative w- h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r={radius} stroke="#E2E8F0" strokeWidth="12" fill="transparent" strokeLinecap="round" />
                <circle cx="50%" cy="50%" r={radius} stroke="#6CD2D9" strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{carbCurrent}ก.</span>
                <span className="text-xs text-slate-400 font-medium mt-1">จากเป้าหมาย {carbExpect || '-'}ก.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="px-5 mt-6 space-y-6">
          
          {/* Search Bar */}
          <button 
            onClick={() => navigate('/find-food')}
            className="w-full h-25 bg-[#6CD2D9] p-4 rounded-2xl flex items-center justify-between text-white shadow-md active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-4">
               <div className="bg-white/20 p-2 rounded-lg">
                  <Search size={24} />
               </div>
               <div className="flex flex-col items-start">
                 <span className="font-bold text-lg">ค้นหาอาหาร</span>
                 <span className="text-xs text-white/90">ค้นหาในฐานข้อมูลเพื่อบันทึก</span>
               </div>
            </div>
            <ChevronRight size={24} className="opacity-80" />
          </button>

          {/* Blood Sugar */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden">
            <div className="z-10">
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-sm font-bold text-slate-600">ระดับน้ำตาลในเลือด</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-extrabold text-slate-900">{userData?.bloodSugar ?? '-'}</span>
                 <span className="text-xs font-bold text-slate-400">มก./ดล.</span>
                 <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${bloodSugarMeta.badgeClass}`}>
                   {bloodSugarMeta.status}
                 </span>
              </div>
                <p className="text-[10px] text-slate-400 mb-4">ล่าสุดเมื่อ {userData?.lastCheck ?? '-'}</p>
              <button 
                onClick={() => setShowBloodSugarModal(true)}
                className="bg-[#55BCC3] text-white px-5 py-2 rounded-full text-xs font-bold shadow-sm active:bg-[#4aaeb5]"
              >
                บันทึกระดับน้ำตาลในเลือด
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center">
               <Droplet size={40} className="text-[#6CD2D9] opacity-40 mb-2 mr-2" fill="currentColor" />
            </div>
          </div>

          {/* Meal Grid */}
          <div className="grid grid-cols-2 gap-3">
             <MealButton icon={<Coffee />} label="อาหารเช้า" />
             <MealButton icon={<Sun />} label="อาหารกลางวัน" />
             <MealButton icon={<Moon />} label="อาหารเย็น" />
             <MealButton icon={<IceCream />} label="อาหารว่าง" />
          </div>
            <div className="bg-[#FFF8E1] p-5 rounded-2xl border border-yellow-100 mb-6">
             <div className="flex items-center gap-2 mb-3 text-[#B78829]">
                <Utensils size={18} fill="#B78829" />
                <span className="font-bold text-sm">ความรู้และเคล็ดลับ</span>
             </div>
             
             <div className="bg-white/80 p-4 rounded-xl mb-3 border border-yellow-50">
                <h4 className="font-bold text-sm text-slate-800 mb-1">💡 เคล็ดลับประจำวัน</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                   การดื่มน้ำให้เพียงพอช่วยควบคุมระดับน้ำตาลในเลือดได้ดีขึ้น ลองตั้งเป้าดื่มให้ครบ 8 แก้วดูนะ!
                </p>
             </div>
             
             <button 
                onClick={() => navigate('/health')}
                className="flex items-center justify-end gap-1 text-[#8D6E33] text-xs font-bold ml-auto"
             >
                <span>อ่านต่อ</span>
                <ChevronRight size={14} />
             </button>
          </div>
        </div>
      </div>


        
      {/* Blood Sugar Modal */}
      {showBloodSugarModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-1">ระดับน้ำตาลในเลือด</h3>
            <p className="text-sm text-slate-400 mb-6">กรอกค่าระดับน้ำตาลในเลือดปัจจุบันของคุณ</p>
            
            <div className="relative mb-6">
              <input
                type="number"
                value={bloodSugarInput}
                onChange={(e) => {
                  setBloodSugarInput(e.target.value);
                  setBloodSugarError('');
                }}
                placeholder=""
                className="w-full px-4 py-3 pr-16 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">มก./ดล.</span>
            </div>
            {bloodSugarError && (
              <p className="text-sm text-red-500 mb-4">{bloodSugarError}</p>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBloodSugarModal(false);
                  setBloodSugarInput('');
                }}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-full hover:bg-slate-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  handleSaveBloodSugar();
                }}
                className="flex-1 bg-[#6CD2D9] text-white font-bold py-3 rounded-full hover:bg-[#5bc0c7] transition-colors"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
        
      {/* เรียกใช้ Nav Bar โดยส่ง prop activePage="home" */}
      <Navigation 
        activePage="home"
        historyState={{ carb_expect: userData?.carb_expect ?? null }}
      />

    </MobileLayout>
  );
};

const MealButton = ({ icon, label }) => (
  <button className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 active:bg-slate-50 transition-colors h-28 group">
    <div className="text-slate-400 group-hover:text-[#6CD2D9] transition-colors bg-slate-50 group-hover:bg-cyan-50 p-3 rounded-full">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className="text-xs font-bold text-slate-600">{label}</span>
  </button>
);

export default HomePage;