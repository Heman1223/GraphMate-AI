import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <div className="relative overflow-hidden min-h-[90vh] flex items-center py-20">
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex self-center lg:self-start items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Revolutionizing Professional Networking
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-foreground text-balance">
              Find Meaningful <br className="hidden sm:inline" />
              Connections with <br />
              <span className="gradient-text">AI Recommendation</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              GraphMate blends advanced graph algorithms with semantic AI analysis to match you with peers, college mates, and professionals who share your exact skills and interests.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
              <Link to="/register" className="btn-primary py-3 px-8 text-center text-sm font-bold shadow-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-secondary py-3 px-8 text-center text-sm font-bold border border-border">
                Explore Dashboard
              </Link>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div 
              variants={itemVariants} 
              className="grid grid-cols-3 gap-6 border-t border-border/60 pt-10 mt-10 max-w-lg mx-auto lg:mx-0"
            >
              <div>
                <p className="text-3xl sm:text-4xl font-black text-primary">96%</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-widest mt-2">AI Accuracy</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-accent-foreground">10K+</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-widest mt-2">Active Graph Nodes</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-black text-emerald-500">50K+</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-widest mt-2">AI Matches</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Graphic Side */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' as const }}
            className="flex justify-center items-center"
          >
            <div className="relative w-[320px] sm:w-[400px] h-[320px] sm:h-[400px] rounded-full border border-border/40 flex items-center justify-center animate-pulse-glow bg-muted/5">
              {/* Floating Graph Network Node mock */}
              <div className="absolute top-10 left-10 w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold shadow-md animate-float">Node</div>
              <div className="absolute top-20 right-4 w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-md animate-float" style={{ animationDelay: '1.5s' }}>AI</div>
              <div className="absolute bottom-16 left-6 w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md animate-float" style={{ animationDelay: '3s' }}>Graph API</div>
              <div className="absolute bottom-8 right-16 w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-md animate-float" style={{ animationDelay: '0.5s' }}>Vector</div>
              
              {/* Center user node */}
              <div className="w-32 h-32 rounded-full border border-border bg-card flex flex-col items-center justify-center shadow-2xl relative z-10">
                <span className="text-4xl">🤖</span>
                <span className="text-xs font-bold text-muted-foreground mt-2">You</span>
              </div>

              {/* Connecting lines SVG overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
                <line x1="50%" y1="50%" x2="15%" y2="15%" stroke="currentColor" strokeWidth="2" strokeDasharray="5" />
                <line x1="50%" y1="50%" x2="85%" y2="28%" stroke="currentColor" strokeWidth="2" />
                <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="currentColor" strokeWidth="2" />
                <line x1="50%" y1="50%" x2="70%" y2="85%" stroke="currentColor" strokeWidth="2" strokeDasharray="5" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
