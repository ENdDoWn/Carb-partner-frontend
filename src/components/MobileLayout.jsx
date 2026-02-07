import React from 'react';

const MobileLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative">
      {children}
    </div>
  );
};

export default MobileLayout;
