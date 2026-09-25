import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { cartButtonGlowAnimation, cartButtonGlowTransition } from '../../utils/animations';

export const FloatingCartBar: React.FC = () => {
  const { totalQuantity, totalPrice, openCart, isOpen } = useCart();
  const [isBuilderInView, setIsBuilderInView] = useState(false);

  useEffect(() => {
    const builderEl = document.getElementById('builder-section');
    if (!builderEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsBuilderInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(builderEl);
    return () => observer.disconnect();
  }, []);

  // No renderizar si el carrito está abierto, si está vacío, o si el usuario está en el constructor interactuando con LivePriceBar
  if (isOpen || totalQuantity === 0 || isBuilderInView) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 lg:hidden max-w-md mx-auto pointer-events-none animate-in slide-in-from-bottom-5 duration-200">
      <motion.button
        type="button"
        animate={cartButtonGlowAnimation}
        transition={cartButtonGlowTransition}
        whileTap={{ scale: 0.95 }}
        onClick={openCart}
        className="pointer-events-auto w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-gourmet-primary via-[#8f2026] to-[#781d22] text-white border-2 border-amber-400 transition-all cursor-pointer select-none"
        aria-label="Abrir pedido actual"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-xl bg-black/25 border border-white/20 flex items-center justify-center text-white">
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {totalQuantity}
            </span>
          </div>
          <div className="text-left">
            <span className="text-[11px] font-medium text-amber-100/90 block leading-tight">
              Ver tu pedido
            </span>
            <span className="text-sm font-extrabold text-white">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
          <span>Revisar</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </motion.button>
    </div>
  );
};
