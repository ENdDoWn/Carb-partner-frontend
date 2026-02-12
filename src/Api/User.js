import api from '../api';

export const getUserInfo = async () => {
  const res = await api.get('/users/me/')
  return res.data
}

export const updateUserInfo = async (data) => {
  const res = await api.put('/user', data)
  return res.data
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