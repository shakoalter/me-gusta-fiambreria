import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, Plus, GlassWater, Sparkles, ChevronDown, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import {
  DAILY_OFFER_CONFIG,
  getDailyOfferFiambre,
  getDailyOfferQueso,
  getDailyOfferBebidas,
  getDailyOfferExtras,
  getDailyOfferAderezos,
} from '../../data/dailyOffer';
import { Bebida, Extra, Aderezo, SandwichCustomization, BebidaId } from '../../types/product';
import { calculateDailyOfferPrice } from '../../services/priceCalculator';
import { formatCurrency } from '../../utils/formatters';

interface DailyOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyOfferModal: React.FC<DailyOfferModalProps> = ({ isOpen, onClose }) => {
  const { addItem, openCart, startNewSandwich } = useCart();
  const { showToast } = useToast();

  const fiambre = useMemo(() => getDailyOfferFiambre(), []);
  const queso = useMemo(() => getDailyOfferQueso(), []);
  const availableBebidas = useMemo(() => getDailyOfferBebidas(), []);
  const availableExtras = useMemo(() => getDailyOfferExtras(), []);
  const availableAderezos = useMemo(() => getDailyOfferAderezos(), []);

  // Estados de selección dentro de la oferta
  const [selectedBebidaId, setSelectedBebidaId] = useState<string>(
    DAILY_OFFER_CONFIG.defaultBebidaId || (availableBebidas[0]?.id ?? '')
  );
  const [selectedExtraId, setSelectedExtraId] = useState<string>('sin-extra');
  const [selectedAderezoId, setSelectedAderezoId] = useState<string>('sin-aderezo');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [addedItem, setAddedItem] = useState<SandwichCustomization | null>(null);

  // Cerrar con tecla Escape y bloquear scroll del body
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

  // Si se abre de nuevo, reseteamos a los valores por defecto
  useEffect(() => {
    if (isOpen) {
      setSelectedBebidaId(DAILY_OFFER_CONFIG.defaultBebidaId || (availableBebidas[0]?.id ?? ''));
      setSelectedExtraId('sin-extra');
      setSelectedAderezoId('sin-aderezo');
      setIsSubmitting(false);
      setIsSuccess(false);
      setAddedItem(null);
    }
  }, [isOpen, availableBebidas]);

  if (!isOpen) return null;

  // Objetos seleccionados
  const chosenBebida: Bebida | undefined = availableBebidas.find((b) => b.id === selectedBebidaId);
  const chosenExtra: Extra | undefined = availableExtras.find((e) => e.id === selectedExtraId);
  const chosenAderezo: Aderezo | undefined = availableAderezos.find((a) => a.id === selectedAderezoId);

  // Cálculo de la oferta: (Sándwich + Bebida) con 10% OFF + redondeo hacia arriba ceil($100) + Extras sin descuento
  const extrasList: Extra[] = chosenExtra ? [chosenExtra] : [];
  const offerCalculation = calculateDailyOfferPrice(
    DAILY_OFFER_CONFIG.fiambreId,
    DAILY_OFFER_CONFIG.quesoId,
    chosenBebida?.id as BebidaId | undefined,
    extrasList,
    DAILY_OFFER_CONFIG.discountPercentage
  );

  const totalPrice = offerCalculation.unitPrice;
  const originalTotalPrice = offerCalculation.originalBasePrice + offerCalculation.extrasTotal;

  const handleAddToCart = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const bebidasList: Bebida[] = chosenBebida ? [chosenBebida] : [];
    const aderezosList: Aderezo[] = chosenAderezo ? [chosenAderezo] : [];

