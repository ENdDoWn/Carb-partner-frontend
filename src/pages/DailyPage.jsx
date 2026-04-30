import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar, Clock, Utensils, Coffee, Sun, Moon, IceCream
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import Navigation from '../components/Navigation';
import MobileLayout from '../components/MobileLayout';
import { getDailyTotalsByDate } from '../Api/History';
import { getDailyCarbTotal, getUserInfo } from '../Api/User';

// --- Thai month names ---
const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const thaiFullMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const thaiDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

const MEAL_SECTIONS = [
  { key: 'breakfast', label: 'อาหารเช้า', icon: Coffee, placeholder: 'ยังไม่มีบันทึกมื้อนี้' },
  { key: 'lunch', label: 'อาหารกลางวัน', icon: Sun, placeholder: 'ยังไม่มีบันทึกมื้อนี้' },
  { key: 'dinner', label: 'อาหารเย็น', icon: Moon, placeholder: 'บันทึกมื้อเย็นเพื่อดูปริมาณคาร์บ' },
  { key: 'snack', label: 'ของว่าง', icon: IceCream, placeholder: 'ยังไม่มีบันทึกของว่าง' },
];

// --- Format date to string ---
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate > today;
};

// --- Check if today ---
const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
};

const isRecordHasData = (record) => {
  if (!record) return false;

  const hasMealItems = (record.meals ?? []).some((meal) => (meal.items ?? []).length > 0);
  const hasBloodSugarLogs = (record.bloodSugarLogs ?? []).length > 0;
  const hasCarbProgress = (record.summary?.carbConsumed ?? 0) > 0;
  const hasBloodSugarProgress = (record.summary?.bloodSugarCurrent ?? 0) > 0;

  return hasMealItems || hasBloodSugarLogs || hasCarbProgress || hasBloodSugarProgress;
};

const formatToTwoDecimals = (value) => {
  if (!Number.isFinite(value)) return '-';
  return Number(value.toFixed(2)).toString();
};

const formatBloodSugarTime = (rawTime) => {
  if (!rawTime) return '-';
  const parsed = new Date(rawTime);
  if (Number.isNaN(parsed.getTime())) {
    return String(rawTime);
  }
  return parsed.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
};

const toBloodSugarLogs = (payload, dateKey) => {
  const rawLogs = payload?.bloodSugarLogs
    ?? payload?.blood_sugar_logs
    ?? payload?.bloodSugarHistory
    ?? payload?.blood_sugar_report
    ?? [];

  if (Array.isArray(rawLogs) && rawLogs.length > 0) {
    return rawLogs
      .map((log, index) => {
        const value = Number(log?.value ?? log?.sugar_level ?? log?.bloodSugar ?? log?.blood_sugar);
        if (!Number.isFinite(value) || value <= 0) return null;

        return {
          id: log?.id ?? `${dateKey}-bg-${index}`,
          label: log?.label ?? log?.title ?? 'บันทึกระดับน้ำตาล',
          time: log?.time ?? formatBloodSugarTime(log?.created_at ?? log?.timestamp),
          value,
          unit: log?.unit ?? 'mg/dL',
        };
      })
      .filter(Boolean);
  }

  const summaryValue = Number(payload?.totalBloodSugar ?? payload?.bloodSugarCurrent ?? payload?.blood_sugar_current);
  if (Number.isFinite(summaryValue) && summaryValue > 0) {
    return [{
      id: `${dateKey}-bg-summary`,
      label: 'บันทึกล่าสุด',
      time: '-',
      value: summaryValue,
      unit: 'mg/dL',
    }];
  }

  return [];
};

const toMealSections = (payload, dateKey) => {
  const rawLogs = payload?.carbLogs
    ?? payload?.carb_logs
    ?? payload?.carbHistory
    ?? payload?.carb_history
    ?? [];

  if (!Array.isArray(rawLogs) || rawLogs.length === 0) return [];

  const grouped = rawLogs.reduce((acc, log, index) => {
    const mealKey = log?.meal_key ?? log?.mealKey;
    if (!mealKey) return acc;

    const carbValue = Number(log?.carb ?? log?.carb_amount ?? log?.carbAmount);
    if (!Number.isFinite(carbValue)) return acc;

    const amount = Number(log?.amount ?? 1);
    const portion = Number.isFinite(amount) && amount > 0 ? `${amount} ที่` : '-';

    const item = {
      id: log?.id ?? `${dateKey}-meal-${mealKey}-${index}`,
      name: log?.food_type ?? log?.foodType ?? 'รายการอาหาร',
      portion,
      carb: carbValue,
    };

    if (!acc[mealKey]) {
      acc[mealKey] = { key: mealKey, items: [], totalCarb: 0 };
    }

    acc[mealKey].items.push(item);
    acc[mealKey].totalCarb = Number((acc[mealKey].totalCarb + carbValue).toFixed(2));
    return acc;
  }, {});

  return Object.values(grouped);
};

