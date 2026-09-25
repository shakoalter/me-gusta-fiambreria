import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { QUESOS_DATA } from '../../data/quesos';
import { Fiambre, Queso } from '../../types/product';
import { getBaseSandwichPrice } from '../../services/priceCalculator';
import { Badge } from '../common/Badge';
import { PriceTag } from '../common/PriceTag';

interface StepQuesoProps {
  selectedFiambre: Fiambre | null;
  selectedQueso: Queso | null;
  onSelect: (queso: Queso) => void;
  onGoToFiambreStep: () => void;
  onNextStep?: () => void;
}

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
            <span className="bg-[#781D22] text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
              Paso 2 de 3 • Obligatorio
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-gourmet-dark tracking-tight">
            Elegí tu Queso
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
            {selectedFiambre ? (
              <span>
                Combinando con tu <strong className="text-[#781D22]">{selectedFiambre.name}</strong>
              </span>
            ) : (
              'Seleccioná el tipo de queso para completar la base de tu sándwich.'
            )}
          </p>
        </div>

        {selectedFiambre && (
          <div className="bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-full flex items-center gap-2 self-start sm:self-auto text-xs font-medium text-amber-900 shadow-xs">
            <span>Fiambre: <strong>{selectedFiambre.name}</strong></span>
            <button
              onClick={onGoToFiambreStep}
              className="text-[#781D22] font-bold underline hover:text-red-800 ml-1 cursor-pointer"
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

      {/* Grid de Quesos */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
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
              className={`relative flex flex-col justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all border-2 select-none overflow-hidden ${
                isSelected
                  ? 'bg-white border-[#781D22] shadow-md ring-2 sm:ring-4 ring-red-900/10'
                  : 'bg-white border-stone-200 hover:border-amber-700/50 hover:shadow-xs'
              }`}
            >
              {/* Imagen y Badges */}
              <div className="relative aspect-[16/11] sm:aspect-[16/10] rounded-lg sm:rounded-xl overflow-hidden bg-stone-100 mb-2 sm:mb-3">
                <img
                  src={queso.image}
                  alt={queso.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {queso.badge && (
                  <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 scale-75 sm:scale-100 origin-top-left">
                    <Badge variant="olive" size="sm">
                      <Sparkles className="w-3 h-3 mr-1 inline" />
                      {queso.badge}
                    </Badge>
                  </div>
                )}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#781D22] text-white flex items-center justify-center shadow-md animate-in fade-in zoom-in duration-200">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-0.5 sm:mb-1">
                  <span className="text-[9px] sm:text-[10px] font-bold text-gourmet-olive uppercase tracking-wider">
                    {queso.flavorProfile}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-xs sm:text-base text-gourmet-dark leading-tight line-clamp-1 sm:line-clamp-none">
                  {queso.name}
                </h4>
                <p className="text-[10px] sm:text-xs text-gourmet-muted line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 leading-snug">
                  {queso.description}
                </p>
              </div>

              {/* Precio Combinado */}
              <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2.5 border-t border-stone-100 flex items-center justify-between">
                {price !== null ? (
                  <PriceTag amount={price} size="sm" highlight={isSelected} />
                ) : (
                  <span className="text-[10px] sm:text-xs text-gourmet-muted italic">Elegir</span>
                )}
                <span
                  className={`text-[10px] sm:text-xs font-bold ${
                    isSelected ? 'text-[#781D22]' : 'text-stone-400'
                  }`}
                >
                  {isSelected ? 'Elegido' : 'Elegir'}
                </span>
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
            className="text-stone-500 hover:text-stone-800 underline font-medium cursor-pointer"
          >
            ← Volver a fiambres
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#781D22] hover:bg-[#63171b] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            <span>Sumar Aderezos & Extras</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
