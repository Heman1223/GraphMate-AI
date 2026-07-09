import type { IUser } from '../../types';
import Avatar from '../ui/Avatar';
import { getUserAvatar } from '../../utils/constants';

interface MutualFriendsProps {
  mutuals: IUser[];
  maxAvatars?: number;
}

export default function MutualFriends({ mutuals, maxAvatars = 3 }: MutualFriendsProps) {
  if (mutuals.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Overlapping Avatar Stack */}
      <div className="flex -space-x-2.5 overflow-hidden">
        {mutuals.slice(0, maxAvatars).map((user) => (
          <Avatar
            key={user._id}
            src={getUserAvatar(user)}
            name={user.name}
            size="sm"
            className="ring-2 ring-surface-light dark:ring-surface-dark bg-surface-light"
          />
        ))}
      </div>
      
      {/* Description text */}
      <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark font-medium">
        {mutuals.length === 1 ? (
          <span><strong>{mutuals[0].name}</strong> is a mutual friend</span>
        ) : (
          <span>
            <strong>{mutuals[0].name}</strong> and {mutuals.length - 1} other{mutuals.length > 2 ? 's' : ''} mutual
          </span>
        )}
      </span>
    </div>
  );
}
