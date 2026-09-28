import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { CartItem } from '../../types/product';
import { QuantitySelector } from '../common/QuantitySelector';
import { PriceTag } from '../common/PriceTag';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { showToast } = useToast();

  const handleRemove = () => {
    removeItem(item.id);
    showToast(`Sándwich eliminado del pedido`, 'info');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-md space-y-3"
    >
      {/* Título y Acciones */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <h4 className="font-serif font-bold text-base text-gourmet-dark leading-snug">
              {item.fiambre.name} + {item.queso.name}
            </h4>
            {item.notes && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                {item.notes}
              </span>
            )}
          </div>
          <p className="text-xs text-gourmet-muted">
            Precio unitario: <strong className="text-gourmet-dark font-medium">${item.unitPrice.toLocaleString('es-AR')}</strong>
          </p>
        </div>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Eliminar sándwich"
            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Eliminar sándwich"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Aderezos y Extras agregados */}
      <div className="bg-[#FAF7F2] border border-stone-200/60 rounded-xl p-2.5 text-xs text-stone-700 space-y-1">
        <div>
          <span className="font-semibold text-gourmet-muted mr-1.5">Aderezos:</span>
          {item.aderezos && item.aderezos.length > 0 ? (
            <span className="font-medium text-amber-900">
              {item.aderezos.map((a) => a.name).join(', ')}
            </span>
          ) : (
            <span className="text-stone-400 italic">Sin aderezos</span>
          )}
        </div>
        <div>
          <span className="font-semibold text-gourmet-muted mr-1.5">Extras:</span>
          {item.extras.length > 0 ? (
            <span className="font-medium text-emerald-800">
              {item.extras.map((e) => e.name).join(', ')}
            </span>
          ) : (
            <span className="text-stone-400 italic">Sin extras</span>
          )}
        </div>
        {item.bebidas && item.bebidas.length > 0 && (
          <div>
            <span className="font-semibold text-gourmet-muted mr-1.5">Bebidas:</span>
            <span className="font-medium text-blue-800">
              {item.bebidas.map((b) => `${b.name} (${b.volume})`).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Controles de Cantidad y Subtotal */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
        <QuantitySelector
          quantity={item.quantity}
          onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
          onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
          size="sm"
        />

        <div className="text-right">
          <span className="text-[10px] text-gourmet-muted font-bold uppercase block">Subtotal</span>
          <PriceTag amount={item.subtotal} size="md" highlight />
        </div>
      </div>
    </motion.div>
  );
};
