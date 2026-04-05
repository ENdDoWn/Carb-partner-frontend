import React, { useMemo, useState } from 'react';
import { 
  ChevronLeft, Search, ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import Shared Components
import MobileLayout from '../components/MobileLayout';
import Navigation from '../components/Navigation';

const FindFoodPage = () => {
   const navigate = useNavigate();
   const [selectedType, setSelectedType] = useState('all');
   const [searchKeyword, setSearchKeyword] = useState('');

   const typeLabelMap = {
      rice_grain_flour: 'ข้าว แป้ง และธัญพืช',
      noodles: 'เส้นและก๋วยเตี๋ยว',
      fruits: 'ผลไม้',
      single_dish: 'อาหารจานเดียว',
      milk_snack: 'นมและขนม',
   };

   const handleBack = () => {
      if (window.history.length > 1) {
         navigate(-1);
      } else {
         navigate('/home');
      }
   };
  // Mock Data สำหรับรายการอาหาร
const foodItems = [
  // --- 1. หมวดข้าว แป้ง และธัญพืช (rice_grain_flour) ---
  { id: 1, name: "ข้าวซ้อมมือ / ข้าวขาว", detail: "55 กรัม (1 ทัพพี)", carb: "1", emoji: "🍚", type: "rice_grain_flour", bg: "bg-orange-100" },
  { id: 2, name: "ข้าวเหนียว", detail: "35 กรัม (1/2 ทัพพี)", carb: "1", emoji: "🌾", type: "rice_grain_flour", bg: "bg-orange-50" },
  { id: 3, name: "ขนมปังขาว / โฮลวีท", detail: "1 แผ่น (25-30 กรัม)", carb: "1", emoji: "🍞", type: "rice_grain_flour", bg: "bg-yellow-50" },
  { id: 4, name: "มันเทศ / มันฝรั่งต้ม", detail: "75-90 กรัม", carb: "1", emoji: "🍠", type: "rice_grain_flour", bg: "bg-purple-100" },
  { id: 5, name: "ข้าวโพดต้ม", detail: "1 ฝักเล็ก (100 กรัม)", carb: "1", emoji: "🌽", type: "rice_grain_flour", bg: "bg-yellow-100" },

  // --- 2. หมวดเส้นและก๋วยเตี๋ยว (noodles) ---
  { id: 6, name: "เส้นหมี่ / เส้นก๋วยเตี๋ยวสุก", detail: "70 กรัม (1 ทัพพี)", carb: "1", emoji: "🍜", type: "noodles", bg: "bg-yellow-50" },
  { id: 7, name: "วุ้นเส้นลวก", detail: "80 กรัม (1 ทัพพี)", carb: "1", emoji: "🍝", type: "noodles", bg: "bg-slate-50" },
  { id: 8, name: "เส้นขนมจีน", detail: "75 กรัม (1 จับ)", carb: "1", emoji: "🍥", type: "noodles", bg: "bg-gray-100" },
  { id: 9, name: "มักกะโรนี / พาสต้าสุก", detail: "70 กรัม", carb: "1", emoji: "🍝", type: "noodles", bg: "bg-amber-50" },

  // --- 3. หมวดผลไม้ (fruits) - เพิ่มเติมจากรูปภาพ ---
  { id: 10, name: "กล้วยน้ำว้า", detail: "1 ผล (45 กรัม)", carb: "1", emoji: "🍌", type: "fruits", bg: "bg-yellow-100" },
  { id: 11, name: "กล้วยหอม", detail: "1/2 ผลกลาง (50 กรัม)", carb: "1", emoji: "🍌", type: "fruits", bg: "bg-yellow-200" },
  { id: 12, name: "กีวี่", detail: "1 ผล (120 กรัม)", carb: "1", emoji: "🥝", type: "fruits", bg: "bg-green-100" },
  { id: 13, name: "แก้วมังกร", detail: "1/2 ผลกลาง (120 กรัม)", carb: "1", emoji: "🐉", type: "fruits", bg: "bg-pink-100" },
  { id: 14, name: "มะละกอสุก", detail: "8 ชิ้นคำ (115 กรัม)", carb: "1", emoji: "🥭", type: "fruits", bg: "bg-orange-100" },
  { id: 15, name: "แตงโม", detail: "8 ชิ้นคำ (285 กรัม)", carb: "1", emoji: "🍉", type: "fruits", bg: "bg-red-100" },
  { id: 16, name: "แอปเปิ้ล", detail: "1 ผลเล็ก (100 กรัม)", carb: "1", emoji: "🍎", type: "fruits", bg: "bg-red-50" },
  { id: 17, name: "ส้มเขียวหวาน", detail: "2 ผลกลาง (150 กรัม)", carb: "1", emoji: "🍊", type: "fruits", bg: "bg-orange-50" },
  { id: 18, name: "องุ่น", detail: "17 ผลเล็ก / 6 ผลใหญ่", carb: "1", emoji: "🍇", type: "fruits", bg: "bg-purple-50" },
  { id: 19, name: "ทุเรียน", detail: "1 เม็ดเล็ก (50 กรัม)", carb: "1", emoji: "🍈", type: "fruits", bg: "bg-yellow-50" },

  // --- 4. หมวดอาหารจานเดียว (single_dish) ---
  { id: 20, name: "ข้าวมันไก่", detail: "หนัก 245 กรัม", carb: 2.3, calories: "380 kcal", emoji: "🍗", type: "single_dish", bg: "bg-yellow-50" },
  { id: 21, name: "ข้าวหมูแดง", detail: "หนัก 250 กรัม", carb: 4, calories: "430 kcal", emoji: "🍛", type: "single_dish", bg: "bg-red-50" },
  { id: 22, name: "ผัดไทยใส่ไข่", detail: "หนัก 268 กรัม", carb: 3, calories: "600 kcal", emoji: "🍳", type: "single_dish", bg: "bg-orange-100" },
  { id: 23, name: "สุกี้ทะเล", detail: "หนัก 590 กรัม", carb: 1.7, calories: "235 kcal", emoji: "🍲", type: "single_dish", bg: "bg-blue-50" },
  { id: 24, name: "ก๋วยจั๊บ", detail: "หนัก 645 กรัม", carb: 2.3, calories: "490 kcal", emoji: "🍜", type: "single_dish", bg: "bg-stone-50" },

  // --- 5. หมวดนมและขนม (milk_snack) ---
  { id: 25, name: "นมสดจืดไขมันเต็มส่วน", detail: "1 แก้ว (240 มล.)", carb: 1, emoji: "🥛", type: "milk_snack", bg: "bg-blue-50" },
  { id: 26, name: "โยเกิร์ต 0% ไขมัน", detail: "1 ถ้วยเล็ก (110 กรัม)", carb: 1, emoji: "🍦", type: "milk_snack", bg: "bg-indigo-50" },
  { id: 27, name: "ขนมครก", detail: "3 คู่ (90 กรัม)", carb: 3, emoji: "🍮", type: "milk_snack", bg: "bg-yellow-50" },
  { id: 28, name: "โดนัทพอนเดอริงเกรซ", detail: "1 ชิ้น", carb: 2, emoji: "🍩", type: "milk_snack", bg: "bg-pink-50" },
  { id: 29, name: "ไอศกรีม", detail: "1/2 ถ้วยตวง", carb: 1, emoji: "🍦", type: "milk_snack", bg: "bg-cyan-50" }
];

   const filterOptions = useMemo(
      () => [
         { key: 'all', label: 'ทั้งหมด' },
         ...Object.entries(typeLabelMap).map(([key, label]) => ({ key, label })),
      ],
      []
   );

   const normalizedKeyword = searchKeyword.trim().toLowerCase();

   const filteredFoodItems = useMemo(() => {
      return foodItems.filter((item) => {
         const matchType = selectedType === 'all' || item.type === selectedType;

         if (!normalizedKeyword) {
            return matchType;
         }

         const searchTarget = `${item.name} ${item.detail} ${typeLabelMap[item.type] || ''}`.toLowerCase();
         const matchKeyword = searchTarget.includes(normalizedKeyword);

         return matchType && matchKeyword;
      });
   }, [selectedType, normalizedKeyword]);

  return (
    <MobileLayout>
      {/* Header */}
      <div className="bg-white p-4 pt-safe-top flex items-center justify-between sticky top-0 z-10">
         <button onClick={handleBack} className="p-2 -ml-2 text-slate-800 hover:bg-slate-50 rounded-full">
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
                     value={searchKeyword}
                     onChange={(event) => setSearchKeyword(event.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6CD2D9]"
           />
        </div>

        {/* Filter Chips (Horizontal Scroll) */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-2 touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
                {filterOptions.map((filter) => (
              <button 
                        key={filter.key}
                        onClick={() => setSelectedType(filter.key)}
         className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                           selectedType === filter.key
                    ? 'bg-[#6CD2D9] text-white shadow-md' 
                    : 'bg-cyan-50 text-[#55BCC3] hover:bg-cyan-100'
                }`}
              >
                        {filter.label}
              </button>
           ))}
        </div>

        {/* Popular Items Header */}
        <h2 className="font-bold text-slate-800 mb-4 text-base">รายการอาหารที่แนะนำ</h2>

        {/* Food List */}
        <div className="space-y-4">
           {filteredFoodItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors group">
                 <div className="flex items-center gap-4">
                    {/* Icon Circle */}
                    <div className={`w-14 h-14 ${item.bg} rounded-full flex items-center justify-center text-3xl shadow-sm`}>
                       {item.emoji}
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800 text-sm">{item.name}</h3>
                       <p className="text-xs text-slate-400">{item.detail}</p>
                       <p className="text-[11px] text-cyan-600 font-semibold mt-0.5">{typeLabelMap[item.type]}</p>
                    </div>
                 </div>
                 <button className="text-slate-300 group-hover:text-[#6CD2D9]">
                    <ChevronRight size={20} />
                 </button>
              </div>
           ))}

           {filteredFoodItems.length === 0 && (
             <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl">
               <p className="text-sm font-semibold text-slate-700">ไม่พบรายการอาหาร</p>
               <p className="text-xs text-slate-500 mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกประเภทอื่น</p>
             </div>
           )}
        </div>

      </div>

      <Navigation activePage="home" />
    </MobileLayout>
  );
};

export default FindFoodPage;