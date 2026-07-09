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
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <span className="text-5xl mb-4">🤝</span>
            <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">No connections yet</h3>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2">
              Go explore AI recommendations or search profiles to build your social network map.
            </p>
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
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <span className="text-5xl mb-4">✉️</span>
          <h3 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">No pending requests</h3>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2">
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
