import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';
import { cn } from '../../utils/helpers';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
              'relative w-full rounded-2xl bg-card border border-border shadow-2xl',
              sizeClasses[size]
            )}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                >
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="p-6">{children}</div>

            {/* Close button if no title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
