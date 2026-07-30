import { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import Skeleton from '../components/ui/Skeleton';
import Card from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { analyticsService } from '../services/analytics.service';
import type { IFriendGrowth, IInterestDistribution, ISkillPopularity } from '../types';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const [growth, setGrowth] = useState<IFriendGrowth[]>([]);
  const [interests, setInterests] = useState<IInterestDistribution[]>([]);
  const [skills, setSkills] = useState<ISkillPopularity[]>([]);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [gData, iData, sData] = await Promise.all([
          analyticsService.getFriendGrowth(),
          analyticsService.getInterestDistribution(),
          analyticsService.getPopularSkills()
        ]);
        setGrowth(gData);
        setInterests(iData);
        setSkills(sData.slice(0, 8)); // Top 8 skills
      } catch (err) {
        console.error('Failed to load analytics details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];
  const tooltipStyle = {
    backgroundColor: resolvedTheme === 'dark' ? '#121214' : '#ffffff',
    borderColor: resolvedTheme === 'dark' ? '#27272a' : '#e4e4e7',
    color: resolvedTheme === 'dark' ? '#fafafa' : '#09090b',
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton.SkeletonChart />
          <Skeleton.SkeletonChart />
          <Skeleton.SkeletonChart className="lg:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">
          Network Analytics Dashboard
        </h1>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
          Aggregate analysis of connections growth, local skill popularity, and shared interests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Friend Growth Chart */}
        <Card className="p-6 h-[320px] flex flex-col justify-between">
          <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Connection Growth Topology
          </h3>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={growth}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: 'var(--background)' }} activeDot={{ r: 6, fill: '#8b5cf6', stroke: 'var(--background)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Skill Popularity Chart */}
        <Card className="p-6 h-[320px] flex flex-col justify-between">
          <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Popular Technical Skills In Local Network
          </h3>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={skills} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="skill" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} itemStyle={{ fontWeight: 'bold' }} />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={30}>
                  {skills.map((_, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Interest Distribution Chart */}
        <Card className="p-6 h-[350px] flex flex-col justify-between lg:col-span-2">
          <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-2 text-center lg:text-left">
            Interest Category Weights
          </h3>
          <div className="flex flex-col lg:flex-row items-center gap-6 flex-1 w-full text-xs">
            <div className="flex-1 w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={interests}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {interests.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend Panel */}
            <div className="grid grid-cols-2 gap-3 w-full lg:w-72 font-semibold">
              {interests.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark truncate">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
