import React from 'react';
import { 
  ChevronLeft, Droplet, Flame, Zap, Dumbbell, 
  CheckCircle2, Info, Utensils
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import MobileLayout from '../components/MobileLayout';

const FoodDetailsPage = () => {
   const navigate = useNavigate();
   const handleBack = () => {
      if (window.history.length > 1) {
         navigate(-1);
      } else {
         navigate('/home');
      }
   };
  return (
    <MobileLayout>
      
      {/* --- Image Banner Area --- */}
      <div className="relative w-full h-64 bg-gray-100">
         {/* Background Image Placeholder */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-0"></div>
         <img 
            src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Apple"
            className="w-full h-full object-cover"
         />
         
         {/* Top Navigation Overlay */}
         <div className="absolute top-0 left-0 w-full p-4 pt-safe-top z-10 flex justify-between items-center">
            <button onClick={handleBack} className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-800 hover:bg-white shadow-sm">
               <ChevronLeft size={24} />
            </button>
         </div>

         {/* Category Badge (Floating) */}
         <div className="absolute bottom-4 right-4 bg-[#FCD34D] w-12 h-12 rounded-full flex items-center justify-center text-slate-800 shadow-lg z-10 border-2 border-white">
            <Utensils size={20} />
         </div>
      </div>

      {/* --- Content Card (Curved Top) --- */}
      <div className="flex-1 bg-white -mt-6 rounded-t-3xl relative z-0 px-6 pt-8 pb-10 overflow-y-auto no-scrollbar">
         
         {/* Title Section */}
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Apple</h1>
            <p className="text-sm text-slate-400 font-medium">Food Details</p>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard 
               icon={<Zap size={20} className="text-[#6CD2D9]" />}
               label="Carbs"
               value="14g"
               color="bg-cyan-50"
            />
            <StatCard 
               icon={<Flame size={20} className="text-orange-400" />}
               label="Calories"
               value="52 kcal"
               color="bg-orange-50"
            />
            <StatCard 
               icon={<Droplet size={20} className="text-blue-400" />}
               label="Fat"
               value="0.2g"
               color="bg-blue-50"
            />
            <StatCard 
               icon={<Dumbbell size={20} className="text-purple-400" />}
               label="Protein"
               value="0.3g"
               color="bg-purple-50"
            />
         </div>

         {/* General Information */}
         <div className="mb-6">
            <h2 className="font-bold text-slate-800 mb-2">General Information</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
               Apples are a popular fruit containing antioxidants, vitamins, dietary fiber, and a range of other nutrients. Due to their varied nutrient content, they may help prevent several health conditions.
            </p>
         </div>

         {/* Recommendations & Tips */}
         <div className="space-y-3 pb-8">
            <h2 className="font-bold text-slate-800 mb-1">Recommendations & Tips</h2>
            
            {/* Tip 1 (Green) */}
            <div className="bg-[#E6F4EA] p-4 rounded-2xl flex gap-3 items-start">
               <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={20} />
               <p className="text-xs text-green-800 leading-relaxed font-medium">
                  A great source of fiber, which can help stabilize blood sugar. Consider pairing with a protein source like nuts or cheese.
               </p>
            </div>

            {/* Tip 2 (Blue) */}
            <div className="bg-[#E3F2FD] p-4 rounded-2xl flex gap-3 items-start">
               <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
               <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  Contains natural sugars. Best consumed in moderation or as part of a balanced meal to manage glucose levels effectively.
               </p>
            </div>
         </div>
         
         {/* Add Button */}
         <button className="w-full bg-[#6CD2D9] hover:bg-[#5bc0c7] text-white font-bold py-4 rounded-full shadow-lg transition duration-200 text-lg">
            Add to Diary
         </button>

      </div>
    </MobileLayout>
  );
};

// --- Sub-component for Stats ---
const StatCard = ({ icon, label, value, color }) => (
   <div className="border border-slate-100 p-4 rounded-2xl flex flex-col gap-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
         {icon}
      </div>
      <div>
         <p className="text-lg font-bold text-slate-800">{value}</p>
         <p className="text-xs text-slate-400">{label}</p>
      </div>
   </div>
);

export default FoodDetailsPage;