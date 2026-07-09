import api from './api';
import type { IRecommendation, IExplanation } from '../types';

export const recommendationService = {
  async getRecommendations(): Promise<IRecommendation[]> {
    const res = await api.get('/recommendations');
    return res.data.recommendations || res.data;
  },

  async getExplanation(userId: string): Promise<IExplanation> {
    const res = await api.get(`/recommendations/explain/${userId}`);
    return res.data.explanation || res.data;
  },
};
