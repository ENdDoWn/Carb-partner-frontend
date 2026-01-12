import React, { useState } from 'react';
import { ArrowLeft, Info, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

// Main Component
const SubInfoPage = () => {
  // 1. State สำหรับควบคุม Step (1-4)
  const [currentStep, setCurrentStep] = useState(1);

  // 2. State สำหรับเก็บข้อมูลทั้งหมด
  const [formData, setFormData] = useState({
    gender: '', // 'male' | 'female'
    activityLevel: '', // 'low' | 'medium' | 'high'
    weight: '',
    height: '',
    birthDate: { day: '', month: '', year: '' }
  });

  // --- Handlers ---
  
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      // Logic for going back to previous page (e.g., Login)
      console.log("Back to previous page");
    }
  };

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateDate = (field, value) => {
    setFormData(prev => ({
      ...prev,
      birthDate: { ...prev.birthDate, [field]: value }
    }));
  };

  const handleSubmit = () => {
    // 🔥 ส่งข้อมูลไป Backend ตรงนี้
    console.log("Ready to submit:", formData);
    alert("บันทึกข้อมูลสำเร็จ! (ดูใน Console)");
  };

  // คำนวณ % ของ Progress Bar
  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col relative overflow-hidden">
      
      {/* --- Header & Progress Bar --- */}
      <div className="pt-6 pb-4 px-4 bg-white z-10">
        {/* Top Nav */}
        <div className="flex items-center mb-4">
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full">
            <ArrowLeft size={24} className="text-slate-700" />
          </button>
          <span className="ml-2 font-bold text-lg text-slate-800">
            {currentStep === 4 ? '' : 'Tell us a bit about yourself'}
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>Step {currentStep} of 4</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#6CD2D9] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* --- Body Content (Switches based on Step) --- */}
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-24">
        
        {/* STEP 1: GENDER */}
        {currentStep === 1 && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold mb-2">What is your gender?</h2>
              <p className="text-slate-500">This helps us calculate your nutritional needs more accurately.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <GenderCard 
                label="Male" 
                icon="♂" 
                selected={formData.gender === 'male'} 
                onClick={() => updateData('gender', 'male')} 
              />
              <GenderCard 
                label="Female" 
                icon="♀" 
                selected={formData.gender === 'female'} 
                onClick={() => updateData('gender', 'female')} 
              />
            </div>
          </div>
        )}

        {/* STEP 2: ACTIVITY LEVEL */}
        {currentStep === 2 && (
          <div className="animate-fade-in space-y-8">
             <div className="mt-2">
              <h2 className="text-2xl font-bold mb-2">What's your weekly activity level?</h2>
              <p className="text-slate-500">Exercise impacts your blood sugar. Let us know your typical routine.</p>
            </div>

            <div className="space-y-4">
              <ActivityOption 
                title="Not Very Active" 
                desc="0-2 days/week" 
                icon="🚶"
                selected={formData.activityLevel === 'low'}
                onClick={() => updateData('activityLevel', 'low')}
              />
              <ActivityOption 
                title="Lightly Active" 
                desc="3-4 days/week" 
                icon="🏃"
                selected={formData.activityLevel === 'medium'}
                onClick={() => updateData('activityLevel', 'medium')}
              />
              <ActivityOption 
                title="Active" 
                desc="5+ days/week" 
                icon="🏋️"
                selected={formData.activityLevel === 'high'}
                onClick={() => updateData('activityLevel', 'high')}
              />
            </div>
          </div>
        )}

        {/* STEP 3: PHYSICAL DATA */}
        {currentStep === 3 && (
          <div className="animate-fade-in space-y-8">
            <div className="mt-2">
              <h2 className="text-2xl font-bold mb-2">Physical Data</h2>
              <p className="text-slate-500">Let's get some basic information to personalize your experience.</p>
            </div>

            <div className="space-y-6">
              {/* Weight */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Weight</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => updateData('weight', e.target.value)}
                    placeholder="Enter your weight"
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kg</span>
                </div>
              </div>

              {/* Height */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Height</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.height}
                    onChange={(e) => updateData('height', e.target.value)}
                    placeholder="Enter your height"
                    className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">cm</span>
                </div>
              </div>

              {/* Info Note */}
              <div className="flex gap-3 items-start bg-cyan-50 p-4 rounded-xl">
                <Info className="text-[#6CD2D9] shrink-0 mt-1" size={20} />
                <p className="text-sm text-slate-600">This information is used to calculate your BMI and personalize your health plan.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: DATE OF BIRTH */}
        {currentStep === 4 && (
          <div className="animate-fade-in space-y-8 text-center pt-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">What's your date of birth?</h2>
              <p className="text-slate-500">Your age helps us tailor your health recommendations.</p>
            </div>

            {/* Simulated Date Picker Style */}
            <div className="flex gap-2 justify-center mt-10">
              <input 
                type="number" placeholder="DD" 
                className="w-20 p-4 text-center text-xl font-bold border-b-2 border-slate-200 focus:border-[#6CD2D9] focus:outline-none bg-transparent"
                value={formData.birthDate.day}
                onChange={(e) => updateDate('day', e.target.value)}
              />
              <input 
                type="number" placeholder="MM" 
                className="w-20 p-4 text-center text-xl font-bold border-b-2 border-slate-200 focus:border-[#6CD2D9] focus:outline-none bg-transparent"
                value={formData.birthDate.month}
                onChange={(e) => updateDate('month', e.target.value)}
              />
              <input 
                type="number" placeholder="YYYY" 
                className="w-24 p-4 text-center text-xl font-bold border-b-2 border-slate-200 focus:border-[#6CD2D9] focus:outline-none bg-transparent"
                value={formData.birthDate.year}
                onChange={(e) => updateDate('year', e.target.value)}
              />
            </div>

             {/* Visual helper for scroll (Decoration only since real scroll is hard in pure CSS) */}
             <div className="mt-8 opacity-30 pointer-events-none select-none">
                <div className="text-3xl font-bold text-slate-300">14 Aug 1998</div>
                <div className="text-3xl font-bold text-[#6CD2D9] my-2">
                    {formData.birthDate.day || '15'} {formData.birthDate.month ? getMonthName(formData.birthDate.month) : 'Sep'} {formData.birthDate.year || '1999'}
                </div>
                <div className="text-3xl font-bold text-slate-300">16 Oct 2000</div>
             </div>
          </div>
        )}
      </div>

      {/* --- Footer (Fixed Bottom) --- */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100">
        <button
          onClick={handleNext}
          className="w-full bg-[#6CD2D9] hover:bg-[#5bc0c7] text-white font-bold py-4 rounded-full shadow-lg transition duration-200 text-lg"
        >
          Continue
        </button>
      </div>

    </div>
  );
};

