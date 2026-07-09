import api from './api';
import type { IAuthResponse, ILoginCredentials, IRegisterData, IUser } from '../types';

export const authService = {
  async register(data: IRegisterData): Promise<IAuthResponse> {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  async getMe(): Promise<IUser> {
    const res = await api.get('/auth/me');
    return res.data.user || res.data;
  },

  logout() {
    localStorage.removeItem('graphmate_token');
    localStorage.removeItem('graphmate_user');
  },

  getToken(): string | null {
    return localStorage.getItem('graphmate_token');
  },

  setToken(token: string) {
    localStorage.setItem('graphmate_token', token);
  },

  setUser(user: IUser) {
    localStorage.setItem('graphmate_user', JSON.stringify(user));
  },

  getStoredUser(): IUser | null {
    const stored = localStorage.getItem('graphmate_user');
    return stored ? JSON.parse(stored) : null;
  },
};
