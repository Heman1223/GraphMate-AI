import { Link } from 'react-router-dom';
import type { IUser } from '../../types';
import { FiMessageSquare, FiUserX, FiMapPin, FiBook, FiBriefcase } from 'react-icons/fi';

interface FriendCardProps {
  friend: IUser;
  onUnfriend: () => void;
}

export default function FriendCard({ friend, onUnfriend }: FriendCardProps) {
  return (
    <div className="glass-card rounded-3xl p-5 border border-border/50 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full relative overflow-hidden">
      
      {/* Background Banner */}
      <div 
        className="absolute top-0 left-0 right-0 h-16 bg-muted opacity-50"
        style={{ backgroundImage: `url(${friend.coverBanner || ''})`, backgroundSize: 'cover' }}
      />

      <div className="flex items-start justify-between relative z-10 pt-4">
        <Link to={`/profile/${friend.username}`} className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-card overflow-hidden bg-muted shadow-sm group-hover:ring-2 group-hover:ring-violet-500 transition-all">
            <img src={friend.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${friend.username}`} alt={friend.name} className="w-full h-full object-cover" />
          </div>
        </Link>
        <button
          onClick={onUnfriend}
          className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
          title="Remove Connection"
        >
          <FiUserX className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex-grow z-10">
        <Link to={`/profile/${friend.username}`} className="hover:underline decoration-violet-500">
          <h3 className="font-black text-foreground text-lg line-clamp-1">{friend.name}</h3>
        </Link>
        <p className="text-violet-500 text-xs font-bold mb-3">@{friend.username}</p>

        <div className="space-y-1.5 text-[11px] font-semibold text-muted-foreground">
          {friend.careerGoal && (
            <div className="flex items-center gap-1.5">
              <FiBriefcase className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{friend.careerGoal}</span>
            </div>
          )}
          {friend.college && (
            <div className="flex items-center gap-1.5">
              <FiBook className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{friend.college}</span>
            </div>
          )}
          {friend.city && (
            <div className="flex items-center gap-1.5">
              <FiMapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{friend.city}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {friend.skills?.slice(0, 3).map((skill) => (
            <span key={skill} className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-foreground border border-border">
              {skill}
            </span>
          ))}
          {friend.skills && friend.skills.length > 3 && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-foreground border border-border">
              +{friend.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-2 z-10 relative">
        <Link
          to={`/profile/${friend.username}`}
          className="flex-1 py-2 rounded-xl text-xs font-bold text-center border border-border hover:bg-muted transition-colors text-foreground"
        >
          View Profile
        </Link>
        <Link
          to={`/messages?user=${friend._id}`}
          className="flex-1 py-2 rounded-xl text-xs font-bold text-center bg-violet-600 text-white hover:bg-violet-500 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-violet-500/20"
        >
          <FiMessageSquare className="w-3.5 h-3.5" />
          Message
        </Link>
      </div>
    </div>
  );
}
