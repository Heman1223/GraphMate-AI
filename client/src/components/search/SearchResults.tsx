import { useState } from 'react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { getUserAvatar } from '../../utils/constants';
import { friendService } from '../../services/friend.service';
import type { IUser } from '../../types';
import { 
  HiOutlineAcademicCap, 
  HiOutlineMapPin, 
  HiOutlineUserPlus,
  HiOutlineCheckCircle,
  HiOutlineArrowTopRightOnSquare
} from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

interface SearchResultsProps {
  users: IUser[];
}

export default function SearchResults({ users }: SearchResultsProps) {
  const navigate = useNavigate();
  const [requestSent, setRequestSent] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState<Record<string, boolean>>({});

  const handleAddFriend = async (userId: string) => {
    try {
      setSending(prev => ({ ...prev, [userId]: true }));
      await friendService.sendRequest(userId);
      setRequestSent(prev => ({ ...prev, [userId]: true }));
    } catch (err) {
      console.error('Failed to send request:', err);
    } finally {
      setSending(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (users.length === 0) {
    return (
      <div className="py-16 text-center">
        <span className="text-4xl">🔍</span>
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2 font-medium">
          No users match your criteria. Try adjusting query filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {users.map((user) => (
        <Card key={user._id} className="flex flex-col justify-between h-full hover" hover>
          <div className="p-5 pb-3 space-y-4">
            {/* Avatar & Username */}
            <div className="flex gap-3">
              <Avatar src={getUserAvatar(user)} name={user.name} size="md" />
              <div className="overflow-hidden">
                <h3 className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark truncate">{user.name}</h3>
                <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark truncate">@{user.username}</p>
              </div>
            </div>

            {/* Academic details */}
            <div className="space-y-1.5 text-[11px] text-text-secondary-light dark:text-text-secondary-dark">
              <div className="flex items-center gap-2">
                <HiOutlineAcademicCap className="h-4 w-4 text-primary-500 flex-shrink-0" />
                <span className="truncate">{user.college}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineMapPin className="h-4 w-4 text-accent-500 flex-shrink-0" />
                <span className="truncate">{user.city}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1">
              {user.skills.slice(0, 3).map((skill, idx) => (
                <Badge key={idx} variant="accent" size="sm">
                  {skill}
                </Badge>
              ))}
              {user.skills.length > 3 && (
                <span className="text-[9px] font-bold text-text-muted-light dark:text-text-muted-dark self-center px-1">
                  +{user.skills.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-5 pt-3 border-t border-border-light/10 dark:border-border-dark/10 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => navigate(`/profile/${user.username}`)}
              className="flex items-center justify-center gap-1 text-[11px] font-semibold py-1.5 border border-border-light dark:border-border-dark"
            >
              <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
              Profile
            </Button>
            {requestSent[user._id] ? (
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                className="flex items-center justify-center gap-1 text-[11px] font-semibold py-1.5 text-success border-success/20 bg-success/5 cursor-default"
              >
                <HiOutlineCheckCircle className="h-4 w-4" />
                Sent
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                fullWidth
                loading={sending[user._id]}
                onClick={() => handleAddFriend(user._id)}
                className="flex items-center justify-center gap-1 text-[11px] font-bold py-1.5"
              >
                <HiOutlineUserPlus className="h-4 w-4" />
                Connect
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
