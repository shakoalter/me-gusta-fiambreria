import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import {
  generateWhatsAppUrl,
  claimNextGlobalOrderCode,
  openWhatsAppUrl,
  CustomerOrderData,
} from '../../services/whatsappService';
import { formatCurrency } from '../../utils/formatters';

interface WhatsAppButtonProps {
  customerData?: CustomerOrderData;
  onOrderSent?: () => void;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  customerData,
  onOrderSent,
  className = '',
}) => {
  const { items, totalPrice, clearCart, closeCart, startNewSandwich } = useCart();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [assignedOrderCode, setAssignedOrderCode] = useState<string | null>(null);
  const [preparedUrl, setPreparedUrl] = useState<string | null>(null);
  const [isPrepared, setIsPrepared] = useState<boolean>(false);

  // Si los ítems o el total cambian, reiniciamos el estado preparado para que el mensaje se actualice
  useEffect(() => {
    setIsPrepared(false);
    setPreparedUrl(null);
  }, [items.length, totalPrice]);

  const isDisabled = items.length === 0 || isSubmitting;

  const handleSendOrder = async () => {
    if (items.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1. Obtener y reservar de forma atómica en Firestore el número global oficial
      // Si ya se asignó un código en este intento para este carrito, lo reutilizamos para no generar duplicados
      const officialOrderCode = assignedOrderCode || (await claimNextGlobalOrderCode());
      setAssignedOrderCode(officialOrderCode);

      const finalCustomerData: CustomerOrderData = {
        ...customerData,
        orderCode: officialOrderCode,
      };

      // 2. Generar el mensaje y URL
      const url = generateWhatsAppUrl(items, finalCustomerData);
      setPreparedUrl(url);

      // 3. Intentar apertura inmediata
      const result = openWhatsAppUrl(url);

      // 4. Marcamos como preparado SIN borrar el carrito para que permanezca recuperable
      setIsPrepared(true);

      if (onOrderSent) {
        onOrderSent();
      }

      if (result.success) {
        showToast(`Tu pedido ${officialOrderCode} fue preparado para WhatsApp.`, 'info');
      } else {
        showToast('No se pudo abrir WhatsApp automáticamente. Podés usar el botón de reintento.', 'info');
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      showToast('Hubo un inconveniente al generar el pedido. Podés reintentar.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualOpen = (e: React.MouseEvent) => {
    if (preparedUrl) {
      e.stopPropagation();
      openWhatsAppUrl(preparedUrl);
      showToast('Abriendo WhatsApp...', 'info');
    }
  };

  // Solo cuando el usuario confirma explícitamente que envió su mensaje o quiere iniciar un nuevo pedido,
  // se limpia el estado del carrito
  const handleFinishAndClear = () => {
    clearCart();
    closeCart();
    startNewSandwich();
    setIsPrepared(false);
    setAssignedOrderCode(null);
    setPreparedUrl(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('¡Muchas gracias! Tu pedido ya quedó registrado para preparar en el local.', 'success');
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Vista alternativa de reintento si ya se generó el pedido */}
      {isPrepared && preparedUrl ? (
        <div className="space-y-2.5 animate-in fade-in duration-200">
          {/* Tarjeta Informativa de Estado Seguro */}
          <div className="bg-emerald-950/90 text-emerald-100 p-3.5 rounded-2xl border border-emerald-500/40 shadow-sm text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pedido preparado ({assignedOrderCode})</span>
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-relaxed">
              El mensaje con tu sándwich ya está listo. Si WhatsApp no se abrió automáticamente, tocá el botón verde abajo para abrirlo y enviarlo.
            </p>
          </div>

          {/* Botón 1: Reintento Directo / Abrir WhatsApp */}
          <a
            href={preparedUrl}
            onClick={handleManualOpen}
            target="_top"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-gourmet-whatsapp hover:bg-gourmet-whatsappHover text-white font-extrabold shadow-gourmet-md transition-all select-none cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 fill-white text-gourmet-whatsapp" />
              </div>
              <div className="text-left">
                <span className="block text-[11px] uppercase tracking-wider text-green-100 font-bold">
                  ¿No se abrió WhatsApp?
                </span>
                <span className="text-sm sm:text-base font-bold">
                  Tocá acá para abrir WhatsApp
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs opacity-90 block font-normal">Pedido</span>
              <span className="text-sm sm:text-base font-extrabold tracking-tight">
                {assignedOrderCode}
              </span>
            </div>
          </a>

          {/* Botón 2: Confirmación manual de mensaje enviado (Finalizar y vaciar pedido) */}
          <button
            type="button"
            onClick={handleFinishAndClear}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 hover:text-stone-900 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Ya envié mi mensaje en WhatsApp (Finalizar y armar otro)</span>
          </button>
        </div>
      ) : (
        <motion.button
          type="button"
          whileHover={isDisabled ? undefined : { scale: 1.02 }}
          whileTap={isDisabled ? undefined : { scale: 0.98 }}
          onClick={handleSendOrder}
          disabled={isDisabled}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-gourmet-whatsapp hover:bg-gourmet-whatsappHover text-white font-extrabold shadow-gourmet-md transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer"
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
      )}
    </div>
  );
};

