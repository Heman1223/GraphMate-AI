import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/40 py-8 transition-colors duration-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-xl font-black gradient-text">GraphMate</span>
            <p className="text-xs text-muted-foreground">
              AI-Powered Friend Recommendation & Network Visualization System.
            </p>
          </div>
          
          <div className="flex gap-6 text-xs font-semibold text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border/50 text-center text-[10px] text-muted-foreground">
          Developed by Heman Sharma &copy; {new Date().getFullYear()} GraphMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
