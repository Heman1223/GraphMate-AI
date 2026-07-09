import { motion, useMotionValue, useTransform } from 'framer-motion';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import ExplainableAI from './ExplainableAI';
import { getUserAvatar } from '../../utils/constants';
import type { IRecommendation } from '../../types';
import { 
  HiOutlineAcademicCap, 
  HiOutlineMapPin,
  HiOutlineSparkles,
  HiOutlineShare,
  HiOutlineCpuChip,
  HiOutlineBriefcase
} from 'react-icons/hi2';

interface RecommendationCardProps {
  recommendation: IRecommendation;
  onConnect: () => void;
  onSkip: () => void;
  active: boolean;
  zIndex: number;
}

export default function RecommendationCard({ recommendation, onConnect, onSkip, active, zIndex }: RecommendationCardProps) {
  const { user, score, graphScore, aiScore, explanation } = recommendation;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const scale = active ? 1 : 0.95;
  const yOffset = active ? 0 : 20;

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onConnect();
    } else if (info.offset.x < -100) {
      onSkip();
    }
  };

  return (
    <motion.div
      style={{
        gridRow: 1,
        gridColumn: 1,
        x: active ? x : 0,
        rotate: active ? rotate : 0,
        opacity: active ? opacity : 1,
        scale,
        y: yOffset,
        zIndex,
        width: '100%',
        height: '100%'
      }}
      drag={active ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ scale, y: yOffset }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
    >
      <Card className="w-full h-full flex flex-col overflow-hidden glass-card shadow-2xl border-border/50">
        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          
          {/* Header Area */}
          <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex-shrink-0">
            <div className="absolute top-4 right-4 z-20">
              <Badge variant={score >= 80 ? 'success' : score >= 40 ? 'primary' : 'accent'} className="shadow-lg backdrop-blur text-sm px-3 py-1">
                {Math.round(score)}% Match
              </Badge>
            </div>
          </div>
          
          {/* Body Content */}
          <div className="px-6 pb-8 flex flex-col items-center text-center -mt-12 relative z-10">
            {/* Avatar */}
            <div className="p-1 bg-background rounded-full shadow-xl mb-4">
              <Avatar src={getUserAvatar(user)} name={user.name} size="xl" className="w-24 h-24" />
            </div>

            <h2 className="text-3xl font-black text-foreground">{user.name}</h2>
            <p className="text-sm font-medium text-muted-foreground mt-1 mb-3">@{user.username}</p>

            {/* Graph + AI Score Breakdown */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <HiOutlineShare className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Graph {Math.round(graphScore)}%
                </span>
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border ${
                explanation.aiAvailable 
                  ? 'bg-violet-500/10 border-violet-500/20' 
                  : 'bg-muted/50 border-border'
              }`}>
                <HiOutlineCpuChip className={`w-3.5 h-3.5 ${explanation.aiAvailable ? 'text-violet-500' : 'text-muted-foreground'}`} />
                <span className={`text-[11px] font-bold ${
                  explanation.aiAvailable 
                    ? 'text-violet-600 dark:text-violet-400' 
                    : 'text-muted-foreground'
                }`}>
                  {explanation.aiAvailable ? `AI ${Math.round(aiScore)}%` : 'AI Offline'}
                </span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex items-center justify-center gap-4 text-sm text-foreground flex-wrap">
                {user.college && (
                  <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-lg">
                    <HiOutlineAcademicCap className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-xs">{user.college}</span>
                  </div>
                )}
                {user.city && (
                  <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-lg">
                    <HiOutlineMapPin className="w-4 h-4 text-accent" />
                    <span className="font-semibold text-xs">{user.city}</span>
                  </div>
                )}
                {user.careerGoal && (
                  <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-lg">
                    <HiOutlineBriefcase className="w-4 h-4 text-violet-500" />
                    <span className="font-semibold text-xs">{user.careerGoal}</span>
                  </div>
                )}
              </div>

              {user.experience && user.experience.length > 0 && (
                <div className="text-xs font-semibold text-muted-foreground px-4 text-center">
                  Previous: <span className="text-foreground">{user.experience[0].role}</span> at {user.experience[0].company}
                </div>
              )}

              {user.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed px-4">
                  "{user.bio}"
                </p>
              )}

              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {(user.skills || []).map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-8 text-left w-full bg-muted/30 p-4 rounded-2xl border border-border/50">
                <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                  <HiOutlineSparkles className="w-4 h-4 text-violet-500" />
                  Why Recommended
                </h4>
                <ExplainableAI explanation={explanation} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
