import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-md border bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200',
              'px-3 py-2 text-sm',
              icon ? 'pl-9' : '',
              error
                ? 'border-destructive focus-visible:ring-destructive/20'
                : 'border-input focus-visible:border-primary focus-visible:ring-primary/20',
              'focus-visible:outline-none focus-visible:ring-2',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-error font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
