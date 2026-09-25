import React from 'react';
import { ShoppingBag, Phone, MapPin, Home, Utensils, Info, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { STORE_CONFIG } from '../../config/storeConfig';
import { cartButtonGlowAnimation, cartButtonGlowTransition } from '../../utils/animations';

export const Header: React.FC = () => {
  const { totalQuantity, openCart } = useCart();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gourmet-border/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        
        {/* Logo / Marca */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer shrink-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gourmet-primary/50 rounded-2xl p-1 -m-1 transition-all"
          aria-label={`${STORE_CONFIG.storeName} - Volver al inicio`}
        >
          <img
            src={STORE_CONFIG.logoUrl}
            alt={`Logo de ${STORE_CONFIG.storeName}`}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm shrink-0 border-2 border-amber-400/70 bg-amber-50"
          />
          <div>
            <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-gourmet-primary leading-tight">
              Fiambrería Artesanal
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-gourmet-dark leading-tight block">
              Me Gusta
            </span>
          </div>
        </button>

        {/* Navegación Central (Desktop) */}
        <nav className="hidden xl:flex items-center gap-7 text-xs font-semibold text-stone-600">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="relative py-2 flex items-center gap-1.5 text-gourmet-primary font-bold transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Inicio</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gourmet-primary rounded-full" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('builder-section')}
            className="py-2 flex items-center gap-1.5 hover:text-gourmet-primary transition-colors cursor-pointer"
          >
            <Utensils className="w-3.5 h-3.5 text-stone-400" />
            <span>Nuestros Sándwiches</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('builder-section')}
            className="py-2 flex items-center gap-1.5 hover:text-gourmet-primary transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Cómo funciona</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('footer-section')}
            className="py-2 flex items-center gap-1.5 hover:text-gourmet-primary transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-stone-400" />
            <span>Contacto</span>
          </button>
        </nav>

        {/* Info adicional para desktop & Botón Carrito */}
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Ubicación */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-left">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-gourmet-primary shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-bold text-gourmet-dark text-[11px] leading-tight">
                {STORE_CONFIG.address}
              </span>
              <span className="text-[10px] text-gourmet-muted block leading-tight">
                CABA, Argentina
              </span>
            </div>
          </div>

          {/* Teléfono y Horario */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-left">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-gourmet-primary shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-bold text-gourmet-dark text-[11px] leading-tight">
                Pedidos: {STORE_CONFIG.displayPhone}
              </span>
              <span className="text-[10px] text-gourmet-muted block leading-tight">
                Lun a Sáb · 10 a 13:30 / 16:30 a 20:30
              </span>
            </div>
          </div>

          {/* Botón Carrito */}
          <motion.button
            type="button"
            animate={cartButtonGlowAnimation}
            transition={cartButtonGlowTransition}
            whileHover={{ scale: 1.1, boxShadow: '0 0 22px rgba(251, 191, 36, 1), 0 0 35px rgba(245, 158, 11, 0.7)' }}
            whileTap={{ scale: 0.93 }}
            onClick={openCart}
            className="relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-gourmet-primary via-[#8f2026] to-[#781d22] text-white font-bold text-sm border-2 border-amber-400 transition-all focus:outline-none cursor-pointer select-none shrink-0"
            aria-label={`Ver carrito de compras con ${totalQuantity} productos`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              {totalQuantity > 0 && (
                <motion.span
                  key={totalQuantity}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2.5 -right-3 bg-amber-400 text-stone-950 text-[10px] sm:text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                >
                  {totalQuantity}
                </motion.span>
              )}
            </div>
            <span className="font-bold text-white tracking-wide text-xs sm:text-sm">Tu Pedido</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
