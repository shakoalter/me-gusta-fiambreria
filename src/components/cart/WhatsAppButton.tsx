import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import {
  generateWhatsAppUrl,
  claimNextGlobalOrderCode,
  CustomerOrderData,
} from '../../services/whatsappService';
import { formatCurrency } from '../../utils/formatters';

interface WhatsAppButtonProps {
  customerData?: CustomerOrderData;
  onOrderSent?: () => void;
  onValidationError?: () => void;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  customerData,
  onOrderSent,
  onValidationError,
  className = '',
}) => {
  const { items, totalPrice, clearCart, closeCart, startNewSandwich } = useCart();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isNameMissing = !customerData?.customerName?.trim();
  const isDisabled = items.length === 0 || isSubmitting;

  const handleSendOrder = async () => {
    if (items.length === 0 || isSubmitting) return;

    if (isNameMissing) {
      if (onValidationError) {
        onValidationError();
      }
      showToast('⚠️ Ingresá tu nombre para poder enviar el pedido.', 'error');
      const inputEl = document.getElementById('customerName');
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Obtener y reservar de forma atómica en Firestore el número global oficial
      const officialOrderCode = await claimNextGlobalOrderCode();

      const finalCustomerData: CustomerOrderData = {
        ...customerData,
        orderCode: officialOrderCode,
      };

      // 2. Generar el mensaje y abrir WhatsApp
      const url = generateWhatsAppUrl(items, finalCustomerData);
      window.open(url, '_blank', 'noopener,noreferrer');

      // 3. Limpiar carrito y resetear estado
      clearCart();
      closeCart();
      startNewSandwich();

      if (onOrderSent) {
        onOrderSent();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(`¡Pedido ${officialOrderCode} enviado con éxito! Te esperamos en el local.`, 'success');
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      showToast('Hubo un inconveniente al generar el pedido. Intentá nuevamente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      onClick={handleSendOrder}
      disabled={isDisabled}
      className={`w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-gourmet-whatsapp hover:bg-gourmet-whatsappHover text-white font-extrabold shadow-gourmet-md transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <MessageCircle className="w-5 h-5 fill-white text-gourmet-whatsapp" />
          )}
        </div>
        <div className="text-left">
          <span className="block text-xs uppercase tracking-wider text-green-100 font-bold">
            {isSubmitting
              ? 'Conectando con el local...'
              : isNameMissing
              ? 'Paso final: Ingresá tu nombre'
              : `Listo para enviar (${customerData?.orderCode || 'MG'})`}
          </span>
          <span className="text-sm sm:text-base font-bold">
            {isSubmitting ? 'Asignando número de pedido...' : 'Enviar Pedido por WhatsApp'}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className="text-xs opacity-90 block font-normal">Total</span>
        <span className="text-base sm:text-lg font-extrabold tracking-tight">
          {formatCurrency(totalPrice)}
        </span>
      </div>
    </motion.button>
  );
};