    const sandwichItem: SandwichCustomization = {
      id: `offer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fiambre,
      queso,
      extras: extrasList,
      aderezos: aderezosList,
      bebidas: bebidasList,
      quantity: 1,
      unitPrice: totalPrice,
      subtotal: totalPrice,
      notes: 'Promo del Día',
    };

    addItem(sandwichItem);
    setAddedItem(sandwichItem);
    setIsSubmitting(false);
    setIsSuccess(true);
    showToast('¡Oferta del Día agregada a tu pedido!', 'success');
  };

  const handleGoToBuilder = () => {
    onClose();
    startNewSandwich();
    setTimeout(() => {
      const el = document.getElementById('builder-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleViewCart = () => {
    onClose();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/75 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-offer-title"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl lg:max-w-3xl bg-[#FAF5EE] rounded-[2rem] shadow-2xl border border-stone-300/80 overflow-hidden z-10 flex flex-col max-h-[92vh]"
      >
        {/* PARTE SUPERIOR / IMAGEN PRINCIPAL */}
        <div className="relative w-full h-48 sm:h-60 md:h-64 bg-stone-900 shrink-0 overflow-hidden">
          <img
            src={DAILY_OFFER_CONFIG.image}
            alt={DAILY_OFFER_CONFIG.title}
            className="w-full h-full object-cover"
            loading="eager"
          />

          {/* Gradiente sutil para contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/35 pointer-events-none" />

          {/* BADGE "🌾 OFERTA DEL DÍA" (Pastilla bordó con borde dorado) */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#781D22] text-amber-100 text-xs sm:text-sm font-extrabold tracking-wider uppercase shadow-lg border border-amber-400/50">
              <span className="text-amber-300 text-sm leading-none">🌾</span>
              <span>{DAILY_OFFER_CONFIG.badge}</span>
            </div>
          </div>

          {/* BOTÓN CERRAR "X" */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de oferta"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors shadow-md cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* CONTENIDO INTERACTIVO O PANTALLA DE ÉXITO */}
        {isSuccess && addedItem ? (
          <div className="p-6 sm:p-8 text-center space-y-5 my-auto overflow-y-auto">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#781D22] text-amber-100 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>¡Oferta agregada al pedido!</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                ¿Qué te gustaría hacer ahora?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md mx-auto">
                Tu combo promocional ya está en tu pedido. Podés finalizar tu compra o sumar más sándwiches artesanales al pedido.
              </p>
            </div>

            {/* Resumen del Combo Recién Agregado */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/90 text-left max-w-lg mx-auto shadow-xs space-y-2">
              <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-2">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    {DAILY_OFFER_CONFIG.title}
                  </h4>
                  <p className="text-xs text-stone-500">
                    {fiambre.name} + {queso.name}
                  </p>
                </div>
                <span className="font-serif text-lg font-black text-[#781D22]">
                  {formatCurrency(addedItem.subtotal)}
                </span>
              </div>

              <div className="text-xs text-stone-600 space-y-1">
                {chosenBebida && (
                  <p className="flex items-center gap-1.5 text-blue-800 font-medium">
                    <span>🥤</span>
                    <span>Bebida: {chosenBebida.name} ({chosenBebida.volume})</span>
                  </p>
                )}
                {chosenExtra && (
                  <p className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <span>🥗</span>
                    <span>Extra: {chosenExtra.name} (+{formatCurrency(chosenExtra.price)})</span>
                  </p>
                )}
                {chosenAderezo && (
                  <p className="flex items-center gap-1.5 text-amber-900 font-medium">
                    <span>🥫</span>
                    <span>Aderezo: {chosenAderezo.name} (Sin cargo)</span>
                  </p>
                )}
              </div>
            </div>

            {/* Botones de acción tras agregar la oferta */}
            <div className="space-y-3 max-w-lg mx-auto pt-2">
              {/* Botón 1: Finalizar compra / Ver pedido */}
              <button
                type="button"
                onClick={handleViewCart}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base shadow-md transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Ver mi Pedido / Finalizar Compra</span>
              </button>

              {/* Botón 2: Armar otro sándwich */}
              <button
                type="button"
                onClick={handleGoToBuilder}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 border-2 border-[#781D22] text-[#781D22] font-bold text-sm sm:text-base shadow-xs transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <Plus className="w-5 h-5" />
                <span>+ Armar otro sándwich a medida</span>
              </button>

              {/* Opción secundaria: Agregar otra oferta */}
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 underline transition-colors pt-1 cursor-pointer block mx-auto"
              >
                + Personalizar y sumar otra Oferta del Día
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-7 overflow-y-auto space-y-5 sm:space-y-6">
            {/* Título, Descripción y Desglose de Precio */}
            <div className="border-b border-[#E8DFC8]/90 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Lado Izquierdo: Título y descripción */}
                <div className="space-y-1 text-left">
                  <h3
                    id="daily-offer-title"
                    className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-tight"
                  >
                    {DAILY_OFFER_CONFIG.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed max-w-xl">
                    {DAILY_OFFER_CONFIG.description}
                  </p>
                </div>

                {/* Lado Derecho: Bloque de Precio */}
                <div className="shrink-0 text-left sm:text-right self-start">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-700 block mb-0.5">
                    PROMO COMBO
                  </span>
                  <div className="flex items-baseline gap-2.5 justify-start sm:justify-end">
                    {originalTotalPrice > totalPrice && (
                      <span className="text-base sm:text-lg font-bold text-stone-400 line-through tracking-tight">
                        {formatCurrency(originalTotalPrice)}
                      </span>
                    )}
                    <span className="font-serif text-3xl sm:text-4xl font-black text-[#781D22] tracking-tight">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SELECTORES EN 3 CAJAS CAOBA ARTESANALES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              
              {/* 1. AGREGAR BEBIDA */}
              <div className="bg-gradient-to-b from-[#4A1519] via-[#2A100B] to-[#1C0B08] rounded-2xl p-3 sm:p-3.5 border-[1.5px] border-amber-500/70 shadow-lg flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={chosenBebida?.image || '/images/bebidas/coca-cola-600.jpg'}
                    alt={chosenBebida?.name || 'Bebida'}
                    className="w-12 h-12 object-contain rounded-lg shrink-0 bg-black/30 p-0.5 border border-amber-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#52191D] border border-amber-400/60 text-amber-300 flex items-center justify-center shrink-0">
                        <GlassWater className="w-3 h-3" />
                      </div>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-white leading-tight truncate">
                        Agregar bebida
                      </h4>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-amber-200/80 font-medium mt-0.5">
                      Incluida en la promo
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedBebidaId}
                    onChange={(e) => setSelectedBebidaId(e.target.value)}
                    aria-label="Seleccionar bebida incluida en la oferta"
                    className="w-full appearance-none bg-[#140607] hover:bg-[#1f090b] border border-amber-500/60 rounded-xl px-3 py-2 text-xs font-semibold text-amber-100 pr-8 focus:outline-hidden focus:ring-1 focus:ring-amber-400 cursor-pointer transition-colors"
                  >
                    {availableBebidas.map((bebida) => (
                      <option key={bebida.id} value={bebida.id} className="bg-stone-900 text-white">
                        {bebida.name} ({bebida.volume})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-amber-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 2. AGREGAR EXTRA */}
              <div className="bg-gradient-to-b from-[#4A1519] via-[#2A100B] to-[#1C0B08] rounded-2xl p-3 sm:p-3.5 border-[1.5px] border-amber-500/70 shadow-lg flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={chosenExtra?.image || '/images/bodegon-charcuterie.jpg'}
                    alt={chosenExtra?.name || 'Extra'}
                    className="w-12 h-12 object-cover rounded-lg shrink-0 bg-black/30 p-0.5 border border-amber-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#52191D] border border-amber-400/60 text-amber-300 flex items-center justify-center shrink-0">
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-white leading-tight truncate">
                        Agregar extra
                      </h4>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-amber-200/80 font-medium mt-0.5">
                      Opcional con precio
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedExtraId}
                    onChange={(e) => setSelectedExtraId(e.target.value)}
                    aria-label="Seleccionar extra opcional"
                    className="w-full appearance-none bg-[#140607] hover:bg-[#1f090b] border border-amber-500/60 rounded-xl px-3 py-2 text-xs font-semibold text-amber-100 pr-8 focus:outline-hidden focus:ring-1 focus:ring-amber-400 cursor-pointer transition-colors"
                  >
                    <option value="sin-extra" className="bg-stone-900 text-white">Sin extra</option>
                    {availableExtras.map((extra) => (
                      <option key={extra.id} value={extra.id} className="bg-stone-900 text-white">
                        {extra.name} (+{formatCurrency(extra.price)})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-amber-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 3. AGREGAR ADEREZO */}
              <div className="bg-gradient-to-b from-[#4A1519] via-[#2A100B] to-[#1C0B08] rounded-2xl p-3 sm:p-3.5 border-[1.5px] border-amber-500/70 shadow-lg flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={chosenAderezo?.image || '/images/aderezos/mayonesa.png'}
                    alt={chosenAderezo?.name || 'Aderezo'}
                    className="w-12 h-12 object-contain rounded-lg shrink-0 bg-black/30 p-0.5 border border-amber-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#52191D] border border-amber-400/60 text-amber-300 flex items-center justify-center shrink-0">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-white leading-tight truncate">
                        Agregar aderezo
                      </h4>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-amber-200/80 font-medium mt-0.5">
                      Sin cargo
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedAderezoId}
                    onChange={(e) => setSelectedAderezoId(e.target.value)}
                    aria-label="Seleccionar aderezo opcional"
                    className="w-full appearance-none bg-[#140607] hover:bg-[#1f090b] border border-amber-500/60 rounded-xl px-3 py-2 text-xs font-semibold text-amber-100 pr-8 focus:outline-hidden focus:ring-1 focus:ring-amber-400 cursor-pointer transition-colors"
                  >
                    <option value="sin-aderezo" className="bg-stone-900 text-white">Sin aderezo</option>
                    {availableAderezos.map((aderezo) => (
                      <option key={aderezo.id} value={aderezo.id} className="bg-stone-900 text-white">
                        {aderezo.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-amber-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* BOTÓN DE ACCIÓN CON FILIGRANA DORADA */}
            <div className="pt-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 sm:gap-4 px-6 py-4 rounded-full bg-gradient-to-r from-[#5B1317] via-[#781D22] to-[#5B1317] hover:via-[#8A2228] text-white font-serif font-bold text-sm sm:text-base md:text-lg shadow-[0_10px_25px_rgba(120,29,34,0.4)] border border-amber-500/60 transition-all cursor-pointer disabled:opacity-75 select-none"
              >
                <span className="hidden sm:block w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400/80 to-amber-300" />
                <ShoppingBag className="w-5 h-5 text-white shrink-0" />
                <span>{isSubmitting ? 'Agregando...' : 'Agregar al Pedido'}</span>
                <span className="hidden sm:block w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent via-amber-400/80 to-amber-300" />
              </motion.button>
            </div>

          </div>
        )}
      </motion.div>
    </div>
  );
};
