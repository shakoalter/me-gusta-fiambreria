import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Sparkles, Ban } from 'lucide-react';
import { EXTRAS_DATA } from '../../data/extras';
import { ADEREZOS_DATA } from '../../data/aderezos';
import { Extra, Aderezo } from '../../types/product';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../common/Badge';

interface StepExtrasProps {
  selectedExtras: Extra[];
  onToggleExtra: (extra: Extra) => void;
  isExtraSelected: (id: string) => boolean;
  selectedAderezos: Aderezo[];
  onToggleAderezo: (aderezo: Aderezo) => void;
  isAderezoSelected: (id: string) => boolean;
  onClearAderezos?: () => void;
}

export const StepExtras: React.FC<StepExtrasProps> = ({
  selectedExtras,
  onToggleExtra,
  isExtraSelected,
  selectedAderezos,
  onToggleAderezo,
  isAderezoSelected,
  onClearAderezos,
}) => {
  const extrasSectionRef = useRef<HTMLDivElement>(null);

  const scrollToExtras = () => {
    setTimeout(() => {
      extrasSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleToggleAderezo = (aderezo: Aderezo) => {
    onToggleAderezo(aderezo);
    scrollToExtras();
  };

  const handleClearAderezos = () => {
    onClearAderezos?.();
    scrollToExtras();
  };

  const isNoAderezoSelected = selectedAderezos.length === 0;

  return (
    <div className="space-y-8">
      {/* Encabezado del Paso 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="bg-emerald-700 text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
              Paso 3 de 3 • Opcional
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-gourmet-dark tracking-tight">
            Sumale Aderezos y Extras
          </h3>
          <p className="text-xs sm:text-sm text-gourmet-muted mt-0.5">
            Elegí tus salsas favoritas sin cargo y agregale ingredientes gourmet a tu gusto.
          </p>
        </div>

        {/* Resumen de selecciones */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {selectedAderezos.length > 0 ? (
            <div className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-xs font-bold text-amber-800">
              {selectedAderezos.length} aderezo{selectedAderezos.length > 1 ? 's' : ''}
            </div>
          ) : (
            <div className="bg-stone-100 border border-stone-200 px-3 py-1 rounded-xl text-xs font-medium text-stone-600">
              Sin aderezos
            </div>
          )}
          {selectedExtras.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold text-emerald-800">
              {selectedExtras.length} extra{selectedExtras.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 1: ADEREZOS (PRIMERO) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif text-lg font-bold text-gourmet-dark flex items-center gap-2">
              <span>🥫</span>
              <span>Aderezos</span>
            </h4>
            <p className="text-xs text-gourmet-muted mt-0.5">
              Elegí tus salsas favoritas para acompañar tu sándwich o continuá sin aderezo.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-100/90 border border-emerald-200 px-2.5 py-1 rounded-lg">
            Sin Cargo
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Opción 1: Sin Aderezo */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClearAderezos}
            className={`relative flex flex-col justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all border-2 select-none overflow-hidden ${
              isNoAderezoSelected
                ? 'bg-amber-50/60 border-amber-600 shadow-gourmet-sm ring-2 ring-amber-500/20'
                : 'bg-white border-gourmet-border hover:border-amber-600/40 hover:shadow-gourmet-sm'
            }`}
          >
            {/* Visual Sin Aderezo */}
            <div className="relative h-16 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden bg-stone-100/80 border border-stone-200/70 p-2 flex items-center justify-center mb-2 sm:mb-2.5">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-500 shadow-inner">
                <Ban className="w-4 h-4 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <div
                className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-sm transition-all ${
                  isNoAderezoSelected
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/90 text-stone-400 border border-stone-200'
                }`}
              >
                {isNoAderezoSelected ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" /> : <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              </div>
            </div>

            {/* Info */}
            <div>
              <h5 className="font-serif font-bold text-xs sm:text-base text-gourmet-dark leading-tight line-clamp-1 sm:line-clamp-none">
                Sin aderezo
              </h5>
              <p className="text-[10px] sm:text-xs text-gourmet-muted mt-0.5 sm:mt-1 leading-snug line-clamp-1 sm:line-clamp-2">
                Sándwich clásico sin salsas ni aderezos agregados.
              </p>
            </div>

            {/* Pie */}
            <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-gourmet-border/60 flex items-center justify-between">
              <span className="text-[9px] sm:text-[11px] font-bold text-emerald-700 uppercase">
                Sin Cargo
              </span>
              <span
                className={`text-[10px] sm:text-xs font-bold ${
                  isNoAderezoSelected ? 'text-amber-700' : 'text-stone-400'
                }`}
              >
                {isNoAderezoSelected ? 'Elegido' : 'Elegir'}
              </span>
            </div>
          </motion.div>

          {/* Opciones de Salsas */}
          {ADEREZOS_DATA.map((aderezo) => {
            const isSelected = isAderezoSelected(aderezo.id);

            return (
              <motion.div
                key={aderezo.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggleAderezo(aderezo)}
                className={`relative flex flex-col justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all border-2 select-none overflow-hidden ${
                  isSelected
                    ? 'bg-amber-50/60 border-amber-600 shadow-gourmet-sm ring-2 ring-amber-500/20'
                    : 'bg-white border-gourmet-border hover:border-amber-600/40 hover:shadow-gourmet-sm'
                }`}
              >
                {/* Imagen del aderezo con Badge y Check */}
                <div className="relative h-16 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden bg-amber-50/40 border border-amber-200/50 p-1.5 flex items-center justify-center mb-2 sm:mb-2.5">
                  <img
                    src={aderezo.image}
                    alt={aderezo.name}
                    className="max-h-12 sm:max-h-20 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {aderezo.badge && (
                    <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 scale-75 sm:scale-100 origin-top-left">
                      <Badge variant="mustard" size="sm">
                        <Sparkles className="w-2.5 h-2.5 mr-1 inline" />
                        {aderezo.badge}
                      </Badge>
                    </div>
                  )}
                  <div
                    className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-sm transition-all ${
                      isSelected
                        ? 'bg-amber-600 text-white'
                        : 'bg-white/90 text-stone-400 border border-stone-200'
                    }`}
                  >
                    {isSelected ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" /> : <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h5 className="font-serif font-bold text-xs sm:text-base text-gourmet-dark leading-tight line-clamp-1 sm:line-clamp-none">
                    {aderezo.name}
                  </h5>
                  <p className="text-[10px] sm:text-xs text-gourmet-muted mt-0.5 sm:mt-1 leading-snug line-clamp-1 sm:line-clamp-2">
                    {aderezo.description}
                  </p>
                </div>

                {/* Pie */}
                <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-gourmet-border/60 flex items-center justify-between">
                  <span className="text-[9px] sm:text-[11px] font-bold text-emerald-700 uppercase">
                    Sin Cargo
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs font-bold ${
                      isSelected ? 'text-amber-700' : 'text-stone-400'
                    }`}
                  >
                    {isSelected ? 'Agregado' : 'Sumar'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 2: EXTRAS GOURMET */}
      <div
        ref={extrasSectionRef}
        id="extras-section"
        className="space-y-4 pt-6 border-t border-gourmet-border/60 scroll-mt-24 sm:scroll-mt-28"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif text-lg font-bold text-gourmet-dark flex items-center gap-2">
              <span>🥗</span>
              <span>Extras Gourmet</span>
            </h4>
            <p className="text-xs text-gourmet-muted mt-0.5">
              Ingredientes frescos y seleccionados por unidad.
            </p>
          </div>
          <span className="text-xs text-gourmet-muted">Opcional con precio individual</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-4">
          {EXTRAS_DATA.map((extra) => {
            const isSelected = isExtraSelected(extra.id);

            return (
              <motion.div
                key={extra.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggleExtra(extra)}
                className={`relative flex flex-col justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all border-2 select-none overflow-hidden ${
                  isSelected
                    ? 'bg-emerald-50/40 border-emerald-600 shadow-gourmet-sm ring-2 ring-emerald-600/20'
                    : 'bg-white border-gourmet-border hover:border-emerald-600/40 hover:shadow-gourmet-sm'
                }`}
              >
                {/* Imagen */}
                <div className="relative aspect-[16/11] sm:aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-stone-100 mb-2 sm:mb-3">
                  <img
                    src={extra.image}
                    alt={extra.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div
                    className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-sm transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/90 text-stone-500 border border-stone-200'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </div>
                </div>

                {/* Contenido */}
                <div>
                  <h5 className="font-serif font-bold text-xs sm:text-base text-gourmet-dark leading-tight line-clamp-1 sm:line-clamp-none">
                    {extra.name}
                  </h5>
                  <p className="text-[10px] sm:text-xs text-gourmet-muted mt-0.5 sm:mt-1 leading-snug line-clamp-1 sm:line-clamp-2">
                    {extra.description}
                  </p>
                </div>

                {/* Precio */}
                <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-gourmet-border/60 flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-700 font-sans">
                    +{formatCurrency(extra.price)}
                  </span>
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold ${
                      isSelected ? 'text-emerald-700' : 'text-stone-400'
                    }`}
                  >
                    {isSelected ? 'Agregado' : 'Sumar'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
