import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_USERNAME = 'carb-admin';
const ADMIN_PASSWORD = 'admin-carb';
const ADMIN_SESSION_KEY = 'admin_session';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      navigate('/admin-dashboard', { replace: true });
      return;
    }

    setError('Username หรือ Password ไม่ถูกต้อง');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-200/70 via-sky-100/50 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-10 h-80 w-80 rounded-full bg-gradient-to-tr from-teal-200/60 via-cyan-100/40 to-transparent blur-3xl" />
        <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-12">
          <div className="w-full rounded-3xl bg-white/90 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-600">Admin Access</div>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">Admin Dashboard Login</h1>
            <p className="mt-1 text-sm text-slate-500">
              เข้าสู่ระบบสำหรับดูข้อมูลภาพรวมของผู้ใช้
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <label className="text-sm text-slate-600">
                Username
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
                  placeholder="Username"
                  autoComplete="username"
                />
              </label>
              <label className="text-sm text-slate-600">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </label>
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
              <button
                type="submit"
                className="mt-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200 transition hover:bg-cyan-600"
              >
                เข้าสู่ระบบผู้ดูแล
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
