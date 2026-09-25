import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { User, FileText, AlertCircle } from 'lucide-react';
import { CustomerOrderData } from '../../services/whatsappService';
import { motion, AnimatePresence } from 'framer-motion';

interface CartSummaryProps {
  customerData: CustomerOrderData;
  onCustomerDataChange: (data: CustomerOrderData) => void;
  hasNameError?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  customerData,
  onCustomerDataChange,
  hasNameError = false,
}) => {
  const { totalPrice, totalQuantity } = useCart();

  return (
    <div className="space-y-3.5 pt-1">
      {/* Tarjeta de Aclaraciones */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-sm space-y-1.5">
        <label
          htmlFor="orderNotes"
          className="flex items-center gap-1.5 text-xs font-bold text-gourmet-dark cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-gourmet-olive" />
          <span>Aclaraciones para el local (opcional)</span>
        </label>
        <input
          id="orderNotes"
          type="text"
          placeholder="Ej: Cortado al medio / Retiro a las 13:30 hs"
          value={customerData.notes || ''}
          onChange={(e) =>
            onCustomerDataChange({ ...customerData, notes: e.target.value })
          }
          className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF7F2] border border-stone-200 focus:bg-white focus:border-gourmet-primary focus:ring-2 focus:ring-gourmet-primary/20 outline-none transition-all placeholder:text-stone-400 text-gourmet-dark"
        />
      </div>

      {/* Desglose de Totales */}
      <div className="bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-stone-200/80 shadow-xs space-y-1 text-xs text-gourmet-muted px-3.5">
        <div className="flex justify-between items-center">
          <span>Cantidad de sándwiches:</span>
          <strong className="text-gourmet-dark text-sm">{totalQuantity}</strong>
        </div>
        <div className="flex justify-between items-center text-base font-extrabold text-gourmet-dark pt-1.5 border-t border-stone-200/70">
          <span>Total:</span>
          <span className="text-gourmet-primary text-xl font-sans font-black">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>

      {/* Tarjeta: Tu Nombre (Obligatorio) + Código Asignado + Advertencia */}
      <motion.div
        animate={hasNameError ? { x: [-4, 4, -3, 3, 0] } : {}}
        transition={{ duration: 0.3 }}
        className={`bg-white shadow-sm rounded-xl p-3.5 space-y-2 transition-all border ${
          hasNameError
            ? 'border-red-500 ring-2 ring-red-400/30 bg-red-50/10'
            : 'border-amber-300/90 text-amber-950'
        }`}
      >
        <div className="flex items-center justify-between">
          <label
            htmlFor="customerName"
            className={`flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
              hasNameError ? 'text-red-700' : 'text-amber-950'
            }`}
          >
            <User className={`w-3.5 h-3.5 ${hasNameError ? 'text-red-600' : 'text-amber-700'}`} />
            <span>Tu Nombre</span>
            <span className="text-red-500 font-bold" title="Campo obligatorio">*</span>
          </label>
          <div className="flex items-center gap-1.5">
            {customerData.orderCode && (
              <span className="text-[11px] font-mono font-black text-amber-950 bg-amber-200/90 border border-amber-300 px-2 py-0.5 rounded-md shadow-xs" title="Número asignado a tu pedido">
                {customerData.orderCode}
              </span>
            )}
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
              hasNameError
                ? 'bg-red-600 text-white animate-pulse'
                : 'text-red-800 bg-red-100 border border-red-200'
            }`}>
              Obligatorio
            </span>
          </div>
        </div>

        <input
          id="customerName"
          type="text"
          required
          placeholder="Ej: Juan Pérez / Sofía"
          value={customerData.customerName || ''}
          onChange={(e) =>
            onCustomerDataChange({ ...customerData, customerName: e.target.value })
          }
          className={`w-full px-3 py-2 text-xs rounded-lg outline-none transition-all placeholder:text-stone-400 font-medium text-gourmet-dark ${
            hasNameError
              ? 'bg-white border-2 border-red-500 focus:ring-2 focus:ring-red-400/20'
              : 'bg-amber-50/50 border border-amber-300/80 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20'
          }`}
        />

        {/* Advertencia visual activa si falta el nombre */}
        <AnimatePresence>
          {hasNameError ? (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1.5 p-2 rounded-lg bg-red-100/90 border border-red-300 text-red-800 text-[11px] font-bold"
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>¡Falta tu nombre! Es obligatorio para retirar tu pedido.</span>
            </motion.div>
          ) : !customerData.customerName?.trim() ? (
            <p className="text-[11px] text-amber-900/80 font-medium pt-0.5">
              Requerido para retirar tu pedido en el local.
            </p>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
