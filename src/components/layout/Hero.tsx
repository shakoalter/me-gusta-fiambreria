import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, ArrowRight, MousePointerClick, Megaphone } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { DAILY_OFFER_CONFIG } from '../../data/dailyOffer';
import { DailyOfferModal } from '../promo/DailyOfferModal';

export const Hero: React.FC = () => {
  const { startNewSandwich } = useCart();
  const [isOfferModalOpen, setIsOfferModalOpen] = useState<boolean>(false);

  const scrollToBuilder = () => {
    startNewSandwich();
    const el = document.getElementById('builder-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section 
        id="hero-section"
        className="relative overflow-hidden bg-[#2A150E] bg-[url('/images/fondo-2.png')] bg-repeat text-white border-b border-amber-950/60 shadow-inner"
      >
        {/* Overlay de gradiente suave para fusionar la iluminación rústica */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/75 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Columna Izquierda: Texto y CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 text-center lg:text-left space-y-6"
            >
              {/* Tag / Badge superior */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-amber-400/40 text-amber-200 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Calidad Artesanal de Primera</span>
              </div>

              {/* Título Principal */}
              <div>
                <h2 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-none">
                  Sándwiches
                </h2>
                <h2 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-normal italic text-[#F0B243] tracking-tight leading-tight mt-1">
                  Gourmet
                </h2>
              </div>

              {/* Descripción */}
              <p className="text-sm sm:text-base text-stone-200/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Elegí tu fiambre favorito, combinálo con el queso que más te tiente y agregale los extras que quieras. Armalo a tu manera y envíalo directo por WhatsApp.
              </p>

              {/* Pills de pasos resumidos */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs font-bold pt-1">
                {/* Paso 1 Pill */}
                <div className="flex items-center gap-2 bg-[#781D22] text-white px-3.5 py-2 rounded-full border border-red-800/80 shadow-md">
                  <span className="w-5 h-5 rounded-full bg-white text-[#781D22] text-[11px] font-black flex items-center justify-center">
                    1
                  </span>
                  <span>1 Fiambre</span>
                </div>

                <span className="text-amber-400/80 font-bold text-sm">+</span>

                {/* Paso 2 Pill */}
                <div className="flex items-center gap-2 bg-white text-stone-900 px-3.5 py-2 rounded-full shadow-md">
                  <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 text-[11px] font-black flex items-center justify-center">
                    2
                  </span>
                  <span>1 Queso</span>
                </div>

                <span className="text-amber-400/80 font-bold text-sm">+</span>

                {/* Paso 3 Pill */}
                <div className="flex items-center gap-2 bg-white text-stone-900 px-3.5 py-2 rounded-full shadow-md">
                  <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 text-[11px] font-black flex items-center justify-center">
                    3
                  </span>
                  <span>Aderezos & Extras</span>
                </div>
              </div>

              {/* Botón CTA + Leyenda de Confianza */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={scrollToBuilder}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#781D22] hover:bg-[#63171b] text-white text-sm font-bold shadow-xl border border-red-700/60 transition-all cursor-pointer"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Armar mi sándwich</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </motion.button>

                <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  <span>Sin tarjeta · Pago al retirar</span>
                </div>
              </div>
            </motion.div>

            {/* Columna Derecha: Tarjeta Promocional Oferta del Día */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-6 relative flex items-center justify-center w-full"
            >
              <div className="relative w-full max-w-lg lg:max-w-xl mx-auto">
                {/* Tarjeta de Oferta - Todo el contenedor es interactivo */}
                <motion.div
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsOfferModalOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsOfferModalOpen(true);
                    }
                  }}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  aria-label="Ver y personalizar la Oferta del Día"
                  className="relative w-full rounded-[2rem] overflow-hidden border-[3.5px] sm:border-4 border-[#F5A623] bg-[#120C08] shadow-[0_22px_55px_rgba(0,0,0,0.85),0_0_30px_rgba(245,166,35,0.22)] group cursor-pointer transition-all duration-300 focus:outline-hidden focus:ring-4 focus:ring-amber-400/60 select-none flex flex-col"
                >
                  {/* FOTOGRAFÍA SUPERIOR DEL PRODUCTO */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] overflow-hidden bg-stone-950 border-b-2 border-amber-500/20">
                    <img
                      src={DAILY_OFFER_CONFIG.image}
                      alt={DAILY_OFFER_CONFIG.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="eager"
                    />

                    {/* Gradiente sutil para profundidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                    {/* INSIGNIA «OFERTA DEL DÍA» (Cinta Amarilla Superior Izquierda) */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
                      <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#F5A623] text-stone-950 text-xs sm:text-sm font-black uppercase tracking-wider shadow-2xl border border-yellow-300/70 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                        <Megaphone className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-stone-950 stroke-stone-950 stroke-[2.5]" />
                        <span>{DAILY_OFFER_CONFIG.badge}</span>
                      </div>
                    </div>

                    {/* INSIGNIA «INGREDIENTES DE PRIMERA» (Sello Circular Superior Derecho) */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-[#18120C]/95 text-amber-300 border-2 border-dashed border-[#F5A623] shadow-2xl flex flex-col items-center justify-center text-center p-1.5 backdrop-blur-xs transform rotate-6 group-hover:rotate-12 transition-transform duration-300 pointer-events-none">
                      <span className="text-sm sm:text-base leading-none">🌿</span>
                      <span className="text-[8px] sm:text-[9.5px] font-black uppercase tracking-tight leading-tight text-white mt-1">
                        Ingredientes
                      </span>
                      <span className="text-[7px] sm:text-[8.5px] font-extrabold text-[#F5A623] uppercase tracking-widest leading-tight">
                        De Primera
                      </span>
                    </div>
                  </div>

                  {/* SECTOR INFERIOR DE INFORMACIÓN Y LLAMADO A LA ACCIÓN */}
                  <div className="p-5 sm:p-6 bg-[#120C08] text-white flex flex-col space-y-3.5 sm:space-y-4">
                    {/* Título y Descripción Dinámica */}
                    <div className="space-y-1 text-left">
                      <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                        {DAILY_OFFER_CONFIG.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-300 font-normal leading-relaxed">
                        {DAILY_OFFER_CONFIG.description}
                      </p>
                    </div>

                    {/* FILA DE INTERACCIÓN: Botón + Indicador «¡Tocá la imagen y descubrilo!» */}
                    <div className="pt-1 flex flex-wrap items-center justify-between gap-3 relative">
                      {/* Botón Principal «Ver más detalles» */}
                      <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#F5A623] group-hover:bg-[#f8b438] text-stone-950 font-extrabold text-xs sm:text-sm shadow-xl transition-all duration-300 transform group-hover:translate-x-0.5 shrink-0">
                        <MousePointerClick className="w-4 h-4 stroke-[2.5]" />
                        <span>Ver más detalles</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </div>

                      {/* Indicador con flecha curva y mano interactiva */}
                      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
                        {/* Flecha curva dibujada en SVG apuntando hacia la imagen */}
                        <svg
                          className="w-8 h-8 sm:w-10 sm:h-10 text-[#F5A623] shrink-0 -rotate-12"
                          viewBox="0 0 40 40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M 32 32 C 20 34 10 26 12 10" />
                          <path d="M 6 16 L 12 10 L 18 16" />
                        </svg>

                        <div className="flex flex-col items-start leading-none text-[#F5A623] drop-shadow-md select-none">
                          <span className="font-handwriting text-base sm:text-xl font-bold whitespace-nowrap rotate-[-3deg]">
                            ¡Tocá la imagen
                          </span>
                          <span className="font-handwriting text-base sm:text-xl font-bold whitespace-nowrap rotate-[-3deg]">
                            y descubrilo!
                          </span>
                        </div>

                        {/* Icono de cursor táctil / mano con ondas */}
                        <div 
                          className="relative w-8 h-8 sm:w-9 sm:h-9 text-white shrink-0 ml-0.5 filter drop-shadow-[0_2px_8px_rgba(245,166,35,0.8)]"
                          aria-hidden="true"
                        >
                          <svg
                            className="w-full h-full text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            {/* Rayos / ondas de click */}
                            <path d="M12 2v2.5" className="stroke-amber-400 stroke-[2.5]" />
                            <path d="M5.5 5.5l1.8 1.8" className="stroke-amber-400 stroke-[2.5]" />
                            <path d="M2 12h2.5" className="stroke-amber-400 stroke-[2.5]" />
                            {/* Puntero de mano */}
                            <path
                              d="M10 13V6a2 2 0 0 1 4 0v5"
                              fill="#FFFFFF"
                              stroke="#1C1917"
                              strokeWidth="1.8"
                            />
                            <path
                              d="M14 10.5a2 2 0 0 1 4 0V12"
                              fill="#FFFFFF"
                              stroke="#1C1917"
                              strokeWidth="1.8"
                            />
                            <path
                              d="M18 11.5a2 2 0 0 1 4 0V15a7 7 0 0 1-7 7h-2a7 7 0 0 1-5.6-2.8L6 17.5a1.5 1.5 0 0 1 2.3-1.9L10 17"
                              fill="#FFFFFF"
                              stroke="#1C1917"
                              strokeWidth="1.8"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Modal Interactivo de Oferta del Día */}
      <AnimatePresence>
        {isOfferModalOpen && (
          <DailyOfferModal
            isOpen={isOfferModalOpen}
            onClose={() => setIsOfferModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
