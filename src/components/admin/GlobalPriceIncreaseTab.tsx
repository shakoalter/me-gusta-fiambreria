import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { usePricing } from '../../context/PricingContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { GlobalIncreaseModal } from './GlobalIncreaseModal';
import { FIAMBRES_DATA } from '../../data/fiambres';
import { QUESOS_DATA } from '../../data/quesos';
import { EXTRAS_DATA } from '../../data/extras';
import { BEBIDAS_DATA } from '../../data/bebidas';

export const GlobalPriceIncreaseTab: React.FC = () => {
  const { pricing, applyGlobalIncrease } = usePricing();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [amount, setAmount] = useState<number>(500);
  const [targetScope, setTargetScope] = useState<'sandwiches' | 'extras' | 'bebidas' | 'all'>('sandwiches');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const quickAmounts = [200, 300, 500, 1000, 1500, 2000];

  // Cálculo de cuántos items son afectados según el alcance
  const affectedCount = useMemo(() => {
    const sandwichCount = FIAMBRES_DATA.length * QUESOS_DATA.length; // 128
    const extraCount = EXTRAS_DATA.length; // 5
    const bebidaCount = BEBIDAS_DATA.length; // 13

    switch (targetScope) {
      case 'sandwiches':
        return sandwichCount;
      case 'extras':
        return extraCount;
      case 'bebidas':
        return bebidaCount;
      case 'all':
        return sandwichCount + extraCount + bebidaCount;
      default:
        return 0;
    }
  }, [targetScope]);

  // Simulación de ejemplos antes / después
  const simulationSamples = useMemo(() => {
    const samples = [];

    // Ejemplo 1: Sándwich Clásico
    const jamonCocidoPrice = pricing.matrix['jamon-cocido']?.['queso-clasico'] || 4200;
    samples.push({
      category: 'Sándwich Clásico',
      name: 'Jamón Cocido + Queso Clásico',
      current: jamonCocidoPrice,
      simulated: (targetScope === 'sandwiches' || targetScope === 'all') ? jamonCocidoPrice + amount : jamonCocidoPrice,
      isAffected: targetScope === 'sandwiches' || targetScope === 'all',
    });

    // Ejemplo 2: Sándwich Premium
    const jamonCrudoPrice = pricing.matrix['jamon-crudo']?.['queso-pesto'] || 7700;
    samples.push({
      category: 'Sándwich Premium',
      name: 'Jamón Crudo + Queso al Pesto',
      current: jamonCrudoPrice,
      simulated: (targetScope === 'sandwiches' || targetScope === 'all') ? jamonCrudoPrice + amount : jamonCrudoPrice,
      isAffected: targetScope === 'sandwiches' || targetScope === 'all',
    });

    // Ejemplo 3: Extra
    const aceitunasPrice = pricing.extras['aceitunas'] || 1000;
    samples.push({
      category: 'Extra Gourmet',
      name: 'Aceitunas',
      current: aceitunasPrice,
      simulated: (targetScope === 'extras' || targetScope === 'all') ? aceitunasPrice + amount : aceitunasPrice,
      isAffected: targetScope === 'extras' || targetScope === 'all',
    });

    // Ejemplo 4: Bebida
    const cocaPrice = pricing.bebidas['coca-cola-600'] || 2600;
    samples.push({
      category: 'Bebida',
      name: 'Coca-Cola 600ml',
      current: cocaPrice,
      simulated: (targetScope === 'bebidas' || targetScope === 'all') ? cocaPrice + amount : cocaPrice,
      isAffected: targetScope === 'bebidas' || targetScope === 'all',
    });

    return samples;
  }, [pricing, amount, targetScope]);

  const handleApplyIncrease = async () => {
    try {
      await applyGlobalIncrease(amount, targetScope, user?.email || 'admin@megusta.com');
      setIsModalOpen(false);
      showToast(`¡Aumento global de +$${amount.toLocaleString('es-AR')} aplicado con éxito!`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al aplicar el aumento';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado */}
      <div className="pb-4 border-b border-stone-800">
        <h4 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#F5A623]" />
          Aumento Global de Precios en Pesos
        </h4>
        <p className="text-xs sm:text-sm text-stone-400">
          Ajustá la inflación o suba de costos sumando una cifra fija en pesos (+$) a todo el catálogo o una categoría específica con un solo clic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel Izquierdo: Configuración del Aumento (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Paso 1: Selección de Alcance */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
              1. Seleccioná el Alcance del Aumento
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'sandwiches', label: 'Solo Sándwiches', count: '128 combinaciones' },
                { id: 'extras', label: 'Solo Extras', count: '5 items' },
                { id: 'bebidas', label: 'Solo Bebidas', count: '13 items' },
                { id: 'all', label: 'Todo el Catálogo', count: '146 items en total' },
              ].map((scope) => (
                <button
                  key={scope.id}
                  type="button"
                  onClick={() => setTargetScope(scope.id as typeof targetScope)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    targetScope === scope.id
                      ? 'bg-[#781D22]/50 border-[#F5A623] text-white shadow-lg'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:bg-stone-800/80 hover:text-stone-200'
                  }`}
                >
                  <span className="font-bold text-sm block text-white">{scope.label}</span>
                  <span className="text-[11px] text-stone-400 mt-1">{scope.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Paso 2: Monto en Pesos */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
              2. Monto a Sumar por Item (en Pesos ARS)
            </label>

            {/* Botones de montos rápidos */}
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((qAmount) => (
                <button
                  key={qAmount}
                  type="button"
                  onClick={() => setAmount(qAmount)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    amount === qAmount
                      ? 'bg-[#F5A623] text-stone-950 shadow-md'
                      : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  +${qAmount.toLocaleString('es-AR')}
                </button>
              ))}
            </div>

            {/* Input manual */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#F5A623] font-bold text-lg">
                +$
              </div>
              <input
                type="number"
                step="50"
                min="50"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                placeholder="500"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-900 border-2 border-stone-700 text-white font-serif text-xl font-bold focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]"
              />
            </div>
          </div>

          {/* Botón Principal Disparador */}
          <div className="pt-2">
            <button
              type="button"
              disabled={amount <= 0}
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#781D22] via-[#8c2228] to-[#781D22] hover:brightness-110 text-white font-black text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-red-700/60"
            >
              <TrendingUp className="w-5 h-5 text-[#F5A623]" />
              <span>Aplicar Aumento Global (+${amount.toLocaleString('es-AR')})</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>

        </div>

        {/* Panel Derecho: Simulación en Vivo (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F5A623]" />
              <span>Simulación en Vivo</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              {affectedCount} items a modificar
            </span>
          </div>

          {/* Card de Simulación */}
          <div className="rounded-3xl bg-stone-900/90 border border-stone-800 p-5 space-y-4 shadow-xl">
            <span className="text-xs font-bold text-stone-300 block pb-2 border-b border-stone-800">
              Ejemplos antes y después del aumento:
            </span>

            <div className="space-y-3">
              {simulationSamples.map((sample, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all ${
                    sample.isAffected
                      ? 'bg-stone-950/70 border-amber-500/30'
                      : 'bg-stone-950/30 border-stone-850 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                    <span>{sample.category}</span>
                    {sample.isAffected ? (
                      <span className="text-emerald-400 font-bold">Modificado (+${amount})</span>
                    ) : (
                      <span className="text-stone-500 font-normal">Sin cambios</span>
                    )}
                  </div>

                  <span className="block font-bold text-white text-xs mb-2">
                    {sample.name}
                  </span>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800/80">
                    <span className="text-stone-400 line-through">
                      ${sample.current.toLocaleString('es-AR')}
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-[#F5A623]">
                      <span>➔</span>
                      <span className="text-sm font-black text-[#F5A623]">
                        ${sample.simulated.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200/90 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                El aumento se ejecuta en una sola transacción atómica en Firestore. Si algún ítem falla, se cancela todo para mantener la integridad de los datos.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Modal de Confirmación */}
      <AnimatePresence>
        {isModalOpen && (
          <GlobalIncreaseModal
            isOpen={isModalOpen}
            amount={amount}
            targetScope={targetScope}
            affectedCount={affectedCount}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleApplyIncrease}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
