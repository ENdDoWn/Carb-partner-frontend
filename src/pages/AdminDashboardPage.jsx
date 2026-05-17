import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopLayout from '../components/DesktopLayout';
import { getAdminDashboard, getAdminUsers } from '../Api/Admin';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const FOOD_BUCKETS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snack', label: 'Snack' },
];

const toInputDate = (date) => date.toISOString().slice(0, 10);

const getDefaultRange = () => {
  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() - 7);
  return {
    from: toInputDate(from),
    to: toInputDate(today),
  };
};

const normalizeFoodSummary = (payload) => {
  if (!payload) return {};
  if (Array.isArray(payload)) {
    return payload.reduce((acc, item) => {
      const key = String(item?.bucket ?? item?.name ?? '').toLowerCase();
      if (!key) return acc;
      acc[key] = {
        count: item.count ?? item.total ?? 0,
        carbs: item.carbs ?? item.carb ?? 0,
      };
      return acc;
    }, {});
  }
  return payload;
};

const normalizeBloodSugar = (payload) => {
  if (!payload) return [];
  const points = Array.isArray(payload) ? payload : payload.points ?? payload.data ?? [];
  return points.map((point) => ({
    time: point.time ?? point.hour ?? point.label ?? '',
    value: Number(point.value ?? point.sugar ?? point.level ?? 0),
  }));
};

const deriveMealKey = (value) => {
  if (!value) return 'snack';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'snack';
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const timeValue = hour * 60 + minutes;
  if (timeValue < 10 * 60 + 30) return 'breakfast';
  if (timeValue < 15 * 60) return 'lunch';
  if (timeValue < 21 * 60) return 'dinner';
  return 'snack';
};

const summarizeCarbLogs = (logs) => {
  const summary = {
    breakfast: { count: 0, carbs: 0 },
    lunch: { count: 0, carbs: 0 },
    dinner: { count: 0, carbs: 0 },
    snack: { count: 0, carbs: 0 },
  };
  (logs || []).forEach((item) => {
    const mealKey = (item.meal_key || item.mealKey || deriveMealKey(item.created_at)).toLowerCase();
    const bucket = summary[mealKey] ?? summary.snack;
    bucket.count += 1;
    bucket.carbs += Number(item.carb ?? 0);
  });
  return summary;
};

const calculateAgeFromBirthDate = (birthDate) => {
  if (!birthDate || typeof birthDate !== 'string') return null;
  const parts = birthDate.split('/');
  if (parts.length !== 3) return null;
  const day = Number(parts[0]);
  const month = Number(parts[1]);
  let year = Number(parts[2]);
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) return null;
  if (year > 2400) {
    year -= 543;
  }
  const birth = new Date(year, month - 1, day);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const isBeforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (isBeforeBirthday) age -= 1;
  return age >= 0 ? age : null;
};

const formatBangkokDateTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatBangkokDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const formatBangkokDayKey = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
  return parts;
};

const toUtcDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  return new Date(Date.UTC(year, month - 1, day));
};

const buildDateRange = (fromDate, toDate) => {
  const start = toUtcDate(fromDate);
  const end = toUtcDate(toDate);
  if (!start || !end) return [];
  const dates = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
};

const buildDailyCarbSeries = (logs, fromDate, toDate, totalDays = 8) => {
  const totals = new Map();
  (logs || []).forEach((item) => {
    const date = new Date(item.created_at);
    if (Number.isNaN(date.getTime())) return;
    const key = formatBangkokDayKey(date);
    if (!key) return;
    const current = totals.get(key) ?? 0;
    totals.set(key, current + Number(item.carb ?? 0));
  });

  const rangeDates = buildDateRange(fromDate, toDate);
  const baseDates = rangeDates.length
    ? rangeDates
    : Array.from(totals.keys()).map((key) => ({ dateLabel: key }));

  const filledDates = [];
  for (let i = 0; i < totalDays; i += 1) {
    const date = baseDates[i];
    if (date instanceof Date) {
      filledDates.push({
        dateLabel: formatBangkokDate(date),
        dayKey: formatBangkokDayKey(date),
      });
    } else {
      filledDates.push({
        dateLabel: date?.dateLabel ?? '-',
        dayKey: date?.dayKey ?? null,
      });
    }
  }

  return filledDates.map((entry, index) => {
    const total = entry.dayKey ? totals.get(entry.dayKey) ?? 0 : 0;
    return {
      dayLabel: `day${index + 1}`,
      dateLabel: entry.dateLabel,
      total: Math.round(total * 10) / 10,
    };
  });
};

