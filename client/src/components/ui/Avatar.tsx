import React, { useState } from 'react';
import { cn } from '../../utils/helpers';
import { getUserAvatar } from '../../utils/constants';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

const statusSizes: Record<string, string> = {
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-[1.5px]',
  lg: 'w-3 h-3 border-2',
  xl: 'w-4 h-4 border-2',
};

export default function Avatar({
  src,
  name = '',
  size = 'md',
  online,
  className,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = src || getUserAvatar({ name });
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      {!imgError ? (
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setImgError(true)}
          className={cn(
            'rounded-full object-cover ring-2 ring-background',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold bg-primary text-primary-foreground',
            sizeClasses[size]
          )}
        >
          {initials || '?'}
        </div>
      )}

      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-background',
            online ? 'bg-emerald-500' : 'bg-muted-foreground',
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
