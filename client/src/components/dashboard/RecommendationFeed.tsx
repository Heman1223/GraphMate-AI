import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { recommendationService } from '../../services/recommendation.service';
import { getUserAvatar } from '../../utils/constants';
import type { IRecommendation } from '../../types';

export default function RecommendationFeed() {
  const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await recommendationService.getRecommendations();
        setRecommendations(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
          Suggested Connections
        </h3>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-border-light dark:bg-border-dark" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-border-light dark:bg-border-dark rounded w-1/3" />
                <div className="h-3 bg-border-light dark:bg-border-dark rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark">
            AI Matches
          </h3>
          <Link to="/recommendations" className="text-xs font-bold text-primary-500 hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {recommendations.length === 0 ? (
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark text-center py-6">
              No recommendations found yet. Try modifying your profile info or adding skills.
            </p>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec.user._id}
                className="flex items-center justify-between p-3 rounded-2xl bg-bg-secondary-light/40 dark:bg-bg-secondary-dark/40 border border-border-light/20 dark:border-border-dark/20"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={getUserAvatar(rec.user)} name={rec.user.name} size="sm" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-text-primary-light dark:text-text-primary-dark truncate">
                      {rec.user.name}
                    </p>
                    <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark truncate">
                      {rec.user.college} &middot; {rec.user.branch}
                    </p>
                  </div>
                </div>

                <Badge variant={rec.score >= 80 ? 'success' : 'primary'} size="sm">
                  {Math.round(rec.score)}% Match
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
