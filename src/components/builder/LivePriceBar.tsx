import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Fiambre, Queso, Extra, Aderezo } from '../../types/product';
import { QuantitySelector } from '../common/QuantitySelector';
import { PriceTag } from '../common/PriceTag';
import { Button } from '../common/Button';

interface LivePriceBarProps {
  selectedFiambre: Fiambre | null;
  selectedQueso: Queso | null;
  selectedExtras: Extra[];
  selectedAderezos?: Aderezo[];
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isComplete: boolean;
  isEditing: boolean;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
  onAddToCart: () => void;
  onReset: () => void;
}

export const LivePriceBar: React.FC<LivePriceBarProps> = ({
  selectedFiambre,
  selectedQueso,
  selectedExtras,
  selectedAderezos = [],
  quantity,
  unitPrice,
  subtotal,
  isComplete,
  isEditing,
  onIncrementQuantity,
  onDecrementQuantity,
  onAddToCart,
  onReset,
}) => {
  return (
    <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t-2 border-gourmet-border shadow-gourmet-floating py-4 px-4 sm:px-6 mt-8 rounded-t-3xl transition-all">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Resumen del Sándwich Actual */}
        <div className="w-full lg:w-auto flex-1">
          <AnimatePresence mode="wait">
            {!selectedFiambre ? (
              <motion.div
                key="no-fiambre"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 text-stone-500 text-xs sm:text-sm font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>Paso 1: Seleccioná un fiambre de la lista para comenzar.</span>
              </motion.div>
            ) : !selectedQueso ? (
              <motion.div
                key="no-queso"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 text-stone-700 text-xs sm:text-sm font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>
                  Has elegido <strong className="text-gourmet-primary font-bold">{selectedFiambre.name}</strong>. 
                  Ahora elegí un queso para completar la combinación base.
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-1"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sándwich Listo
                  </span>
                  {isEditing && (
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      Modificando sándwich
                    </span>
                  )}
                  <h4 className="font-serif font-bold text-base sm:text-lg text-gourmet-dark">
                    {selectedFiambre.name} + {selectedQueso.name}
                  </h4>
                </div>

                <div className="text-xs text-gourmet-muted flex flex-wrap items-center gap-1.5">
                  <span>Aderezos:</span>
                  {selectedAderezos.length > 0 ? (
                    <span className="font-semibold text-amber-800">
                      {selectedAderezos.map((a) => a.name).join(', ')}
                    </span>
                  ) : (
                    <span className="italic">Ninguno</span>
                  )}
                  <span className="text-stone-300">•</span>
                  <span>Extras:</span>
                  {selectedExtras.length > 0 ? (
                    <span className="font-semibold text-emerald-800">
                      {selectedExtras.map((e) => e.name).join(', ')}
                    </span>
                  ) : (
                    <span className="italic">Ninguno</span>
                  )}
                  <span className="text-stone-300">•</span>
                  <span>Unitario: <strong className="text-gourmet-dark">{unitPrice > 0 ? `$${unitPrice.toLocaleString('es-AR')}` : ''}</strong></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selector de Cantidad, Total y Botón de Agregar */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 shrink-0">
          {isComplete && (
            <div className="flex items-center justify-between sm:justify-start gap-3 bg-gourmet-surface/80 px-3 py-1.5 rounded-2xl border border-gourmet-border/80">
              <div className="text-left">
                <p className="text-[10px] font-bold text-gourmet-muted uppercase">Cantidad</p>
                <QuantitySelector
                  quantity={quantity}
                  onIncrement={onIncrementQuantity}
                  onDecrement={onDecrementQuantity}
                  size="sm"
                />
              </div>

              <div className="border-l border-gourmet-border pl-3 text-right">
                <p className="text-[10px] font-bold text-gourmet-muted uppercase">Subtotal</p>
                <PriceTag amount={subtotal} size="lg" highlight />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {isComplete && (
              <button
                type="button"
                onClick={onReset}
                className="px-3 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
              >
                Limpiar
              </button>
            )}

            <Button
              variant={isComplete ? 'primary' : 'secondary'}
              size="lg"
              disabled={!isComplete}
              onClick={onAddToCart}
              icon={isComplete ? <ShoppingBag className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto font-bold px-6 py-3.5 shadow-gourmet-md"
            >
              {!isComplete
                ? 'Completar Fiambre + Queso'
                : isEditing
                ? 'Guardar Cambios'
                : 'Agregar al Pedido'}
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
};
