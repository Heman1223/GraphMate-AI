import { Link } from 'react-router-dom';
import type { IFriendship } from '../../types';
import { FiCheck, FiX, FiMapPin, FiBook } from 'react-icons/fi';

interface FriendRequestCardProps {
  request: IFriendship;
  onAccept: () => void;
  onReject: () => void;
}

export default function FriendRequestCard({ request, onAccept, onReject }: FriendRequestCardProps) {
  const requester = typeof request.requester !== 'string' ? request.requester : null;

  if (!requester) return null;

  return (
    <div className="glass-card rounded-3xl p-5 border border-border/50 shadow-sm flex flex-col h-full overflow-hidden relative">
      
      {/* Accent Background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <Link to={`/profile/${requester.username}`}>
          <div className="w-14 h-14 rounded-full overflow-hidden bg-muted shadow-sm border-2 border-card">
            <img src={requester.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${requester.username}`} alt={requester.name} className="w-full h-full object-cover" />
          </div>
        </Link>
      </div>

      <div className="mt-3 flex-grow relative z-10">
        <Link to={`/profile/${requester.username}`} className="hover:underline decoration-amber-500">
          <h3 className="font-black text-foreground text-lg line-clamp-1">{requester.name}</h3>
        </Link>
        <p className="text-amber-500 text-xs font-bold mb-3">@{requester.username}</p>

        <div className="space-y-1.5 text-[11px] font-semibold text-muted-foreground">
          {requester.college && (
            <div className="flex items-center gap-1.5">
              <FiBook className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{requester.college}</span>
            </div>
          )}
          {requester.city && (
            <div className="flex items-center gap-1.5">
              <FiMapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{requester.city}</span>
            </div>
          )}
        </div>
        
        {requester.skills && requester.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {requester.skills.slice(0, 2).map((skill) => (
              <span key={skill} className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-foreground border border-border">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-2 relative z-10">
        <button
          onClick={onReject}
          className="flex-1 py-2 rounded-xl text-xs font-bold flex justify-center items-center gap-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
        >
          <FiX className="w-4 h-4" />
          Decline
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-2 rounded-xl text-xs font-bold flex justify-center items-center gap-1 bg-amber-500 text-white shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-colors"
        >
          <FiCheck className="w-4 h-4" />
          Accept
        </button>
      </div>
    </div>
  );
}
