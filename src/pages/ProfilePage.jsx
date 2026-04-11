import React, { useEffect, useState, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, User, Pencil, 
  HelpCircle, Mail, LogOut, Camera, Calendar, X, Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import Components ที่แยกไว้ (ใช้ร่วมกับหน้าอื่น)
import MobileLayout from '../components/MobileLayout';
import BottomNavigation from '../components/Navigation';
import { getUserInfo, updateUserInfo } from '../Api/User';

// --- Thai month names ---
const thaiFullMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const thaiDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

// --- Format date to string ---
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseBirthDate = (dateString) => {
  if (!dateString) return null;

  if (typeof dateString === 'string' && dateString.includes('/')) {
    const [dayRaw, monthRaw, yearRaw] = dateString.split('/');
    const day = Number(dayRaw);
    const month = Number(monthRaw);
    const year = Number(yearRaw);

    if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
      return null;
    }

    const gregorianYear = year > 2400 ? year - 543 : year;
    const parsed = new Date(gregorianYear, month - 1, day);

    if (
      parsed.getFullYear() !== gregorianYear ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null;
    }

    return parsed;
  }

  const parsed = new Date(dateString);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatBirthDateBE = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const beYear = date.getFullYear() + 543;
  return `${day}/${month}/${beYear}`;
};

const normalizeBirthDateToIso = (dateString, fallbackValue = '') => {
  const parsed = parseBirthDate(dateString);
  return parsed ? formatDateKey(parsed) : fallbackValue;
};

const normalizeBirthDateToBE = (dateString, fallbackValue = null) => {
  const parsed = parseBirthDate(dateString);
  return parsed ? formatBirthDateBE(parsed) : fallbackValue;
};

