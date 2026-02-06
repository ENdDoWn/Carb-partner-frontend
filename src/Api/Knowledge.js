import api from '../api';

export const getKnowledgeDiseases = async () => {
  const res = await api.get('/knowledge/diseases')
  return res.data
}

export const getKnowledgeRecommendFood= async () => {
    const res = await api.get('/knowledge/recommend-food')
    return res.data
}

export const getKnowledgeExercise= async () => {
    const res = await api.get('/knowledge/exercise')
    return res.data
}