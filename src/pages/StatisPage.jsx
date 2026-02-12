import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, TrendingUp, TrendingDown,
  ChevronRight, MoreHorizontal 
} from 'lucide-react';

// Import Components ที่แยกไว้
import MobileLayout from '../components/MobileLayout';
import Navigation from '../components/Navigation';

// --- Components ย่อยสำหรับหน้านี้ ---

// 1. Tab Button (ปุ่มเลือกช่วงเวลา)
const TabButton = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
      active 
        ? 'bg-[#55BCC3] text-white shadow-md' 
        : 'text-slate-400 hover:bg-slate-50'
    }`}
  >
    {label}
  </button>
);

// 2. Stat Card (การ์ดแสดงตัวเลขเฉลี่ย)
const StatCard = ({ title, value, unit, trend, isPositive }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
    <h3 className="text-xs text-slate-500 font-bold">{title}</h3>
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-extrabold text-slate-800">{value}</span>
        <span className="text-xs text-slate-400 font-medium">{unit}</span>
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{trend}</span>
      </div>
    </div>
  </div>
);

// 3. Custom Line Chart (กราฟเส้นโค้ง SVG)
const CustomLineChart = ({ activeTab }) => {
  // Chart data for each tab
  const chartData = {
    วัน: {
      carbPath: "M10,100 C40,80 80,120 120,90 C160,60 200,100 240,80 C280,60 310,90 340,70",
      sugarPath: "M10,110 C40,90 80,130 120,100 C160,70 200,110 240,90 C280,70 310,100 340,80",
      tooltipPos: { cx: 170, cy: 70, tx: 140, ty: 40, value: "95 มก./ดล." },
      labels: [
        { x: 15, text: "6" },
        { x: 55, text: "9" },
        { x: 100, text: "12" },
        { x: 145, text: "15" },
        { x: 190, text: "18" },
        { x: 235, text: "21" },
        { x: 280, text: "24" },
        { x: 325, text: "น." }
      ]
    },
    สัปดาห์: {
      carbPath: "M10,110 C40,140 80,80 120,100 C160,120 200,60 240,60 C280,60 310,120 340,100",
      sugarPath: "M10,120 C50,60 90,80 130,100 C170,120 210,50 240,70 C280,100 310,140 340,120",
      tooltipPos: { cx: 215, cy: 55, tx: 185, ty: 25, value: "145 มก./ดล." },
      labels: [
        { x: 20, text: "จ." },
        { x: 70, text: "อ." },
        { x: 120, text: "พ." },
        { x: 170, text: "พฤ." },
        { x: 220, text: "ศ." },
        { x: 270, text: "ส." },
        { x: 320, text: "อา." }
      ]
    },
    เดือน: {
      carbPath: "M10,80 C50,100 90,60 130,90 C170,120 210,70 250,80 C290,90 310,60 340,50",
      sugarPath: "M10,90 C50,110 90,70 130,100 C170,130 210,80 250,90 C290,100 310,70 340,60",
      tooltipPos: { cx: 310, cy: 55, tx: 275, ty: 25, value: "110 มก./ดล." },
      labels: [
        { x: 25, text: "สัปดาห์ 1" },
        { x: 125, text: "สัปดาห์ 2" },
        { x: 225, text: "สัปดาห์ 3" },
        { x: 320, text: "สัปดาห์ 4" }
      ]
    }
  };

  const data = chartData[activeTab];

  return (
    <div className="w-full h-48 relative mt-4">
      <svg viewBox="0 0 350 180" className="w-full h-full overflow-visible">
        {/* Grid Lines (เส้นบรรทัดจางๆ) */}
        <line x1="0" y1="40" x2="350" y2="40" stroke="#F1F5F9" strokeWidth="1" />
        <line x1="0" y1="90" x2="350" y2="90" stroke="#F1F5F9" strokeWidth="1" />
        <line x1="0" y1="140" x2="350" y2="140" stroke="#F1F5F9" strokeWidth="1" />

        {/* --- Yellow Line (Carb) --- */}
        <path 
          d={data.carbPath}
          fill="none" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        />

        {/* --- Red Line (Sugar) --- */}
        <path 
          d={data.sugarPath}
          fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        />

        {/* Tooltip Dot & Label (จุดแดงและป้ายกำกับ) */}
        <circle cx={data.tooltipPos.cx} cy={data.tooltipPos.cy} r="4" fill="#EF4444" stroke="white" strokeWidth="2" />
        <g transform={`translate(${data.tooltipPos.tx}, ${data.tooltipPos.ty})`}>
          <rect x="0" y="0" width="70" height="22" rx="6" fill="#EF4444" />
          <text x="35" y="15" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{data.tooltipPos.value}</text>
          {/* Triangle pointing down */}
          <path d="M30,22 L35,27 L40,22 Z" fill="#EF4444" />
        </g>

        {/* X-Axis Labels */}
        <g className="text-[10px] fill-slate-400 font-medium" transform="translate(0, 170)">
          {data.labels.map((label, index) => (
            <text key={index} x={label.x} textAnchor="middle">{label.text}</text>
          ))}
        </g>
      </svg>
    </div>
  );
};

// --- Main Page Component ---
const StatsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('สัปดาห์');
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  return (
    <MobileLayout>
      
      {/* Header */}
      <div className="px-4 pt-safe-top pb-2 bg-white sticky top-0 z-20">
        <div className="flex items-center justify-between py-3">
          <button onClick={handleBack} className="p-2 -ml-2 text-slate-800 hover:bg-slate-50 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">สถิติ</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Tabs Segmented Control */}
        <div className="bg-slate-100 p-1 rounded-xl flex mb-2">
          <TabButton label="วัน" active={activeTab === 'วัน'} onClick={() => setActiveTab('วัน')} />
          <TabButton label="สัปดาห์" active={activeTab === 'สัปดาห์'} onClick={() => setActiveTab('สัปดาห์')} />
          <TabButton label="เดือน" active={activeTab === 'เดือน'} onClick={() => setActiveTab('เดือน')} />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-4 pt-2 no-scrollbar bg-[#F8FAFC]">
        
        {/* 1. Main Chart Card */}
        <div className="bg-white p-5 rounded-3xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="font-bold text-slate-800 text-lg">แนวโน้มราย{activeTab}</h2>
              <p className="text-xs text-slate-400">เทียบกับ{activeTab === 'วัน' ? 'เมื่อวาน' : activeTab === 'สัปดาห์' ? 'สัปดาห์ที่แล้ว' : 'เดือนที่แล้ว'}</p>
            </div>
            {/* Legend */}
            <div className="flex gap-3 text-xs font-bold text-slate-600">
               <div className="flex items-center gap-1">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                 <span>น้ำตาล</span>
               </div>
               <div className="flex items-center gap-1">
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                 <span>คาร์บ</span>
               </div>
            </div>
          </div>
          
          <CustomLineChart activeTab={activeTab} />
        </div>

        {/* 2. Summary Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            title="ระดับน้ำตาลในเลือดเฉลี่ย"
            value="120"
            unit="มก./ดล."
            trend="+2%"
            isPositive={true}
          />
          <StatCard 
            title="ปริมาณคาร์บเฉลี่ย"
            value="150"
            unit="ก."
            trend="-3%"
            isPositive={false}
          />
        </div>

        {/* 3. Target Success Card */}
        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center gap-4">
          {/* Donut Chart Mini */}
          <div className="relative w-16 h-16 shrink-0">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="28" stroke="#E2E8F0" strokeWidth="6" fill="transparent" />
                <circle cx="50%" cy="50%" r="28" stroke="#55BCC3" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset="26" strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-slate-800">
               85%
             </div>
          </div>
          
          <div>
             <h3 className="font-bold text-slate-800">อยู่ในเกณฑ์เป้าหมาย</h3>
             <div className="flex items-center gap-1 text-xs font-bold text-green-500 mt-1">
                <TrendingUp size={14} />
                <span>+5% เทียบกับ{activeTab === 'วัน' ? 'เมื่อวาน' : activeTab === 'สัปดาห์' ? 'สัปดาห์ที่แล้ว' : 'เดือนที่แล้ว'}</span>
             </div>
          </div>
        </div>

        {/* 4. Weekly Carb Goal Card */}
        <div className="bg-white p-5 rounded-3xl shadow-sm mb-4">
           <div className="flex justify-between items-end mb-2">
              <h3 className="font-bold text-slate-800">เป้าหมายคาร์บราย{activeTab}</h3>
              <div className="text-xs">
                 <span className="font-bold text-slate-800">250ก.</span>
                 <span className="text-slate-400"> / 400ก.</span>
              </div>
           </div>
           
           {/* Linear Progress Bar */}
           <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#55BCC3] w-[62%] rounded-full"></div>
           </div>
        </div>

      </div>

      {/* Navigation (Active = stats) */}
      <Navigation activePage="stats" />

    </MobileLayout>
  );
};

export default StatsPage;