import type { IExplanation } from '../../types';
import { 
  HiOutlineCheckCircle, 
  HiOutlineXCircle,
  HiOutlineShare,
  HiOutlineCpuChip,
  HiOutlineExclamationTriangle
} from 'react-icons/hi2';

interface ExplainableAIProps {
  explanation: IExplanation;
}

export default function ExplainableAI({ explanation }: ExplainableAIProps) {
  const breakdown = [
    { 
      label: 'Mutual Connections', 
      met: explanation.mutualFriends > 0, 
      desc: explanation.mutualFriends > 0 
        ? `${explanation.mutualFriends} shared connection(s)` 
        : 'No mutual connections',
    },
    { 
      label: 'Skill Intersections', 
      met: explanation.commonSkills.length > 0, 
      desc: explanation.commonSkills.length > 0 
        ? `Matching: ${explanation.commonSkills.join(', ')}` 
        : 'No direct skill intersection',
    },
    { 
      label: 'Common Interests', 
      met: explanation.commonInterests.length > 0, 
      desc: explanation.commonInterests.length > 0 
        ? `Matching: ${explanation.commonInterests.join(', ')}` 
        : 'No matching interests',
    },
    { 
      label: 'Academic College Match', 
      met: explanation.sameCollege, 
      desc: explanation.sameCollege ? 'Studying at the same college' : 'Different college',
    },
    { 
      label: 'Geographic City Match', 
      met: explanation.sameCity, 
      desc: explanation.sameCity ? 'Located in the same city' : 'Different city',
    }
  ];

  const aiSimilarityPercent = Math.round(explanation.aiSimilarity * 100);

  return (
    <div className="space-y-4 text-xs transition-colors duration-200">
      {/* Graph Analysis Section */}
      <div>
        <div className="flex items-center gap-2 font-bold text-foreground mb-2">
          <HiOutlineShare className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-[11px] uppercase tracking-wider">Graph Analysis</span>
        </div>
        
        <div className="space-y-1.5 pl-1">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              {item.met ? (
                <HiOutlineCheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <HiOutlineXCircle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Semantic Score Section */}
      <div className="border-t border-border/30 pt-3">
        <div className="flex items-center gap-2 font-bold text-foreground mb-2">
          <HiOutlineCpuChip className={`h-3.5 w-3.5 ${explanation.aiAvailable ? 'text-violet-500' : 'text-muted-foreground'}`} />
          <span className="text-[11px] uppercase tracking-wider">AI Semantic Analysis</span>
        </div>

        {explanation.aiAvailable ? (
          <div className="pl-1 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <span>Embedding Cosine Similarity</span>
                <span className="text-violet-500">{aiSimilarityPercent}%</span>
              </div>
              <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-violet-500 to-purple-500" 
                  style={{ width: `${aiSimilarityPercent}%` }}
                />
              </div>
            </div>
            
            {explanation.aiBasis && explanation.aiBasis.length > 0 && (
              <div className="bg-violet-500/5 rounded-lg p-2.5 border border-violet-500/10">
                <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 mb-1.5 uppercase tracking-wider">
                  Semantic Matches
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {explanation.aiBasis.map((basis, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-300">
                      {basis}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="pl-1 flex items-center gap-2 py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <HiOutlineExclamationTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-600 dark:text-amber-400 text-[11px]">AI Service Offline</p>
              <p className="text-[10px] text-muted-foreground">Score is based on graph algorithms only. Start the AI service for semantic matching.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