// --- Sub Components ---

const GenderCard = ({ label, icon, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      cursor-pointer h-40 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 transition-all duration-200
      ${selected ? 'border-[#6CD2D9] bg-cyan-50' : 'border-slate-200 hover:border-slate-300'}
    `}
  >
    <span className={`text-4xl ${selected ? 'text-[#6CD2D9]' : 'text-slate-400'}`}>{icon}</span>
    <span className={`font-bold ${selected ? 'text-[#6CD2D9]' : 'text-slate-600'}`}>{label}</span>
  </div>
);

const ActivityOption = ({ title, desc, icon, selected, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      cursor-pointer p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-200
      ${selected ? 'border-[#6CD2D9] bg-cyan-50' : 'border-slate-200 hover:border-slate-300'}
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${selected ? 'bg-white' : 'bg-slate-100'}`}>
        {icon}
      </div>
      <div className="text-left">
        <h3 className={`font-bold ${selected ? 'text-slate-900' : 'text-slate-700'}`}>{title}</h3>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
    
    {/* Radio Circle */}
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-[#6CD2D9]' : 'border-slate-300'}`}>
      {selected && <div className="w-3 h-3 rounded-full bg-[#6CD2D9]" />}
    </div>
  </div>
);

// Helper for month name
const getMonthName = (monthNum) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[monthNum - 1] || "Sep";
};

// Add simple fade-in animation to Tailwind config if not exists, 
// or simply use this inline style hack for the demo
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default SubInfoPage;