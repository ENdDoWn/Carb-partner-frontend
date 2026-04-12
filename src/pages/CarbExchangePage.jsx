import React, { useEffect, useMemo, useState } from 'react';
import { 
   ChevronLeft, Search, ArrowUpDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import Shared Components
import MobileLayout from '../components/MobileLayout';
import Navigation from '../components/Navigation';
import { getUserInfo, getDailyCarbTotal } from '../Api/User';

const GRAMS_PER_CARB = 15;

const CarbExchangePage = () => {
   const navigate = useNavigate();

   const [dailyCarb, setDailyCarb] = useState({ used: 0, limit: 0 });

   useEffect(() => {
      const fetchDailyCarb = async () => {
         try {
            const [userInfo, dailyCarbTotal] = await Promise.all([
               getUserInfo(),
               getDailyCarbTotal(),
            ]);

            const user = userInfo?.user ?? userInfo;
            const carbExpectGram = Number(user?.carb_expect ?? user?.carbGoal ?? 0);
            const carbCurrentGram = Number(dailyCarbTotal?.totalCarb ?? 0);

            setDailyCarb({
               used: carbCurrentGram > 0 ? carbCurrentGram / GRAMS_PER_CARB : 0,
               limit: carbExpectGram > 0 ? carbExpectGram / GRAMS_PER_CARB : 0,
            });
         } catch (error) {
            setDailyCarb({ used: 0, limit: 0 });
         }
      };

      fetchDailyCarb();
   }, []);

   const remainingCarb = Math.max(dailyCarb.limit - dailyCarb.used, 0);
   const progressPercent = dailyCarb.limit > 0 ? Math.min((dailyCarb.used / dailyCarb.limit) * 100, 100) : 0;

   const foodItems = [
      { id: 1, name: 'ข้าวซ้อมมือ / ข้าวขาว', detail: '55 กรัม (1 ทัพพี)', carb: 1, emoji: '🍚', type: 'rice_grain_flour', bg: 'bg-orange-100' },
      { id: 2, name: 'ข้าวเหนียว', detail: '35 กรัม (1/2 ทัพพี)', carb: 1, emoji: '🌾', type: 'rice_grain_flour', bg: 'bg-orange-50' },
      { id: 3, name: 'ขนมปังขาว / โฮลวีท', detail: '1 แผ่น (25-30 กรัม)', carb: 1, emoji: '🍞', type: 'rice_grain_flour', bg: 'bg-yellow-50' },
      { id: 4, name: 'มันเทศ / มันฝรั่งต้ม', detail: '75-90 กรัม', carb: 1, emoji: '🍠', type: 'rice_grain_flour', bg: 'bg-purple-100' },
      { id: 5, name: 'ข้าวโพดต้ม', detail: '1 ฝักเล็ก (100 กรัม)', carb: 1, emoji: '🌽', type: 'rice_grain_flour', bg: 'bg-yellow-100' },
      { id: 6, name: 'เส้นหมี่ / เส้นก๋วยเตี๋ยวสุก', detail: '70 กรัม (1 ทัพพี)', carb: 1, emoji: '🍜', type: 'noodles', bg: 'bg-yellow-50' },
      { id: 7, name: 'วุ้นเส้นลวก', detail: '80 กรัม (1 ทัพพี)', carb: 1, emoji: '🍝', type: 'noodles', bg: 'bg-slate-50' },
      { id: 8, name: 'เส้นขนมจีน', detail: '75 กรัม (1 จับ)', carb: 1, emoji: '🍥', type: 'noodles', bg: 'bg-gray-100' },
      { id: 9, name: 'มักกะโรนี / พาสต้าสุก', detail: '70 กรัม', carb: 1, emoji: '🍝', type: 'noodles', bg: 'bg-amber-50' },
      { id: 10, name: 'กล้วยน้ำว้า', detail: '1 ผล (45 กรัม)', carb: 1, emoji: '🍌', type: 'fruits', bg: 'bg-yellow-100' },
      { id: 11, name: 'กล้วยหอม', detail: '1/2 ผลกลาง (50 กรัม)', carb: 1, emoji: '🍌', type: 'fruits', bg: 'bg-yellow-200' },
      { id: 12, name: 'กีวี่', detail: '1 ผล (120 กรัม)', carb: 1, emoji: '🥝', type: 'fruits', bg: 'bg-green-100' },
      { id: 13, name: 'แก้วมังกร', detail: '1/2 ผลกลาง (120 กรัม)', carb: 1, emoji: '🐉', type: 'fruits', bg: 'bg-pink-100' },
      { id: 14, name: 'มะละกอสุก', detail: '8 ชิ้นคำ (115 กรัม)', carb: 1, emoji: '🥭', type: 'fruits', bg: 'bg-orange-100' },
      { id: 15, name: 'แตงโม', detail: '8 ชิ้นคำ (285 กรัม)', carb: 1, emoji: '🍉', type: 'fruits', bg: 'bg-red-100' },
      { id: 16, name: 'แอปเปิ้ล', detail: '1 ผลเล็ก (100 กรัม)', carb: 1, emoji: '🍎', type: 'fruits', bg: 'bg-red-50' },
      { id: 17, name: 'ส้มเขียวหวาน', detail: '2 ผลกลาง (150 กรัม)', carb: 1, emoji: '🍊', type: 'fruits', bg: 'bg-orange-50' },
      { id: 18, name: 'องุ่น', detail: '17 ผลเล็ก / 6 ผลใหญ่', carb: 1, emoji: '🍇', type: 'fruits', bg: 'bg-purple-50' },
      { id: 19, name: 'ทุเรียน', detail: '1 เม็ดเล็ก (50 กรัม)', carb: 1, emoji: '🍈', type: 'fruits', bg: 'bg-yellow-50' },
      { id: 20, name: 'ข้าวมันไก่', detail: 'หนัก 245 กรัม', carb: 2.3, calories: '380 kcal', emoji: '🍗', type: 'single_dish', bg: 'bg-yellow-50' },
      { id: 21, name: 'ข้าวหมูแดง', detail: 'หนัก 250 กรัม', carb: 4, calories: '430 kcal', emoji: '🍛', type: 'single_dish', bg: 'bg-red-50' },
      { id: 22, name: 'ผัดไทยใส่ไข่', detail: 'หนัก 268 กรัม', carb: 3, calories: '600 kcal', emoji: '🍳', type: 'single_dish', bg: 'bg-orange-100' },
      { id: 23, name: 'สุกี้ทะเล', detail: 'หนัก 590 กรัม', carb: 1.7, calories: '235 kcal', emoji: '🍲', type: 'single_dish', bg: 'bg-blue-50' },
      { id: 24, name: 'ก๋วยจั๊บ', detail: 'หนัก 645 กรัม', carb: 2.3, calories: '490 kcal', emoji: '🍜', type: 'single_dish', bg: 'bg-stone-50' },
      { id: 25, name: 'นมสดจืดไขมันเต็มส่วน', detail: '1 แก้ว (240 มล.)', carb: 1, emoji: '🥛', type: 'milk_snack', bg: 'bg-blue-50' },
      { id: 26, name: 'โยเกิร์ต 0% ไขมัน', detail: '1 ถ้วยเล็ก (110 กรัม)', carb: 1, emoji: '🍦', type: 'milk_snack', bg: 'bg-indigo-50' },
      { id: 27, name: 'ขนมครก', detail: '3 คู่ (90 กรัม)', carb: 3, emoji: '🍮', type: 'milk_snack', bg: 'bg-yellow-50' },
      { id: 28, name: 'โดนัทพอนเดอริงเกรซ', detail: '1 ชิ้น', carb: 2, emoji: '🍩', type: 'milk_snack', bg: 'bg-pink-50' },
      { id: 29, name: 'ไอศกรีม', detail: '1/2 ถ้วยตวง', carb: 1, emoji: '🍦', type: 'milk_snack', bg: 'bg-cyan-50' },
   ];

   const [query, setQuery] = useState('');
   const [selectedFoodId, setSelectedFoodId] = useState(foodItems[0]?.id ?? null);

   const selectedFood = useMemo(
      () => foodItems.find((item) => item.id === selectedFoodId) ?? null,
      [selectedFoodId]
   );

   const selectedCarb = selectedFood ? Number(selectedFood.carb) : 0;
   const canExchange = selectedCarb <= remainingCarb;
   const normalizedQuery = query.trim().toLowerCase();

   const searchResults = useMemo(() => {
      if (!normalizedQuery) {
         return foodItems.slice(0, 8);
      }

      return foodItems
         .filter((item) => {
            const target = `${item.name} ${item.detail}`.toLowerCase();
            return target.includes(normalizedQuery);
         })
         .slice(0, 10);
   }, [normalizedQuery]);

   const exchangeOptions = useMemo(() => {
      if (!selectedFood || !canExchange) {
         return [];
      }

      return foodItems
         .filter((item) => item.id !== selectedFood.id)
         .map((item) => {
            const diff = Math.abs(Number(item.carb) - selectedCarb);
            const sameTypeBonus = item.type === selectedFood.type ? 0 : 0.2;
            return { ...item, score: diff + sameTypeBonus };
         })
         .sort((a, b) => a.score - b.score)
         .slice(0, 4);
   }, [selectedFood, selectedCarb, canExchange]);

   const recommendedOptions = useMemo(() => {
      if (!selectedFood) {
         return [];
      }

      return foodItems
         .filter((item) => item.id !== selectedFood.id && Number(item.carb) <= remainingCarb)
         .map((item) => {
            const carbGap = Math.abs(Number(item.carb) - selectedCarb);
            const priority = carbGap + (item.type === selectedFood.type ? 0 : 0.4);
            return { ...item, priority };
         })
         .sort((a, b) => a.priority - b.priority)
         .slice(0, 6);
   }, [selectedFood, selectedCarb, remainingCarb]);

   const handleBack = () => {
      if (window.history.length > 1) {
         navigate(-1);
      } else {
         navigate('/home');
      }
   };
  return (
    <MobileLayout>
      {/* --- Header --- */}
      <div className="bg-white p-4 pt-safe-top flex items-center justify-between sticky top-0 z-10">
         <button onClick={handleBack} className="p-2 -ml-2 text-slate-800 hover:bg-slate-50 rounded-full">
            <ChevronLeft size={24} />
         </button>
         <h1 className="text-lg font-bold text-slate-800 text-center w-full">อัตราแลกเปลี่ยนคาร์บ</h1>
         <div className="w-10"></div>
      </div>

      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-6 pt-4 no-scrollbar bg-[#F8FAFC]">
        
        {/* 1. Daily Carb Overview */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
           <div className="flex justify-between items-baseline mb-2">
              <h2 className="font-bold text-slate-800">ภาพรวมคาร์บประจำวัน</h2>
              <span className="text-xs font-bold text-[#6CD2D9] bg-cyan-50 px-2 py-1 rounded-lg">{dailyCarb.used.toFixed(1)} / {dailyCarb.limit.toFixed(1)} คาร์บ</span>
           </div>
           
           {/* Progress Bar */}
           <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div
                 className="h-full bg-[#6CD2D9] rounded-full"
                 style={{ width: `${progressPercent}%` }}
              ></div>
           </div>

           {/* Info Pill */}
           <div className="bg-cyan-50 text-[#55BCC3] text-xs font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2 px-3">
              เหลือวันนี้ {remainingCarb.toFixed(1)} คาร์บ | คาร์โบไฮเดรต 15 กรัม = 1 คาร์บ
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
                 value={query}
                 onChange={(event) => setQuery(event.target.value)}
                 placeholder="เช่น ข้าวมันไก่, กล้วย, ผัดไทย"
                 className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 text-slate-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6CD2D9]"
              />
           </div>

           <div className="bg-white border border-slate-100 rounded-2xl p-3 mb-4 max-h-48 overflow-y-auto no-scrollbar">
              <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-2">ผลการค้นหา</p>
              <div className="space-y-2">
                 {searchResults.map((item) => (
                    <button
                       key={item.id}
                       onClick={() => {
                          setSelectedFoodId(item.id);
                          setQuery(item.name);
                       }}
                       className={`w-full text-left flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                          selectedFoodId === item.id ? 'bg-cyan-50' : 'hover:bg-slate-50'
                       }`}
                    >
                       <div className="flex items-center gap-3">
                          <span className="text-xl">{item.emoji}</span>
                          <div>
                             <p className="text-sm font-bold text-slate-700">{item.name}</p>
                             <p className="text-xs text-slate-400">{item.detail}</p>
                          </div>
                       </div>
                       <span className="text-xs font-bold text-[#55BCC3]">{Number(item.carb).toFixed(1)} คาร์บ</span>
                    </button>
                 ))}

                 {searchResults.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-3">ไม่พบเมนูที่ค้นหา</p>
                 )}
              </div>
           </div>

           {/* Swap Icon */}
           <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100 text-[#6CD2D9]">
                 <ArrowUpDown size={20} />
              </div>
           </div>

           {/* Result Box */}
           <div className="bg-slate-100 rounded-3xl p-5 pt-8 -mt-4">
              {selectedFood && (
                 <>
                    <p className="text-xs text-slate-500 font-medium mb-2 text-center">
                       เมนูที่เลือก <strong className="text-slate-800">{selectedFood.name}</strong>
                    </p>
                    <p className="text-xs text-slate-500 font-medium mb-4 text-center">
                       ใช้ <strong className="text-slate-800">{selectedCarb.toFixed(1)} คาร์บ</strong>
                    </p>
                 </>
              )}

              {!canExchange && selectedFood && (
                 <div className="bg-rose-50 text-rose-600 text-xs font-semibold py-3 px-3 rounded-xl text-center mb-3">
                    เมนูนี้ใช้ {selectedCarb.toFixed(1)} คาร์บ แต่วันนี้เหลือ {remainingCarb.toFixed(1)} คาร์บ จึงยังแลกไม่ได้
                 </div>
              )}
              
              {canExchange && exchangeOptions.length > 0 && (
                 <div className="grid grid-cols-2 gap-3">
                    {exchangeOptions.map((item) => (
                       <div key={item.id} className="bg-[#FFF9C4] p-4 rounded-xl border border-yellow-100 flex flex-col items-center justify-center text-center shadow-sm">
                          <span className="text-2xl mb-1">{item.emoji}</span>
                          <span className="text-xs font-bold text-slate-700 leading-tight">{item.name}</span>
                          <span className="text-[11px] text-slate-500 mt-1">{Number(item.carb).toFixed(1)} คาร์บ</span>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>

        {/* 3. Recommended Exchange Options */}
        <div>
           <h2 className="font-bold text-slate-800 mb-3 px-1">ตัวเลือกแลกเปลี่ยนแนะนำ</h2>
           <div className="grid grid-cols-2 gap-3">
              {recommendedOptions.map((item) => (
                 <RecommendationCard
                    key={item.id}
                    emoji={item.emoji}
                    name={item.name}
                    carbCount={`${Number(item.carb).toFixed(1)} คาร์บ`}
                    detail={item.detail}
                    disabled={!canExchange}
                 />
              ))}
           </div>

           {recommendedOptions.length === 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl py-5 text-center text-xs text-slate-400">
                 ไม่มีเมนูแนะนำที่อยู่ในคาร์บคงเหลือ
              </div>
           )}
        </div>

      </div>

      {/* Bottom Nav (Active = exchange) */}
      <Navigation activePage="exchange" />
    </MobileLayout>
  );
};

// --- Sub-components ---
const RecommendationCard = ({ emoji, name, carbCount, detail, disabled }) => (
   <div className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-6 ${disabled ? 'opacity-50' : ''}`}>
     <span className="text-4xl mb-3">{emoji}</span>
     <h3 className="font-bold text-slate-800 text-sm">{name}</h3>
     <p className="text-xs text-slate-400">{carbCount}</p>
       <p className="text-[11px] text-slate-400 mt-1 text-center">{detail}</p>
  </div>
);

export default CarbExchangePage;