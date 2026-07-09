import api from './api';
import type { INotification } from '../types';

export const notificationService = {
  async getNotifications(): Promise<INotification[]> {
    const res = await api.get('/notifications');
    return res.data.notifications || res.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.put(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  },

  async getUnreadCount(): Promise<number> {
    const res = await api.get('/notifications/unread-count');
    return res.data.count;
  },
};
