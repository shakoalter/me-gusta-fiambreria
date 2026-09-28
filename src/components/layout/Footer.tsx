import React from 'react';
import { STORE_CONFIG } from '../../config/storeConfig';
import { MapPin, Clock, CreditCard, MessageCircle, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer id="footer-section" className="bg-stone-900 text-stone-300 pt-12 pb-24 md:pb-12 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-stone-800 text-sm">
          
          {/* Marca */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src={STORE_CONFIG.logoUrl}
                alt={`Logo de ${STORE_CONFIG.storeName}`}
                className="w-9 h-9 rounded-full object-cover border border-amber-400/50 shadow-sm bg-amber-50"
              />
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                {STORE_CONFIG.storeName}
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed mb-4">
              {STORE_CONFIG.tagline}. Especialistas en fiambres seleccionados, quesos artesanales y los mejores sándwiches preparados al momento.
            </p>
          </div>

          {/* Información y Horarios */}
          <div className="space-y-2.5">
            <h4 className="font-serif font-bold text-white text-base mb-3">Información & Horarios</h4>
            <div className="flex items-start gap-2.5 text-xs text-stone-400">
              <MapPin className="w-4 h-4 text-gourmet-mustard shrink-0 mt-0.5" />
              <span>{STORE_CONFIG.address}</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-stone-400">
              <Clock className="w-4 h-4 text-gourmet-olive shrink-0 mt-0.5" />
              <span>{STORE_CONFIG.schedule}</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-stone-400">
              <MessageCircle className="w-4 h-4 text-gourmet-whatsapp shrink-0 mt-0.5" />
              <span>WhatsApp de pedidos: {STORE_CONFIG.displayPhone}</span>
            </div>
          </div>

          {/* Modalidad de Pago */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-3">Modalidad de Pago</h4>
            <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700/60">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1.5">
                <CreditCard className="w-4 h-4" />
                <span>PAGO EN EL LOCAL</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {STORE_CONFIG.paymentNotice}
              </p>
            </div>
          </div>

        </div>

        {/* Copyright y Acceso de Administración */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} {STORE_CONFIG.storeName} — Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-4">
            <p className="italic">Elaboración fresca y artesanal.</p>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-amber-300 text-[11px] font-medium transition-colors cursor-pointer border border-stone-700/50"
                aria-label="Acceso al panel de administración"
              >
                <Lock className="w-3 h-3" />
                <span>Administración</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
