import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Search, Sparkles, ArrowRight } from 'lucide-react';
import { FIAMBRES_DATA } from '../../data/fiambres';
import { Fiambre, FiambreCategory } from '../../types/product';
import { Badge } from '../common/Badge';
import { PriceTag } from '../common/PriceTag';

interface StepFiambreProps {
  selectedFiambre: Fiambre | null;
  onSelect: (fiambre: Fiambre) => void;
  onNextStep?: () => void;
}

const CATEGORIES: ('Todos' | FiambreCategory)[] = [
  'Todos',
  'Clásicos',
  'Especiales',
  'Curados & Ahumados',
];

export const StepFiambre: React.FC<StepFiambreProps> = ({
  selectedFiambre,
  onSelect,
  onNextStep,
}) => {
  const [activeCategory, setActiveCategory] = useState<'Todos' | FiambreCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiambres = useMemo(() => {
    return FIAMBRES_DATA.filter((fiambre) => {
      const matchesCategory =
        activeCategory === 'Todos' || fiambre.category === activeCategory;
      const matchesSearch =
        fiambre.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fiambre.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Encabezado del Paso + Buscador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-100">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="bg-[#781D22] text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
              Paso 1 de 3 • Obligatorio
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-gourmet-dark tracking-tight">
            Elegí tu Fiambre
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
            Seleccioná la base artesanal para tu sándwich gourmet.
          </p>
        </div>

        {/* Buscador Rápido */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar fiambre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#781D22] focus:ring-2 focus:ring-red-900/15 outline-none transition-all placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Pestañas de Categoría en Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all focus:outline-none cursor-pointer ${
                isActive
                  ? 'bg-[#781D22] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid de Fiambres */}
      {filteredFiambres.length === 0 ? (
        <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 p-6">
          <p className="text-sm font-semibold text-gourmet-dark">No se encontraron fiambres</p>
          <p className="text-xs text-gourmet-muted mt-1">Probá con otro término de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
          {filteredFiambres.map((fiambre) => {
            const isSelected = selectedFiambre?.id === fiambre.id;

            return (
              <motion.div
                key={fiambre.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(fiambre)}
                className={`relative flex flex-col justify-between p-2.5 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all border-2 select-none overflow-hidden ${
                  isSelected
                    ? 'bg-white border-[#781D22] shadow-md ring-2 sm:ring-4 ring-red-900/10'
                    : 'bg-white border-stone-200 hover:border-amber-700/50 hover:shadow-xs'
                }`}
              >
                {/* Imagen y Badges */}
                <div className="relative aspect-[16/11] sm:aspect-[16/10] rounded-lg sm:rounded-xl overflow-hidden bg-stone-100 mb-2 sm:mb-3">
                  <img
                    src={fiambre.image}
                    alt={fiambre.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {fiambre.badge && (
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 scale-75 sm:scale-100 origin-top-left">
                      <Badge variant="mustard" size="sm">
                        <Sparkles className="w-3 h-3 mr-1 inline" />
                        {fiambre.badge}
                      </Badge>
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#781D22] text-white flex items-center justify-center shadow-md animate-in fade-in zoom-in duration-200">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-0.5 sm:mb-1">
                    <span className="text-[9px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      {fiambre.category}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-xs sm:text-base text-gourmet-dark leading-tight line-clamp-1 sm:line-clamp-none">
                    {fiambre.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-gourmet-muted line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 leading-snug">
                    {fiambre.description}
                  </p>
                </div>

                {/* Precio Base */}
                <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2.5 border-t border-stone-100 flex items-center justify-between">
                  <PriceTag amount={fiambre.basePriceMin} prefix="Desde" size="sm" highlight={isSelected} />
                  <span
                    className={`text-[10px] sm:text-xs font-bold ${
                      isSelected ? 'text-[#781D22]' : 'text-stone-400'
                    }`}
                  >
                    {isSelected ? 'Elegido' : 'Elegir'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Barra Inferior del Paso */}
      <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
          <span className="w-4 h-4 rounded-full bg-red-100 text-[#781D22] flex items-center justify-center text-[10px] font-black">
            ▶
          </span>
          <span>
            {selectedFiambre
              ? `Fiambre elegido: ${selectedFiambre.name}. Podés avanzar al queso.`
              : 'Paso 1: Seleccioná un fiambre de la lista para comenzar.'}
          </span>
        </div>

        {selectedFiambre && onNextStep && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNextStep}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#781D22] hover:bg-[#63171b] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            <span>Completar Fiambre + Queso</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
