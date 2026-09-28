import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X, Check } from 'lucide-react';

interface GlobalIncreaseModalProps {
  isOpen: boolean;
  amount: number;
  targetScope: 'sandwiches' | 'extras' | 'bebidas' | 'all';
  affectedCount: number;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const GlobalIncreaseModal: React.FC<GlobalIncreaseModalProps> = ({
  isOpen,
  amount,
  targetScope,
  affectedCount,
  onClose,
  onConfirm,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const scopeLabels = {
    sandwiches: 'Solo Sándwiches (Matriz Fiambre × Queso)',
    extras: 'Solo Extras',
    bebidas: 'Solo Bebidas',
    all: 'Todo el Catálogo (Sándwiches + Extras + Bebidas)',
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#18120C] border-2 border-red-500/60 rounded-3xl p-6 sm:p-8 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {/* Glow de advertencia */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ícono de Advertencia */}
        <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 mx-auto mb-4 shadow-lg">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Título */}
        <div className="text-center space-y-2 mb-6">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            ¿Confirmar Aumento Global?
          </h3>
          <p className="text-xs sm:text-sm text-stone-300">
            Esta acción modificará los precios en la base de datos de manera atómica y se reflejará de inmediato para los clientes.
          </p>
        </div>

        {/* Resumen del Aumento */}
        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3 mb-6 text-xs sm:text-sm">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <span className="text-stone-400">Monto del Aumento:</span>
            <span className="font-black text-xl text-[#F5A623]">
              +${amount.toLocaleString('es-AR')}
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <span className="text-stone-400">Alcance:</span>
            <span className="font-bold text-stone-200 text-right">{scopeLabels[targetScope]}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Items Afectados:</span>
            <span className="font-bold text-emerald-400">{affectedCount} precios</span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-red-700 to-[#781D22] hover:from-red-600 hover:to-red-800 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sí, Aplicar</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
