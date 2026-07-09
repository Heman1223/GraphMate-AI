import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  className,
  children,
  hover = true,
  padding = 'md',
  onClick,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={
        hover
          ? { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }
          : undefined
      }
      onClick={onClick}
      className={cn(
        'bg-card text-card-foreground border border-border rounded-xl shadow-sm transition-all duration-300',
        onClick && 'cursor-pointer',
        hover && 'hover:border-primary/20',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
