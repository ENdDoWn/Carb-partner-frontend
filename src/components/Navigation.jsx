import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BarChart2, ScanLine, History, ArrowRightLeft } from 'lucide-react';

const Navigation = ({ activePage }) => {
  const navigate = useNavigate();
  
  // Helper เช็คสีปุ่ม Active
  const getItemClass = (pageName) => {
    const isActive = activePage === pageName;
    return `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors duration-200 ${
      isActive ? 'text-[#55BCC3]' : 'text-slate-400 hover:text-slate-600'
    }`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white border-t border-slate-100 pb-safe-bottom pt-2 px-6 z-50 h-[80px]">
      <div className="flex justify-between items-end h-full pb-4">
        
        {/* Home */}
        <button className={getItemClass('home')} onClick={() => navigate('/home')}>
          <Home size={24} strokeWidth={activePage === 'home' ? 2.5 : 2} />
          <span>หน้าหลัก</span>
        </button>

        {/* Stats */}
        <button className={getItemClass('stats')} onClick={() => navigate('/stats')}>
          <BarChart2 size={24} strokeWidth={activePage === 'stats' ? 2.5 : 2} />
          <span>สถิติ</span>
        </button>

        {/* Scan Button */}
        <div className="relative -top-6">
          <button 
            className="w-16 h-16 bg-[#6CD2D9] hover:bg-[#5bc0c7] rounded-full shadow-[0_0_20px_rgba(108,210,217,0.6)] flex items-center justify-center transform transition-transform active:scale-95"
            onClick={() => navigate('/camera')}
          >
            <ScanLine size={30} className="text-white" />
          </button>
        </div>

        {/* History */}
        <button className={getItemClass('history')} onClick={() => navigate('/daily')}>
          <History size={24} strokeWidth={activePage === 'history' ? 2.5 : 2} />
          <span>ประวัติ</span>
        </button>

        {/* Exchange */}
        <button className={getItemClass('exchange')} onClick={() => navigate('/exchange')}>
          <ArrowRightLeft size={24} strokeWidth={activePage === 'exchange' ? 2.5 : 2} />
          <span className="text-center leading-3">Carb<br/>Exchange</span>
        </button>

      </div>
    </div>
  );
};

export default Navigation;