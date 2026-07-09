import { useEffect, useState, useCallback } from 'react';
import RecommendationCard from '../recommendation/RecommendationCard';
import { recommendationService } from '../../services/recommendation.service';
import { friendService } from '../../services/friend.service';
import type { IRecommendation } from '../../types';
import { AnimatePresence } from 'framer-motion';
import { HiOutlineXMark, HiOutlineHeart } from 'react-icons/hi2';
import { useToast } from '../ui/Toast';

export default function SwipeRecommendations() {
  const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await recommendationService.getRecommendations();
        setRecommendations(data);
      } catch (err) {
        console.error('Failed to load recommendation list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSkip = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
  }, []);

  const handleConnect = useCallback(async () => {
    const rec = recommendations[currentIndex];
    if (rec) {
      try {
        await friendService.sendRequest(rec.user._id);
        addToast(`Connection request sent to ${rec.user.name}`, 'success');
      } catch (err) {
        console.error(err);
      }
    }
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, recommendations, addToast]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex >= recommendations.length) return;
      
      if (e.key === 'ArrowLeft') {
        handleSkip();
      } else if (e.key === 'ArrowRight') {
        handleConnect();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, recommendations.length, handleSkip, handleConnect]);

  return (
    <div className="flex flex-col w-full h-full min-h-[600px] items-center">
      <div className="flex flex-col gap-1 mb-6 text-center w-full">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Discover Matches
        </h2>
        <p className="text-xs text-muted-foreground">
          Swipe right or <kbd className="bg-muted px-1 rounded">→</kbd> to connect.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start w-full">
        {loading ? (
          <div className="w-full max-w-2xl h-[600px] rounded-3xl skeleton" />
        ) : currentIndex >= recommendations.length ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="font-bold text-lg text-foreground">All caught up!</h3>
            <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
              Check back later for more AI matches.
            </p>
          </div>
        ) : (
          <div className="relative w-full max-w-2xl h-[600px] flex flex-col">
            <div className="relative flex-1 w-full grid">
              <AnimatePresence>
                {recommendations.map((rec, index) => {
                  if (index < currentIndex) return null; // Already swiped
                  if (index > currentIndex + 2) return null; // Only render top 3 cards for performance
                  
                  return (
                    <RecommendationCard
                      key={rec.user._id}
                      recommendation={rec}
                      onConnect={handleConnect}
                      onSkip={handleSkip}
                      active={index === currentIndex}
                      zIndex={recommendations.length - index}
                    />
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center gap-6 mt-8 z-20">
              <button
                onClick={handleSkip}
                className="w-16 h-16 rounded-full bg-background border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all active:scale-95"
              >
                <HiOutlineXMark className="w-8 h-8" />
              </button>
              <button
                onClick={handleConnect}
                className="w-16 h-16 rounded-full bg-background border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:bg-success/10 hover:text-success hover:border-success/30 transition-all active:scale-95"
              >
                <HiOutlineHeart className="w-8 h-8" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
