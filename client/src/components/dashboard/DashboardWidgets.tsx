import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUserPlus, FiActivity, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { friendService } from '../../services/friend.service';
import { Link } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function DashboardWidgets() {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const response = await friendService.getRequests();
        setPendingRequests(response || []);
      } catch (err) {
        console.error('Failed to load pending requests', err);
      }
    };
    fetchPending();
  }, []);

  const dummyGrowthData = [
    { name: 'Mon', value: 10 },
    { name: 'Tue', value: 15 },
    { name: 'Wed', value: 25 },
    { name: 'Thu', value: 45 },
    { name: 'Fri', value: 65 },
    { name: 'Sat', value: 90 },
    { name: 'Sun', value: 120 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      {/* Network Growth Widget */}
      <motion.div 
        className="glass-card rounded-2xl p-5 border border-border/50 relative overflow-hidden group"
        whileHover={{ y: -5 }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Network Growth</p>
            <h3 className="text-2xl font-black text-foreground">+120%</h3>
          </div>
          <div className="p-2.5 bg-violet-500/10 rounded-xl">
            <FiTrendingUp className="text-violet-500 w-5 h-5" />
          </div>
        </div>
        <div className="h-16 w-full mt-4 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyGrowthData}>
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pending Requests Widget */}
      <motion.div 
        className="glass-card rounded-2xl p-5 border border-border/50"
        whileHover={{ y: -5 }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Action Required</p>
            <h3 className="text-2xl font-black text-foreground">{pendingRequests.length}</h3>
          </div>
          <div className="p-2.5 bg-amber-500/10 rounded-xl">
            <FiUserPlus className="text-amber-500 w-5 h-5" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground font-medium">Pending Connection Requests</p>
        <Link to="/network" className="mt-4 block text-xs font-bold text-violet-500 hover:text-violet-400 transition-colors">
          View All Requests &rarr;
        </Link>
      </motion.div>

      {/* Suggested Skill Groups */}
      <motion.div 
        className="glass-card rounded-2xl p-5 border border-border/50"
        whileHover={{ y: -5 }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Recommended</p>
            <h3 className="text-lg font-black text-foreground">Top Skill Groups</h3>
          </div>
          <div className="p-2.5 bg-blue-500/10 rounded-xl">
            <FiBriefcase className="text-blue-500 w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {user?.skills?.slice(0,3).map(skill => (
            <span key={skill} className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 text-xs font-bold">
              {skill}
            </span>
          ))}
          {(!user?.skills || user.skills.length === 0) && (
            <span className="text-xs text-muted-foreground">Add skills to get suggestions</span>
          )}
        </div>
        <Link to="/communities" className="mt-4 block text-xs font-bold text-violet-500 hover:text-violet-400 transition-colors">
          Discover Communities &rarr;
        </Link>
      </motion.div>

      {/* AI Career Insight */}
      <motion.div 
        className="glass-card rounded-2xl p-5 border border-border/50 bg-gradient-to-br from-violet-500/5 to-purple-500/5"
        whileHover={{ y: -5 }}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">AI Career Insight</p>
            <h3 className="text-lg font-black text-foreground">Graph Projection</h3>
          </div>
          <div className="p-2.5 bg-purple-500/10 rounded-xl">
            <FiActivity className="text-purple-500 w-5 h-5" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2 font-medium">
          Your semantic profile indicates a strong alignment with <strong className="text-purple-400">Full-Stack Development</strong> roles in your local network graph. Connecting with 3 more backend developers will optimize your opportunities.
        </p>
      </motion.div>

    </div>
  );
}
