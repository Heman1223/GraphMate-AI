import { useEffect, useState } from 'react';
import FriendCard from '../components/friends/FriendCard';
import FriendRequestCard from '../components/friends/FriendRequestCard';
import { friendService } from '../services/friend.service';
import type { IFriendship, IUser } from '../types';
import { motion } from 'framer-motion';
import Skeleton from '../components/ui/Skeleton';

export default function FriendsPage() {
  const [friends, setFriends] = useState<{ user: IUser; friendshipId: string }[]>([]);
  const [requests, setRequests] = useState<IFriendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'requests'>('all');

  const fetchFriendsData = async () => {
    try {
      setLoading(true);
      const [friendsList, requestsList] = await Promise.all([
        friendService.getFriends(),
        friendService.getRequests()
      ]);
      setFriends(friendsList);
      setRequests(requestsList);
    } catch (err) {
      console.error('Failed to load friends page data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await friendService.acceptRequest(id);
      fetchFriendsData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await friendService.rejectRequest(id);
      fetchFriendsData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfriend = async (friendshipId: string) => {
    try {
      await friendService.unfriend(friendshipId);
      fetchFriendsData();
    } catch (err) {
      console.error(err);
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">
            Friends List
          </h1>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            Manage your network connections and incoming friend requests.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-bg-secondary-light dark:bg-bg-secondary-dark p-1 rounded-2xl border border-border-light/20 dark:border-border-dark/20 text-xs font-bold w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark shadow-sm'
                : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light'
            }`}
          >
            My Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl transition-all duration-200 relative ${
              activeTab === 'requests'
                ? 'bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark shadow-sm'
                : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light'
            }`}
          >
            Requests ({requests.length})
            {requests.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error" />
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton.SkeletonCard key={i} />
          ))}
        </div>
      ) : activeTab === 'all' ? (
        friends.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-foreground mb-3">No connections yet</h3>
            <p className="text-muted-foreground text-sm mb-8">
              Your professional network is waiting. Discover like-minded people using our AI match engine.
            </p>
            <a href="/dashboard" className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Discover Matches
            </a>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {friends.map((item, index) => (
              <motion.div
                key={item.user._id || index}
                variants={{
                  hidden: { y: 15, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { type: 'spring' } }
                }}
              >
                <FriendCard 
                  friend={item.user} 
                  onUnfriend={() => handleUnfriend(item.friendshipId)} 
                />
              </motion.div>
            ))}
          </motion.div>
        )
      ) : requests.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">No pending requests</h3>
          <p className="text-muted-foreground text-sm">
            Incoming friendship invitations will appear here.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {requests.map((request, index) => (
            <motion.div
              key={request._id || index}
              variants={{
                hidden: { y: 15, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { type: 'spring' } }
              }}
            >
              <FriendRequestCard
                request={request}
                onAccept={() => handleAccept(request._id)}
                onReject={() => handleReject(request._id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
