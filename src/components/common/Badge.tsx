import React from 'react';

type BadgeVariant = 'primary' | 'olive' | 'mustard' | 'neutral' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-gourmet-primaryLight text-gourmet-primary border border-gourmet-primary/20',
  olive: 'bg-gourmet-oliveLight text-gourmet-olive border border-gourmet-olive/20',
  mustard: 'bg-gourmet-mustardLight text-gourmet-mustard border border-gourmet-mustard/20',
  neutral: 'bg-stone-100 text-stone-700 border border-stone-200',
  outline: 'bg-transparent text-stone-600 border border-gourmet-border',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const sizeStyle = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full tracking-wide uppercase ${variantStyles[variant]} ${sizeStyle} ${className}`}
    >
      {children}
    </span>
  );
};
