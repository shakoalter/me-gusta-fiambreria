import React, { useState, useMemo } from 'react';
import { Save, Sparkles, Megaphone, RefreshCw } from 'lucide-react';
import { usePricing } from '../../context/PricingContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FIAMBRES_DATA } from '../../data/fiambres';
import { QUESOS_DATA } from '../../data/quesos';
import { BEBIDAS_DATA } from '../../data/bebidas';
import { FiambreId, QuesoId, BebidaId } from '../../types/product';
import { DailyOfferState } from '../../types/admin';

export const DailyOfferAdminTab: React.FC = () => {
  const { dailyOffer, saveDailyOffer, calculateOfferPrice, getSandwichPrice, getBebidaPrice } = usePricing();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [fiambreId, setFiambreId] = useState<FiambreId>(dailyOffer.fiambreId);
  const [quesoId, setQuesoId] = useState<QuesoId>(dailyOffer.quesoId);
  const [defaultBebidaId, setDefaultBebidaId] = useState<BebidaId>(dailyOffer.defaultBebidaId);
  const [discountPercent, setDiscountPercent] = useState<number>(Math.round(dailyOffer.discountPercentage * 100));
  const [badge, setBadge] = useState<string>(dailyOffer.badge || 'OFERTA DEL DÍA');
  const [title, setTitle] = useState<string>(dailyOffer.title);
  const [description, setDescription] = useState<string>(dailyOffer.description);
  const [image, setImage] = useState<string>(dailyOffer.image || '/images/hero-sandwich.jpg');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const selectedFiambre = useMemo(() => FIAMBRES_DATA.find((f) => f.id === fiambreId), [fiambreId]);
  const selectedQueso = useMemo(() => QUESOS_DATA.find((q) => q.id === quesoId), [quesoId]);
  const selectedBebida = useMemo(() => BEBIDAS_DATA.find((b) => b.id === defaultBebidaId), [defaultBebidaId]);

  // Cálculo en tiempo real del combo simulado
  const calculation = useMemo(() => {
    return calculateOfferPrice(fiambreId, quesoId, defaultBebidaId, [], discountPercent / 100);
  }, [fiambreId, quesoId, defaultBebidaId, discountPercent, calculateOfferPrice]);

  const handleAutoGenerateTexts = () => {
    if (selectedFiambre && selectedQueso) {
      setTitle(`Sándwich de ${selectedFiambre.name} + ${selectedQueso.name} + Bebida`);
      setDescription(`Disfrutá del exquisito ${selectedFiambre.name} con ${selectedQueso.name}. ¡Incluye una bebida a elección!`);
      showToast('Títulos generados automáticamente', 'info');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedOffer: Partial<DailyOfferState> = {
        fiambreId,
        quesoId,
        defaultBebidaId,
        discountPercentage: discountPercent / 100,
        badge,
        title,
        subtitle: title,
        description,
        image,
      };

      await saveDailyOffer(updatedOffer, user?.email || 'admin@megusta.com');
      showToast('¡Oferta del Día actualizada exitosamente!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al guardar la oferta del día', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado de la pestaña */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h4 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#F5A623]" />
            Configurar Oferta del Día
          </h4>
          <p className="text-xs sm:text-sm text-stone-400">
            Elegí los productos existentes del catálogo. Los cambios se reflejarán instantáneamente en la web.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F5A623] hover:bg-[#f8b438] text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>

      {/* Grid de Configuración + Preview en Vivo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Formulario de Selección (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Fila 1: Fiambre y Queso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Fiambre Base
              </label>
              <select
                value={fiambreId}
                onChange={(e) => setFiambreId(e.target.value as FiambreId)}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-[#F5A623] cursor-pointer"
              >
                {FIAMBRES_DATA.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} (Base min: ${f.basePriceMin?.toLocaleString('es-AR')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Queso Base
              </label>
              <select
                value={quesoId}
                onChange={(e) => setQuesoId(e.target.value as QuesoId)}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-[#F5A623] cursor-pointer"
              >
                {QUESOS_DATA.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 2: Bebida por defecto y Descuento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Bebida Sugerida
              </label>
              <select
                value={defaultBebidaId}
                onChange={(e) => setDefaultBebidaId(e.target.value as BebidaId)}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-[#F5A623] cursor-pointer"
              >
                {BEBIDAS_DATA.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (${getBebidaPrice(b.id).toLocaleString('es-AR')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                  Descuento Aplicado
                </label>
                <span className="text-xs font-black text-[#F5A623] bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40">
                  {discountPercent}% OFF
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full accent-[#F5A623] cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Math.max(0, Math.min(50, Number(e.target.value))))}
                  className="w-16 p-2 rounded-lg bg-stone-900 border border-stone-700 text-white text-center text-sm font-bold"
                />
              </div>
            </div>
          </div>

          {/* Fila 3: Badge e Imagen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Etiqueta / Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="OFERTA DEL DÍA"
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-[#F5A623]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Ruta de Imagen
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/hero-sandwich.jpg"
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-[#F5A623]"
              />
            </div>
          </div>

          {/* Fila 4: Título y Descripción */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                Título & Descripción
              </label>
              <button
                type="button"
                onClick={handleAutoGenerateTexts}
                className="text-[11px] font-bold text-[#F5A623] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Autogenerar textos</span>
              </button>
            </div>

            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del combo..."
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-[#F5A623]"
              />
            </div>

            <div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción del combo..."
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-[#F5A623] resize-none"
              />
            </div>
          </div>

        </div>

        {/* Columna Derecha: Vista Previa en Vivo (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
            <Sparkles className="w-4 h-4 text-[#F5A623]" />
            <span>Vista Previa en Tiempo Real</span>
          </div>

          {/* Tarjeta Mockup tal cual en el Hero */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#F5A623] bg-[#120C08] shadow-2xl p-4 text-white">
            <div className="relative aspect-[16/9.5] rounded-2xl overflow-hidden bg-stone-950 mb-4">
              <img
                src={image}
                alt="Preview Oferta"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hero-sandwich.jpg';
                }}
              />
              <div className="absolute top-2 left-2 z-10">
                <span className="px-3 py-1 rounded-lg bg-[#F5A623] text-stone-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                  {badge}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-serif text-lg font-bold text-white line-clamp-2">
                {title || 'Título de la oferta'}
              </h5>
              <p className="text-xs text-stone-400 line-clamp-2">
                {description || 'Descripción breve...'}
              </p>

              {/* Resumen de Precios Calculados */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block line-through">
                    Regular: ${calculation.originalBasePrice.toLocaleString('es-AR')}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-serif font-black text-[#F5A623]">
                      ${calculation.discountedBasePrice.toLocaleString('es-AR')}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                      Ahorro: ${calculation.discountSavings.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-full bg-amber-500/20 text-[#F5A623] text-xs font-bold border border-amber-500/30">
                  {discountPercent}% OFF
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 text-[11px] text-stone-300 space-y-1">
            <span className="font-bold text-stone-200 block">Detalles del combo:</span>
            <p>• Sándwich base ({selectedFiambre?.name} + {selectedQueso?.name}): ${getSandwichPrice(fiambreId, quesoId).toLocaleString('es-AR')}</p>
            <p>• Bebida incluida ({selectedBebida?.name}): ${getBebidaPrice(defaultBebidaId).toLocaleString('es-AR')}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
