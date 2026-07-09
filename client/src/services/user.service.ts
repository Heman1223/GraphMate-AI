import api from './api';
import type { IUser, IUserUpdate } from '../types';

export const userService = {
  async getProfile(): Promise<IUser> {
    const res = await api.get('/users/profile');
    return res.data.user || res.data;
  },

  async updateProfile(data: IUserUpdate): Promise<IUser> {
    const res = await api.put('/users/profile', data);
    return res.data.user || res.data;
  },

  async getUserById(id: string): Promise<IUser> {
    const res = await api.get(`/users/${id}`);
    return res.data.user || res.data;
  },

  async getUserByUsername(username: string): Promise<IUser> {
    const res = await api.get(`/users/username/${username}`);
    return res.data.user || res.data;
  },

  async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.post('/users/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
