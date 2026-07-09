import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Skeleton from '../ui/Skeleton';
import { HiOutlineBars3 } from 'react-icons/hi2';

export default function AppLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="h-6 w-32 skeleton" />
          <div className="h-10 w-10 rounded-full skeleton" />
        </div>
        <div className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton.SkeletonCard key={i} />
            ))}
          </div>
          <div className="h-64 skeleton rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check profile completeness for protected routes
  const isProfileComplete = user?.college && user?.skills && user.skills.length > 0;
  if (!isProfileComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-200 overflow-hidden relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Mobile menu toggle */}
        <div className="lg:hidden p-4 flex items-center justify-between border-b border-border bg-background/50 backdrop-blur-xl z-10 absolute top-0 left-0 w-full">
          <span className="font-black text-lg gradient-text">GraphMate</span>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground"
          >
            <HiOutlineBars3 className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pt-20 lg:pt-8 sm:p-6 lg:p-8 animate-fade-in custom-scrollbar">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
