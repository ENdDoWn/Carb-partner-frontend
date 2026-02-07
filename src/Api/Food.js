import api from '../api';

export const getFoods = async () => {
  const res = await api.get('/foods')
  return res.data
}

export const getFoodById = async (id) => {
  const res = await api.get(`/foods/${id}`)
  return res.data
}

export const createScanFood = async (data) => {
  const res = await api.post('/foods/scan', data)
  return res.data
}