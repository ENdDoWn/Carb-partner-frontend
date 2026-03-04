import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, ChevronDown 
} from 'lucide-react';

import MobileLayout from '../components/MobileLayout';

const ScanResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const carbAmount = Number(location.state?.carb ?? 0);
  const scannedImage = location.state?.image;
  
  // เอาเวลาปัจจุบัน
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} น.`;

  return (
    <MobileLayout>
      <div className="relative h-full flex flex-col bg-white">
        
        {/* --- Header --- */}
        <div className="bg-white p-4 pt-safe-top flex items-center justify-between z-10 sticky top-0">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-800 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">ผลการสแกน</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* --- Scrollable Content --- */}
        <div className="flex-1 overflow-y-auto px-5 pb-32 no-scrollbar">
          
          {/* Image Section */}
          <div className="w-full h-64 rounded-3xl overflow-hidden mb-6 shadow-sm border border-slate-100">
            <img 
              src={scannedImage || 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
              alt="Apple" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title & Subtitle */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-1">แอปเปิล</h2>
            <p className="text-sm text-slate-500 font-medium">ต่อ 1 ผลกลาง (182 กรัม)</p>
          </div>

          {/* --- Form Inputs --- */}
          <div className="space-y-5 mb-6">
            
            {/* Time Input */}
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block">เวลา</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Clock size={20} />
                </div>
                <div className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 font-bold">
                  {currentTime}
                </div>
              </div>
            </div>

            {/* Carb Amount Display */}
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1.5 block">ปริมาณคาร์บ</label>
              <div className="flex items-center justify-center bg-[#F8FAFC] border border-slate-200 rounded-2xl py-4">
                <span className="text-xl font-extrabold text-slate-800">{carbAmount} กรัม</span>
              </div>
            </div>

          </div>

          {/* --- Expand Details Toggle --- */}
          <div className="flex justify-center mb-6">
            <button className="flex items-center gap-1 text-xs font-bold text-[#6CD2D9] hover:text-[#5bc0c7] transition-colors">
              <span>ดูรายละเอียดเพิ่มเติม</span>
              <ChevronDown size={16} />
            </button>
          </div>

          <hr className="border-slate-100 mb-6" />

          {/* --- Nutrition Summary Grid --- */}
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 mb-1">กิโลแคลอรี่</p>
              <p className="text-lg font-extrabold text-slate-800">95</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 mb-1">ไขมัน</p>
              <p className="text-lg font-extrabold text-slate-800">0.3 ก.</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 mb-1">โปรตีน</p>
              <p className="text-lg font-extrabold text-slate-800">0.5 ก.</p>
            </div>
          </div>

        </div>

        {/* --- Bottom Fixed Buttons --- */}
        <div className="absolute bottom-0 left-0 w-full p-6 pt-4 bg-white border-t border-slate-50 pb-safe-bottom z-10 flex flex-col gap-3">
          <button className="w-full bg-[#6CD2D9] hover:bg-[#5bc0c7] text-white font-bold py-4 rounded-full shadow-lg transition duration-200 text-lg active:scale-[0.98]">
            ยืนยันและบันทึก
          </button>
          <button className="w-full bg-white text-[#6CD2D9] font-bold py-4 rounded-full transition duration-200 text-lg active:bg-slate-50">
            สแกนใหม่
          </button>
        </div>

      </div>
    </MobileLayout>
  );
};

export default ScanResultPage;