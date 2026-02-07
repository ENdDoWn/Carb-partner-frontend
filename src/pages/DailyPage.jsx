import React from 'react';
import { 
  Bell, User, Search, Plus, Home, BarChart2, ScanLine, History, ArrowRightLeft, 
  ChevronLeft, ChevronRight, Calendar, Clock, Utensils, Coffee, Sun, Moon, IceCream
} from 'lucide-react';

import Navigation from '../components/Navigation';
import MobileLayout from '../components/MobileLayout';

// --- Component: Circular Progress (Reusable) ---
const CircularProgress = ({ value, max, color, size = 120, strokeWidth = 10, label, subLabel, unit }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * 100;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        {/* Background Circle */}
        <circle cx="50%" cy="50%" r={radius} stroke="#E2E8F0" strokeWidth={strokeWidth} fill="transparent" strokeLinecap="round" />
        {/* Progress Circle */}
        <circle 
          cx="50%" cy="50%" r={radius} 
          stroke={color} strokeWidth={strokeWidth} fill="transparent" 
          strokeDasharray={circumference} 
          strokeDashoffset={dashOffset} 
          strokeLinecap="round" 
          className="transition-all duration-1000 ease-out" 
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold text-slate-800 leading-none">
          {value}<span className="text-lg align-baseline">{unit}</span>
        </span>
        {subLabel && <span className="text-[10px] text-slate-400 mt-1">{subLabel}</span>}
        {label && <span className="text-xs text-slate-500 font-medium">{label}</span>}
      </div>
    </div>
  );
};

// --- Main Page Component ---
const DailyLogPage = () => {
  return (
    <MobileLayout>
      {/* --- Top Bar --- */}
      <div className="bg-[#F8FAFC] px-4 pt-safe-top pb-2">
        <div className="flex items-center justify-between py-4">
          <button className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">บันทึกประจำวัน</h1>
          <button className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-full">
            <Calendar size={24} />
          </button>
        </div>
        
        {/* Date Navigator */}
        <div className="flex items-center justify-between px-8 pb-2">
          <button className="text-slate-400 hover:text-slate-600"><ChevronLeft size={20} /></button>
          <span className="font-bold text-slate-700">วันนี้, 26 ต.ค.</span>
          <button className="text-slate-400 hover:text-slate-600"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-4">
        
        {/* Card 1: Carb Progress */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">ความคืบหน้าวันนี้</h2>
          <div className="flex justify-center mb-6">
            <CircularProgress 
              value={120} max={200} color="#6CD2D9" 
              unit="g" 
              subLabel="ที่บริโภคแล้ว"
              size={140} strokeWidth={14}
            />
          </div>
          <div className="flex justify-between px-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 mb-1">เป้าหมาย</span>
              <span className="text-lg font-bold text-slate-800">200g</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 mb-1">คงเหลือ</span>
              <span className="text-lg font-bold text-slate-800">80g</span>
            </div>
          </div>
        </div>

        {/* Card 2: Blood Sugar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">ระดับน้ำตาลในเลือด</h2>
          <div className="flex justify-center mb-6">
             <CircularProgress 
              value={110} max={180} color="#FCD34D" // Yellow color
              label="mg/dL" 
              size={120} strokeWidth={12}
            />
          </div>
          
          <div className="space-y-4">
            {/* List Item 1 */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-slate-400 mt-1" />
                <div>
                  <p className="text-sm font-bold text-slate-700">ก่อนอาหารเช้า</p>
                  <p className="text-xs text-slate-400">07:05 น.</p>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-800">95 mg/dL.</span>
            </div>
            {/* List Item 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-slate-400 mt-1" />
                <div>
                  <p className="text-sm font-bold text-slate-700">หลังอาหารกลางวัน</p>
                  <p className="text-xs text-slate-400">13:30 น.</p>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-800">110 mg/dL.</span>
            </div>
          </div>
        </div>

        {/* Card 3: Breakfast (Full Detail) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-[#6CD2D9]">
              <Coffee size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">อาหารเช้า</h3>
              <p className="text-xs text-slate-400">คาร์บ 45g</p>
            </div>
          </div>
          
          {/* Food Items */}
          <div className="space-y-3 pl-2">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="mt-1"><Utensils size={14} className="text-slate-300" /></div>
                <div>
                  <p className="text-sm font-bold text-slate-700">ขนมปังปิ้งเนยถั่ว</p>
                  <p className="text-xs text-slate-400">2 แผ่น</p>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-800">45g</span>
            </div>
          </div>
        </div>

        {/* Card 4: Lunch (Full Detail) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
             <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-[#6CD2D9]">
              <Sun size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">อาหารกลางวัน</h3>
              <p className="text-xs text-slate-400">คาร์บ 75g</p>
            </div>
          </div>
          
          {/* Food Items */}
          <div className="space-y-3 pl-2">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="mt-1"><Utensils size={14} className="text-slate-300" /></div>
                <div>
                  <p className="text-sm font-bold text-slate-700">สลัดไก่</p>
                  <p className="text-xs text-slate-400">1 ชาม</p>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-800">25g</span>
            </div>
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                 <div className="mt-1"><Utensils size={14} className="text-slate-300" /></div>
                <div>
                  <p className="text-sm font-bold text-slate-700">น้ำส้มคั้น</p>
                  <p className="text-xs text-slate-400">1 แก้ว</p>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-800">50g</span>
            </div>
          </div>
        </div>

        {/* Card 5: Dinner (Empty State) */}
        <div className="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4 py-5">
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Moon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">อาหารเย็น</h3>
              <p className="text-xs text-slate-400">บันทึกมื้อเย็นเพื่อดูปริมาณคาร์บ</p>
            </div>
        </div>

        {/* Card 6: Snack (Empty State) */}
        <div className="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4 py-5">
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <IceCream size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">ของว่าง</h3>
              <p className="text-xs text-slate-400">ยังไม่มีบันทึกของว่าง</p>
            </div>
        </div>

      </div>

      {/* --- Active Page = 'stats' (2nd icon) --- */}
      <Navigation activePage="stats" />
    </MobileLayout>
  );
};

export default DailyLogPage;