// --- Calendar Popup Component ---
const CalendarPopup = ({ isOpen, onClose, selectedDate, onSelectDate, datesWithData }) => {
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
            const isFuture = isFutureDate(date);
            
            return (
              <button
                key={i}
                onClick={() => {
                  if (isFuture) return;
                  onSelectDate(date);
                  onClose();
                }}
                disabled={isFuture}
                className={`
                  relative h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${isFuture ? 'text-slate-300 cursor-not-allowed' : isSelected ? 'bg-[#6CD2D9] text-white' : isTodayDate ? 'bg-cyan-50 text-[#6CD2D9]' : 'text-slate-700 hover:bg-slate-100'}
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
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [dailyHistoryData, setDailyHistoryData] = useState({ days: [] });
  const [isLoadingDaily, setIsLoadingDaily] = useState(true);
  const [dailyError, setDailyError] = useState('');
  const selectedDateKey = formatDateKey(selectedDate);
  const carbExpectFromHome = location.state?.carb_expect ?? location.state?.carbGoal ?? null;

  const [carbExpectFromUser, setCarbExpectFromUser] = useState(null);
  const [dailyCarbTotal, setDailyCarbTotal] = useState(null);

  const toDailyRecord = (payload, dateKey, userCarbExpect, dailyTotalCarb) => ({
    date: dateKey,
    summary: {
      carbConsumed: Number.isFinite(dailyTotalCarb) ? dailyTotalCarb : (payload?.totalCarb ?? 0),
      carb_expect: userCarbExpect ?? carbExpectFromHome,
      bloodSugarCurrent: payload?.totalBloodSugar ?? 0,
      bloodSugarMax: 180,
    },
    bloodSugarLogs: toBloodSugarLogs(payload, dateKey),
    meals: toMealSections(payload, dateKey),
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDaily = async () => {
      setIsLoadingDaily(true);
      setDailyError('');

      try {
        const [data, userInfo] = await Promise.all([
          getDailyTotalsByDate(selectedDate),
          getUserInfo(),
        ]);
        console.log('Fetched daily totals:', data);
        if (!isMounted) return;

        const user = userInfo?.user ?? userInfo;
        const userCarbExpect = user?.carb_expect ?? user?.carbGoal ?? null;
        const dailyTotalCarb = Number(data?.totalCarb);
        setCarbExpectFromUser(userCarbExpect);
        setDailyCarbTotal(Number.isFinite(dailyTotalCarb) ? dailyTotalCarb : null);

        setDailyHistoryData((prev) => {
          const nextRecord = toDailyRecord(data, selectedDateKey, userCarbExpect, dailyTotalCarb);
          const filtered = (prev?.days ?? []).filter((day) => day.date !== selectedDateKey);
          return {
            days: [...filtered, nextRecord],
          };
        });
      } catch (error) {
        console.error('Failed to fetch daily totals:', error);
        if (isMounted) {
          setDailyError('ไม่สามารถโหลดข้อมูลรายวันได้ กรุณาลองใหม่อีกครั้ง');
        }
      } finally {
        if (isMounted) {
          setIsLoadingDaily(false);
        }
      }
    };

    fetchDaily();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedDateKey, carbExpectFromHome]);

  // TODO(backend): เพิ่มรายการอาหารรายมื้อใน response เพื่อแสดง meals และ items บนหน้านี้

  const dailyHistoryList = dailyHistoryData?.days ?? [];
  const datesWithData = dailyHistoryList.filter(isRecordHasData).map((day) => day.date);
  const selectedRecord = dailyHistoryList.find((day) => day.date === selectedDateKey) ?? null;
  const hasData = isRecordHasData(selectedRecord);

  const summary = selectedRecord?.summary ?? {
    carbConsumed: dailyCarbTotal ?? 0,
    carb_expect: carbExpectFromUser ?? carbExpectFromHome,
    bloodSugarCurrent: 0,
    bloodSugarMax: 180,
  };

  const carbExpect = summary.carb_expect ?? summary.carbGoal ?? carbExpectFromHome ?? null;
  const carbRemaining = carbExpect != null ? Math.max(carbExpect - (summary.carbConsumed ?? 0), 0) : null;
  const bloodSugarLogs = selectedRecord?.bloodSugarLogs ?? [];
  const mealMap = Object.fromEntries((selectedRecord?.meals ?? []).map((meal) => [meal.key, meal]));
  const mealSections = MEAL_SECTIONS.map((section) => {
    const meal = mealMap[section.key] ?? { items: [], totalCarb: 0 };
    return {
      ...section,
      totalCarb: meal.totalCarb ?? 0,
      items: meal.items ?? [],
    };
  });

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

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

  // Navigate date
  const prevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const nextDay = () => {
    if (isToday(selectedDate)) {
      return;
    }

    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    if (isFutureDate(newDate)) {
      return;
    }
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
        datesWithData={datesWithData}
      />

      {/* --- Top Bar --- */}
      <div className="bg-[#F8FAFC] px-4 pt-safe-top pb-2">
        <div className="flex items-center justify-between py-4">
          <button onClick={handleBack} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-800 text-center w-full">บันทึกประจำวัน</h1>
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
        {isLoadingDaily && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-sm text-slate-500">
            กำลังโหลดข้อมูลรายวัน...
          </div>
        )}

        {dailyError && (
          <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-sm text-red-600">
            {dailyError}
          </div>
        )}
        
        {/* Card 1: Carb Progress */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">ความคืบหน้าวันนี้</h2>
          <div className="flex justify-center mb-6">
            <CircularProgress 
              value={summary.carbConsumed} max={carbExpect || 200} color="#6CD2D9" 
              unit="g" 
              subLabel={hasData ? 'ที่บริโภคแล้ว' : 'ยังไม่มีข้อมูล'}
              size={140} strokeWidth={14}
            />
          </div>
          <div className="flex justify-between px-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 mb-1">เป้าหมาย</span>
              <span className="text-lg font-bold text-slate-800">{carbExpect != null ? `${carbExpect}g` : '-'}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400 mb-1">คงเหลือ</span>
              <span className="text-lg font-bold text-slate-800">{hasData && carbRemaining != null ? `${formatToTwoDecimals(carbRemaining)}g` : '-'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Blood Sugar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">ระดับน้ำตาลในเลือด</h2>
          <div className="flex justify-center mb-6">
             <CircularProgress 
              value={summary.bloodSugarCurrent} max={summary.bloodSugarMax || 180} color="#FCD34D"
              label={hasData ? 'mg/dL' : '-'}
              size={120} strokeWidth={12}
            />
          </div>
          
          {bloodSugarLogs.length > 0 ? (
            <div className="space-y-4">
              {bloodSugarLogs.map((log, index) => (
                <div key={log.id ?? `${selectedDateKey}-bg-${index}`} className={`flex items-center justify-between ${index !== bloodSugarLogs.length - 1 ? 'border-b border-slate-50 pb-3' : ''}`}>
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-slate-400 mt-1" />
                    <div>
                      <p className="text-sm font-bold text-slate-700">{log.label}</p>
                      <p className="text-xs text-slate-400">{log.time}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{log.value} {log.unit}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 text-sm py-4">
              ไม่มีข้อมูลบันทึกในวันนี้
            </div>
          )}
        </div>

        {mealSections.map((meal) => {
          const Icon = meal.icon;
          const hasMealItems = meal.items.length > 0;

          return hasMealItems ? (
            <div key={meal.key} className="bg-white rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-[#6CD2D9]">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{meal.label}</h3>
                  <p className="text-xs text-slate-400">คาร์บ {meal.totalCarb}g</p>
                </div>
              </div>

              <div className="space-y-3 pl-2">
                {meal.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="mt-1"><Utensils size={14} className="text-slate-300" /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.portion}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{item.carb}g</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div key={meal.key} className="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4 py-5">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{meal.label}</h3>
                <p className="text-xs text-slate-400">{hasData ? meal.placeholder : '-'}</p>
              </div>
            </div>
          );
        })}

      </div>

      {/* --- Active Page = 'history' (4th icon) --- */}
      <Navigation activePage="history" />
    </MobileLayout>
  );
};

export default DailyLogPage;