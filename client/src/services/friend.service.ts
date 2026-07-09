import api from './api';
import type { IFriendship, IFriendStatus, IUser } from '../types';

export const friendService = {
  async sendRequest(userId: string): Promise<IFriendship> {
    const res = await api.post(`/friends/request/${userId}`);
    return res.data.friendship || res.data;
  },

  async acceptRequest(friendshipId: string): Promise<IFriendship> {
    const res = await api.put(`/friends/accept/${friendshipId}`);
    return res.data.friendship || res.data;
  },

  async rejectRequest(friendshipId: string): Promise<IFriendship> {
    const res = await api.put(`/friends/reject/${friendshipId}`);
    return res.data.friendship || res.data;
  },

  async getFriends(): Promise<{ user: IUser; friendshipId: string }[]> {
    const res = await api.get('/friends');
    const friends = res.data.friends || res.data;
    // Backend returns { friendshipId, user, since } — extract properly
    return Array.isArray(friends)
      ? friends.map((f: any) => ({
          user: f.user || f,
          friendshipId: f.friendshipId || f._id,
        }))
      : [];
  },

  async getRequests(): Promise<IFriendship[]> {
    const res = await api.get('/friends/requests');
    return res.data.requests || res.data;
  },

  async getSentRequests(): Promise<IFriendship[]> {
    const res = await api.get('/friends/sent');
    return res.data.requests || res.data;
  },

  async getMutualFriends(userId: string): Promise<IUser[]> {
    const res = await api.get(`/friends/mutual/${userId}`);
    return res.data.mutualFriends || res.data;
  },

  async unfriend(friendshipId: string): Promise<void> {
    await api.delete(`/friends/${friendshipId}`);
  },

  async getFriendStatus(userId: string): Promise<IFriendStatus> {
    const res = await api.get(`/friends/status/${userId}`);
    return res.data;
  },

  async getFriendsCount(): Promise<number> {
    const res = await api.get('/friends/count');
    return res.data.friendsCount ?? res.data.count ?? 0;
  },
};
