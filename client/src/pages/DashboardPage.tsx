import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardWidgets from '../components/dashboard/DashboardWidgets';
import SwipeRecommendations from '../components/dashboard/SwipeRecommendations';
import NetworkPreview from '../components/dashboard/NetworkPreview';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Welcome header */}
      <div className="flex flex-col gap-1.5 mb-6">
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">{user?.name}</span>
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Ready to expand your professional network? Here is who you should connect with today.
        </p>
      </div>

      {/* Actionable Top Widgets */}
      <DashboardWidgets />

      {/* Centerpiece: Discover Matches */}
      <div className="w-full pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Today's Best Matches</h2>
          <span className="px-3 py-1 bg-violet-500/10 text-violet-500 text-xs font-bold rounded-full uppercase tracking-wider">AI Powered</span>
        </div>
        <div className="w-full bg-card border border-border/60 shadow-lg shadow-violet-500/5 rounded-3xl p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <SwipeRecommendations />
        </div>
      </div>

      {/* Secondary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NetworkPreview />
        
        {/* Placeholder for Recent Connections or upcoming hackathons */}
        <div className="glass-card rounded-2xl p-6 border border-border/50">
          <h3 className="text-lg font-bold text-foreground mb-4">Upcoming Hackathons</h3>
          <div className="flex flex-col items-center justify-center h-48 text-center bg-background/50 rounded-xl border border-dashed border-border">
            <span className="text-4xl mb-3">🚀</span>
            <h4 className="text-sm font-bold text-foreground">Coming Soon</h4>
            <p className="text-xs text-muted-foreground max-w-xs mt-1">Hackathon and event integration is coming in the next major update.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
