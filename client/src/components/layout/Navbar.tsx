import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { getUserAvatar } from '../../utils/constants';
import Avatar from '../ui/Avatar';
import { 
  HiOutlineBell, 
  HiOutlineSun, 
  HiOutlineMoon, 
  HiOutlineMenu, 
  HiOutlineX, 
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineCog
} from 'react-icons/hi';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Recommendations', path: '/recommendations' },
    { name: 'Network', path: '/network' },
    { name: 'Friends', path: '/friends' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Search', path: '/search' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Mobile Menu Trigger */}
          <div className="flex items-center gap-4">
            {user && (
              <button 
                onClick={onMenuClick}
                className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-muted focus:outline-none md:hidden"
              >
                <HiOutlineMenu className="h-6 w-6" />
              </button>
            )}
            <Link to={user ? "/dashboard" : "/"} className="flex items-center">
              <span className="text-2xl font-black tracking-tight gradient-text">GraphMate</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                  `}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          )}

          {/* User Controls / Auth Buttons */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-all duration-200"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <HiOutlineSun className="h-5 w-5 text-yellow-500" />
              ) : (
                <HiOutlineMoon className="h-5 w-5 text-primary-600" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowDropdown(false);
                    }}
                    className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-all duration-200 relative"
                  >
                    <HiOutlineBell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-2 ring-background">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-card border border-border p-2 shadow-xl animate-slide-up focus:outline-none max-h-96 overflow-y-auto z-50">
                      <div className="px-4 py-2 border-b border-border flex justify-between items-center">
                        <span className="font-bold text-sm text-foreground">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                      <div className="mt-1 divide-y divide-border">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-xs text-muted-foreground">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif._id} 
                              onClick={() => {
                                markAsRead(notif._id);
                                if (notif.relatedUser) {
                                  navigate(`/profile/${notif.relatedUser.username}`);
                                }
                                setShowNotifications(false);
                              }}
                              className={`p-3 text-xs hover:bg-muted rounded-xl cursor-pointer transition-colors ${!notif.read ? 'bg-primary/5 font-medium' : ''}`}
                            >
                              <div className="flex gap-2">
                                <Avatar src={getUserAvatar(notif.relatedUser || {})} name={notif.relatedUser?.name || 'User'} size="sm" />
                                <div>
                                  <p className="text-foreground">{notif.message}</p>
                                  <p className="text-[10px] text-muted-foreground mt-1">
                                    {new Date(notif.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <Avatar 
                      src={getUserAvatar(user)} 
                      name={user.name} 
                      size="sm"
                      className="ring-2 ring-primary/20 hover:ring-primary transition-all duration-200"
                    />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-card border border-border p-2 shadow-xl animate-slide-up z-50">
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">@{user.username}</p>
                      </div>
                      
                      <Link 
                        to={`/profile/${user.username}`} 
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <HiOutlineUser className="h-4 w-4" />
                        My Profile
                      </Link>

                      <Link 
                        to="/settings" 
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <HiOutlineCog className="h-4 w-4" />
                        Settings
                      </Link>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          logout();
                          navigate('/login');
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-xs text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <HiOutlineLogout className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-secondary py-1.5 px-4 text-xs font-semibold rounded-xl">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary py-1.5 px-4 text-xs font-semibold rounded-xl">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
