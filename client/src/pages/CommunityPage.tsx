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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-card/30">
              {messages.length === 0 && (
                <div className="text-center py-10 text-muted-foreground text-sm font-semibold">
                  Welcome to the {globalCommunity.name}! Be the first to say hello!
                </div>
              )}
              {messages.map((msg, idx) => {
                const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg._id || idx} 
                    className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    {!isMe && (
                      <img src={msg.sender.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.sender.username}`} alt="" className="w-10 h-10 rounded-full mt-auto shadow-sm" />
                    )}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {!isMe && (
                        <span className="text-[10px] font-bold text-muted-foreground mb-1 ml-1 tracking-wide">{msg.sender.name}</span>
                      )}
                      <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-br-sm shadow-md shadow-blue-500/20' : 'bg-card border border-border rounded-bl-sm shadow-sm'}`}>
                        {msg.content}
                      </div>
                      <span className="text-[9px] font-semibold text-muted-foreground mt-1 mx-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur z-10">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <button type="button" className="p-3.5 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                  <FiImage className="w-5 h-5" />
                </button>
                <button type="button" className="p-3.5 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                  <FiCode className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message to the global community..."
                  className="flex-1 bg-card border border-border/50 rounded-xl px-5 text-[15px] focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-500/20"
                >
                  <FiSend className="w-5 h-5 mr-2" /> Send
                </button>
              </form>
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
