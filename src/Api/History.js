import api from '../api';

export const getStatsByPeriod = async (period, anchorDate) => {
  const res = await api.get('/stats', {
    params: {
      period,
      anchor_date: anchorDate,
    },
  });

  return res.data;
};

export const getStatsHistory = async (periods, anchorDate) => {
  const responses = await Promise.all(
    periods.map(async (period) => {
      const data = await getStatsByPeriod(period, anchorDate);
      return [period, data ?? null];
    })
  );

  return {
    tabs: Object.fromEntries(responses),
  };
};

const toThaiBeDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear() + 543;
  return `${day}/${month}/${year}`;
};

export const getDailyTotalsByDate = async (date) => {
  const res = await api.get('/daily_totals_by_date', {
    params: {
      selected_date: toThaiBeDate(date),
    },
  });

  return res.data;
};
