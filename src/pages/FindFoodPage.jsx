import React from 'react';
import { 
  ChevronLeft, Search, ChevronRight 
} from 'lucide-react';

// Import Shared Components
import MobileLayout from '../components/MobileLayout';
import Navigation from '../components/Navigation';

const FindFoodPage = () => {
  // Mock Data สำหรับรายการอาหาร
  const foodItems = [
    { id: 1, name: "แอปเปิ้ล", detail: "1 ลูกกลาง (182 กรัม)", emoji: "🍎", bg: "bg-red-100" },
    { id: 2, name: "กล้วยหอม", detail: "1 ลูกกลาง (118 กรัม)", emoji: "🍌", bg: "bg-yellow-100" },
    { id: 3, name: "ข้าวกล้อง", detail: "1 ถ้วยหุงสุก (195 กรัม)", emoji: "🍚", bg: "bg-orange-100" },
    { id: 4, name: "อกไก่", detail: "100 กรัม, ย่าง", emoji: "🍗", bg: "bg-orange-50" },
    { id: 5, name: "บร็อคโคลี", detail: "1 ถ้วยหั่น (91 กรัม)", emoji: "🥦", bg: "bg-green-100" },
    { id: 6, name: "อัลมอนด์", detail: "1/4 ถ้วย (28 กรัม)", emoji: "🌰", bg: "bg-amber-100" },
  ];

  // Filter Chips
  const filters = ["ทั้งหมด", "ล่าสุด", "ผลไม้", "ผัก", "เนื้อสัตว์", "นมและผลิตภัณฑ์นม", "ของว่าง", "เครื่องดื่ม", "ขนมหวาน"];

  return (
    <MobileLayout>
      {/* Header */}
      <div className="bg-white p-4 pt-safe-top flex items-center justify-between sticky top-0 z-10">
         <button className="p-2 -ml-2 text-slate-800 hover:bg-slate-50 rounded-full">
            <ChevronLeft size={24} />
         </button>
         <h1 className="text-lg font-bold text-slate-800">ค้นหาอาหาร</h1>
         <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-2 no-scrollbar bg-white">
        
        {/* Search Bar */}
        <div className="relative mb-6">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
           <input 
              type="text" 
              placeholder="ค้นหาอาหาร..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6CD2D9]"
           />
        </div>

        {/* Filter Chips (Horizontal Scroll) */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-2">
           {filters.map((filter, index) => (
              <button 
                key={index}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  index === 0 
                    ? 'bg-[#6CD2D9] text-white shadow-md' 
                    : 'bg-cyan-50 text-[#55BCC3] hover:bg-cyan-100'
                }`}
              >
                {filter}
              </button>
           ))}
        </div>

        {/* Popular Items Header */}
        <h2 className="font-bold text-slate-800 mb-4 text-base">รายการยอดนิยม</h2>

        {/* Food List */}
        <div className="space-y-4">
           {foodItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors group">
                 <div className="flex items-center gap-4">
                    {/* Icon Circle */}
                    <div className={`w-14 h-14 ${item.bg} rounded-full flex items-center justify-center text-3xl shadow-sm`}>
                       {item.emoji}
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800 text-sm">{item.name}</h3>
                       <p className="text-xs text-slate-400">{item.detail}</p>
                    </div>
                 </div>
                 <button className="text-slate-300 group-hover:text-[#6CD2D9]">
                    <ChevronRight size={20} />
                 </button>
              </div>
           ))}
        </div>

      </div>

      <Navigation activePage="home" />
    </MobileLayout>
  );
};

export default FindFoodPage;