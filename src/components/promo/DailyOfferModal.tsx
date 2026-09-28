import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, PlusCircle, GlassWater, Sparkles, ChevronDown } from 'lucide-react';
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
import { Bebida, Extra, Aderezo, SandwichCustomization } from '../../types/product';
import { calculateExtrasTotal } from '../../services/priceCalculator';
import { formatCurrency } from '../../utils/formatters';

interface DailyOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyOfferModal: React.FC<DailyOfferModalProps> = ({ isOpen, onClose }) => {
  const { addItem, openCart } = useCart();
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
    }
  }, [isOpen, availableBebidas]);

  if (!isOpen) return null;

  // Objetos seleccionados
  const chosenBebida: Bebida | undefined = availableBebidas.find((b) => b.id === selectedBebidaId);
  const chosenExtra: Extra | undefined = availableExtras.find((e) => e.id === selectedExtraId);
  const chosenAderezo: Aderezo | undefined = availableAderezos.find((a) => a.id === selectedAderezoId);

  // Cálculo del precio final de la oferta (Precio base promo combo + extras adicionales si los hubiere)
  const extrasList: Extra[] = chosenExtra ? [chosenExtra] : [];
  const extrasCost = calculateExtrasTotal(extrasList);
  const totalPrice = DAILY_OFFER_CONFIG.promoBasePrice + extrasCost;

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
    showToast('¡Oferta del Día agregada a tu pedido!', 'success');

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      openCart();
    }, 200);
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
        className="relative w-full max-w-2xl lg:max-w-3xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden z-10 flex flex-col max-h-[92vh]"
      >
        {/* PARTE SUPERIOR / IMAGEN PRINCIPAL */}
        <div className="relative w-full h-52 sm:h-64 md:h-72 bg-stone-900 shrink-0 overflow-hidden">
          <img
            src={DAILY_OFFER_CONFIG.image}
            alt={DAILY_OFFER_CONFIG.title}
            className="w-full h-full object-cover"
            loading="eager"
          />

          {/* Gradiente sutil para contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 pointer-events-none" />

          {/* BADGE "OFERTA DEL DÍA" (Estilo destacado artesanal) */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8E1B22] text-amber-100 text-xs sm:text-sm font-extrabold tracking-wider uppercase shadow-lg border border-red-500/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{DAILY_OFFER_CONFIG.badge}</span>
            </div>
          </div>

          {/* BOTÓN CERRAR "X" */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de oferta"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/75 text-white/90 hover:text-white flex items-center justify-center transition-colors shadow-md cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* CONTENIDO DE LA OFERTA Y SELECTORES */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* Título y Descripción */}
          <div className="space-y-1.5 text-left border-b border-stone-200/70 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3
                id="daily-offer-title"
                className="font-serif text-2xl sm:text-3xl font-extrabold text-gourmet-dark tracking-tight leading-tight"
              >
                {DAILY_OFFER_CONFIG.title}
              </h3>
              <div className="shrink-0 text-left sm:text-right">
                <span className="text-[10px] sm:text-xs font-bold uppercase text-stone-500 block">
                  Precio Promo Combo
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-black text-[#781D22]">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed max-w-xl">
              {DAILY_OFFER_CONFIG.description}
            </p>
          </div>

          {/* SELECTORES EN 3 COLUMNAS (Desktop) / 1 COLUMNA (Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
            
            {/* 1. AGREGAR BEBIDA */}
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                  <GlassWater className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-gourmet-dark leading-tight">
                    Agregar bebida
                  </h4>
                  <p className="text-[10px] text-stone-500 font-medium">Incluida en la promo</p>
                </div>
              </div>

              <div className="relative">
                <select
                  value={selectedBebidaId}
                  onChange={(e) => setSelectedBebidaId(e.target.value)}
                  aria-label="Seleccionar bebida incluida en la oferta"
                  className="w-full appearance-none bg-stone-50/80 hover:bg-stone-100 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 pr-8 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 cursor-pointer transition-colors"
                >
                  {availableBebidas.map((bebida) => (
                    <option key={bebida.id} value={bebida.id}>
                      {bebida.name} ({bebida.volume})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. AGREGAR EXTRA */}
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-gourmet-dark leading-tight">
                    Agregar extra
                  </h4>
                  <p className="text-[10px] text-stone-500 font-medium">Opcional con precio</p>
                </div>
              </div>

              <div className="relative">
                <select
                  value={selectedExtraId}
                  onChange={(e) => setSelectedExtraId(e.target.value)}
                  aria-label="Seleccionar extra opcional"
                  className="w-full appearance-none bg-stone-50/80 hover:bg-stone-100 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 pr-8 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 cursor-pointer transition-colors"
                >
                  <option value="sin-extra">Sin extra</option>
                  {availableExtras.map((extra) => (
                    <option key={extra.id} value={extra.id}>
                      {extra.name} (+{formatCurrency(extra.price)})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. AGREGAR ADEREZO */}
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-gourmet-dark leading-tight">
                    Agregar aderezo
                  </h4>
                  <p className="text-[10px] text-stone-500 font-medium">Sin cargo</p>
                </div>
              </div>

              <div className="relative">
                <select
                  value={selectedAderezoId}
                  onChange={(e) => setSelectedAderezoId(e.target.value)}
                  aria-label="Seleccionar aderezo opcional"
                  className="w-full appearance-none bg-stone-50/80 hover:bg-stone-100 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 pr-8 focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 cursor-pointer transition-colors"
                >
                  <option value="sin-aderezo">Sin aderezo</option>
                  {availableAderezos.map((aderezo) => (
                    <option key={aderezo.id} value={aderezo.id}>
                      {aderezo.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="pt-2 space-y-2.5">
            {/* Botón Principal: Agregar pedido al pedido */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#781D22] hover:bg-[#63171b] text-white font-extrabold text-sm sm:text-base shadow-lg border border-red-700/60 transition-all cursor-pointer disabled:opacity-75"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{isSubmitting ? 'Agregando...' : 'Agregar pedido al pedido'}</span>
            </motion.button>

            {/* Botón Secundario: Cancelar */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-transparent hover:bg-stone-100 text-stone-600 hover:text-stone-900 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
