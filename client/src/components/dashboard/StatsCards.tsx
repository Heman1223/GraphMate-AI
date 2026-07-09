import { useEffect, useState } from 'react';
import Card from '../ui/Card';
import { 
  HiOutlineUserGroup, 
  HiOutlineLink, 
  HiOutlineChartBar, 
  HiOutlineSparkles 
} from 'react-icons/hi2';
import type { IDashboardStats } from '../../types';

interface StatsCardsProps {
  stats: IDashboardStats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const [counts, setCounts] = useState({
    totalUsers: 0,
    friends: 0,
    accuracy: 0,
    views: 0
  });

  useEffect(() => {
    if (!stats) return;
    
    // Simple mock counter animation
    const duration = 1000;
    const steps = 20;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCounts({
        totalUsers: Math.floor((stats.totalUsers / steps) * step),
        friends: Math.floor((stats.friendsCount / steps) * step),
        accuracy: Math.floor((stats.aiMatchAccuracy / steps) * step),
        views: Math.floor((stats.profileViews / steps) * step)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({
          totalUsers: stats.totalUsers,
          friends: stats.friendsCount,
          accuracy: stats.aiMatchAccuracy,
          views: stats.profileViews
        });
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [stats]);

  const statItems = [
    {
      title: 'Total Network Users',
      value: counts.totalUsers,
      icon: HiOutlineUserGroup,
      trend: '+12%',
      trendUp: true,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10 border-violet-500/20'
    },
    {
      title: 'My Connections',
      value: counts.friends,
      icon: HiOutlineLink,
      trend: '+3',
      trendUp: true,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'Profile Views',
      value: counts.views,
      icon: HiOutlineChartBar,
      trend: '+8%',
      trendUp: true,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Match Accuracy',
      value: `${counts.accuracy}%`,
      icon: HiOutlineSparkles,
      trend: '+2.4%',
      trendUp: true,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10 border-orange-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="flex items-center gap-4 p-5" hover>
            <div className={`p-3 rounded-2xl border ${item.bg} ${item.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted-light dark:text-text-muted-dark uppercase tracking-wider">
                {item.title}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-black text-text-primary-light dark:text-text-primary-dark">
                  {item.value}
                </p>
                <span className={`text-xs font-bold ${item.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {item.trend}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
