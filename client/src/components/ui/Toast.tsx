import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
  HiExclamationTriangle,
  HiXMark,
} from 'react-icons/hi2';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (title: string | Omit<Toast, 'id'>, type?: ToastType, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const icons: Record<ToastType, React.ReactNode> = {
  success: <HiCheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <HiExclamationCircle className="w-5 h-5 text-red-500" />,
  info: <HiInformationCircle className="w-5 h-5 text-blue-500" />,
  warning: <HiExclamationTriangle className="w-5 h-5 text-amber-500" />,
};

const progressColors: Record<ToastType, string> = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) {
  const duration = toast.duration || 4000;

  React.useEffect(() => {
    const timer = setTimeout(onRemove, duration);
    return () => clearTimeout(timer);
  }, [duration, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
    >
      <div className="flex items-start gap-3 p-4">
        <span className="flex-shrink-0 mt-0.5">{icons[toast.type]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {toast.title}
          </p>
          {toast.message && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="flex-shrink-0 p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors hover:bg-muted"
        >
          <HiXMark className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        style={{ transformOrigin: 'left' }}
        className={`h-0.5 ${progressColors[toast.type]}`}
      />
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((title: string | Omit<Toast, 'id'>, type?: ToastType, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    if (typeof title === 'string') {
      setToasts((prev) => [...prev, { id, title, type: type || 'info', message }]);
    } else {
      setToasts((prev) => [...prev, { ...title, id }]);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
