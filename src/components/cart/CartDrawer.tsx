import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItemCard } from './CartItemCard';
import { CartSummary } from './CartSummary';
import { WhatsAppButton } from './WhatsAppButton';
import { CustomerOrderData, generateOrderCode } from '../../services/whatsappService';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, clearCart, startNewSandwich, totalQuantity } = useCart();
  const [customerData, setCustomerData] = useState<CustomerOrderData>(() => ({
    customerName: '',
    notes: '',
    orderCode: generateOrderCode(),
  }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
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
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const handleClearCart = () => {
    clearCart();
    setCustomerData({
      customerName: '',
      notes: '',
      orderCode: generateOrderCode(),
    });
    startNewSandwich();
  };

  const handleStartBuilding = () => {
    startNewSandwich();
    closeCart();
    const el = document.getElementById('builder-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderSent = () => {
    setCustomerData({
      customerName: '',
      notes: '',
      orderCode: generateOrderCode(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop con cierre al hacer click */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Panel Lateral del Carrito */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#ECE4D8] h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-stone-300 animate-in slide-in-from-right duration-200"
      >
        {/* Header del Carrito */}
        <div className="px-6 py-4 bg-white border-b border-stone-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gourmet-primaryLight flex items-center justify-center text-gourmet-primary font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 id="cart-drawer-title" className="font-serif font-bold text-lg text-gourmet-dark">
                Tu Pedido
              </h3>
              <span className="text-xs text-gourmet-muted">
                {totalQuantity} sándwich{totalQuantity !== 1 ? 'es' : ''} en total
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 transition-colors"
                title="Vaciar carrito"
                aria-label="Vaciar carrito"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Cerrar panel de pedido"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lista de Sándwiches o Estado Vacío */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl">
                🥪
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-gourmet-dark">
                  Tu pedido está vacío
                </h4>
                <p className="text-xs text-gourmet-muted max-w-xs mt-1 leading-relaxed">
                  Elegí tu fiambre, queso y extras en el armador para sumar sándwiches a tu pedido.
                </p>
              </div>
              <button
                type="button"
                onClick={handleStartBuilding}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gourmet-primary text-white text-xs font-bold shadow-sm hover:bg-gourmet-primaryHover transition-colors cursor-pointer"
              >
                <span>Comenzar a armar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            items.map((item) => <CartItemCard key={item.id} item={item} />)
          )}
        </div>

        {/* Footer con Resumen y CTA WhatsApp */}
        {items.length > 0 && (
          <div className="bg-[#E4DACD] p-4 sm:p-6 border-t border-stone-300 shadow-lg space-y-3.5">
            <CartSummary
              customerData={customerData}
              onCustomerDataChange={setCustomerData}
            />
            <WhatsAppButton
              customerData={customerData}
              onOrderSent={handleOrderSent}
            />
          </div>
        )}
      </div>
    </div>
  );
};