const buildHourlySeries = (logs, fromDate, toDate, totalDays = 8) => {
  const tz = 'Asia/Bangkok';
  const perDayLatest = new Map();

  (logs || []).forEach((item) => {
    const date = new Date(item.created_at);
    if (Number.isNaN(date.getTime())) return;
    const dayKey = formatBangkokDayKey(date);
    if (!dayKey) return;
    const existing = perDayLatest.get(dayKey);
    if (!existing || date > existing.rawDate) {
      perDayLatest.set(dayKey, {
        rawDate: date,
        dayKey,
        time: date.toISOString(),
        label: new Intl.DateTimeFormat('en-GB', {
          timeZone: tz,
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date),
        value: Number(item.sugar_level ?? item.value ?? 0),
      });
    }
  });

  const points = Array.from(perDayLatest.values()).sort((a, b) => a.rawDate - b.rawDate);
  const rangeDates = buildDateRange(fromDate, toDate);
  const startDate = rangeDates[0];
  const endDate = rangeDates[rangeDates.length - 1];
  const fallbackStart = points[0]?.rawDate ? new Date(points[0].rawDate) : null;
  const fallbackEnd = points[points.length - 1]?.rawDate ? new Date(points[points.length - 1].rawDate) : null;

  const daySlots = [
    {
      key: formatBangkokDayKey(startDate ?? fallbackStart),
      label: formatBangkokDate(startDate ?? fallbackStart) ?? '-'
    },
    {
      key: formatBangkokDayKey(endDate ?? fallbackEnd),
      label: formatBangkokDate(endDate ?? fallbackEnd) ?? '-'
    },
  ];

  return daySlots.map((entry, index) => {
    const point = points.find((item) => item.dayKey === entry.key);
    return {
      time: point?.time ?? null,
      label: point?.label ?? entry.label,
      value: point?.value ?? 0,
      dayLabel: index === 0 ? 'day1' : `day${totalDays}`,
    };
  });
};

const buildProfileRows = (profile) => {
  if (!profile) return [];
  const age = calculateAgeFromBirthDate(profile.birth_date);
  return [
    { label: 'Name', value: profile.name ?? profile.full_name ?? '-' },
    { label: 'Email', value: profile.email ?? '-' },
    { label: 'Phone', value: profile.phone ?? profile.phone_number ?? '-' },
    { label: 'Age', value: age ?? profile.age ?? profile.user_age ?? '-' },
    { label: 'Weight', value: profile.weight ? `${profile.weight} kg` : '-' },
    { label: 'Height', value: profile.height ? `${profile.height} cm` : '-' },
    { label: 'Last Active', value: formatBangkokDateTime(profile.last_active ?? profile.last_login) ?? '-' },
  ];
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState(() => getDefaultRange());
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userError, setUserError] = useState('');

  const carbLogs = useMemo(() => data?.carb_logs ?? data?.carbLogs ?? [], [data]);
  const sugarLogs = useMemo(() => data?.blood_sugar_logs ?? data?.bloodSugarLogs ?? [], [data]);
  const foodSummary = useMemo(() => {
    const summary = normalizeFoodSummary(data?.food_summary ?? data?.foodSummary);
    if (Object.keys(summary).length) return summary;
    return summarizeCarbLogs(carbLogs);
  }, [data, carbLogs]);
  const sugarSeries = useMemo(() => {
    const chartSeries = normalizeBloodSugar(data?.blood_sugar ?? data?.bloodSugar);
    if (chartSeries.length) return chartSeries;
    return buildHourlySeries(sugarLogs, range.from, range.to, 8);
  }, [data, sugarLogs, range.from, range.to]);
  const dailyCarbSeries = useMemo(
    () => buildDailyCarbSeries(carbLogs, range.from, range.to, 8),
    [carbLogs, range.from, range.to]
  );
  const profileRows = useMemo(() => buildProfileRows(data?.profile ?? data?.user_profile), [data]);

  const fetchDashboard = async () => {
    if (!range.from || !range.to) return;
    setLoading(true);
    setError('');
    try {
      const res = await getAdminDashboard(range.from, range.to, selectedUserId || undefined);
      setData(res);
    } catch (err) {
      setError('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUserError('');
    try {
      const res = await getAdminUsers(100);
      const list = Array.isArray(res?.users) ? res.users : [];
      setUsers(list);
      if (!selectedUserId && list.length) {
        setSelectedUserId(list[0].id);
      }
    } catch (err) {
      setUserError('โหลดรายชื่อผู้ใช้ไม่สำเร็จ');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchDashboard();
    }
  }, [range.from, range.to, selectedUserId]);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin-login', { replace: true });
  };

  const actions = (
    <div className="flex flex-wrap gap-3">
      <label className="text-xs text-slate-500">
        User
        <select
          value={selectedUserId}
          onChange={(event) => setSelectedUserId(event.target.value)}
          className="mt-1 block min-w-[220px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.full_name || user.username || user.email || user.id}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-slate-500">
        From
        <input
          type="date"
          value={range.from}
          onChange={(event) => setRange((prev) => ({ ...prev, from: event.target.value }))}
          className="mt-1 block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200"
        />
      </label>
      <label className="text-xs text-slate-500">
        To
        <input
          type="date"
          value={range.to}
          onChange={(event) => setRange((prev) => ({ ...prev, to: event.target.value }))}
          className="mt-1 block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200"
        />
      </label>
      <button
        type="button"
        onClick={fetchDashboard}
        className="mt-5 h-fit rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-slate-800"
      >
        Refresh
      </button>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-5 h-fit rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:border-rose-300"
      >
        Logout
      </button>
    </div>
  );

  return (
    <DesktopLayout
      title="Admin Dashboard"
      subtitle="ภาพรวมการใช้งานผู้ใช้และการติดตามน้ำตาล"
      actions={actions}
    >
      {loading ? (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 text-sm text-slate-500 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          กำลังโหลดข้อมูล...
        </div>
      ) : null}
      {error ? (
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-600 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          {error}
        </div>
      ) : null}
      {userError ? (
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6 text-sm text-amber-700 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          {userError}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[2fr,3fr]">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-600">User Profile</div>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">ข้อมูลผู้ใช้</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {profileRows.map((row) => (
              <div key={row.label} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="text-xs text-slate-500">{row.label}</div>
                <div className="mt-1 text-sm font-semibold text-slate-800">{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-600">Food Logs</div>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">คาร์บรวมรายวัน</h2>
            </div>
            <div className="text-xs text-slate-400">{range.from} - {range.to}</div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyCarbSeries} margin={{ left: 8, right: 24, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="6 6" stroke="#E2E8F0" />
                <XAxis dataKey="dayLabel" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, borderColor: '#E2E8F0' }}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.dateLabel ?? ''}
                  formatter={(value) => [`${value} g`, 'Carbs']}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#55BCC3"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, stroke: '#0EA5B1' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-600">Blood Sugar</div>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">กราฟข้อมูลระดับน้ำตาล</h2>
            <p className="mt-1 text-xs text-slate-500">Hourly points within selected range</p>
          </div>
          <div className="rounded-2xl bg-cyan-50 px-3 py-2 text-xs text-cyan-700">Points: {sugarSeries.length}</div>
        </div>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sugarSeries} margin={{ left: 24, right: 24, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="6 6" stroke="#E2E8F0" />
              <XAxis
                dataKey="dayLabel"
                tick={{ fill: '#64748B', fontSize: 11 }}
                interval="preserveStartEnd"
                padding={{ left: 170, right: 170 }}
              />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, borderColor: '#E2E8F0' }}
                labelFormatter={(_, payload) => formatBangkokDateTime(payload?.[0]?.payload?.time) ?? ''}
                formatter={(value) => [value, 'Sugar']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#55BCC3"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, stroke: '#0EA5B1' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </DesktopLayout>
  );
};

export default AdminDashboardPage;
