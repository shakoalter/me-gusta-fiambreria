import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { User, FileText } from 'lucide-react';
import { CustomerOrderData } from '../../services/whatsappService';

interface CartSummaryProps {
  customerData: CustomerOrderData;
  onCustomerDataChange: (data: CustomerOrderData) => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  customerData,
  onCustomerDataChange,
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

      {/* Tarjeta: Tu Nombre (Opcional) + Código Asignado */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-sm space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="customerName"
            className="flex items-center gap-1.5 text-xs font-bold text-gourmet-dark cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-gourmet-olive" />
            <span>Tu Nombre (opcional)</span>
          </label>
          {customerData.orderCode && (
            <span
              className="text-[11px] font-mono font-black text-amber-950 bg-amber-200/90 border border-amber-300 px-2 py-0.5 rounded-md shadow-xs"
              title="Número asignado a tu pedido"
            >
              {customerData.orderCode}
            </span>
          )}
        </div>

        <input
          id="customerName"
          type="text"
          placeholder="Ej: Juan Pérez / Sofía"
          value={customerData.customerName || ''}
          onChange={(e) =>
            onCustomerDataChange({ ...customerData, customerName: e.target.value })
          }
          className="w-full px-3 py-2 text-xs rounded-lg bg-[#FAF7F2] border border-stone-200 focus:bg-white focus:border-gourmet-primary focus:ring-2 focus:ring-gourmet-primary/20 outline-none transition-all placeholder:text-stone-400 text-gourmet-dark font-medium"
        />
      </div>
    </div>
  );
};
