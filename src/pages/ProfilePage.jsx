import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, User, Pencil, 
  HelpCircle, Mail, LogOut, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import Components ที่แยกไว้ (ใช้ร่วมกับหน้าอื่น)
import MobileLayout from '../components/MobileLayout';
import BottomNavigation from '../components/Navigation';

const ProfilePage = () => {
  const navigate = useNavigate();
  // --- 1. State ---
  const [isEditing, setIsEditing] = useState(false); // ควบคุมการเปิด/ปิดหน้า Edit
  
  // ข้อมูลผู้ใช้ (Shared State ระหว่างหน้าดูและหน้าแก้ไข)
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "alex.johnson@example.com",
    age: 34,
    weight: 75,
    height: 180,
    bmi: 23.1,
    activityLevel: "ปานกลาง",
    carbGoal: 150
  });

  // State สำหรับฟอร์มแก้ไข (Temp State)
  const [editFormData, setEditFormData] = useState(userData);

  // --- 2. Handlers ---
  
  // เปิดหน้า Edit
  const handleOpenEdit = () => {
    setEditFormData(userData); // โหลดข้อมูลปัจจุบันไปใส่ฟอร์ม
    setIsEditing(true);
  };

  // ปิดหน้า Edit (Back)
  const handleCloseEdit = () => {
    setIsEditing(false);
  };

   const handleLogout = () => {
      localStorage.removeItem('access_token');
      navigate('/signin');
   };

  // บันทึกข้อมูล
  const handleSave = () => {
    // คำนวณ BMI ใหม่แบบคร่าวๆ
    const heightInM = editFormData.height / 100;
    const newBMI = (editFormData.weight / (heightInM * heightInM)).toFixed(1);
    
    setUserData({ ...editFormData, bmi: newBMI });
    setIsEditing(false);
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 3. Render ---
  return (
    <MobileLayout>
      <div className="relative h-full overflow-hidden flex flex-col">
        
        {/* ==============================
            VIEW 1: PROFILE MAIN VIEW
           ============================== */}
        <div className={`flex-1 flex flex-col transition-transform duration-300 ease-in-out ${isEditing ? '-translate-x-[20%]' : 'translate-x-0'}`}>
          
          {/* Header */}
          <div className="bg-white p-4 pt-safe-top flex items-center justify-between sticky top-0 z-10">
             <button onClick={() => navigate('/home')} className="p-2 -ml-2 text-slate-800 hover:bg-slate-50 rounded-full">
                <ChevronLeft size={24} />
             </button>
             <h1 className="text-lg font-bold text-slate-800">โปรไฟล์</h1>
             <div className="w-10"></div> {/* Spacer to center title */}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar bg-white">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center mt-6 mb-8">
              <div className="relative mb-3">
                 <div className="w-24 h-24 rounded-full bg-cyan-50 border-2 border-dashed border-[#6CD2D9] flex items-center justify-center text-[#6CD2D9]">
                    <User size={48} strokeWidth={1.5} />
                 </div>
                 <button 
                    onClick={handleOpenEdit}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#6CD2D9] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm"
                 >
                    <Pencil size={14} />
                 </button>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{userData.name}</h2>
              <button 
                onClick={handleOpenEdit}
                className="text-sm text-[#6CD2D9] font-bold flex items-center gap-1 mt-1 hover:underline"
              >
                แก้ไขโปรไฟล์ <Pencil size={12} />
              </button>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-50 mb-6">
               <div className="text-center mb-6 pb-6 border-b border-slate-100">
                  <p className="text-xs text-slate-400 mb-1">ปริมาณคาร์บที่แนะนำต่อวัน</p>
                  <p className="text-3xl font-bold text-[#6CD2D9]">{userData.carbGoal}g</p>
               </div>
               
               <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <StatItem label="อายุ" value={userData.age} />
                  <StatItem label="น้ำหนัก" value={`${userData.weight} kg`} />
                  <StatItem label="ส่วนสูง" value={`${userData.height} cm`} />
                  <StatItem label="BMI" value={userData.bmi} />
               </div>
            </div>

            {/* Menu Links */}
            <div className="space-y-3 mb-8">
               <MenuItem icon={<HelpCircle size={20} />} label="วิธีใช้งานแอป" />
               <MenuItem icon={<Mail size={20} />} label="ติดต่อเรา" />
            </div>

            {/* Logout */}
                  <button
                     onClick={handleLogout}
                     className="w-full bg-red-50 text-red-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                  >
               <LogOut size={20} />
               <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>


        {/* ==============================
            VIEW 2: EDIT PROFILE (SLIDE-IN)
           ============================== */}
        <div 
          className={`absolute inset-0 bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out ${
            isEditing ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header Edit */}
          <div className="bg-white p-4 pt-safe-top flex items-center justify-between border-b border-slate-100">
             <button 
                onClick={handleCloseEdit}
                className="p-2 -ml-2 text-slate-800 hover:bg-slate-50 rounded-full"
             >
                <ChevronLeft size={24} />
             </button>
             <h1 className="text-lg font-bold text-slate-800">แก้ไขโปรไฟล์</h1>
             <div className="w-10"></div>
          </div>

          {/* Edit Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
             
             {/* Edit Avatar */}
             <div className="flex flex-col items-center mb-8">
                <div className="relative mb-3">
                   <div className="w-24 h-24 rounded-full bg-cyan-50 flex items-center justify-center text-[#6CD2D9]">
                      <User size={48} strokeWidth={1.5} />
                   </div>
                   <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#6CD2D9] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                      <Camera size={14} />
                   </button>
                </div>
                <h2 className="font-bold text-slate-900">{userData.name}</h2>
                <p className="text-xs text-slate-400">{userData.email}</p>
             </div>

             {/* Form Fields */}
             <div className="space-y-5">
                
                {/* Personal Info */}
                <div>
                   <label className="text-xs font-bold text-slate-700 mb-1 block">ชื่อ</label>
                   <h3 className="text-xs font-bold text-slate-400 mb-2">ข้อมูลส่วนตัว</h3>
                   <input 
                      type="text" name="name"
                      value={editFormData.name} onChange={handleChange}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-slate-700 font-medium"
                   />
                </div>

                <div>
                   <label className="text-xs font-bold text-slate-700 mb-1 block">อายุ</label>
                   <input 
                      type="number" name="age"
                      value={editFormData.age} onChange={handleChange}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-slate-700 font-medium"
                   />
                </div>

                {/* Physical Data */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-2">ข้อมูลทางกายภาพ</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">น้ำหนัก (กก.)</label>
                        <input 
                           type="number" name="weight"
                           value={editFormData.weight} onChange={handleChange}
                           className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-slate-700 font-medium"
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">ส่วนสูง (ซม.)</label>
                        <input 
                           type="number" name="height"
                           value={editFormData.height} onChange={handleChange}
                           className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-slate-700 font-medium"
                        />
                     </div>
                  </div>
                </div>

                {/* Activity */}
                <div>
                   <label className="text-xs font-bold text-slate-700 mb-1 block">ระดับกิจกรรม</label>
                   <div className="relative">
                      <select 
                        name="activityLevel"
                        value={editFormData.activityLevel} onChange={handleChange}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-slate-700 font-medium appearance-none bg-white"
                      >
                         <option>น้อยมาก</option>
                         <option>ปานกลาง</option>
                         <option>หนัก</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-3.5 text-slate-400 rotate-90" size={16} />
                   </div>
                </div>

                {/* Nutrition Goal (Slider) */}
                <div>
                   <h3 className="text-xs font-bold text-slate-400 mb-2">เป้าหมายโภชนาการ</h3>
                   <div className="bg-white p-4 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-xs font-bold text-slate-700">ปริมาณคาร์บที่แนะนำต่อวัน</span>
                         <span className="text-sm font-bold text-[#6CD2D9]">{editFormData.carbGoal} ก.</span>
                      </div>
                      
                      <input 
                         type="range" min="50" max="300" step="5"
                         name="carbGoal"
                         value={editFormData.carbGoal} onChange={handleChange}
                         className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#6CD2D9]"
                      />
                      <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold">
                         <span>50 ก.</span>
                         <span>300 ก.</span>
                      </div>
                   </div>
                </div>

             </div>
          </div>

          {/* Fixed Save Button */}
          <div className="p-4 bg-white border-t border-slate-100 pb-safe-bottom">
             <button 
                onClick={handleSave}
                className="w-full bg-[#6CD2D9] hover:bg-[#5bc0c7] text-white font-bold py-3.5 rounded-full shadow-lg transition duration-200 text-lg"
             >
                บันทึกการเปลี่ยนแปลง
             </button>
          </div>
        </div>

      </div>
      
      {/* Bottom Nav - อยู่นอก scroll container */}
      {!isEditing && <BottomNavigation />}
    </MobileLayout>
  );
};

// --- Sub-components (เพื่อลดความรกของโค้ดหลัก) ---

const StatItem = ({ label, value }) => (
   <div className="flex flex-col items-center">
      <span className="text-xs text-slate-400 mb-1">{label}</span>
      <span className="text-lg font-bold text-slate-800">{value}</span>
   </div>
);

const MenuItem = ({ icon, label }) => (
   <button className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
         <div className="text-slate-500">{icon}</div>
         <span className="font-bold text-slate-700 text-sm">{label}</span>
      </div>
      <ChevronRight size={18} className="text-slate-300" />
   </button>
);

export default ProfilePage;