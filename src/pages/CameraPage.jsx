import React, { useRef, useEffect, useState } from 'react';
import { 
  ArrowLeft, ZapOff, Zap, RefreshCcw, Image as ImageIcon,
  X, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import MobileLayout from '../components/MobileLayout';
import { ScanFood } from '../Api/Food';

const CameraPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // เพิ่ม Canvas สำหรับวาดรูป
  const fileInputRef = useRef(null); // Ref สำหรับเลือกไฟล์รูปภาพ
  const streamRef = useRef(null); // เก็บ stream ไว้สำหรับสลับกล้อง
  
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null); // เก็บรูปที่ถ่ายไว้
  const [flashOn, setFlashOn] = useState(false); // สถานะแฟลช
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' = กล้องหลัง, 'user' = กล้องหน้า
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const TARGET_SIZE = 1024; // ขนาด output ที่ต้องการ

  // --- เปิดกล้อง ---
  useEffect(() => {
    const startCamera = async () => {
      // ถ้ามีรูปที่ถ่ายแล้ว ไม่ต้องเปิดกล้องซ้ำ
      if (capturedImage) return;

      // ปิด stream เดิมก่อน (ถ้ามี)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: facingMode }, // ใช้กล้องตาม state
          audio: false 
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Error accessing the camera:", err);
        setHasPermission(false);
      }
    };

    startCamera();

    // Cleanup: ปิดกล้องเมื่อออกจากหน้าเว็บ
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [capturedImage, facingMode]); // รีรันเมื่อ facingMode เปลี่ยนด้วย

  // --- ฟังก์ชันถ่ายรูป (ครอปตามกรอบที่แสดงบนหน้าจอ 90% ของด้านสั้น) ---
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      // ขนาดหน้าจอที่แสดง video (element size)
      const screenWidth = video.clientWidth;
      const screenHeight = video.clientHeight;
      
      // Video แสดงแบบ object-cover: scale ให้เต็มหน้าจอแล้ว crop ส่วนเกิน
      const videoAspect = videoWidth / videoHeight;
      const screenAspect = screenWidth / screenHeight;
      
      let scaleX, scaleY, offsetX, offsetY;
      
      if (videoAspect > screenAspect) {
        // Video กว้างกว่า: scale ตาม height, crop ข้างซ้าย-ขวา
        scaleY = videoHeight / screenHeight;
        scaleX = scaleY;
        offsetX = (videoWidth - screenWidth * scaleX) / 2;
        offsetY = 0;
      } else {
        // Video สูงกว่า: scale ตาม width, crop บน-ล่าง
        scaleX = videoWidth / screenWidth;
        scaleY = scaleX;
        offsetX = 0;
        offsetY = (videoHeight - screenHeight * scaleY) / 2;
      }
      
      // กรอบบนหน้าจอ = min(90vw, 90vh) ตรงกลาง
      const frameSizeOnScreen = Math.min(screenWidth, screenHeight) * 0.9;
      
      // คำนวณขนาดและตำแหน่งกรอบใน video pixels
      const cropSizeInVideo = frameSizeOnScreen * scaleX;
      const cropX = offsetX + (screenWidth * scaleX - cropSizeInVideo) / 2;
      const cropY = offsetY + (screenHeight * scaleY - cropSizeInVideo) / 2;
      
      // ตั้งค่า Canvas เป็น 1024x1024
      canvas.width = TARGET_SIZE;
      canvas.height = TARGET_SIZE;
      
      const context = canvas.getContext('2d');
      context.drawImage(
        video, 
        cropX, cropY, cropSizeInVideo, cropSizeInVideo,
        0, 0, TARGET_SIZE, TARGET_SIZE
      );
      
      // แปลง Canvas เป็น Base64 Image (JPEG คุณภาพ 90%)
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageUrl);
      console.log('Cropped from frame: 1024x1024, Base64 length:', imageUrl.length);
    }
  };

  // --- ฟังก์ชันถ่ายใหม่ ---
  const handleRetake = () => {
    setCapturedImage(null);
  };

  // --- ฟังก์ชันสลับกล้อง ---
  const handleSwitchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // --- ฟังก์ชันเปิด/ปิดแฟลช ---
  const handleToggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = track.getCapabilities();
          if (capabilities.torch) {
            const newFlashState = !flashOn;
            await track.applyConstraints({
              advanced: [{ torch: newFlashState }]
            });
            setFlashOn(newFlashState);
          } else {
            alert('อุปกรณ์นี้ไม่รองรับแฟลช');
          }
        } catch (err) {
          console.error('Error toggling flash:', err);
          alert('ไม่สามารถเปิดแฟลชได้');
        }
      }
    }
  };

  // --- ฟังก์ชันเลือกรูปภาพจากเครื่อง ---
  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // ครอปรูปที่เลือกให้เป็น 1024x1024 ตรงกลาง
        const img = new Image();
        img.onload = () => {
          // สร้าง canvas ใหม่สำหรับ crop เพื่อให้แน่ใจว่าทำงานถูกต้อง
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = TARGET_SIZE;
          tempCanvas.height = TARGET_SIZE;
          
          // Crop สี่เหลี่ยมจัตุรัสตรงกลางรูป
          const cropSize = Math.min(img.width, img.height);
          const cropX = (img.width - cropSize) / 2;
          const cropY = (img.height - cropSize) / 2;
          
          const context = tempCanvas.getContext('2d');
          context.drawImage(
            img,
            cropX, cropY, cropSize, cropSize,
            0, 0, TARGET_SIZE, TARGET_SIZE
          );
          
          const croppedImage = tempCanvas.toDataURL('image/jpeg', 0.9);
          setCapturedImage(croppedImage);
          console.log('Cropped picked image: 1024x1024, Base64 length:', croppedImage.length);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // --- ฟังก์ชันยืนยันการใช้รูป ---
  const handleConfirm = async () => {
    if (!capturedImage || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const result = await ScanFood({ image_base64: capturedImage });
      const carbValue = Number(result?.carb);

      if (Number.isNaN(carbValue)) {
        throw new Error('รูปแบบข้อมูล carb ไม่ถูกต้อง');
      }

      navigate('/scan-result', {
        state: {
          carb: carbValue,
          image: capturedImage,
          scanResult: result,
        },
      });
    } catch (error) {
      console.error('Scan food failed:', error);
      alert('ไม่สามารถวิเคราะห์อาหารได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileLayout>
      <div className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col font-sans">
        
        {/* --- Hidden Canvas (ใช้สำหรับประมวลผลรูปเท่านั้น ไม่แสดงผลบนจอ) --- */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* --- Hidden File Input สำหรับเลือกรูปภาพ --- */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileChange}
          className="hidden" 
        />

        {/* =========================================
            STATE 1: โหมดกล้อง (ยังไม่ได้ถ่าย)
            ========================================= */}
        {!capturedImage && (
          <>
            {/* Loading State */}
            {hasPermission === null && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm px-8 text-center bg-slate-900 z-0">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                กำลังเปิดกล้อง...
              </div>
            )}

            {/* No Camera / Permission Denied */}
            {hasPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm px-8 text-center bg-slate-900 z-0 gap-4">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-2">
                  <ZapOff size={40} className="text-slate-500" />
                </div>
                <p>ไม่สามารถเข้าถึงกล้องได้</p>
                <p className="text-slate-400 text-xs">กรุณาอนุญาตการใช้งานกล้องในการตั้งค่า<br/>หรือใช้อุปกรณ์ที่มีกล้อง</p>
                <button 
                  onClick={() => window.history.back()}
                  className="mt-4 px-6 py-3 bg-[#6CD2D9] rounded-full text-white font-bold"
                >
                  กลับ
                </button>
              </div>
            )}

            {/* Real Camera Feed */}
            {hasPermission === true && (
              <>
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
                
                {/* Viewfinder Frame Overlay - กรอบสี่เหลี่ยม 1024x1024 ตรงกลาง */}
                <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none">
                  
                  {/* กรอบสี่เหลี่ยมตรงกลาง */}
                  <div 
                    className="relative"
                    style={{ 
                      width: 'min(90vw, 90vh)',
                      height: 'min(90vw, 90vh)',
                    }}
                  >
                    {/* มุมทั้ง 4 */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#6CD2D9] rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#6CD2D9] rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#6CD2D9] rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#6CD2D9] rounded-br-xl" />
                    
                    {/* ข้อความแนะนำ */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/80 text-sm whitespace-nowrap bg-black/40 px-3 py-1 rounded-full">
                      วางอาหารให้อยู่ในกรอบ
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Top Controls */}
            {hasPermission === true && (
            <div className="absolute top-0 left-0 w-full p-6 pt-safe-top flex justify-between items-start z-10">
              <button 
                onClick={() => window.history.back()}
                className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleToggleFlash}
                  className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors ${
                    flashOn ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-black/40 hover:bg-black/60'
                  }`}
                >
                  {flashOn ? <Zap size={20} /> : <ZapOff size={20} />}
                </button>
                <button 
                  onClick={handleSwitchCamera}
                  className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <RefreshCcw size={18} />
                </button>
              </div>
            </div>
            )}



            {/* Bottom Controls (Capture Button) */}
            {hasPermission === true && (
            <div className="absolute bottom-0 left-0 w-full pb-12 pt-8 px-8 flex items-center justify-center z-10 bg-gradient-to-t from-black/60 to-transparent">
              <div className="relative w-full flex items-center justify-center">
                
                {/* ปุ่มถ่ายรูป */}
                <button 
                  onClick={handleCapture}
                  className="relative w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm p-1.5 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <div className="w-full h-full bg-white rounded-full shadow-sm"></div>
                </button>

                <button 
                  onClick={handlePickImage}
                  className="absolute right-0 w-12 h-12 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-black/60 transition-colors border border-white/10"
                >
                  <ImageIcon size={22} />
                </button>
              </div>
            </div>
            )}
          </>
        )}

        {/* =========================================
            STATE 2: โหมดพรีวิว (ถ่ายรูปเสร็จแล้ว)
            ========================================= */}
        {capturedImage && (
          <>
            {/* Black background */}
            <div className="absolute inset-0 bg-black z-0" />
            
            {/* แสดงรูปที่ถ่าย - ตรงกลางพร้อม black bar บนล่าง */}
            <div className="absolute inset-0 flex items-center justify-center z-[1] py-20">
              <img 
                src={capturedImage} 
                alt="Captured Meal" 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Top Controls (Back/Retake) */}
            <div className="absolute top-0 left-0 w-full p-6 pt-safe-top flex justify-between items-start z-10 bg-gradient-to-b from-black/60 to-transparent">
              <button 
                onClick={handleRetake}
                className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
            </div>

            {/* Bottom Controls (Retake / Confirm) */}
            <div className="absolute bottom-0 left-0 w-full p-8 pb-12 flex items-center justify-between gap-4 z-10 bg-gradient-to-t from-black/80 to-transparent">
              <button 
                onClick={handleRetake}
                className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
              >
                <X size={20} /> ถ่ายใหม่
              </button>
              <button 
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 bg-[#6CD2D9] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg hover:bg-[#5bc0c7] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Check size={20} /> {isSubmitting ? 'กำลังวิเคราะห์...' : 'ใช้รูปนี้'}
              </button>
            </div>
          </>
        )}

      </div>
    </MobileLayout>
  );
};

export default CameraPage;