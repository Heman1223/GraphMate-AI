import Badge from '../ui/Badge';
import { motion } from 'framer-motion';

interface SkillBadgesProps {
  skills: string[];
  title?: string;
  badgeVariant?: 'accent' | 'primary' | 'success' | 'warning' | 'neutral';
}

export default function SkillBadges({ skills, title = 'Skills', badgeVariant = 'accent' }: SkillBadgesProps) {
  if (skills.length === 0) return null;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 200 } }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark uppercase tracking-wider">
        {title}
      </h4>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap gap-1.5"
      >
        {skills.map((skill, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Badge variant={badgeVariant} size="sm">
              {skill}
            </Badge>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
