import React from 'react';
import { cn } from '../../utils/helpers';

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'accent' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-primary/10 text-primary border border-primary/20',
  success:
    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  warning:
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  accent:
    'bg-accent text-accent-foreground border border-border',
  neutral:
    'bg-muted text-muted-foreground border border-border',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({
  variant = 'primary',
  size = 'md',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