// --- Format date for display in Thai ---
const formatThaiDate = (dateString) => {
  if (!dateString) return 'เลือกวันเกิด';
  const date = parseBirthDate(dateString);
  if (!date) return 'เลือกวันเกิด';
  const day = date.getDate();
  const month = thaiFullMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${day} ${month} ${year}`;
};

// --- BirthDate Calendar Popup Component ---
const BirthDateCalendarPopup = ({ isOpen, onClose, selectedDate, onSelectDate }) => {
  const initialDate = parseBirthDate(selectedDate) || new Date(2000, 0, 1);
  const [viewDate, setViewDate] = useState(initialDate);
  const [viewMode, setViewMode] = useState('date'); // 'date' | 'month' | 'year'
  
  if (!isOpen) return null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = new Date();
  const normalizedSelectedDate = normalizeBirthDateToIso(selectedDate, '');
  
  // สร้าง year range (ย้อนหลัง 100 ปี ถึงปัจจุบัน)
  const startYear = today.getFullYear() - 100;
  const endYear = today.getFullYear();
  const years = [];
  for (let y = endYear; y >= startYear; y--) {
    years.push(y);
  }

  // First day of month
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  
  // Days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Generate calendar days
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  // Year selector view
  if (viewMode === 'year') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">เลือกปี พ.ศ.</h3>
            <button onClick={() => setViewMode('date')} className="p-2 hover:bg-slate-100 rounded-full">
              <X size={20} className="text-slate-600" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-2">
            {years.map(y => (
              <button
                key={y}
                onClick={() => {
                  setViewDate(new Date(y, month, 1));
                  setViewMode('date');
                }}
                className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                  y === year ? 'bg-[#6CD2D9] text-white' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {y + 543}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Month selector view
  if (viewMode === 'month') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">เลือกเดือน</h3>
            <button onClick={() => setViewMode('date')} className="p-2 hover:bg-slate-100 rounded-full">
              <X size={20} className="text-slate-600" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {thaiFullMonths.map((m, i) => (
              <button
                key={i}
                onClick={() => {
                  setViewDate(new Date(year, i, 1));
                  setViewMode('date');
                }}
                className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                  i === month ? 'bg-[#6CD2D9] text-white' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('month')}
              className="font-bold text-slate-800 hover:text-[#6CD2D9] transition-colors"
            >
              {thaiFullMonths[month]}
            </button>
            <button 
              onClick={() => setViewMode('year')}
              className="font-bold text-slate-800 hover:text-[#6CD2D9] transition-colors"
            >
              {year + 543}
            </button>
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {thaiDays.map((day, i) => (
            <div key={i} className="text-center text-xs font-bold text-slate-400 py-2">{day}</div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (!day) return <div key={i} />;
            
            const date = new Date(year, month, day);
            const dateKey = formatDateKey(date);
            const isSelected = normalizedSelectedDate === dateKey;
            const isFuture = date > today;
            
            return (
              <button
                key={i}
                disabled={isFuture}
                onClick={() => {
                  onSelectDate(dateKey);
                  onClose();
                }}
                className={`
                  relative h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${isFuture ? 'text-slate-300 cursor-not-allowed' : 
                    isSelected ? 'bg-[#6CD2D9] text-white' : 'text-slate-700 hover:bg-slate-100'}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-slate-100 text-slate-700 font-bold py-3 rounded-full hover:bg-slate-200 transition-colors"
        >
          ปิด
        </button>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  // --- 1. State ---
  const [isEditing, setIsEditing] = useState(false); // ควบคุมการเปิด/ปิดหน้า Edit
  
  // ข้อมูลผู้ใช้ (Shared State ระหว่างหน้าดูและหน้าแก้ไข)
  const [userData, setUserData] = useState(null);

  // ฟังก์ชันคำนวณอายุจากวันเกิด
  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = parseBirthDate(birthDate);
    if (!birth) return 0;
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // State สำหรับฟอร์มแก้ไข (Temp State)
  const [editFormData, setEditFormData] = useState(null);
   const [saveError, setSaveError] = useState('');
   const [showBirthDateCalendar, setShowBirthDateCalendar] = useState(false);
   const [profileImage, setProfileImage] = useState(null);
   const [showImagePicker, setShowImagePicker] = useState(false);
   const [showCamera, setShowCamera] = useState(false);
   
   const fileInputRef = useRef(null);
   const cameraInputRef = useRef(null);
   const videoRef = useRef(null);
   const canvasRef = useRef(null);
   const streamRef = useRef(null);

   // ฟังก์ชันเปิดกล้อง
   const openCamera = async () => {
      setShowImagePicker(false);
      setShowCamera(true);
      try {
         const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }, 
            audio: false 
         });
         streamRef.current = stream;
         if (videoRef.current) {
            videoRef.current.srcObject = stream;
         }
      } catch (err) {
         console.error('Error accessing camera:', err);
         alert('ไม่สามารถเข้าถึงกล้องได้');
         setShowCamera(false);
      }
   };

   // ฟังก์ชันปิดกล้อง
   const closeCamera = () => {
      if (streamRef.current) {
         streamRef.current.getTracks().forEach(track => track.stop());
         streamRef.current = null;
      }
      setShowCamera(false);
   };

   // ฟังก์ชันถ่ายรูป
   const capturePhoto = () => {
      if (videoRef.current && canvasRef.current) {
         const video = videoRef.current;
         const canvas = canvasRef.current;
         
         // ครอปเป็นสี่เหลี่ยมจัตุรัส
         const size = Math.min(video.videoWidth, video.videoHeight);
         canvas.width = size;
         canvas.height = size;
         
         const offsetX = (video.videoWidth - size) / 2;
         const offsetY = (video.videoHeight - size) / 2;
         
         const ctx = canvas.getContext('2d');
         ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size);
         
         const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
         setProfileImage(imageUrl);
         closeCamera();
      }
   };

   useEffect(() => {
      const loadUserData = async () => {
         try {
            const data = await getUserInfo();
            console.log('API response for user info:', data);
            const user = data?.user ?? data;
            console.log('User data:', user);
            if (!user) {
              setUserData(null);
              setEditFormData(null);
               return;
            }
            const nextUserData = {
              full_name: user.full_name ?? null,
              email: user.email ?? null,
               birth_date: normalizeBirthDateToBE(user.birth_date || user.birthDate, null),
              weight: user.weight ?? null,
              height: user.height ?? null,
              bmi: user.bmi ?? null,
              active: user.active ?? null,
              carb_expect: user.carb_expect ?? user.carbGoal ?? null
            };
            setUserData(nextUserData);
            setEditFormData(nextUserData);
         } catch (error) {
            console.log('Failed to load user data', error);
         }
      };

      loadUserData();
   }, []);

  // --- 2. Handlers ---
  
  // เปิดหน้า Edit
  const handleOpenEdit = () => {
    if (!userData) {
      return;
    }
    setEditFormData(userData); // โหลดข้อมูลปัจจุบันไปใส่ฟอร์ม
    setIsEditing(true);
  };

  // ปิดหน้า Edit (Back)
  const handleCloseEdit = () => {
    setIsEditing(false);
  };

   const handleLogout = () => {
      localStorage.removeItem('access_token');
    localStorage.removeItem('userData');
      navigate('/signin');
   };

  // บันทึกข้อมูล
   const validateProfileData = (data) => {
    if (!data) {
      return 'ไม่พบข้อมูลผู้ใช้';
    }

      if (!data.full_name || !data.full_name.trim()) {
         return 'กรุณากรอกชื่อผู้ใช้งาน';
      }

    if (!data.birth_date) {
         return 'กรุณาเลือกวันเกิด';
      }
    const birthDate = parseBirthDate(data.birth_date);
    if (!birthDate || birthDate > new Date()) {
         return 'กรุณาเลือกวันเกิดให้ถูกต้อง';
      }

      const weight = Number(data.weight);
      if (!Number.isFinite(weight) || weight <= 0) {
         return 'กรุณากรอกน้ำหนักให้ถูกต้อง';
      }

      const height = Number(data.height);
      if (!Number.isFinite(height) || height <= 0) {
         return 'กรุณากรอกส่วนสูงให้ถูกต้อง';
      }

      return '';
   };

   const handleSave = async () => {
    if (!editFormData) {
      setSaveError('ไม่พบข้อมูลที่ต้องบันทึก');
      return;
    }

      const errorMessage = validateProfileData(editFormData);
      if (errorMessage) {
         setSaveError(errorMessage);
         return;
      }

      setSaveError('');

      // คำนวณ BMI ใหม่แบบคร่าวๆ
      const heightInM = Number(editFormData.height) / 100;
      const newBMI = (Number(editFormData.weight) / (heightInM * heightInM)).toFixed(1);
      // รักษา carb_expect จาก userData เดิม (ไม่ให้แก้ไข)
      const nextUserData = { ...editFormData, bmi: newBMI, carb_expect: userData?.carb_expect ?? null };

      try {
         console.log('Saving user data:', nextUserData);
         await updateUserInfo({ user: nextUserData });
        const refreshed = await getUserInfo();
        const refreshedUser = refreshed?.user ?? refreshed;
        console.log('Refreshed user data:', refreshedUser, 'API response:', refreshed);
        const refreshedUserData = refreshedUser
          ? {
              full_name: refreshedUser.full_name ?? null,
              email: refreshedUser.email ?? null,
              birth_date: normalizeBirthDateToBE(refreshedUser.birth_date || refreshedUser.birthDate, null),
              weight: refreshedUser.weight ?? null,
              height: refreshedUser.height ?? null,
              bmi: refreshedUser.bmi ?? null,
              active: refreshedUser.active ?? null,
              carb_expect: refreshedUser.carb_expect ?? refreshedUser.carbGoal ?? null
            }
          : null;

        setUserData(refreshedUserData);
        setEditFormData(refreshedUserData);
         setIsEditing(false);
      } catch (error) {
         console.log('Failed to update user data', error);
         setSaveError('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      }
   };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...(prev ?? {}), [name]: value }));
      if (saveError) {
         setSaveError('');
      }
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
                 <div className="w-24 h-24 rounded-full bg-cyan-50 border-2 border-dashed border-[#6CD2D9] flex items-center justify-center text-[#6CD2D9] overflow-hidden">
                    {profileImage ? (
                       <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                       <User size={48} strokeWidth={1.5} />
                    )}
                 </div>
                 <button 
                    onClick={handleOpenEdit}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#6CD2D9] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm"
                 >
                    <Pencil size={14} />
                 </button>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{userData?.full_name ?? '-'}</h2>
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
                <p className="text-3xl font-bold text-[#6CD2D9]">{userData?.carb_expect ?? '-'}g</p>
               </div>
               
               <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <StatItem label="อายุ" value={`${calculateAge(userData?.birth_date)} ปี`} />
                  <StatItem label="น้ำหนัก" value={userData?.weight != null ? `${userData.weight} กก.` : '-'} />
                  <StatItem label="ส่วนสูง" value={userData?.height != null ? `${userData.height} ซม.` : '-'} />
                  <StatItem label="BMI" value={userData?.bmi ?? '-'} />
               </div>
            </div>

            {/* Menu Links */}
            <div className="space-y-3 mb-8">
              <MenuItem
                icon={<HelpCircle size={20} />}
                label="คู่มือการใช้งานเว็บแอปพลิเคชัน"
                onClick={() => navigate('/webapp-guide', { state: { from: '/profile' } })}
              />
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
             
             {/* Hidden file inputs */}
             <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden"
                onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => setProfileImage(event.target.result);
                      reader.readAsDataURL(file);
                   }
                   setShowImagePicker(false);
                }}
             />
             <input 
                type="file" 
                ref={cameraInputRef} 
                accept="image/*" 
                capture="environment"
                className="hidden"
                onChange={(e) => {
                   const file = e.target.files?.[0];
                   if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => setProfileImage(event.target.result);
                      reader.readAsDataURL(file);
                   }
                   setShowImagePicker(false);
                }}
             />
             
             {/* Edit Avatar */}
             <div className="flex flex-col items-center mb-8">
                <div className="relative mb-3">
                   <button 
                      onClick={() => setShowImagePicker(true)}
                      className="w-24 h-24 rounded-full bg-cyan-50 flex items-center justify-center text-[#6CD2D9] overflow-hidden border-2 border-dashed border-[#6CD2D9] hover:border-solid hover:bg-cyan-100 transition-colors"
                   >
                      {profileImage ? (
                         <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                         <User size={48} strokeWidth={1.5} />
                      )}
                   </button>
                   <button 
                      onClick={() => setShowImagePicker(true)}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-[#6CD2D9] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm hover:bg-[#5bc0c7] transition-colors"
                   >
                      <Camera size={14} />
                   </button>
                </div>
                <h2 className="font-bold text-slate-900">{userData?.full_name ?? '-'}</h2>
                <p className="text-xs text-slate-400">{userData?.email ?? '-'}</p>
             </div>

             {/* Form Fields */}
             <div className="space-y-5">
                
                {/* Personal Info */}
                <div>
                   <label className="text-xs font-bold text-slate-700 mb-1 block">ชื่อ</label>
                   <h3 className="text-xs font-bold text-slate-400 mb-2">ข้อมูลส่วนตัว</h3>
                   <input 
                      type="text" name="full_name"
                   value={editFormData?.full_name ?? ''} onChange={handleChange}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-slate-700 font-medium"
                   />
                </div>

                <div>
                   <label className="text-xs font-bold text-slate-700 mb-1 block">วันเกิด</label>
                   <button 
                      type="button"
                      onClick={() => setShowBirthDateCalendar(true)}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-slate-700 font-medium text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                   >
                     <span>{formatThaiDate(editFormData?.birth_date ?? '')}</span>
                      <Calendar size={18} className="text-slate-400" />
                   </button>
                </div>

                {/* Physical Data */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-2">ข้อมูลทางกายภาพ</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">น้ำหนัก (กก.)</label>
                        <input 
                           type="number" name="weight"
                          value={editFormData?.weight ?? ''} onChange={handleChange}
                           className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-slate-700 font-medium"
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-700 mb-1 block">ส่วนสูง (ซม.)</label>
                        <input 
                           type="number" name="height"
                          value={editFormData?.height ?? ''} onChange={handleChange}
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
                        name="active"
                        value={editFormData?.active ?? ''} onChange={handleChange}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] text-slate-700 font-medium appearance-none bg-white"
                      >
                         <option value="" disabled>เลือกระดับกิจกรรม</option>
                         <option value={"low"}>น้อยมาก</option>
                         <option value={"medium"}>ปานกลาง</option>
                         <option value={"high"}>หนัก</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-3.5 text-slate-400 rotate-90" size={16} />
                   </div>
                </div>

                {/* Nutrition Goal (Read-only - คำนวณอัตโนมัติ) */}
                <div>
                   <h3 className="text-xs font-bold text-slate-400 mb-2">เป้าหมายโภชนาการ</h3>
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-500">ปริมาณคาร์บที่แนะนำต่อวัน</span>
                       <span className="text-lg font-bold text-[#6CD2D9]">{userData?.carb_expect ?? '-'} ก.</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2">* คำนวณจากข้อมูลส่วนตัวของคุณ</p>
                   </div>
                </div>

             </div>
          </div>

          {/* Fixed Save Button */}
          <div className="p-4 bg-white border-t border-slate-100 pb-safe-bottom">
             {saveError && (
               <p className="text-sm text-red-500 mb-3">{saveError}</p>
             )}
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
      
      {/* BirthDate Calendar Popup */}
      <BirthDateCalendarPopup 
        isOpen={showBirthDateCalendar}
        onClose={() => setShowBirthDateCalendar(false)}
        selectedDate={editFormData?.birth_date ?? ''}
        onSelectDate={(date) => setEditFormData(prev => ({ ...(prev ?? {}), birth_date: normalizeBirthDateToBE(date, null) }))}
      />
      
      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-safe-bottom animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">เลือกรูปโปรไฟล์</h3>
              <button 
                onClick={() => setShowImagePicker(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={openCamera}
                className="w-full flex items-center gap-4 p-4 bg-cyan-50 rounded-2xl hover:bg-cyan-100 transition-colors"
              >
                <div className="w-12 h-12 bg-[#6CD2D9] rounded-full flex items-center justify-center text-white">
                  <Camera size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800">ถ่ายรูป</p>
                  <p className="text-xs text-slate-500">ใช้กล้องถ่ายรูปใหม่</p>
                </div>
              </button>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 bg-slate-400 rounded-full flex items-center justify-center text-white">
                  <ImageIcon size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800">เลือกจากอัลบั้ม</p>
                  <p className="text-xs text-slate-500">เลือกรูปจากคลังภาพ</p>
                </div>
              </button>
              
              {profileImage && (
                <button 
                  onClick={() => {
                    setProfileImage(null);
                    setShowImagePicker(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center text-white">
                    <X size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-red-600">ลบรูปโปรไฟล์</p>
                    <p className="text-xs text-red-400">กลับไปใช้รูปเริ่มต้น</p>
                  </div>
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setShowImagePicker(false)}
              className="w-full mt-6 bg-slate-100 text-slate-700 font-bold py-3 rounded-full hover:bg-slate-200 transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
      
      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black z-[200] flex flex-col">
          {/* Hidden Canvas สำหรับ capture */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Camera Feed */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            className="flex-1 w-full object-cover"
          />
          
          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-center gap-8">
              {/* ปุ่มยกเลิก */}
              <button 
                onClick={closeCamera}
                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
              >
                <X size={28} />
              </button>
              
              {/* ปุ่มถ่ายรูป */}
              <button 
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm p-1.5 flex items-center justify-center"
              >
                <div className="w-full h-full bg-white rounded-full shadow-sm" />
              </button>
              
              {/* Spacer */}
              <div className="w-14 h-14" />
            </div>
          </div>
        </div>
      )}
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

const MenuItem = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
  >
      <div className="flex items-center gap-3">
         <div className="text-slate-500">{icon}</div>
         <span className="font-bold text-slate-700 text-sm">{label}</span>
      </div>
      <ChevronRight size={18} className="text-slate-300" />
   </button>
);

export default ProfilePage;