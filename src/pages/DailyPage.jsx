import React, { useState, useEffect } from 'react';
import { 
  Bell, User, Search, Plus, Home, BarChart2, ScanLine, History, ArrowRightLeft, 
  ChevronLeft, ChevronRight, Calendar, Clock, Utensils, Coffee, Sun, Moon, IceCream, X
} from 'lucide-react';

import Navigation from '../components/Navigation';
import MobileLayout from '../components/MobileLayout';

// --- Thai month names ---
const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const thaiFullMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const thaiDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

// --- Mock data - dates with data ---
const datesWithData = ['2026-02-11', '2026-02-10', '2026-02-08', '2026-02-05'];

// --- Format date to string ---
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- Check if today ---
const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
};

// --- Calendar Popup Component ---
const CalendarPopup = ({ isOpen, onClose, selectedDate, onSelectDate }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  
  if (!isOpen) return null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  // First day of month
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  
  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Generate calendar days
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <h3 className="font-bold text-slate-800">{thaiFullMonths[month]} {year + 543}</h3>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {thaiDays.map((day, i) => (
            <div key={i} className="text-center text-xs font-bold text-slate-400 py-2">{day}</div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (!day) return <div key={i} />;
            
            const date = new Date(year, month, day);
            const dateKey = formatDateKey(date);
            const hasData = datesWithData.includes(dateKey);
            const isSelected = formatDateKey(selectedDate) === dateKey;
            const isTodayDate = isToday(date);
            
            return (
              <button
                key={i}
                onClick={() => {
                  onSelectDate(date);
                  onClose();
                }}
                className={`
                  relative h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${isSelected ? 'bg-[#6CD2D9] text-white' : isTodayDate ? 'bg-cyan-50 text-[#6CD2D9]' : 'text-slate-700 hover:bg-slate-100'}
                `}
              >
                {day}
                {hasData && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#6CD2D9]" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-slate-100 text-slate-700 font-bold py-3 rounded-full hover:bg-slate-200 transition-colors"
        >
          ปิด
        </button>
      </div>
    </div>
  );
};

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showCalendar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showCalendar]);

  // Check if selected date has data
  const hasData = datesWithData.includes(formatDateKey(selectedDate));

  // Navigate date
  const prevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  // Format display date
  const formatDisplayDate = () => {
    if (isToday(selectedDate)) {
      return `วันนี้, ${selectedDate.getDate()} ${thaiMonths[selectedDate.getMonth()]}`;
    }
    return `${selectedDate.getDate()} ${thaiMonths[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
  };

  return (
    <MobileLayout>
      {/* Calendar Popup */}
      <CalendarPopup 
        isOpen={showCalendar} 
        onClose={() => setShowCalendar(false)}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* --- Top Bar --- */}
      <div className="bg-[#F8FAFC] px-4 pt-safe-top pb-2">
        <div className="flex items-center justify-between py-4">
          <button className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">บันทึกประจำวัน</h1>
          <button 
            onClick={() => setShowCalendar(true)}
            className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-full"
          >
            <Calendar size={24} />
          </button>
        </div>
        
        {/* Date Navigator */}
        <div className="flex items-center justify-between px-8 pb-2">
          <button onClick={prevDay} className="text-slate-400 hover:text-slate-600"><ChevronLeft size={20} /></button>
          <span className="font-bold text-slate-700">{formatDisplayDate()}</span>
          <button onClick={nextDay} className="text-slate-400 hover:text-slate-600"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-4">
        
        {/* Card 1: Carb Progress */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">ความคืบหน้าวันนี้</h2>
          <div className="flex justify-center mb-6">
            <CircularProgress 
              value={hasData ? 120 : 0} max={200} color="#6CD2D9" 
              unit="g" 
              subLabel={hasData ? "ที่บริโภคแล้ว" : "-"}
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
              <span className="text-lg font-bold text-slate-800">{hasData ? '80g' : '-'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Blood Sugar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">ระดับน้ำตาลในเลือด</h2>
          <div className="flex justify-center mb-6">
             <CircularProgress 
              value={hasData ? 110 : 0} max={180} color="#FCD34D"
              label={hasData ? "mg/dL" : "-"}
              size={120} strokeWidth={12}
            />
          </div>
          
          {hasData ? (
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
          ) : (
            <div className="text-center text-slate-400 text-sm py-4">
              ไม่มีข้อมูลบันทึกในวันนี้
            </div>
          )}
        </div>

        {/* Card 3: Breakfast */}
        {hasData ? (
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
        ) : (
          <div className="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4 py-5">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Coffee size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">อาหารเช้า</h3>
              <p className="text-xs text-slate-400">-</p>
            </div>
          </div>
        )}

        {/* Card 4: Lunch */}
        {hasData ? (
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
        ) : (
          <div className="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4 py-5">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Sun size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">อาหารกลางวัน</h3>
              <p className="text-xs text-slate-400">-</p>
            </div>
          </div>
        )}

        {/* Card 5: Dinner (Empty State) */}
        <div className="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4 py-5">
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Moon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">อาหารเย็น</h3>
              <p className="text-xs text-slate-400">{hasData ? 'บันทึกมื้อเย็นเพื่อดูปริมาณคาร์บ' : '-'}</p>
            </div>
        </div>

        {/* Card 6: Snack (Empty State) */}
        <div className="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4 py-5">
           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <IceCream size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">ของว่าง</h3>
              <p className="text-xs text-slate-400">{hasData ? 'ยังไม่มีบันทึกของว่าง' : '-'}</p>
            </div>
        </div>

      </div>

      {/* --- Active Page = 'history' (4th icon) --- */}
      <Navigation activePage="history" />
    </MobileLayout>
  );
};

export default DailyLogPage;