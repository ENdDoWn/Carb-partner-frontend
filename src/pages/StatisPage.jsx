import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, TrendingUp, TrendingDown
} from 'lucide-react';
import { getStatsHistory } from '../Api/History';

// Import Components ที่แยกไว้
import MobileLayout from '../components/MobileLayout';
import Navigation from '../components/Navigation';

const TAB_OPTIONS = [
  { key: 'day', label: 'วัน' },
  { key: 'week', label: 'สัปดาห์' },
  { key: 'month', label: 'เดือน' },
];

const getCurrentAnchorDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const buildLinePath = (points) => {
  if (!points.length) return '';

  return points.reduce((acc, point, index) => {
    if (index === 0) return `M${point.x},${point.y}`;
    return `${acc} L${point.x},${point.y}`;
  }, '');
};

const getChartCoordinates = (seriesPoints, width, height, yMin, yMax) => {
  const stepX = seriesPoints.length > 1 ? (width - 20) / (seriesPoints.length - 1) : 0;

  return seriesPoints.map((point, index) => {
    const normalized = yMax === yMin ? 0 : (point.value - yMin) / (yMax - yMin);
    return {
      x: 10 + index * stepX,
      y: 140 - clamp(normalized, 0, 1) * (height - 40),
      value: point.value,
      rawX: point.x,
    };
  });
};

const getStatsViewModel = (activeTab, historyPayload) => {
  const tabData = historyPayload?.tabs?.[activeTab];
  if (!tabData) return null;

  const yAxis = tabData.chart?.yAxis ?? { min: 0, max: 200, unit: '' };
  const labels = tabData.chart?.labels ?? [];
  const chartSeries = (tabData.chart?.series ?? []).map((series) => {
    const points = getChartCoordinates(series.points ?? [], 340, 120, yAxis.min, yAxis.max);
    return {
      ...series,
      points,
      path: buildLinePath(points),
    };
  });

  const highlight = tabData.chart?.highlight ?? { seriesKey: chartSeries[0]?.key, index: 0 };
  const highlightedSeries = chartSeries.find((series) => series.key === highlight.seriesKey) ?? chartSeries[0];
  const highlightedPoint = highlightedSeries?.points?.[highlight.index] ?? highlightedSeries?.points?.[0] ?? null;

  return {
    comparisonLabel: tabData.comparisonLabel ?? '',
    summaryCards: tabData.summaryCards ?? [],
    targetSuccess: tabData.targetSuccess ?? { percent: 0, trendText: '0%', isPositive: true },
    carb_expect: tabData.carb_expect ?? tabData.carbGoal ?? { consumed: 0, goal: 0, unit: '' },
    chart: {
      labels,
      yAxis,
      series: chartSeries,
      highlightedPoint,
      highlightedColor: highlightedSeries?.color ?? '#EF4444',
    },
  };
};

// --- Components ย่อยสำหรับหน้านี้ ---

