import api from './api';
import type { INetworkData, INetworkStats } from '../types';

export const graphService = {
  async getNetworkData(): Promise<INetworkData> {
    const res = await api.get('/graph/network');
    return res.data;
  },

  async getNetworkStats(): Promise<INetworkStats> {
    const res = await api.get('/graph/stats');
    return res.data;
  },
};
