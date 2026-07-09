import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <div className="py-24 sm:py-32 relative overflow-hidden bg-muted/30 transition-colors duration-200">
      {/* Background Gradients */}
      <div className="absolute inset-0 gradient-bg opacity-5 pointer-events-none" />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Ready to Map Your <span className="gradient-text">Local Network</span>?
        </h2>
        <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
          Sign up now to connect, explore common skills, run semantic search matching, and visualize your node edges.
        </p>
        
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/register" className="btn-primary py-3 px-8 text-sm font-bold shadow-lg">
            Create Account
          </Link>
          <Link to="/login" className="btn-secondary py-3 px-8 text-sm font-bold border border-border">
            Member Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
