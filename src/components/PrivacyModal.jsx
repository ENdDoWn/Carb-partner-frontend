import React from 'react';

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-15 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-fade-in-up">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">นโยบายความเป็นส่วนตัว Carb-partner</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4">
          <p>
            <strong>1. ข้อมูลที่เราจัดเก็บ</strong><br/>
            แอปพลิเคชันของเราจะจัดเก็บข้อมูลพื้นฐานของท่าน ได้แก่ ชื่อผู้ใช้งาน (Display Name), รูปโปรไฟล์ และอีเมล (Email Address) เพื่อใช้ในการสร้างบัญชีและยืนยันตัวตน
          </p>
          <p>
            <strong>2. วัตถุประสงค์การใช้งาน</strong><br/>
            เราใช้ข้อมูลของท่านเพื่อ:
            <ul className="list-disc pl-5 mt-1">
              <li>ยืนยันตัวตนในการเข้าสู่ระบบ</li>
              <li>เชื่อมโยงบัญชีของท่านกับระบบสมาชิก</li>
            </ul>
          </p>
          <p>
            <strong>3. การเก็บรักษาข้อมูล</strong><br/>
            ข้อมูลของท่านจะถูกเก็บรักษาไว้อย่างปลอดภัยตามมาตรฐานสากล และเราจะไม่เปิดเผยข้อมูลต่อบุคคลภายนอกโดยไม่ได้รับอนุญาต
          </p>
          <p>
            <strong>4. สิทธิ์ของเจ้าของข้อมูล</strong><br/>
            ท่านสามารถขอลบข้อมูลบัญชีของท่านได้ตลอดเวลา โดยติดต่อทีมงานผ่านช่องทางที่กำหนด
          </p>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
          <button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            รับทราบ
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrivacyModal;