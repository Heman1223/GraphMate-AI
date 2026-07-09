import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserAvatar } from '../../utils/constants';
import Avatar from '../ui/Avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineHome, 
  HiOutlineShare, 
  HiOutlineUserGroup, 
  HiOutlineChartBar, 
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog6Tooth,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineGlobeAlt
} from 'react-icons/hi2';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HiOutlineHome },
    { name: 'Network Graph', path: '/network', icon: HiOutlineShare },
    { name: 'Friends & Requests', path: '/friends', icon: HiOutlineUserGroup },
    { name: 'Messages', path: '/messages', icon: HiOutlineChatBubbleLeftEllipsis },
    { name: 'Global Community', path: '/community', icon: HiOutlineGlobeAlt },
    { name: 'Analytics', path: '/analytics', icon: HiOutlineChartBar },
    { name: 'Semantic Search', path: '/search', icon: HiOutlineMagnifyingGlass },
    { name: 'Settings', path: '/settings', icon: HiOutlineCog6Tooth },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-background border-r border-border p-4 sm:p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 lg:translate-x-0 lg:static lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-72 lg:w-20 lg:items-center lg:px-4' : 'w-72'}
        `}
      >
        <div>
          {/* Header & Toggle */}
          <div className={`flex items-center mb-6 ${isCollapsed ? 'lg:justify-center justify-between' : 'justify-between'}`}>
            {!isCollapsed && <span className="text-xl font-black gradient-text lg:block hidden">GraphMate</span>}
            <span className="text-xl font-black gradient-text lg:hidden">GraphMate</span>
            
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {isCollapsed ? <HiOutlineChevronRight className="h-5 w-5" /> : <HiOutlineChevronLeft className="h-5 w-5" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            >
              <HiOutlineXMark className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Info */}
          {user && (
            <Link 
              to={`/profile/${user.username}`}
              onClick={onClose}
              className={`flex items-center gap-3 p-3 bg-muted rounded-2xl mb-6 hover:ring-2 hover:ring-primary/50 transition-all ${isCollapsed ? 'lg:justify-center' : ''}`}
            >
              <Avatar src={getUserAvatar(user)} name={user.name} size="md" />
              <div className={`overflow-hidden ${isCollapsed ? 'lg:hidden' : ''}`}>
                <p className="font-bold text-sm text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
              </div>
            </Link>
          )}

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  title={isCollapsed ? item.name : undefined}
                  className={({ isActive }) => `
                    flex items-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                    ${isCollapsed ? 'lg:justify-center px-0 lg:px-0 px-4' : 'px-4'}
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                  `}
                >
                  <Icon className="h-6 w-6 shrink-0" />
                  <span className={`${isCollapsed ? 'lg:hidden' : ''}`}>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        {user && (
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            title={isCollapsed ? "Logout" : undefined}
            className={`flex items-center gap-3 py-3 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors
              ${isCollapsed ? 'lg:justify-center px-0 lg:px-0 px-4' : 'px-4 w-full'}
            `}
          >
            <HiOutlineArrowRightOnRectangle className="h-6 w-6 shrink-0" />
            <span className={`${isCollapsed ? 'lg:hidden' : ''}`}>Logout</span>
          </button>
        )}
      </aside>
    </>
  );
}
