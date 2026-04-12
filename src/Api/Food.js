import api from '../api';

export const ScanFood = async (data) => {
  const res = await api.post('/food/analyze/', data)
  return res.data
}

export const saveScanResult = async (data) => {
  const res = await api.post('/food/confirm_food/', data )
  return true
}