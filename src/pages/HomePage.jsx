import React from 'react';
import { 
  Bell, User, Search, Droplet, ChevronRight, 
  Coffee, Sun, Moon, IceCream, Utensils 
} from 'lucide-react';

import Navigation from '../components/Navigation';
import MobileLayout from '../components/MobileLayout';

const HomePage = () => {
  const userData = {
    name: "จอห์น โด",
    date: "อังคาร, 26 พ.ย.",
    carbCurrent: 120,
    carbTarget: 200,
    bloodSugar: 115,
    bloodSugarStatus: "คงที่",
    lastCheck: "08:45 น."
  };

  // Logic คำนวณวงกลม
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (userData.carbCurrent / userData.carbTarget) * 100;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <MobileLayout>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-28 no-scrollbar">
        
        {/* Header Section */}
        <div className="bg-white p-6 pb-4 rounded-b-3xl shadow-sm pt-safe-top relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white overflow-hidden border-2 border-white shadow-sm">
                 <User size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">สวัสดีตอนเช้า,</h1>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">{userData.name}</h2>
                <p className="text-xs text-slate-500 mt-1">{userData.date}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 border border-slate-100 active:bg-slate-100">
                 <User size={20} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 border border-slate-100 relative active:bg-slate-100">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>

          {/* Carb Ring */}
          <div className="flex justify-center my-4 relative">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r={radius} stroke="#E2E8F0" strokeWidth="12" fill="transparent" strokeLinecap="round" />
                <circle cx="50%" cy="50%" r={radius} stroke="#6CD2D9" strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{userData.carbCurrent}ก.</span>
                <span className="text-xs text-slate-400 font-medium mt-1">จากเป้าหมาย {userData.carbTarget}ก.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="px-5 mt-6 space-y-6">
          
          {/* Search Bar */}
          <button className="w-full bg-gradient-to-r from-[#7ddce3] to-[#5fb4bb] p-4 rounded-2xl flex items-center justify-between text-white shadow-md active:scale-[0.98] transition-transform">
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
                 <span className="text-sm font-bold text-slate-600">น้ำตาลในเลือด</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                 <span className="text-3xl font-extrabold text-slate-900">{userData.bloodSugar}</span>
                 <span className="text-xs font-bold text-slate-400">มก./ดล.</span>
                 <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-[10px] font-bold">
                   {userData.bloodSugarStatus}
                 </span>
              </div>
              <p className="text-[10px] text-slate-400 mb-4">ล่าสุดเมื่อ {userData.lastCheck}</p>
              <button className="bg-[#55BCC3] text-white px-5 py-2 rounded-full text-xs font-bold shadow-sm active:bg-[#4aaeb5]">
                บันทึกกลูโคส
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
             <MealButton icon={<IceCream />} label="ของว่าง" />
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
             
             <div className="flex items-center justify-end gap-1 text-[#8D6E33] text-xs font-bold">
                <span>อ่านต่อ</span>
                <ChevronRight size={14} />
             </div>
          </div>
        </div>
      </div>


        
      {/* เรียกใช้ Nav Bar โดยส่ง prop activePage="home" */}
      <Navigation activePage="home" />

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