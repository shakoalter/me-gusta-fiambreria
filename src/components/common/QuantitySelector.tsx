import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  size = 'md',
  className = '',
}) => {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  const buttonSizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  }[size];

  const textSizeClasses = {
    sm: 'text-sm w-7',
    md: 'text-base w-9',
    lg: 'text-lg w-12 font-bold',
  }[size];

  return (
    <div
      className={`inline-flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200/80 select-none ${className}`}
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={onDecrement}
        disabled={isMin}
        aria-label="Disminuir cantidad"
        className={`flex items-center justify-center rounded-lg bg-white text-gourmet-dark shadow-sm hover:bg-stone-50 active:bg-stone-200 disabled:opacity-40 disabled:hover:bg-white transition-colors ${buttonSizeClasses}`}
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </motion.button>

      <span
        aria-live="polite"
        className={`text-center font-bold text-gourmet-dark ${textSizeClasses}`}
      >
        {quantity}
      </span>

      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={onIncrement}
        disabled={isMax}
        aria-label="Aumentar cantidad"
        className={`flex items-center justify-center rounded-lg bg-white text-gourmet-dark shadow-sm hover:bg-stone-50 active:bg-stone-200 disabled:opacity-40 disabled:hover:bg-white transition-colors ${buttonSizeClasses}`}
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </motion.button>
    </div>
  );
};
