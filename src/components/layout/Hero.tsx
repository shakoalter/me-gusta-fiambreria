import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Utensils, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Hero: React.FC = () => {
  const { startNewSandwich } = useCart();

  const scrollToBuilder = () => {
    startNewSandwich();
    const el = document.getElementById('builder-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
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

          {/* Columna Derecha: Composición Visual Gastronómica */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg lg:max-w-none">
              
              {/* Sello Vintage Circular: Ingredientes de Primera */}
              <div className="absolute -top-4 -right-2 sm:-top-6 sm:right-2 z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1C1917]/90 text-amber-300 border-2 border-dashed border-amber-400/80 shadow-2xl flex flex-col items-center justify-center text-center p-1.5 backdrop-blur-xs transform rotate-6">
                <span className="text-[14px]">🌿</span>
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-tight leading-tight text-white mt-0.5">
                  Ingredientes
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-amber-400 uppercase tracking-widest leading-tight">
                  De Primera
                </span>
              </div>

              {/* Tarjeta de Fotografía Principal */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-stone-900 group">
                <div className="aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden">
                  <img
                    src="/images/hero-sandwich.jpg"
                    alt="Sándwich gourmet artesanal preparado con fiambres seleccionados"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                </div>

                {/* Gradiente oscuro inferior para texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                {/* Badge y Leyenda sobre la foto */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block bg-[#E5A83B] text-stone-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md mb-1.5 shadow-sm">
                    Especial de la casa
                  </span>
                  <p className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                    Pan baguette artesanal y fiambres seleccionados
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
