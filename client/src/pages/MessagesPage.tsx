import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { FiSend, FiUsers, FiMessageSquare, FiHash, FiImage, FiCode, FiSearch } from 'react-icons/fi';
import type { IConversation, ICommunity, ICommunityMessage, IDirectMessage } from '../types';

export default function MessagesPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState<'dms'>('dms');
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [activeChat, setActiveChat] = useState<{ id: string, type: 'dm', name: string, avatar: string } | null>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const res = await api.get('/chat/conversations');
        const loadedConvs = res.data.conversations || [];
        
        // Handle URL parameters for starting new chats
        const params = new URLSearchParams(location.search);
        const userId = params.get('user');
        
        if (userId && user) {
          const existingConv = loadedConvs.find((c: any) => c.participants.some((p: any) => p._id === userId));
          if (existingConv) {
            const otherUser = existingConv.participants.find((p: any) => p._id !== user._id);
            if (otherUser) {
              setActiveChat({
                id: existingConv._id,
                type: 'dm',
                name: otherUser.name,
                avatar: otherUser.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${otherUser.username}`
              });
            }
            setConversations(loadedConvs);
          } else {
            // Need to create temporary conversation for UI
            const userRes = await api.get(`/users/${userId}`);
            const targetUser = userRes.data.user;
            if (targetUser) {
              const tempId = `temp_${userId}`;
              const fakeConv = {
                _id: tempId,
                participants: [user, targetUser],
                lastMessage: null
              };
              setConversations([fakeConv as any, ...loadedConvs]);
              setActiveChat({
                id: tempId,
                type: 'dm',
                name: targetUser.name,
                avatar: targetUser.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${targetUser.username}`
              });
            } else {
              setConversations(loadedConvs);
            }
          }
        } else {
          setConversations(loadedConvs);
        }
      } catch (err) {
        console.error('Failed to load sidebar data', err);
      }
    };
    if (user) {
      fetchSidebarData();
    }
  }, [location.search, user]);

  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      try {
        if (activeChat.type === 'dm') {
          if (activeChat.id.startsWith('temp_')) {
            setMessages([]);
          } else {
            const res = await api.get(`/chat/messages/${activeChat.id}`);
            setMessages(res.data.messages || []);
          }
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };

    fetchMessages();
    
    if (socket) {
      if (!activeChat.id.startsWith('temp_')) {
        socket.emit('join_room', activeChat.id);
        
        const handleReceive = (msg: any) => {
          setMessages(prev => [...prev, msg]);
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };
        
        socket.on('receive_message', handleReceive);
        
        return () => {
          socket.emit('leave_room', activeChat.id);
          socket.off('receive_message', handleReceive);
        };
      }
    }
  }, [activeChat, socket]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const text = newMessage;
    setNewMessage('');

    try {
      let sentMsg;
      if (activeChat.type === 'dm') {
        const conversation = conversations.find(c => c._id === activeChat.id);
        const receiver = conversation?.participants.find(p => p._id !== user?._id);
        if (!receiver) return;

        const res = await api.post('/chat/messages', {
          receiverId: receiver._id,
          content: text
        });
        sentMsg = res.data.message;
      }

      setMessages(prev => [...prev, sentMsg]);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

      // If we are still using a temp ID, we can't emit to room yet unless we update the active chat ID.
      // But we will fetch the conversations on next load. For now, it's fine.
      if (socket && !activeChat.id.startsWith('temp_')) {
        socket.emit('send_message', { ...sentMsg, roomId: activeChat.id });
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 mt-4">
      {/* Sidebar */}
      <div className="w-80 flex flex-col glass-card border border-border/50 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h2 className="text-xl font-black text-foreground mb-4">Messaging Hub</h2>
          
          <div className="flex bg-muted p-1 rounded-xl">
            <button 
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all bg-card shadow-sm text-foreground"
            >
              <FiMessageSquare className="w-4 h-4" /> Direct Messages
            </button>
          </div>

          <div className="relative mt-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-card border border-border/50 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {conversations.length > 0 ? conversations.map(conv => {
            const otherUser = conv.participants.find(p => p._id !== user?._id);
            if (!otherUser) return null;
            
            return (
              <button
                key={conv._id}
                onClick={() => setActiveChat({ id: conv._id, type: 'dm', name: otherUser.name, avatar: otherUser.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${otherUser.username}` })}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${activeChat?.id === conv._id ? 'bg-violet-500/10 border border-violet-500/20' : 'hover:bg-muted border border-transparent'}`}
              >
                <img src={otherUser.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${otherUser.username}`} alt="" className="w-10 h-10 rounded-full border border-border/50" />
                <div className="text-left flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground truncate">{otherUser.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage?.content || 'Say hello!'}</p>
                </div>
              </button>
            )
          }) : (
            <p className="text-xs text-muted-foreground text-center mt-10">No messages yet.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col glass-card border border-border/50 rounded-3xl overflow-hidden relative">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-card/50 backdrop-blur flex items-center gap-4 shadow-sm z-10">
              <img src={activeChat.avatar} alt="" className={`w-12 h-12 ${activeChat.type === 'community' ? 'rounded-xl' : 'rounded-full'} border border-border`} />
              <div>
                <h2 className="text-xl font-black text-foreground">{activeChat.name}</h2>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Direct Message
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => {
                const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg._id || idx} 
                    className={`flex gap-3 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    {!isMe && (
                      <img src={msg.sender.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.sender.username}`} alt="" className="w-8 h-8 rounded-full mt-auto" />
                    )}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-violet-600 text-white rounded-br-sm shadow-md shadow-violet-500/20' : 'bg-card border border-border rounded-bl-sm shadow-sm'}`}>
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
                <button type="button" className="p-3 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                  <FiImage className="w-5 h-5" />
                </button>
                <button type="button" className="p-3 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                  <FiCode className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-card border border-border/50 rounded-xl px-4 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-violet-500/20"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-violet-500/10 rounded-full flex items-center justify-center mb-6">
              <FiMessageSquare className="w-10 h-10 text-violet-500" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-2">Direct Messages</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Select a conversation from the sidebar to start networking privately.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
