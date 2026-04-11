import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserInfo } from '../Api/User';

const ProfileGate = () => {
  const [targetPath, setTargetPath] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        if (!isActive) return;

        const user = userInfo?.user ?? userInfo;
        const nextPath = user?.has_profile ? '/home' : '/subinfo';
        setTargetPath(nextPath);
      } catch (error) {
        if (!isActive) return;
        setHasError(true);
      }
    };

    loadUserInfo();

    return () => {
      isActive = false;
    };
  }, []);

  if (hasError) {
    return <Navigate to="/signin" replace />;
  }

  if (!targetPath) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        กำลังตรวจสอบข้อมูลผู้ใช้...
      </div>
    );
  }

  return <Navigate to={targetPath} replace />;
};

export default ProfileGate;
