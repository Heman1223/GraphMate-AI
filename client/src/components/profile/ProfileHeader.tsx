import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import Card from '../ui/Card';
import { getUserAvatar } from '../../utils/constants';
import type { IUser } from '../../types';
import { 
  HiOutlineAcademicCap, 
  HiOutlineMapPin, 
  HiOutlineBriefcase, 
  HiOutlineEye,
  HiOutlineUserGroup,
  HiOutlineLink
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';

interface ProfileHeaderProps {
  profileUser: IUser;
  friendsCount: number;
}

export default function ProfileHeader({ profileUser, friendsCount }: ProfileHeaderProps) {
  const { user } = useAuth();
  const isOwnProfile = user?.username === profileUser.username;

  return (
    <Card className="overflow-hidden shadow-xl border border-border-light/60 dark:border-border-dark/60 bg-surface-light dark:bg-surface-dark transition-colors duration-200">
      {/* Visual background gradient panel banner */}
      <div className="h-36 sm:h-44 w-full gradient-bg-animated" />

      {/* Main Avatar & Details Grid */}
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Big Avatar */}
            <div className="relative">
              <Avatar 
                src={getUserAvatar(profileUser)} 
                name={profileUser.name} 
                size="xl" 
                className="w-28 sm:w-36 h-28 sm:h-36 ring-4 ring-surface-light dark:ring-surface-dark shadow-2xl bg-surface-light"
              />
            </div>
            
            {/* Info details */}
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-text-primary-light dark:text-text-primary-dark">
                {profileUser.name}
              </h1>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark font-semibold">
                @{profileUser.username}
              </p>
            </div>
          </div>

          {/* Quick Stats list */}
          <div className="flex gap-4 border border-border-light/40 dark:border-border-dark/40 bg-bg-secondary-light/40 dark:bg-bg-secondary-dark/40 rounded-2xl px-4 py-2 text-xs font-bold w-fit">
            <div className="flex items-center gap-1.5">
              <HiOutlineUserGroup className="h-4 w-4 text-primary-500" />
              <span>{friendsCount} Friends</span>
            </div>
            <div className="w-px bg-border-light/60 dark:bg-border-dark/60" />
            <div className="flex items-center gap-1.5">
              <HiOutlineEye className="h-4 w-4 text-emerald-500" />
              <span>{profileUser.profileViews} Views</span>
            </div>
          </div>
        </div>

        {/* Info Grid List */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border-light/10 dark:border-border-dark/10 pt-6">
          <div className="space-y-3 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">
            <div className="flex items-center gap-2.5">
              <HiOutlineAcademicCap className="h-4 w-4 text-primary-500 flex-shrink-0" />
              <span>{profileUser.college}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <HiOutlineBriefcase className="h-4 w-4 text-indigo-500 flex-shrink-0" />
              <span>{profileUser.branch} ({profileUser.graduationYear})</span>
            </div>
            <div className="flex items-center gap-2.5">
              <HiOutlineMapPin className="h-4 w-4 text-accent-500 flex-shrink-0" />
              <span>{profileUser.city}</span>
            </div>
          </div>

          <div className="space-y-3 text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">
            {/* Bio info */}
            {profileUser.bio && (
              <p className="leading-relaxed italic text-text-secondary-light dark:text-text-secondary-dark max-w-md">
                "{profileUser.bio}"
              </p>
            )}

            {/* Social Links */}
            <div className="flex gap-4 pt-1">
              {profileUser.socialLinks?.github && (
                <a 
                  href={profileUser.socialLinks.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs hover:text-primary-500 transition-colors"
                >
                  <HiOutlineLink className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {profileUser.socialLinks?.linkedin && (
                <a 
                  href={profileUser.socialLinks.linkedin} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs hover:text-primary-500 transition-colors"
                >
                  <HiOutlineLink className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Edit profile link button */}
        {isOwnProfile && (
          <div className="mt-6 flex justify-end">
            <Link to="/edit-profile" className="btn-secondary py-2 px-6 text-xs font-bold rounded-xl border border-border-light dark:border-border-dark">
              Edit profile details
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
