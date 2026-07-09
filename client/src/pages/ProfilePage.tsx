import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../services/user.service';
import { friendService } from '../services/friend.service';
import type { IUser } from '../types';
import { motion } from 'framer-motion';
import { FiMapPin, FiBriefcase, FiBook, FiGithub, FiLinkedin, FiExternalLink, FiEdit3 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { identifier } = useParams<{ identifier: string }>();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<IUser | null>(null);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?._id === profileUser?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!identifier) return;
        
        let userData: IUser;
        if (identifier.length === 24) {
          userData = await userService.getUserById(identifier);
        } else {
          userData = await userService.getUserByUsername(identifier);
        }

        setProfileUser(userData);
        // Note: For demo we just set mock or dynamic count
        const count = await friendService.getFriendsCount();
        setFriendsCount(count);
      } catch (err) {
        console.error('Failed to load user profile view:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [identifier]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse w-full max-w-5xl mx-auto">
        <div className="h-64 bg-border/20 rounded-b-3xl rounded-t-xl" />
        <div className="flex gap-6 mt-6">
          <div className="w-1/3 h-96 bg-border/20 rounded-2xl" />
          <div className="w-2/3 h-96 bg-border/20 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="py-20 text-center text-sm font-semibold text-muted-foreground">
        User profile not found.
      </div>
    );
  }

  const coverBannerUrl = profileUser.coverBanner || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2000';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto pb-12"
    >
      {/* Cover Banner */}
      <div 
        className="w-full h-48 md:h-64 rounded-b-3xl rounded-t-xl relative overflow-hidden shadow-sm"
        style={{ backgroundImage: `url(${coverBannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      <div className="px-4 md:px-8 max-w-5xl mx-auto -mt-20 md:-mt-24 relative z-10">
        
        {/* Profile Header Block */}
        <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start shadow-xl shadow-black/5 border border-border/50">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background overflow-hidden bg-muted shadow-lg">
              <img src={profileUser.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${profileUser.username}`} alt={profileUser.name} className="w-full h-full object-cover" />
            </div>
            {isOwnProfile && (
              <Link to="/edit-profile" className="absolute bottom-2 right-2 bg-violet-600 text-white p-2 rounded-full shadow-lg hover:bg-violet-500 transition-colors">
                <FiEdit3 className="w-4 h-4" />
              </Link>
            )}
          </div>
          
          <div className="flex-1 mt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-foreground">{profileUser.name}</h1>
                <p className="text-violet-500 font-bold text-sm tracking-wide">@{profileUser.username}</p>
              </div>
              <div className="flex gap-3">
                {profileUser.socialLinks?.github && (
                  <a href={profileUser.socialLinks.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-card border border-border hover:border-violet-500/50 hover:text-violet-500 transition-all text-muted-foreground">
                    <FiGithub className="w-5 h-5" />
                  </a>
                )}
                {profileUser.socialLinks?.linkedin && (
                  <a href={profileUser.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-card border border-border hover:border-blue-500/50 hover:text-blue-500 transition-all text-muted-foreground">
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                )}
                {profileUser.resumeLink && (
                  <a href={profileUser.resumeLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500 text-white font-bold text-xs hover:bg-violet-400 transition-colors">
                    <FiExternalLink className="w-4 h-4" />
                    Resume
                  </a>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground">
              {profileUser.careerGoal && (
                <div className="flex items-center gap-1.5"><FiBriefcase className="w-4 h-4 text-violet-500"/> {profileUser.careerGoal}</div>
              )}
              {profileUser.city && (
                <div className="flex items-center gap-1.5"><FiMapPin className="w-4 h-4 text-blue-500"/> {profileUser.city}</div>
              )}
              {profileUser.college && (
                <div className="flex items-center gap-1.5"><FiBook className="w-4 h-4 text-emerald-500"/> {profileUser.college}</div>
              )}
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <span className="text-amber-500">{friendsCount}</span> Connections
              </div>
            </div>

            {profileUser.bio && (
              <p className="mt-5 text-sm text-foreground/80 leading-relaxed max-w-3xl">
                {profileUser.bio}
              </p>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card rounded-3xl p-6 border border-border/50">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profileUser.skills?.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg text-xs font-bold border border-violet-500/10">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="glass-card rounded-3xl p-6 border border-border/50">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profileUser.interests?.map(interest => (
                  <span key={interest} className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-500/10">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Experience */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-border/50">
              <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                <FiBriefcase className="text-violet-500" />
                Experience
              </h3>
              
              {profileUser.experience && profileUser.experience.length > 0 ? (
                <div className="space-y-6">
                  {profileUser.experience.map((exp, i) => (
                    <div key={i} className="relative pl-6 border-l border-border pb-6 last:border-0 last:pb-0">
                      <div className="absolute w-3 h-3 bg-violet-500 rounded-full -left-[6.5px] top-1.5 ring-4 ring-background" />
                      <h4 className="font-bold text-foreground">{exp.role}</h4>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">{exp.company}</p>
                      <p className="text-xs text-muted-foreground/60 mb-2 font-medium">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </p>
                      {exp.description && (
                        <p className="text-xs text-foreground/80 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No experience details added yet.</p>
              )}
            </div>

            {/* Projects */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-border/50">
              <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-2">
                <span className="text-xl">🚀</span>
                Featured Projects
              </h3>
              
              {profileUser.projects && profileUser.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileUser.projects.map((proj, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-card border border-border/50 hover:border-violet-500/30 transition-colors">
                      <h4 className="font-bold text-foreground flex items-center justify-between">
                        {proj.name}
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-violet-500">
                            <FiExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                        {proj.description}
                      </p>
                      {proj.tags && proj.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {proj.tags.map(t => (
                            <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No projects added yet.</p>
              )}
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