// 1. Tab Button (ปุ่มเลือกช่วงเวลา)
const TabButton = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
      active 
        ? 'bg-[#55BCC3] text-white shadow-md' 
        : 'text-slate-400 hover:bg-slate-50'
    }`}
  >
    {label}
  </button>
);

// 2. Stat Card (การ์ดแสดงตัวเลขเฉลี่ย)
const StatCard = ({ title, value, unit, trend, isPositive }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
    <h3 className="text-xs text-slate-500 font-bold">{title}</h3>
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-extrabold text-slate-800">{value}</span>
        <span className="text-xs text-slate-400 font-medium">{unit}</span>
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{trend}</span>
      </div>
    </div>
  </div>
);

// 3. Custom Line Chart (กราฟเส้นโค้ง SVG)
const CustomLineChart = ({ chartModel }) => {
  if (!chartModel) return null;

  const labelStepX = chartModel.labels.length > 1 ? (340 - 20) / (chartModel.labels.length - 1) : 0;
  const tooltipValue = chartModel.highlightedPoint
    ? `${chartModel.highlightedPoint.value.toFixed(0)} ${chartModel.yAxis.unit === 'mg/dL' ? 'มก./ดล.' : chartModel.yAxis.unit}`
    : '';

  return (
    <div className="w-full h-48 relative mt-4">
      <svg viewBox="0 0 350 180" className="w-full h-full overflow-visible">
        {/* Grid Lines (เส้นบรรทัดจางๆ) */}
        <line x1="0" y1="40" x2="350" y2="40" stroke="#F1F5F9" strokeWidth="1" />
        <line x1="0" y1="90" x2="350" y2="90" stroke="#F1F5F9" strokeWidth="1" />
        <line x1="0" y1="140" x2="350" y2="140" stroke="#F1F5F9" strokeWidth="1" />

        {chartModel.series.map((series) => (
          <path
            key={series.key}
            d={series.path}
            fill="none"
            stroke={series.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Tooltip Dot & Label (จุดแดงและป้ายกำกับ) */}
        {chartModel.highlightedPoint && (
          <>
            <circle cx={chartModel.highlightedPoint.x} cy={chartModel.highlightedPoint.y} r="4" fill={chartModel.highlightedColor} stroke="white" strokeWidth="2" />
            <g transform={`translate(${chartModel.highlightedPoint.x - 35}, ${chartModel.highlightedPoint.y - 30})`}>
          <rect x="0" y="0" width="70" height="22" rx="6" fill="#EF4444" />
              <text x="35" y="15" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{tooltipValue}</text>
          {/* Triangle pointing down */}
          <path d="M30,22 L35,27 L40,22 Z" fill="#EF4444" />
        </g>
          </>
        )}

        {/* X-Axis Labels */}
        <g className="text-[10px] fill-slate-400 font-medium" transform="translate(0, 170)">
          {chartModel.labels.map((label, index) => (
            <text key={`${label}-${index}`} x={10 + index * labelStepX} textAnchor="middle">{label}</text>
          ))}
        </g>
      </svg>
    </div>
  );
};

// --- Main Page Component ---
const StatsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('week');
  const [statsHistoryData, setStatsHistoryData] = useState({ tabs: {} });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      setStatsError('');

      try {
        const periods = TAB_OPTIONS.map((tab) => tab.key);
        const historyData = await getStatsHistory(periods, getCurrentAnchorDate());
        console.log(historyData);
        setStatsHistoryData(historyData);
      } catch (error) {
        console.error('Failed to fetch stats data:', error);
        setStatsError('ไม่สามารถโหลดข้อมูลสถิติได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const activeTabLabel = TAB_OPTIONS.find((tab) => tab.key === activeTab)?.label ?? 'สัปดาห์';
  const viewModel = useMemo(() => getStatsViewModel(activeTab, statsHistoryData), [activeTab, statsHistoryData]);
  const targetPercent = clamp(viewModel?.targetSuccess?.percent ?? 0, 0, 100);
  const targetDashOffset = 175 - (175 * targetPercent) / 100;
  const carbConsumed = viewModel?.carb_expect?.consumed ?? 0;
  const carbGoal = viewModel?.carb_expect?.goal ?? 0;
  const carbProgressPercent = carbGoal > 0 ? clamp((carbConsumed / carbGoal) * 100, 0, 100) : 0;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  return (
    <MobileLayout>
      
      {/* Header */}
      <div className="px-4 pt-safe-top pb-2 bg-white sticky top-0 z-20">
        <div className="flex items-center justify-between py-3">
          <button onClick={handleBack} className="p-2 -ml-2 text-slate-800 hover:bg-slate-50 rounded-full">
            <ChevronLeft size={24} />
          </button>

          <h1 className="text-lg font-bold text-slate-800 text-center w-full">สถิติ</h1>

          <div className="w-10"></div>

        </div>

        {/* Tabs Segmented Control */}
        <div className="bg-slate-100 p-1 rounded-xl flex mb-2">
          {TAB_OPTIONS.map((tab) => (
            <TabButton
              key={tab.key}
              label={tab.label}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            />
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-4 pt-2 no-scrollbar bg-[#F8FAFC]">
        {isLoadingStats && (
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-sm text-slate-500">
            กำลังโหลดข้อมูลสถิติ...
          </div>
        )}

        {statsError && (
          <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-sm text-red-600">
            {statsError}
          </div>
        )}
        
        {/* 1. Main Chart Card */}
        <div className="bg-white p-5 rounded-3xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="font-bold text-slate-800 text-lg">แนวโน้มราย{activeTabLabel}</h2>
              <p className="text-xs text-slate-400">เทียบกับ{viewModel?.comparisonLabel}</p>
            </div>
            {/* Legend */}
            <div className="flex gap-3 text-xs font-bold text-slate-600">
               {viewModel?.chart?.series?.map((series) => (
                 <div key={series.key} className="flex items-center gap-1">
                   <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: series.color }}></div>
                   <span>{series.label}</span>
                 </div>
               ))}
            </div>
          </div>
          
          <CustomLineChart chartModel={viewModel?.chart} />
        </div>

        {/* 2. Summary Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {(viewModel?.summaryCards ?? []).map((card) => (
            <StatCard
              key={card.id}
              title={card.title}
              value={card.value}
              unit={card.unit}
              trend={card.trendText}
              isPositive={card.isPositive}
            />
          ))}
        </div>

        {/* 3. Target Success Card */}
        <div className="bg-white p-5 rounded-3xl shadow-sm flex items-center gap-4">
          {/* Donut Chart Mini */}
          <div className="relative w-16 h-16 shrink-0">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="28" stroke="#E2E8F0" strokeWidth="6" fill="transparent" />
               <circle cx="50%" cy="50%" r="28" stroke="#55BCC3" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset={targetDashOffset} strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-slate-800">
              {targetPercent.toFixed(0)}%
             </div>
          </div>
          
          <div>
             <h3 className="font-bold text-slate-800">อยู่ในเกณฑ์เป้าหมาย</h3>
             <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${viewModel?.targetSuccess?.isPositive ? 'text-green-500' : 'text-red-500'}`}>
               {viewModel?.targetSuccess?.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
               <span>{viewModel?.targetSuccess?.trendText} เทียบกับ{viewModel?.comparisonLabel}</span>
             </div>
          </div>
        </div>

        {/* 4. Weekly Carb Goal Card */}
        <div className="bg-white p-5 rounded-3xl shadow-sm mb-4">
           <div className="flex justify-between items-end mb-2">
              <h3 className="font-bold text-slate-800">เป้าหมายคาร์บราย{activeTabLabel}</h3>
              <div className="text-xs">
                <span className="font-bold text-slate-800">{carbConsumed}{viewModel?.carb_expect?.unit}</span>
                <span className="text-slate-400"> / {carbGoal}{viewModel?.carb_expect?.unit}</span>
              </div>
           </div>
           
           {/* Linear Progress Bar */}
           <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#55BCC3] rounded-full" style={{ width: `${carbProgressPercent}%` }}></div>
           </div>
        </div>

      </div>

      {/* Navigation (Active = stats) */}
      <Navigation activePage="stats" />

    </MobileLayout>
  );
};

export default StatsPage;