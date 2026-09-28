import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Ban, ArrowDown, GlassWater } from 'lucide-react';
import { EXTRAS_DATA } from '../../data/extras';
import { ADEREZOS_DATA } from '../../data/aderezos';
import { BEBIDAS_DATA } from '../../data/bebidas';
import { Extra, Aderezo, Bebida } from '../../types/product';
import { formatCurrency } from '../../utils/formatters';
import { usePricing } from '../../context/PricingContext';

interface StepExtrasProps {
  selectedExtras: Extra[];
  onToggleExtra: (extra: Extra) => void;
  isExtraSelected: (id: string) => boolean;
  onClearExtras?: () => void;
  selectedAderezos: Aderezo[];
  onToggleAderezo: (aderezo: Aderezo) => void;
  isAderezoSelected: (id: string) => boolean;
  onClearAderezos?: () => void;
  selectedBebidas?: Bebida[];
  onToggleBebida?: (bebida: Bebida) => void;
  isBebidaSelected?: (id: string) => boolean;
  onClearBebidas?: () => void;
}

const renderBadge = (badgeText?: string) => {
  if (!badgeText) return null;
  return (
    <span className="bg-[#FFF9EE]/95 text-[#8C5D23] border border-[#ECD8B8] font-bold text-[9px] sm:text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-xs inline-flex items-center gap-1 backdrop-blur-xs">
      <span>⭐</span>
      <span>{badgeText}</span>
    </span>
  );
};

