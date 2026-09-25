import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface PriceTagProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  prefix?: string;
  suffix?: string;
  className?: string;
  highlight?: boolean;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  amount,
  size = 'md',
  prefix,
  suffix,
  className = '',
  highlight = false,
}) => {
  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-extrabold',
    xl: 'text-2xl md:text-3xl font-extrabold',
  }[size];

  const colorClass = highlight ? 'text-gourmet-primary' : 'text-gourmet-dark';

  return (
    <div className={`inline-flex items-baseline gap-1 ${className}`}>
      {prefix && <span className="text-xs text-gourmet-muted font-normal">{prefix}</span>}
      <span className={`${sizeClasses} ${colorClass} tracking-tight font-sans`}>
        {formatCurrency(amount)}
      </span>
      {suffix && <span className="text-xs text-gourmet-muted font-normal">{suffix}</span>}
    </div>
  );
};
