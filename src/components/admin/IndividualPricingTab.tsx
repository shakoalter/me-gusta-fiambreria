import React, { useState } from 'react';
import { Save, Search, RotateCcw, ChevronDown, ChevronUp, DollarSign, CheckCircle2, XCircle } from 'lucide-react';
import { usePricing } from '../../context/PricingContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FIAMBRES_DATA } from '../../data/fiambres';
import { QUESOS_DATA } from '../../data/quesos';
import { EXTRAS_DATA } from '../../data/extras';
import { BEBIDAS_DATA } from '../../data/bebidas';
import { ADEREZOS_DATA } from '../../data/aderezos';
import { SANDWICH_PRICING_MATRIX, EXTRAS_PRICING, BEBIDAS_PRICING } from '../../data/pricingMatrix';
import { FiambreId, QuesoId, ExtraId, BebidaId } from '../../types/product';
import { PricingState } from '../../types/admin';

type ProductTab = 'sandwiches' | 'quesos' | 'extras' | 'bebidas' | 'aderezos';

export const IndividualPricingTab: React.FC = () => {
  const { pricing, savePricing } = usePricing();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<ProductTab>('sandwiches');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editablePricing, setEditablePricing] = useState<PricingState>(() => ({
    ...JSON.parse(JSON.stringify(pricing)),
    outOfStock: pricing.outOfStock ? [...pricing.outOfStock] : [],
  }));
  const [expandedFiambre, setExpandedFiambre] = useState<string | null>(FIAMBRES_DATA[0]?.id || null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Helper para verificar stock
  const isOutOfStock = (id: string): boolean => {
    return Boolean(editablePricing.outOfStock && editablePricing.outOfStock.includes(id));
  };

  // Alternar stock
  const handleToggleStock = (id: string, name: string) => {
    setEditablePricing((prev) => {
      const currentList = prev.outOfStock ? [...prev.outOfStock] : [];
      const isCurrentlyOut = currentList.includes(id);
      const nextList = isCurrentlyOut
        ? currentList.filter((item) => item !== id)
        : [...currentList, id];

      showToast(
        isCurrentlyOut
          ? `🟢 "${name}" marcado como EN STOCK (guardá para aplicar)`
          : `🔴 "${name}" marcado como SIN STOCK (guardá para aplicar)`,
        isCurrentlyOut ? 'success' : 'info'
      );

      return {
        ...prev,
        outOfStock: nextList,
      };
    });
  };

  // Modificar precio en matriz sándwiches
  const handleMatrixPriceChange = (fiambreId: FiambreId, quesoId: QuesoId, value: number) => {
    setEditablePricing((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next.matrix[fiambreId]) {
        next.matrix[fiambreId] = {};
      }
      next.matrix[fiambreId][quesoId] = Math.max(0, value);
      return next;
    });
  };

  // Modificar precio en extras
  const handleExtraPriceChange = (extraId: ExtraId, value: number) => {
    setEditablePricing((prev) => ({
      ...prev,
      extras: {
        ...prev.extras,
        [extraId]: Math.max(0, value),
      },
    }));
  };

  // Modificar precio en bebidas
  const handleBebidaPriceChange = (bebidaId: BebidaId, value: number) => {
    setEditablePricing((prev) => ({
      ...prev,
      bebidas: {
        ...prev.bebidas,
        [bebidaId]: Math.max(0, value),
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await savePricing(
        editablePricing,
        user?.email || 'admin@megusta.com',
        `Modificación de precios y disponibilidad de stock (${activeSubTab})`
      );
      showToast('¡Cambios guardados y sincronizados exitosamente!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al guardar cambios', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('¿Estás seguro de restablecer todos los precios a los valores de fábrica? (El stock no se modificará)')) {
      setEditablePricing((prev) => ({
        ...prev,
        matrix: JSON.parse(JSON.stringify(SANDWICH_PRICING_MATRIX)),
        extras: { ...EXTRAS_PRICING },
        bebidas: { ...BEBIDAS_PRICING },
      }));
      showToast('Valores de precios restablecidos. Recordá hacer clic en "Guardar Cambios".', 'info');
    }
  };

  const filteredFiambres = FIAMBRES_DATA.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuesos = QUESOS_DATA.filter((q) =>
    q.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExtras = EXTRAS_DATA.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBebidas = BEBIDAS_DATA.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAderezos = ADEREZOS_DATA.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalOutOfStockCount = editablePricing.outOfStock?.length || 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado y Acciones Globales */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#F5A623]" />
              Edición de Precios y Control de Stock
            </h4>
            {totalOutOfStockCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-950/80 text-red-400 border border-red-500/40">
                {totalOutOfStockCount} sin stock
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-stone-400">
            Ajustá precios y activá o desactivá la disponibilidad de cualquier producto del catálogo en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="p-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-xs font-bold transition-all cursor-pointer"
            title="Restablecer a valores de fábrica"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

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
      </div>

      {/* Selector de Sub-pestañas y Buscador */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Sub-tabs */}
        <div className="flex items-center p-1 bg-stone-900 rounded-xl border border-stone-800 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSubTab('sandwiches')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'sandwiches'
                ? 'bg-[#781D22] text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Fiambres ({FIAMBRES_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('quesos')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'quesos'
                ? 'bg-[#781D22] text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Quesos ({QUESOS_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('extras')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'extras'
                ? 'bg-[#781D22] text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Extras ({EXTRAS_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('bebidas')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'bebidas'
                ? 'bg-[#781D22] text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Bebidas ({BEBIDAS_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('aderezos')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'aderezos'
                ? 'bg-[#781D22] text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Aderezos ({ADEREZOS_DATA.length})
          </button>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white text-xs focus:outline-none focus:border-[#F5A623]"
          />
        </div>
      </div>

      {/* Sub-pestaña 1: SÁNDWICHES / FIAMBRES */}
      {activeSubTab === 'sandwiches' && (
        <div className="space-y-3">
          {filteredFiambres.map((fiambre) => {
            const isExpanded = expandedFiambre === fiambre.id;
            const fiambrePrices = editablePricing.matrix[fiambre.id] || {};
            const outOfStock = isOutOfStock(fiambre.id);

            return (
              <div
                key={fiambre.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  outOfStock
                    ? 'border-red-900/60 bg-red-950/20'
                    : 'border-stone-800 bg-stone-900/80'
                }`}
              >
                {/* Cabecera del Fiambre */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-900/40">
                  <button
                    type="button"
                    onClick={() => setExpandedFiambre(isExpanded ? null : fiambre.id)}
                    className="flex-1 flex items-center gap-3 text-left cursor-pointer"
                  >
                    <img
                      src={fiambre.image}
                      alt={fiambre.name}
                      className={`w-11 h-11 rounded-xl object-cover border transition-all ${
                        outOfStock ? 'grayscale opacity-60 border-red-800' : 'border-stone-700'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className={`font-bold text-sm ${outOfStock ? 'text-red-300 line-through' : 'text-white'}`}>
                          {fiambre.name}
                        </h5>
                        {outOfStock && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                            Sin Stock
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {fiambre.category} · 8 combinaciones de queso
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    {/* Botón Switch Stock */}
                    <button
                      type="button"
                      onClick={() => handleToggleStock(fiambre.id, fiambre.name)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        outOfStock
                          ? 'bg-red-900/80 text-red-200 border-red-700 hover:bg-red-800'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-600 hover:bg-emerald-900'
                      }`}
                      title="Alternar disponibilidad de stock"
                    >
                      {outOfStock ? (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                          <span>Sin Stock</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>En Stock</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedFiambre(isExpanded ? null : fiambre.id)}
                      className="flex items-center gap-2 text-xs font-bold text-[#F5A623] cursor-pointer"
                    >
                      <span>Base: ${(fiambrePrices['queso-clasico'] || fiambre.basePriceMin || 0).toLocaleString('es-AR')}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-stone-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Grilla de Precios por Queso */}
                {isExpanded && (
                  <div className="p-4 bg-[#120C08] border-t border-stone-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fadeIn">
                    {QUESOS_DATA.map((queso) => {
                      const currentPrice = fiambrePrices[queso.id] ?? 0;
                      return (
                        <div
                          key={queso.id}
                          className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-2"
                        >
                          <div className="truncate">
                            <span className="block text-xs font-bold text-stone-200 truncate">
                              {queso.name}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              +{fiambre.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-xs font-bold text-stone-400">$</span>
                            <input
                              type="number"
                              step="50"
                              min="0"
                              value={currentPrice}
                              onChange={(e) =>
                                handleMatrixPriceChange(fiambre.id, queso.id, Number(e.target.value))
                              }
                              className="w-20 p-1.5 rounded-lg bg-stone-950 border border-stone-700 text-right text-xs font-bold text-[#F5A623] focus:outline-none focus:border-[#F5A623]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-pestaña 2: QUESOS */}
      {activeSubTab === 'quesos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuesos.map((queso) => {
            const outOfStock = isOutOfStock(queso.id);
            return (
              <div
                key={queso.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  outOfStock
                    ? 'border-red-900/60 bg-red-950/20'
                    : 'border-stone-800 bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={queso.image}
                    alt={queso.name}
                    className={`w-11 h-11 rounded-xl object-cover border transition-all ${
                      outOfStock ? 'grayscale opacity-60 border-red-800' : 'border-stone-700'
                    }`}
                  />
                  <div>
                    <h5 className={`font-bold text-sm ${outOfStock ? 'text-red-300 line-through' : 'text-white'}`}>
                      {queso.name}
                    </h5>
                    <span className="text-[10px] text-stone-400 block">{queso.flavorProfile}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStock(queso.id, queso.name)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                    outOfStock
                      ? 'bg-red-900/80 text-red-200 border-red-700 hover:bg-red-800'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-600 hover:bg-emerald-900'
                  }`}
                  title="Alternar disponibilidad de stock"
                >
                  {outOfStock ? (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>Sin Stock</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>En Stock</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-pestaña 3: EXTRAS */}
      {activeSubTab === 'extras' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExtras.map((extra) => {
            const currentPrice = editablePricing.extras[extra.id] ?? extra.price;
            const outOfStock = isOutOfStock(extra.id);

            return (
              <div
                key={extra.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  outOfStock
                    ? 'border-red-900/60 bg-red-950/20'
                    : 'border-stone-800 bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={extra.image}
                      alt={extra.name}
                      className={`w-10 h-10 rounded-xl object-cover border transition-all ${
                        outOfStock ? 'grayscale opacity-60 border-red-800' : 'border-stone-700'
                      }`}
                    />
                    <div>
                      <h5 className={`font-bold text-sm ${outOfStock ? 'text-red-300 line-through' : 'text-white'}`}>
                        {extra.name}
                      </h5>
                      <span className="text-[10px] text-stone-400">Por porción</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStock(extra.id, extra.name)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shrink-0 ${
                      outOfStock
                        ? 'bg-red-900/80 text-red-200 border-red-700 hover:bg-red-800'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-600 hover:bg-emerald-900'
                    }`}
                  >
                    {outOfStock ? <XCircle className="w-3 h-3 text-red-400" /> : <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    <span>{outOfStock ? 'Sin Stock' : 'En Stock'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800/80">
                  <span className="text-xs text-stone-400">Precio individual:</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-bold text-stone-400">$</span>
                    <input
                      type="number"
                      step="50"
                      min="0"
                      value={currentPrice}
                      onChange={(e) => handleExtraPriceChange(extra.id, Number(e.target.value))}
                      className="w-24 p-1.5 rounded-lg bg-stone-950 border border-stone-700 text-right text-xs font-bold text-[#F5A623] focus:outline-none focus:border-[#F5A623]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-pestaña 4: BEBIDAS */}
      {activeSubTab === 'bebidas' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBebidas.map((bebida) => {
            const currentPrice = editablePricing.bebidas[bebida.id] ?? bebida.price;
            const outOfStock = isOutOfStock(bebida.id);

            return (
              <div
                key={bebida.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  outOfStock
                    ? 'border-red-900/60 bg-red-950/20'
                    : 'border-stone-800 bg-stone-900'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate">
                    <h5 className={`font-bold text-sm truncate ${outOfStock ? 'text-red-300 line-through' : 'text-white'}`}>
                      {bebida.name}
                    </h5>
                    <span className="text-[10px] text-stone-400 block">{bebida.category} · {bebida.volume}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleStock(bebida.id, bebida.name)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shrink-0 ${
                      outOfStock
                        ? 'bg-red-900/80 text-red-200 border-red-700 hover:bg-red-800'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-600 hover:bg-emerald-900'
                    }`}
                  >
                    {outOfStock ? <XCircle className="w-3 h-3 text-red-400" /> : <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    <span>{outOfStock ? 'Sin Stock' : 'En Stock'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800/80">
                  <span className="text-xs text-stone-400">Precio individual:</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-bold text-stone-400">$</span>
                    <input
                      type="number"
                      step="50"
                      min="0"
                      value={currentPrice}
                      onChange={(e) => handleBebidaPriceChange(bebida.id, Number(e.target.value))}
                      className="w-24 p-1.5 rounded-lg bg-stone-950 border border-stone-700 text-right text-xs font-bold text-[#F5A623] focus:outline-none focus:border-[#F5A623]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-pestaña 5: ADEREZOS */}
      {activeSubTab === 'aderezos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAderezos.map((aderezo) => {
            const outOfStock = isOutOfStock(aderezo.id);
            return (
              <div
                key={aderezo.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  outOfStock
                    ? 'border-red-900/60 bg-red-950/20'
                    : 'border-stone-800 bg-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={aderezo.image}
                    alt={aderezo.name}
                    className={`w-10 h-10 rounded-xl object-contain bg-amber-50/10 p-1 border transition-all ${
                      outOfStock ? 'grayscale opacity-60 border-red-800' : 'border-stone-700'
                    }`}
                  />
                  <div>
                    <h5 className={`font-bold text-sm ${outOfStock ? 'text-red-300 line-through' : 'text-white'}`}>
                      {aderezo.name}
                    </h5>
                    <span className="text-[10px] text-stone-400 block">Sin cargo</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStock(aderezo.id, aderezo.name)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                    outOfStock
                      ? 'bg-red-900/80 text-red-200 border-red-700 hover:bg-red-800'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-600 hover:bg-emerald-900'
                  }`}
                  title="Alternar disponibilidad de stock"
                >
                  {outOfStock ? (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>Sin Stock</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>En Stock</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
