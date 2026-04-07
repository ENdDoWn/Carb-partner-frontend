import api from '../api';

export const getFoods = async () => {
  const res = await api.get('/foods')
  return res.data
}

export const getFoodById = async (id) => {
  const res = await api.get(`/foods/${id}`)
  return res.data
}

export const ScanFood = async (data) => {
  const res = await api.post('/food/analyze/', data)
  return res.data
}

export const saveScanResult = async (data) => {
  const res = await api.post('/food/confirm_food', data)
  return res.data
}