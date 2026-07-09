import React from 'react';
import { cn } from '../../utils/helpers';

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const roundedClasses: Record<string, string> = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
};

export default function Skeleton({
  width,
  height,
  rounded = 'lg',
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', roundedClasses[rounded], className)}
      style={{ width: width || '100%', height: height || '20px' }}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('glass-card p-5 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div className="skeleton rounded-full w-12 h-12" />
        <div className="flex-1 space-y-2">
          <div className="skeleton rounded h-4 w-3/4" />
          <div className="skeleton rounded h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton rounded h-3 w-full" />
        <div className="skeleton rounded h-3 w-5/6" />
        <div className="skeleton rounded h-3 w-4/6" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton rounded-full h-6 w-16" />
        <div className="skeleton rounded-full h-6 w-20" />
        <div className="skeleton rounded-full h-6 w-14" />
      </div>
    </div>
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton rounded h-3"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeMap = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
  return (
    <div className={cn('skeleton rounded-full', sizeMap[size], className)} />
  );
}

Skeleton.SkeletonCard = SkeletonCard;
Skeleton.SkeletonText = SkeletonText;
Skeleton.SkeletonAvatar = SkeletonAvatar;

