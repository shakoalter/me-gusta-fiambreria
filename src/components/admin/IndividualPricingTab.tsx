import React, { useState } from 'react';
import { Save, Search, RotateCcw, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import { usePricing } from '../../context/PricingContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FIAMBRES_DATA } from '../../data/fiambres';
import { QUESOS_DATA } from '../../data/quesos';
import { EXTRAS_DATA } from '../../data/extras';
import { BEBIDAS_DATA } from '../../data/bebidas';
import { SANDWICH_PRICING_MATRIX, EXTRAS_PRICING, BEBIDAS_PRICING } from '../../data/pricingMatrix';
import { FiambreId, QuesoId, ExtraId, BebidaId } from '../../types/product';
import { PricingState } from '../../types/admin';

export const IndividualPricingTab: React.FC = () => {
  const { pricing, savePricing } = usePricing();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'sandwiches' | 'extras' | 'bebidas'>('sandwiches');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editablePricing, setEditablePricing] = useState<PricingState>(() => JSON.parse(JSON.stringify(pricing)));
  const [expandedFiambre, setExpandedFiambre] = useState<string | null>(FIAMBRES_DATA[0]?.id || null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

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
        `Modificación manual de precios individuales (${activeSubTab})`
      );
      showToast('¡Precios actualizados exitosamente!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al guardar precios', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('¿Estás seguro de restablecer todos los precios a los valores de fábrica?')) {
      const defaultState: PricingState = {
        matrix: JSON.parse(JSON.stringify(SANDWICH_PRICING_MATRIX)),
        extras: { ...EXTRAS_PRICING },
        bebidas: { ...BEBIDAS_PRICING },
      };
      setEditablePricing(defaultState);
      showToast('Valores restablecidos. Recordá hacer clic en "Guardar Cambios".', 'info');
    }
  };

  const filteredFiambres = FIAMBRES_DATA.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExtras = EXTRAS_DATA.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBebidas = BEBIDAS_DATA.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado y Acciones Globales */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h4 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#F5A623]" />
            Edición de Precios Individuales
          </h4>
          <p className="text-xs sm:text-sm text-stone-400">
            Ajustá los valores de cada combinación de sándwich, extra o bebida en pesos argentinos.
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
        <div className="flex items-center p-1 bg-stone-900 rounded-xl border border-stone-800 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('sandwiches')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'sandwiches'
                ? 'bg-[#781D22] text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Sándwiches ({FIAMBRES_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('extras')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'bebidas'
                ? 'bg-[#781D22] text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Bebidas ({BEBIDAS_DATA.length})
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

      {/* Sub-pestaña 1: SÁNDWICHES */}
      {activeSubTab === 'sandwiches' && (
        <div className="space-y-3">
          {filteredFiambres.map((fiambre) => {
            const isExpanded = expandedFiambre === fiambre.id;
            const fiambrePrices = editablePricing.matrix[fiambre.id] || {};

            return (
              <div
                key={fiambre.id}
                className="rounded-2xl border border-stone-800 bg-stone-900/80 overflow-hidden transition-all"
              >
                {/* Cabecera del Fiambre */}
                <button
                  type="button"
                  onClick={() => setExpandedFiambre(isExpanded ? null : fiambre.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={fiambre.image}
                      alt={fiambre.name}
                      className="w-10 h-10 rounded-xl object-cover border border-stone-700"
                    />
                    <div>
                      <h5 className="font-bold text-white text-sm">{fiambre.name}</h5>
                      <span className="text-[11px] text-stone-400">
                        {fiambre.category} · 8 combinaciones de queso
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#F5A623]">
                      Base desde: ${(fiambrePrices['queso-clasico'] || fiambre.basePriceMin || 0).toLocaleString('es-AR')}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </button>

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

      {/* Sub-pestaña 2: EXTRAS */}
      {activeSubTab === 'extras' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExtras.map((extra) => {
            const currentPrice = editablePricing.extras[extra.id] ?? extra.price;
            return (
              <div
                key={extra.id}
                className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={extra.image}
                    alt={extra.name}
                    className="w-10 h-10 rounded-xl object-cover border border-stone-700"
                  />
                  <div>
                    <h5 className="font-bold text-white text-sm">{extra.name}</h5>
                    <span className="text-[10px] text-stone-400">Por porción</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-bold text-stone-400">$</span>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    value={currentPrice}
                    onChange={(e) => handleExtraPriceChange(extra.id, Number(e.target.value))}
                    className="w-24 p-2 rounded-xl bg-stone-950 border border-stone-700 text-right text-sm font-bold text-[#F5A623] focus:outline-none focus:border-[#F5A623]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-pestaña 3: BEBIDAS */}
      {activeSubTab === 'bebidas' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBebidas.map((bebida) => {
            const currentPrice = editablePricing.bebidas[bebida.id] ?? bebida.price;
            return (
              <div
                key={bebida.id}
                className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-4"
              >
                <div className="truncate">
                  <h5 className="font-bold text-white text-sm truncate">{bebida.name}</h5>
                  <span className="text-[10px] text-stone-400 block">{bebida.category} · {bebida.volume}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-bold text-stone-400">$</span>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    value={currentPrice}
                    onChange={(e) => handleBebidaPriceChange(bebida.id, Number(e.target.value))}
                    className="w-24 p-2 rounded-xl bg-stone-950 border border-stone-700 text-right text-sm font-bold text-[#F5A623] focus:outline-none focus:border-[#F5A623]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
