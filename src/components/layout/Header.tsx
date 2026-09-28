import React from 'react';
import { ShoppingBag, Phone, MapPin, Home, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { STORE_CONFIG } from '../../config/storeConfig';

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
    <header className="sticky top-0 z-40 bg-[#FAF4EC]/95 backdrop-blur-md border-b border-[#E8DFC8] shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        
        {/* Logo / Marca */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer shrink-0 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-gourmet-primary/50 rounded-2xl p-1 -m-1 transition-all"
          aria-label={`${STORE_CONFIG.storeName} - Volver al inicio`}
        >
          <img
            src="/images/logo-me-gusta.png"
            alt={`Logo de ${STORE_CONFIG.storeName}`}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-contain shrink-0 filter drop-shadow-xs"
          />
          <div>
            <span className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#781D22] leading-tight">
              Fiambrería Artesanal
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 leading-tight block">
              Me Gusta
            </span>
          </div>
        </button>

        {/* Navegación Central (Desktop) */}
        <nav className="hidden xl:flex items-center gap-8 text-xs font-semibold text-stone-700">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="relative py-2 flex items-center gap-2 text-[#781D22] font-bold transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#781D22]" />
            <span>Inicio</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#781D22] rounded-full" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('builder-section')}
            className="py-2 flex items-center gap-2 text-stone-700 hover:text-[#781D22] font-semibold transition-colors cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-stone-500" />
            <span>Nuestros Sándwiches</span>
          </button>
        </nav>

        {/* Info adicional para desktop & Botón Carrito */}
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Ubicación */}
          <div className="hidden lg:flex items-center gap-2.5 text-xs text-left">
            <div className="w-8 h-8 rounded-full bg-[#EADCCB] flex items-center justify-center text-stone-700 shrink-0 shadow-2xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-bold text-stone-900 text-[11px] leading-tight">
                {STORE_CONFIG.address}
              </span>
              <span className="text-[10px] text-stone-500 font-medium block leading-tight">
                CABA, Argentina
              </span>
            </div>
          </div>

          {/* Teléfono y Horario */}
          <div className="hidden lg:flex items-center gap-2.5 text-xs text-left">
            <div className="w-8 h-8 rounded-full bg-[#EADCCB] flex items-center justify-center text-stone-700 shrink-0 shadow-2xs">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-bold text-stone-900 text-[11px] leading-tight">
                Pedidos: {STORE_CONFIG.displayPhone}
              </span>
              <span className="text-[10px] text-stone-500 font-medium block leading-tight">
                Lun a Sáb: 10 a 13:30 / 16:30 a 20:30
              </span>
            </div>
          </div>

          {/* Botón Carrito «Tu Pedido» */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCart}
            className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-[#781D22] hover:bg-[#64171b] text-white font-bold text-sm shadow-md transition-all focus:outline-hidden cursor-pointer select-none shrink-0"
            aria-label={`Ver carrito de compras con ${totalQuantity} productos`}
          >
            <div className="relative flex items-center">
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-200" />
              {totalQuantity > 0 && (
                <motion.span
                  key={totalQuantity}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2.5 -right-3 bg-amber-400 text-stone-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs"
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

