import api from '../api';

export const getAdminDashboard = async (fromDate, toDate, userId) => {
  const res = await api.get('/admin/dashboard', {
    params: {
      from: fromDate,
      to: toDate,
      user_id: userId,
    },
  });

  return res.data;
};

export const getAdminUsers = async (limit = 50) => {
  const res = await api.get('/admin/users', {
    params: {
      limit,
    },
  });

  return res.data;
};
