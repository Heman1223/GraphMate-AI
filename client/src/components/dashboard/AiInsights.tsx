import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLightBulb, HiOutlineSparkles, HiOutlineFire } from 'react-icons/hi2';
import Card from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import type { IDashboardStats } from '../../types';

interface AiInsightsProps {
  stats: IDashboardStats | null;
}

export default function AiInsights({ stats }: AiInsightsProps) {
  const { user } = useAuth();

  const insights = useMemo(() => {
    if (!user || !stats) return [];

    const items = [];

    // Insight 1: Profile Views & Reach
    if (stats.profileViews > 5) {
      items.push({
        id: 1,
        icon: HiOutlineFire,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        title: 'High Visibility',
        description: `Your profile has been viewed ${stats.profileViews} times recently. Your current skill stack is attracting attention.`,
      });
    }

    // Insight 2: Match Accuracy
    if (stats.aiMatchAccuracy) {
      items.push({
        id: 2,
        icon: HiOutlineSparkles,
        color: 'text-violet-500',
        bgColor: 'bg-violet-500/10',
        title: 'Strong Embedding Match',
        description: `Our vector space model predicts an ${stats.aiMatchAccuracy}% average compatibility with your recent suggestions.`,
      });
    }

    // Insight 3: Growth Opportunity
    const topSkill = user.skills && user.skills.length > 0 ? user.skills[0] : 'programming';
    items.push({
      id: 3,
      icon: HiOutlineLightBulb,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      title: 'Expansion Strategy',
      description: `Based on your expertise in ${topSkill}, we recommend connecting with developers who specialize in complementary backend technologies.`,
    });

    return items;
  }, [user, stats]);

  if (!stats) return null;

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <HiOutlineSparkles className="w-5 h-5 text-violet-500" />
        <h3 className="text-sm font-bold text-foreground">AI Network Insights</h3>
      </div>
      
      <div className="space-y-4 flex-1">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${insight.bgColor} ${insight.color}`}>
              <insight.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground mb-1">{insight.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
