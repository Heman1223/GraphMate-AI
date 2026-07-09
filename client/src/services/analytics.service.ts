import api from './api';
import type { IDashboardStats, IFriendGrowth, IInterestDistribution, ISkillPopularity } from '../types';

export const analyticsService = {
  async getDashboardStats(): Promise<IDashboardStats> {
    const res = await api.get('/analytics/dashboard');
    return res.data;
  },

  async getFriendGrowth(): Promise<IFriendGrowth[]> {
    const res = await api.get('/analytics/friend-growth');
    return res.data.growth || res.data;
  },

  async getInterestDistribution(): Promise<IInterestDistribution[]> {
    const res = await api.get('/analytics/interests');
    return res.data.interests || res.data;
  },

  async getPopularSkills(): Promise<ISkillPopularity[]> {
    const res = await api.get('/analytics/skills');
    return res.data.skills || res.data;
  },
};
