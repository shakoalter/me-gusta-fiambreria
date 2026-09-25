import React, { ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'whatsapp' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gourmet-primary hover:bg-gourmet-primaryHover text-white shadow-gourmet-md border border-red-900/40',
  secondary: 'bg-gourmet-surface hover:bg-gourmet-surfaceHover text-gourmet-dark border border-gourmet-border',
  outline: 'bg-transparent border-2 border-gourmet-primary text-gourmet-primary hover:bg-gourmet-primaryLight',
  whatsapp: 'bg-gourmet-whatsapp hover:bg-gourmet-whatsappHover text-white shadow-gourmet-md font-bold tracking-wide',
  ghost: 'bg-transparent hover:bg-black/5 text-gourmet-dark',
  danger: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 font-semibold',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  disabled,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-colors
    focus:outline-none focus:ring-2 focus:ring-gourmet-primary/30 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <motion.button
      type={type}
      whileHover={disabled ? undefined : { scale: 1.015 }}
      whileTap={disabled ? undefined : { scale: 0.975 }}
      transition={{ duration: 0.15 }}
      disabled={disabled}
      onClick={onClick}
      className={baseClasses}
      {...(props as HTMLMotionProps<'button'>)}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};
