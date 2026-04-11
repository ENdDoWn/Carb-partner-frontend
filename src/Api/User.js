import api from '../api';

const USER_DATA_CACHE_KEY = 'userData';

const toBeBirthDateString = (rawBirthDate) => {
  if (!rawBirthDate || typeof rawBirthDate !== 'string') {
    return rawBirthDate ?? null;
  }

  const dateString = rawBirthDate.trim();
  if (!dateString) return null;

  if (dateString.includes('/')) {
    const [dayRaw, monthRaw, yearRaw] = dateString.split('/');
    const day = Number(dayRaw);
    const month = Number(monthRaw);
    const year = Number(yearRaw);

    if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
      return dateString;
    }

    const beYear = year > 2400 ? year : year + 543;
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${beYear}`;
  }

  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return dateString;
  }

  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const beYear = parsed.getFullYear() + 543;
  return `${day}/${month}/${beYear}`;
};

const isUserLikePayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const userHints = ['email', 'id', 'birth_date', 'birthDate', 'sex', 'active', 'weight', 'height'];
  return userHints.some((key) => Object.prototype.hasOwnProperty.call(payload, key));
};

const normalizeUserRecord = (user) => {
  if (!user || typeof user !== 'object') {
    return user;
  }

  return {
    ...user,
    birth_date: toBeBirthDateString(user.birth_date ?? user.birthDate),
    carb_expect: user.carb_expect ?? user.carbGoal ?? null,
  };
};

const normalizeUserPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  if (payload.user && typeof payload.user === 'object') {
    const normalizedUser = normalizeUserRecord(payload.user);
    return {
      ...payload,
      user: normalizedUser,
    };
  }

  if (isUserLikePayload(payload)) {
    const normalizedUser = normalizeUserRecord(payload);
    return {
      ...normalizedUser,
      user: normalizedUser,
    };
  }

  return payload;
};

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
    return parsed && typeof parsed === 'object' ? normalizeUserPayload(parsed) : null;
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

  const normalized = normalizeUserPayload(data);
  window.localStorage.setItem(USER_DATA_CACHE_KEY, JSON.stringify(normalized));
};

export const getUserInfo = async () => {
  const cached = readCachedUserData();
  if (cached) {
    return cached;
  }

  const res = await api.get('/users/me/');
  console.log('Fetched user info:', res);
  const normalized = normalizeUserPayload(res?.data);
  if (normalized) {
    writeCachedUserData(normalized);
  }
  return normalized;
}

export const updateUserInfo = async (data) => {
  const res = await api.post('/users/update_profile/', data);
  const normalized = normalizeUserPayload(res?.data);
  if (normalized) {
    writeCachedUserData(normalized);
  }
  return normalized;
}

export const saveUserQuestionnaire = async (data) => {
  const res = await api.post('/users/add_info/', data)
  const normalized = normalizeUserPayload(res?.data);
  if (normalized) {
    writeCachedUserData(normalized);
  }
  return normalized;
}

export const saveRating = async (data) => {
  const res = await api.post('/user/rating', data)
  return res.data
}

export const allCarbHistory = async () => {
  const res = await api.get('/user/carb-history')
  return res.data
}
export const allBloodSugarHistory = async () => {
  const res = await api.get('/blood_sugar_report')
  return res.data
}

export const updateBloodSugar = async (data) => {
  const res = await api.post('/add_sugars', data)
  console.log('Blood sugar update response:', res);
  return true
}