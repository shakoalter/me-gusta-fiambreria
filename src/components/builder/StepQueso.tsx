import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { QUESOS_DATA } from '../../data/quesos';
import { Fiambre, Queso } from '../../types/product';
import { getBaseSandwichPrice } from '../../services/priceCalculator';
import { formatCurrency } from '../../utils/formatters';

interface StepQuesoProps {
  selectedFiambre: Fiambre | null;
  selectedQueso: Queso | null;
  onSelect: (queso: Queso) => void;
  onGoToFiambreStep: () => void;
  onNextStep?: () => void;
}

const renderBadge = (badgeText?: string) => {
  if (!badgeText) return null;
  const lower = badgeText.toLowerCase();
  let icon = '⭐';
  if (lower.includes('clásico') || lower.includes('tradicional')) icon = '✨';
  else if (lower.includes('especialidad') || lower.includes('gourmet')) icon = '⭐';
  else if (lower.includes('único')) icon = '🔥';

  return (
    <span className="bg-[#FFF9EE]/95 text-[#8C5D23] border border-[#ECD8B8] font-bold text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-xs inline-flex items-center gap-1 backdrop-blur-xs">
      <span>{icon}</span>
      <span>{badgeText}</span>
    </span>
  );
};

export const StepQueso: React.FC<StepQuesoProps> = ({
  selectedFiambre,
  selectedQueso,
  onSelect,
  onGoToFiambreStep,
  onNextStep,
}) => {
  return (
    <div className="space-y-6">
      {/* Encabezado del Paso */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="bg-[#781D22] text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs">
              Paso 2 de 3 • Obligatorio
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Elegí tu Queso
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
            {selectedFiambre ? (
              <span>
                Combinando con tu <strong className="text-[#781D22] font-bold">{selectedFiambre.name}</strong>
              </span>
            ) : (
              'Seleccioná el tipo de queso para completar la base de tu sándwich.'
            )}
          </p>
        </div>

        {selectedFiambre && (
          <div className="bg-[#FFF9EE] border border-[#ECD8B8] px-3.5 py-1.5 rounded-full flex items-center gap-2 self-start sm:self-auto text-xs font-medium text-[#8C5D23] shadow-xs">
            <span>Fiambre: <strong className="text-stone-900">{selectedFiambre.name}</strong></span>
            <button
              type="button"
              onClick={onGoToFiambreStep}
              className="text-[#781D22] font-bold underline hover:text-[#60161a] ml-1 cursor-pointer"
            >
              Cambiar
            </button>
          </div>
        )}
      </div>

      {!selectedFiambre && (
        <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Aún no has seleccionado un fiambre</p>
            <p className="text-amber-800 text-xs mt-0.5">
              Te sugerimos{' '}
              <button
                type="button"
                onClick={onGoToFiambreStep}
                className="underline font-bold text-[#781D22] hover:text-red-800 cursor-pointer"
              >
                elegir primero tu fiambre
              </button>{' '}
              para ver el precio final exacto de cada combinación.
            </p>
          </div>
        </div>
      )}

      {/* Grid de Quesos (4 Columnas en Desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {QUESOS_DATA.map((queso) => {
          const isSelected = selectedQueso?.id === queso.id;

          // Calculamos el precio combinado si ya tenemos fiambre
          const price = selectedFiambre
            ? getBaseSandwichPrice(selectedFiambre.id, queso.id)
            : null;

          return (
            <motion.div
              key={queso.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(queso)}
              className={`group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all border select-none overflow-hidden ${
                isSelected
                  ? 'bg-white border-2 border-[#781D22] shadow-md ring-2 sm:ring-4 ring-red-900/10'
                  : 'bg-white border-stone-200/90 hover:border-amber-700/50 hover:shadow-md'
              }`}
            >
              {/* Imagen y Badges */}
              <div>
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-100 mb-3">
                  <img
                    src={queso.image}
                    alt={queso.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {queso.badge && (
                    <div className="absolute top-2 left-2">
                      {renderBadge(queso.badge)}
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#781D22] text-white flex items-center justify-center shadow-md animate-in fade-in zoom-in duration-200">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                    {queso.flavorProfile}
                  </span>
                  <h4 className="font-serif font-bold text-base text-stone-900 leading-tight">
                    {queso.name}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {queso.description}
                  </p>
                </div>
              </div>

              {/* Precio Combinado y Botón Elegir */}
              <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-stone-400 block leading-tight">
                    {price !== null ? 'Precio total' : 'Base'}
                  </span>
                  <span className="font-serif font-bold text-base text-stone-900 leading-tight">
                    {price !== null ? formatCurrency(price) : '—'}
                  </span>
                </div>

                <div
                  className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                    isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#781D22] text-white group-hover:bg-[#60161a]'
                  }`}
                >
                  <span>{isSelected ? 'Elegido' : 'Elegir'}</span>
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <ArrowRight className="w-3 h-3" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Barra Inferior del Paso */}
      <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
          <button
            type="button"
            onClick={onGoToFiambreStep}
            className="inline-flex items-center gap-1 text-[#781D22] hover:text-[#60161a] font-bold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a fiambres</span>
          </button>
          <span className="text-stone-300">•</span>
          <span>
            {selectedQueso
              ? `Base lista: ${selectedFiambre?.name} + ${selectedQueso.name}.`
              : 'Paso 2: Elegí un queso para completar la base del sándwich.'}
          </span>
        </div>

        {selectedQueso && onNextStep && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNextStep}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#781D22] hover:bg-[#60161a] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            <span>Sumar Aderezos & Extras →</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};
