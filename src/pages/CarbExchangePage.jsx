import React from 'react';
import { 
  ChevronLeft, Search, ArrowUpDown, Info 
} from 'lucide-react';

// Import Shared Components
import MobileLayout from '../components/MobileLayout';
import Navigation from '../components/Navigation';

const CarbExchangePage = () => {
  return (
    <MobileLayout>
      {/* --- Header --- */}
      <div className="bg-white p-4 pt-safe-top flex items-center justify-between sticky top-0 z-10">

         <h1 className="text-lg font-bold text-slate-800 text-center w-full">อัตราแลกเปลี่ยนคาร์บ</h1>
      </div>

      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-6 pt-4 no-scrollbar bg-[#F8FAFC]">
        
        {/* 1. Daily Carb Overview */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
           <div className="flex justify-between items-baseline mb-2">
              <h2 className="font-bold text-slate-800">ภาพรวมคาร์บประจำวัน</h2>
              <span className="text-xs font-bold text-[#6CD2D9] bg-cyan-50 px-2 py-1 rounded-lg">12 / 20 คาร์บ</span>
           </div>
           
           {/* Progress Bar */}
           <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[#6CD2D9] w-[60%] rounded-full"></div>
           </div>

           {/* Info Pill */}
           <div className="bg-cyan-50 text-[#55BCC3] text-xs font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2">
              คาร์โบไฮเดรต 15 กรัม = 1 คาร์บ
           </div>
        </div>

        {/* 2. Food Exchange Calculator */}
        <div>
           <h2 className="font-bold text-slate-800 mb-3 px-1">แลกเปลี่ยนอาหาร</h2>
           
           {/* Search Input */}
           <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                 type="text" 
                 defaultValue="ข้าว 1 จาน"
                 className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 text-slate-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6CD2D9]"
              />
           </div>

           {/* Swap Icon */}
           <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100 text-[#6CD2D9]">
                 <ArrowUpDown size={20} />
              </div>
           </div>

           {/* Result Box */}
           <div className="bg-slate-100 rounded-3xl p-5 pt-8 -mt-4">
              <p className="text-xs text-slate-500 font-medium mb-4 text-center">
                 เทียบเท่ากับ <strong className="text-slate-800">3 คาร์บ</strong> คุณสามารถแลกเปลี่ยนเป็น:
              </p>
              
              <div className="flex gap-3">
                 <div className="flex-1 bg-[#FFF9C4] p-4 rounded-xl border border-yellow-100 flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="text-2xl mb-1">🍞</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">ขนมปัง 2 แผ่น</span>
                 </div>
                 <div className="flex-1 bg-[#FFF9C4] p-4 rounded-xl border border-yellow-100 flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="text-2xl mb-1">🍌</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">กล้วยหอม 1 ลูกใหญ่</span>
                 </div>
              </div>
           </div>
        </div>

        {/* 3. Recommended Exchange Options */}
        <div>
           <h2 className="font-bold text-slate-800 mb-3 px-1">ตัวเลือกแลกเปลี่ยนแนะนำ</h2>
           <div className="grid grid-cols-2 gap-3">
              <RecommendationCard 
                 emoji="🍎" 
                 name="แอปเปิ้ล" 
                 carbCount="1 คาร์บ" 
              />
              <RecommendationCard 
                 emoji="🥛" 
                 name="นมไขมันต่ำ" 
                 carbCount="1 คาร์บ" 
              />
           </div>
        </div>

      </div>

      {/* Bottom Nav (Active = exchange) */}
      <Navigation activePage="exchange" />
    </MobileLayout>
  );
};

// --- Sub-components ---
const RecommendationCard = ({ emoji, name, carbCount }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-6">
     <span className="text-4xl mb-3">{emoji}</span>
     <h3 className="font-bold text-slate-800 text-sm">{name}</h3>
     <p className="text-xs text-slate-400">{carbCount}</p>
  </div>
);

export default CarbExchangePage;