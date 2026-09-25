import React, { useEffect } from 'react';
import { Plus, ShoppingBag, Check, Sparkles, X } from 'lucide-react';
import { SandwichCustomization } from '../../types/product';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';

interface SandwichAddedModalProps {
  isOpen: boolean;
  onClose: () => void;
  sandwich: SandwichCustomization | null;
  onBuildAnother: () => void;
  onFinishOrder: () => void;
}

export const SandwichAddedModal: React.FC<SandwichAddedModalProps> = ({
  isOpen,
  onClose,
  sandwich,
  onBuildAnother,
  onFinishOrder,
}) => {
  const { totalQuantity, totalPrice } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !sandwich) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-added-title"
        aria-describedby="modal-added-desc"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gourmet-border overflow-hidden z-10 p-6 sm:p-7 text-center animate-in zoom-in-95 duration-200"
      >
        {/* Botón de cierre en esquina */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ícono de éxito gastronómico */}
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-700 mb-4 shadow-inner">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>¡Agregado con éxito!</span>
        </div>

        <h3 id="modal-added-title" className="font-serif text-2xl font-bold text-gourmet-dark mb-1">
          ¿Qué te gustaría hacer?
        </h3>
        <p id="modal-added-desc" className="text-xs text-gourmet-muted mb-5">
          Tu sándwich ya fue añadido al carrito de tu pedido.
        </p>

        {/* Resumen del Sándwich recién agregado */}
        <div className="bg-gourmet-surface/80 rounded-2xl p-4 border border-gourmet-border/80 text-left mb-5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-serif font-bold text-base text-gourmet-dark leading-tight">
              {sandwich.quantity}x {sandwich.fiambre.name} + {sandwich.queso.name}
            </h4>
            <span className="text-sm font-extrabold text-gourmet-primary shrink-0">
              {formatCurrency(sandwich.subtotal)}
            </span>
          </div>

          {/* Aderezos y extras */}
          <div className="text-xs text-stone-600 space-y-0.5 pt-1 border-t border-gourmet-border/60">
            <p>
              <span className="font-semibold text-gourmet-muted">Aderezos:</span>{' '}
              {sandwich.aderezos && sandwich.aderezos.length > 0 ? (
                <span className="font-medium text-amber-900">
                  {sandwich.aderezos.map((a) => a.name).join(', ')}
                </span>
              ) : (
                <span className="text-stone-400 italic">Sin aderezos</span>
              )}
            </p>
            <p>
              <span className="font-semibold text-gourmet-muted">Extras:</span>{' '}
              {sandwich.extras.length > 0 ? (
                <span className="font-medium text-emerald-800">
                  {sandwich.extras.map((e) => e.name).join(', ')}
                </span>
              ) : (
                <span className="text-stone-400 italic">Sin extras</span>
              )}
            </p>
          </div>

          {/* Total acumulado en carrito */}
          <div className="pt-2 border-t border-gourmet-border/60 flex items-center justify-between text-xs font-bold text-gourmet-dark">
            <span className="text-gourmet-muted">Total del pedido ({totalQuantity} sándwich{totalQuantity !== 1 ? 'es' : ''}):</span>
            <span className="text-gourmet-dark font-extrabold">{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="space-y-3">
          {/* Botón 1: Finalizar compra / Enviar pedido */}
          <button
            type="button"
            onClick={onFinishOrder}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gourmet-whatsapp hover:bg-gourmet-whatsappHover text-white font-extrabold text-sm sm:text-base shadow-gourmet-md transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Finalizar Compra / Ver Pedido</span>
          </button>

          {/* Botón 2: Armar otro sándwich */}
          <button
            type="button"
            onClick={onBuildAnother}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border-2 border-gourmet-border text-gourmet-dark hover:border-amber-700/50 font-bold text-sm sm:text-base shadow-xs transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-5 h-5 text-gourmet-primary" />
            <span>Armar otro sándwich</span>
          </button>
        </div>
      </div>
    </div>
  );
};
