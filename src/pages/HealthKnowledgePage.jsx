import React from 'react';
import { 
  ChevronLeft, ChevronRight, PlusSquare, AlertCircle, 
  Utensils, Calculator, Activity 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


// Import Shared Components
import MobileLayout from '../components/MobileLayout';
import Navigation from '../components/Navigation';

const HealthKnowledgePage = () => {
  const navigate = useNavigate();
   const openReader = (topic) => {
      navigate(`/health/reader?topic=${topic}`);
   };
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
      <div className="bg-white p-4 pt-safe-top flex items-center justify-between sticky top-0 z-10 border-b border-slate-50">
         <button onClick={handleBack} className="p-2 -ml-2 text-slate-800 hover:bg-slate-50 rounded-full">
            <ChevronLeft size={24} />
         </button>
         <h1 className="text-lg font-bold text-slate-800">ความรู้สุขภาพ</h1>
         <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-6 pt-6 no-scrollbar bg-[#F8FAFC]">
        
        {/* Section 1: Diabetes Info */}
        <section>
           <SectionHeader title="โรคเบาหวาน" />
           <div className="space-y-3">
              <KnowledgeCard 
                icon={<PlusSquare size={24} className="text-[#6CD2D9]" />}
                iconBg="bg-cyan-50"
                title="ชนิดของเบาหวาน"
                subtitle="ทำความเข้าใจเบาหวานประเภทต่างๆ"
                        onClick={() => openReader('diabetes-types')}
              />
              {/* <KnowledgeCard 
                icon={<AlertCircle size={24} className="text-[#6CD2D9]" />}
                iconBg="bg-cyan-50"
                title="อาการและสัญญาณ"
                subtitle="สังเกตสัญญาณเตือนของโรค"
                        onClick={() => openReader('diabetes-signs')}
              /> */}
           </div>
        </section>

        {/* Section 2: Food */}
        <section>
           <SectionHeader title="อาหารที่ควรรับประทาน" />
           <div className="space-y-3">
              {/* <KnowledgeCard 
                icon={<Utensils size={24} className="text-[#6CD2D9]" />}
                iconBg="bg-cyan-50"
                title="หลักการทานอาหาร"
                subtitle="แนวทางการเลือกรับประทาน"
              /> */}
              <KnowledgeCard 
                icon={<Calculator size={24} className="text-[#6CD2D9]" />}
                iconBg="bg-cyan-50"
                title="การนับคาร์โบไฮเดรต"
                subtitle="เทคนิคควบคุมระดับน้ำตาล"
                        onClick={() => openReader('carb-counting')}
              />
           </div>
        </section>

        {/* Section 3: Exercise */}
        <section>
           <SectionHeader title="การออกกำลังกาย" />
           <div className="space-y-3">
              <KnowledgeCard 
                icon={<Activity size={24} className="text-[#6CD2D9]" />}
                iconBg="bg-cyan-50"
                title="การออกกำลังกาย"
                subtitle="แนวทางการออกกำลังกายที่เหมาะกับผู้ป่วยเบาหวาน"
                        onClick={() => openReader('exercise')}
              />
           </div>
        </section>

      </div>

      {/* Bottom Nav (สมมติว่าหน้านี้เข้าผ่านเมนู Home หรืออื่นๆ) */}
      <Navigation activePage="home" />
    </MobileLayout>
  );
};

// --- Sub-components ---
const SectionHeader = ({ title }) => (
  <div className="flex justify-between items-end mb-3 px-1">
     <h2 className="font-bold text-slate-800 text-base">{title}</h2>
     <button className="text-xs font-bold text-[#6CD2D9] flex items-center hover:underline">
        ดูเพิ่มเติม <ChevronRight size={14} />
     </button>
  </div>
);

const KnowledgeCard = ({ icon, iconBg, title, subtitle, onClick }) => (
   <button
      type="button"
      onClick={onClick}
      className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
   >
     <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
           {icon}
        </div>
        <div>
           <h3 className="font-bold text-slate-800 text-sm mb-0.5">{title}</h3>
           <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
        </div>
     </div>
     <ChevronRight size={20} className="text-slate-300" />
   </button>
);

export default HealthKnowledgePage;