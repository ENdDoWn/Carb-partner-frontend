import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';

const LineCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("กำลังยืนยันตัวตนกับ LINE...");
    const code = searchParams.get('code');

    useEffect(() => {
        if (!code) {
            navigate('/signin');
            return;
        }

        const loginWithLine = async () => {
            try {
                const res = await api.post('/line/login', {
                    code: code 
                });
                localStorage.setItem('access_token', res.data.access_token);
                navigate('/subinfo');

            } catch (error) {
                console.error("LINE Login Error:", error);
                setStatus("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
                setTimeout(() => navigate('/signin'), 2300);
            }
        };
        loginWithLine();
    }, [code, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">{status}</h2>
        </div>
    );
};

export default LineCallbackPage;
