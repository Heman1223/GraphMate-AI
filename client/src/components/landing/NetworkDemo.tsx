import { motion } from 'framer-motion';

export default function NetworkDemo() {
  const nodes = [
    { id: 1, x: '20%', y: '30%', emoji: '🚀', name: 'Aman' },
    { id: 2, x: '80%', y: '25%', emoji: '💻', name: 'Priya' },
    { id: 3, x: '15%', y: '70%', emoji: '📈', name: 'Kabir' },
    { id: 4, x: '75%', y: '75%', emoji: '🎨', name: 'Sneha' },
    { id: 5, x: '45%', y: '50%', emoji: '🧠', name: 'You (AI Engine)' },
  ];

  const lines = [
    { from: 5, to: 1, isSuggested: false },
    { from: 5, to: 2, isSuggested: false },
    { from: 5, to: 3, isSuggested: true },
    { from: 5, to: 4, isSuggested: true },
    { from: 1, to: 2, isSuggested: false },
    { from: 3, to: 4, isSuggested: false },
  ];

  return (
    <div className="py-24 sm:py-32 bg-background transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Visualizing the <span className="gradient-text">Social Graph</span>
            </h2>
            <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
              Our graph rendering engine plots user nodes and friendship connections with colored vectors.
            </p>
            <div className="mt-10 space-y-6 text-sm font-semibold">
              <div className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-foreground">Direct Friendships (Active Edges)</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </span>
                <span className="text-foreground">Suggested AI Matches (Embedding Similarity)</span>
              </div>
            </div>
          </div>

          <div className="relative w-full h-[400px] bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
            {/* SVG Connecting lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {lines.map((line, idx) => {
                const nFrom = nodes.find(n => n.id === line.from)!;
                const nTo = nodes.find(n => n.id === line.to)!;
                return (
                  <motion.line
                    key={idx}
                    x1={nFrom.x}
                    y1={nFrom.y}
                    x2={nTo.x}
                    y2={nTo.y}
                    stroke={line.isSuggested ? '#8b5cf6' : '#10b981'}
                    strokeWidth={line.isSuggested ? '2' : '1.5'}
                    strokeDasharray={line.isSuggested ? '5,5' : 'none'}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer z-10"
                style={{ left: node.x, top: node.y }}
                whileHover={{ scale: 1.15 }}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md border ${
                  node.id === 5 
                    ? 'gradient-bg text-white border-primary/50' 
                    : 'bg-background border-border'
                }`}>
                  {node.emoji}
                </div>
                <span className="text-[10px] font-bold text-foreground bg-card/90 backdrop-blur-sm px-2 py-1 rounded-full border border-border/50">
                  {node.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
