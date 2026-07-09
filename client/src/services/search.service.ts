import api from './api';
import type { IUser, ISearchParams } from '../types';

export const searchService = {
  async searchUsers(params: ISearchParams): Promise<IUser[]> {
    const res = await api.get('/search', { params });
    return res.data.users || res.data;
  },
};
