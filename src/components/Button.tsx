import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost';
}

export const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-fg text-white hover:bg-fg/90 shadow-xl shadow-fg/10',
    accent: 'bg-accent text-white hover:opacity-90 shadow-xl shadow-accent/20',
    secondary: 'bg-white border border-border text-fg hover:bg-bg',
    ghost: 'hover:bg-fg/5 text-muted hover:text-fg',
  };
  
  return (
    <button 
      className={cn(
        'px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3',
        variants[variant],
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
};
