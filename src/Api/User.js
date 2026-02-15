import api from '../api';

const USER_DATA_CACHE_KEY = 'userData';

const readCachedUserData = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  const cached = window.localStorage.getItem(USER_DATA_CACHE_KEY);
  if (!cached) {
    return null;
  }

  try {
    const parsed = JSON.parse(cached);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    console.log('Failed to parse cached userData', error);
    window.localStorage.removeItem(USER_DATA_CACHE_KEY);
    return null;
  }
};

const writeCachedUserData = (data) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(USER_DATA_CACHE_KEY, JSON.stringify(data));
};

export const getUserInfo = async () => {
  const cached = readCachedUserData();
  if (cached) {
    return cached;
  }

  const res = await api.get('/users/me/');
  if (res?.data) {
    writeCachedUserData(res.data);
  }
  return res.data;
}

export const updateUserInfo = async (data) => {
  const res = await api.put('/users/me/', data);
  if (res?.data) {
    writeCachedUserData(data.user);
  }
  return data.user;
}

export const saveUserQuestionnaire = async (data) => {
  const res = await api.post('/users/add_info/', data)
  return res.data
}

export const saveRating = async (data) => {
  const res = await api.post('/user/rating', data)
  return res.data
}

export const allCarbHistory = async () => {
  const res = await api.get('/user/carb-history')
  return res.data
}

export const updateBloodSugar = async (data) => {
  const res = await api.post('/add_sugars', data)
  return res.data
}