import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import MobileLayout from '../components/MobileLayout';

const GUIDE_URL = 'https://heyzine.com/flip-book/60db1e4596.html';

const WebAppGuidePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const fromPath = location.state?.from;
    navigate(fromPath || '/profile', { replace: true });
  };

  return (
    <MobileLayout>
      <div className="bg-white p-4 pt-safe-top flex items-center justify-between sticky top-0 z-10 border-b border-slate-100">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 -ml-2 text-slate-800 hover:bg-slate-50 rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-800">คู่มือการใช้งาน</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4 no-scrollbar bg-[#F8FAFC]">
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="h-[84vh] min-h-[560px] w-full bg-slate-100">
            <iframe
              title="คู่มือการใช้งานเว็บแอปพลิเคชัน"
              src={GUIDE_URL}
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default WebAppGuidePage;
