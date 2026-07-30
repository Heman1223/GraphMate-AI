import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import { FiSend, FiHash, FiImage, FiCode, FiUsers } from 'react-icons/fi';
import type { ICommunity } from '../types';

export default function CommunityPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  
  const [globalCommunity, setGlobalCommunity] = useState<ICommunity | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeCommunity = async () => {
      try {
        setLoading(true);
        // First try to fetch the global community
        const res = await api.get('/communities?type=global');
        let community = res.data.communities?.[0];

        // If no global community exists, create one
        if (!community) {
          const createRes = await api.post('/communities', {
            name: 'Global Network',
            description: 'The global community chat for everyone on GraphMate.',
            type: 'global'
          });
          community = createRes.data.community;
        }
        
        setGlobalCommunity(community);

        // Fetch messages for the global community
        if (community) {
          const msgRes = await api.get(`/communities/${community._id}/messages`);
          setMessages(msgRes.data.messages || []);
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {
        console.error('Failed to initialize global community', err);
      } finally {
        setLoading(false);
      }
    };

    initializeCommunity();
  }, []);

  useEffect(() => {
    if (!globalCommunity || !socket) return;

    socket.emit('join_room', globalCommunity._id);
    
    const handleReceive = (msg: any) => {
      setMessages(prev => [...prev, msg]);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    socket.on('receive_message', handleReceive);
    
    return () => {
      socket.emit('leave_room', globalCommunity._id);
      socket.off('receive_message', handleReceive);
    };
  }, [globalCommunity, socket]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !globalCommunity) return;

    const text = newMessage;
    setNewMessage('');

    try {
      const res = await api.post('/communities/messages', {
        communityId: globalCommunity._id,
        content: text
      });
      const sentMsg = res.data.message;

      setMessages(prev => [...prev, sentMsg]);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

      if (socket) {
        socket.emit('send_message', { ...sentMsg, roomId: globalCommunity._id });
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="h-[calc(100vh-120px)] flex flex-col mt-4"
    >
      <div className="flex-1 flex flex-col glass-card border border-border/50 rounded-3xl overflow-hidden relative max-w-5xl mx-auto w-full shadow-xl">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : globalCommunity ? (
          <>
            {/* Header */}
            <div className="p-5 border-b border-border/50 bg-card/50 backdrop-blur flex items-center gap-4 shadow-sm z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg overflow-hidden">
                <FiUsers className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground">{globalCommunity.name}</h2>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mt-0.5">
                  Global Public Channel
                </p>
              </div>
              <div className="ml-auto text-xs font-semibold text-muted-foreground flex items-center gap-2 px-3 py-1.5 bg-muted rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Chat
              </div>
            </div>

            {/* Create Post Input */}
            <div className="p-6 border-b border-border/50 bg-card/50 backdrop-blur z-10">
              <form onSubmit={handleSendMessage} className="flex gap-4">
                <img src={user?.profilePicture || `https://api.dicebear.com/9.x/initials/svg?seed=${user?.username || 'U'}&backgroundColor=7c3aed&fontFamily=Inter`} alt="You" className="w-12 h-12 rounded-full shadow-sm object-cover" />
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Share something with the global network..."
                    className="w-full bg-surface border border-border/50 rounded-2xl px-5 py-3 text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-2">
                      <button type="button" className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors flex items-center gap-2 text-xs font-semibold">
                        <FiImage className="w-4 h-4" /> Media
                      </button>
                      <button type="button" className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors flex items-center gap-2 text-xs font-semibold">
                        <FiCode className="w-4 h-4" /> Code
                      </button>
                    </div>
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Feed Posts */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-surface/30">
              {messages.length === 0 && (
                <div className="text-center py-20 text-muted-foreground text-sm font-semibold">
                  Welcome to the {globalCommunity.name}! Be the first to start a discussion.
                </div>
              )}
              {messages.slice().reverse().map((msg, idx) => {
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg._id || idx} 
                    className="glass-card p-5 w-full max-w-3xl mx-auto"
                  >
                    {/* Post Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <img src={msg.sender.profilePicture || `https://api.dicebear.com/9.x/initials/svg?seed=${msg.sender.username || 'U'}&backgroundColor=2563eb&fontFamily=Inter`} alt="" className="w-10 h-10 rounded-full shadow-sm object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{msg.sender.name}</h4>
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          @{msg.sender.username} • {new Date(msg.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Post Content */}
                    <p className="text-[15px] leading-relaxed text-foreground mb-4 whitespace-pre-wrap">
                      {msg.content}
                    </p>

                    {/* Post Footer / Actions */}
                    <div className="flex items-center gap-6 pt-4 border-t border-border/50 text-muted-foreground">
                      <button className="flex items-center gap-2 hover:text-primary transition-colors text-xs font-bold">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Like
                      </button>
                      <button className="flex items-center gap-2 hover:text-primary transition-colors text-xs font-bold">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Comment
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>


          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-2xl font-black text-foreground mb-2">Community Unavailable</h2>
            <p className="text-sm text-muted-foreground">The global community channel could not be loaded.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
