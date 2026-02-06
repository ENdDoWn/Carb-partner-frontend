import api from '../api';

export const getUserInfo = async () => {
  const res = await api.get('/user')
  return res.data
}

export const updateUserInfo = async (data) => {
  const res = await api.put('/user', data)
  return res.data
}

export const saveUserQuestionnaire = async (data) => {
  const res = await api.post('/user/questionnaire', data)
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
  const res = await api.put('/user/blood-sugar', data)
  return res.data
}