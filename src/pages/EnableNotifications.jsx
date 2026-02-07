import React from 'react';
import { Bell } from 'lucide-react';

const EnableNotifications = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col p-6 font-sans text-slate-800 relative">
      
      {/* Content Container (Centered vertically) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        
        {/* Icon Circle */}
        <div className="w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center mb-8">
          <Bell className="text-[#6CD2D9] w-10 h-10" />
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Enable Notifications
        </h1>
        <p className="text-slate-500 leading-relaxed max-w-xs">
          Get timely reminders for your meals, medication, and blood sugar checks to stay on top of your health.
        </p>
      </div>

      {/* Footer Buttons (Fixed at bottom area) */}
      <div className="space-y-4 mb-8">
        <button className="w-full bg-[#6CD2D9] hover:bg-[#5bc0c7] text-white font-bold py-4 rounded-full shadow-lg transition duration-200 text-lg">
          Allow Notifications
        </button>
        
        <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 rounded-full transition duration-200 text-lg">
          Don't Allow
        </button>
      </div>
    </div>
  );
};

export default EnableNotifications;