export const StepExtras: React.FC<StepExtrasProps> = ({
  selectedExtras,
  onToggleExtra,
  isExtraSelected,
  onClearExtras,
  selectedAderezos,
  onToggleAderezo,
  isAderezoSelected,
  onClearAderezos,
  selectedBebidas = [],
  onToggleBebida,
  isBebidaSelected = () => false,
  onClearBebidas,
}) => {
  const { pricing } = usePricing();
  const extrasSectionRef = useRef<HTMLDivElement>(null);
  const bebidasSectionRef = useRef<HTMLDivElement>(null);

  const scrollToExtras = () => {
    setTimeout(() => {
      extrasSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const scrollToBebidas = () => {
    setTimeout(() => {
      bebidasSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const handleToggleExtra = (extra: Extra) => {
    onToggleExtra(extra);
  };

  const handleClearExtras = () => {
    onClearExtras?.();
    scrollToBebidas();
  };

  const handleToggleBebida = (bebida: Bebida) => {
    onToggleBebida?.(bebida);
  };

  const handleClearBebidas = () => {
    onClearBebidas?.();
  };

  const isNoAderezoSelected = selectedAderezos.length === 0;
  const isNoExtraSelected = selectedExtras.length === 0;
  const isNoBebidaSelected = selectedBebidas.length === 0;

  return (
    <div className="space-y-8">
      {/* Encabezado del Paso 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="bg-emerald-700 text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
              Paso 3 de 3 • Opcional
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Personalizá tu Sándwich
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
            Elegí tus salsas favoritas sin cargo, sumale extras gourmet y agregá tu bebida.
          </p>
        </div>

        {/* Resumen de selecciones */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {selectedAderezos.length > 0 ? (
            <div className="bg-[#FFF9EE] border border-[#ECD8B8] px-3 py-1 rounded-full text-xs font-bold text-[#8C5D23] shadow-xs">
              {selectedAderezos.length} aderezo{selectedAderezos.length > 1 ? 's' : ''}
            </div>
          ) : (
            <div className="bg-stone-100 border border-stone-200 px-3 py-1 rounded-full text-xs font-medium text-stone-600">
              Sin aderezos
            </div>
          )}
          {selectedExtras.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-xs">
              {selectedExtras.length} extra{selectedExtras.length > 1 ? 's' : ''}
            </div>
          )}
          {selectedBebidas.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold text-blue-800 shadow-xs">
              {selectedBebidas.length} bebida{selectedBebidas.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 1: ADEREZOS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h4 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>🥫</span>
                <span>Aderezos</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Elegí tus salsas favoritas para acompañar tu sándwich o continuá sin aderezo.
              </p>
            </div>

            {/* BOTÓN "SIN ADEREZO" */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleClearAderezos}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer border ${
                isNoAderezoSelected
                  ? 'bg-amber-100/90 text-amber-900 border-amber-300'
                  : 'bg-[#781D22] text-white border-[#781D22] hover:bg-[#60161a]'
              }`}
              title="Continuar sin aderezos hacia los extras"
            >
              <Ban className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>SIN ADEREZO</span>
              <ArrowDown className="w-3.5 h-3.5 ml-0.5 stroke-[2.5]" />
            </motion.button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-100/90 border border-emerald-200 px-2.5 py-1 rounded-full">
              Sin Cargo
            </span>
            {selectedAderezos.length > 0 && (
              <button
                type="button"
                onClick={scrollToExtras}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#781D22] hover:text-[#60161a] hover:underline cursor-pointer"
              >
                <span>Ir a Extras</span>
                <ArrowDown className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {ADEREZOS_DATA.map((aderezo) => {
            const isSelected = isAderezoSelected(aderezo.id);

            return (
              <motion.div
                key={aderezo.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggleAderezo(aderezo)}
                className={`group relative flex flex-col justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all border select-none overflow-hidden ${
                  isSelected
                    ? 'bg-white border-2 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-white border-stone-200/90 hover:border-amber-600/40 hover:shadow-md'
                }`}
              >
                {/* Imagen del aderezo con Badge y Check */}
                <div>
                  <div className="relative h-16 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden bg-amber-50/40 border border-amber-200/50 p-1 flex items-center justify-center mb-2 sm:mb-2.5">
                    <img
                      src={aderezo.image}
                      alt={aderezo.name}
                      className="max-h-12 sm:max-h-20 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {aderezo.badge && (
                      <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 scale-[0.75] sm:scale-100 origin-top-left">
                        {renderBadge(aderezo.badge)}
                      </div>
                    )}
                    <div
                      className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-xs transition-all ${
                        isSelected
                          ? 'bg-amber-600 text-white'
                          : 'bg-white text-stone-400 border border-stone-200'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" /> : <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <h5 className="font-serif font-bold text-xs sm:text-base text-stone-900 leading-tight line-clamp-1 sm:line-clamp-none">
                      {aderezo.name}
                    </h5>
                    <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5 leading-snug line-clamp-2">
                      {aderezo.description}
                    </p>
                  </div>
                </div>

                {/* Pie */}
                <div className="mt-2.5 sm:mt-3 pt-1.5 sm:pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
                  <span className="text-[9px] sm:text-xs font-bold text-emerald-700 uppercase">
                    Sin Cargo
                  </span>
                  <div
                    className={`inline-flex items-center gap-0.5 sm:gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all shadow-xs shrink-0 ${
                      isSelected
                        ? 'bg-amber-600 text-white'
                        : 'bg-[#781D22] text-white group-hover:bg-[#60161a]'
                    }`}
                  >
                    <span>{isSelected ? 'Agregado' : 'Sumar'}</span>
                    {isSelected ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" /> : <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  </div>
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
        className="space-y-4 pt-6 border-t border-stone-200/70 scroll-mt-24 sm:scroll-mt-28"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h4 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>🥗</span>
                <span>Extras Gourmet</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Ingredientes frescos y seleccionados por unidad.
              </p>
            </div>

            {/* BOTÓN "SIN EXTRA" */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleClearExtras}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer border ${
                isNoExtraSelected
                  ? 'bg-amber-100/90 text-amber-900 border-amber-300'
                  : 'bg-[#781D22] text-white border-[#781D22] hover:bg-[#60161a]'
              }`}
              title="Continuar sin extras hacia las bebidas"
            >
              <Ban className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>SIN EXTRA</span>
              <ArrowDown className="w-3.5 h-3.5 ml-0.5 stroke-[2.5]" />
            </motion.button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500">Opcional con precio individual</span>
            {selectedExtras.length > 0 && (
              <button
                type="button"
                onClick={scrollToBebidas}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
              >
                <span>Ir a Bebidas</span>
                <ArrowDown className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4">
          {EXTRAS_DATA.map((extra) => {
            const isSelected = isExtraSelected(extra.id);
            const dynamicPrice = pricing.extras[extra.id] ?? extra.price;

            return (
              <motion.div
                key={extra.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggleExtra(extra)}
                className={`group relative flex flex-col justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all border select-none overflow-hidden ${
                  isSelected
                    ? 'bg-white border-2 border-emerald-600 shadow-md ring-2 ring-emerald-600/20'
                    : 'bg-white border-stone-200/90 hover:border-emerald-600/40 hover:shadow-md'
                }`}
              >
                {/* Imagen */}
                <div>
                  <div className="relative aspect-[16/11] sm:aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-stone-100 mb-2 sm:mb-3">
                    <img
                      src={extra.image}
                      alt={extra.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div
                      className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-xs transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-stone-500 border border-stone-200'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" /> : <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div>
                    <h5 className="font-serif font-bold text-xs sm:text-base text-stone-900 leading-tight line-clamp-1 sm:line-clamp-none">
                      {extra.name}
                    </h5>
                    <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5 leading-snug line-clamp-2">
                      {extra.description}
                    </p>
                  </div>
                </div>

                {/* Precio */}
                <div className="mt-2.5 sm:mt-3 pt-1.5 sm:pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-bold text-emerald-700">
                    +{formatCurrency(dynamicPrice)}
                  </span>
                  <div
                    className={`inline-flex items-center gap-0.5 sm:gap-1 px-2.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all shadow-xs shrink-0 ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#781D22] text-white group-hover:bg-[#60161a]'
                    }`}
                  >
                    <span>{isSelected ? 'Agregado' : 'Sumar'}</span>
                    {isSelected ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" /> : <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 3: BEBIDAS FRESCAS */}
      <div
        ref={bebidasSectionRef}
        id="bebidas-section"
        className="space-y-4 pt-6 border-t border-stone-200/70 scroll-mt-24 sm:scroll-mt-28"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h4 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>🥤</span>
                <span>Bebidas Frescas</span>
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Elegí una bebida bien fría para acompañar tu sándwich o continuá sin bebida.
              </p>
            </div>

            {/* BOTÓN "SIN BEBIDA" */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleClearBebidas}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer border ${
                isNoBebidaSelected
                  ? 'bg-blue-100/90 text-blue-900 border-blue-300'
                  : 'bg-[#781D22] text-white border-[#781D22] hover:bg-[#60161a]'
              }`}
              title="Continuar sin bebidas para agregar tu sándwich al pedido"
            >
              <Ban className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>SIN BEBIDA</span>
              <Check className="w-3.5 h-3.5 ml-0.5 stroke-[2.5]" />
            </motion.button>
          </div>

          <span className="text-xs text-stone-500">Opcional con precio individual</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {BEBIDAS_DATA.map((bebida) => {
            const isSelected = isBebidaSelected(bebida.id);
            const dynamicPrice = pricing.bebidas[bebida.id] ?? bebida.price;

            return (
              <motion.div
                key={bebida.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggleBebida(bebida)}
                className={`group relative flex flex-col justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all border select-none overflow-hidden ${
                  isSelected
                    ? 'bg-white border-2 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-stone-200/90 hover:border-blue-600/40 hover:shadow-md'
                }`}
              >
                {/* Visual Bebida */}
                <div>
                  <div className="relative h-18 sm:h-28 rounded-lg sm:rounded-xl overflow-hidden bg-white/90 border border-stone-200/70 p-1 flex items-center justify-center mb-2 sm:mb-2.5">
                    {bebida.image ? (
                      <img
                        src={bebida.image}
                        alt={bebida.name}
                        className="max-h-14 sm:max-h-24 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-stone-100 shadow-xs border border-stone-200/60 flex items-center justify-center text-blue-800">
                        <GlassWater className="w-5 h-5 stroke-[1.8]" />
                      </div>
                    )}

                    {bebida.badge && (
                      <div className="absolute top-1 left-1">
                        <span className="bg-[#781D22] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                          {bebida.badge}
                        </span>
                      </div>
                    )}

                    <div
                      className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-xs transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-stone-400 border border-stone-200'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" /> : <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <h5 className="font-serif font-bold text-xs sm:text-sm text-stone-900 leading-tight line-clamp-1">
                      {bebida.name}
                    </h5>
                    <p className="text-[9px] sm:text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                      {bebida.category} • {bebida.volume}
                    </p>
                  </div>
                </div>

                {/* Precio */}
                <div className="mt-2.5 sm:mt-3 pt-1.5 sm:pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
                  <span className="text-xs sm:text-sm font-bold text-blue-800">
                    +{formatCurrency(dynamicPrice)}
                  </span>
                  <div
                    className={`inline-flex items-center gap-0.5 sm:gap-1 px-2.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all shadow-xs shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#781D22] text-white group-hover:bg-[#60161a]'
                    }`}
                  >
                    <span>{isSelected ? 'Agregada' : 'Sumar'}</span>
                    {isSelected ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" /> : <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
