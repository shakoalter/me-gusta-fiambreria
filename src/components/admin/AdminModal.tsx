import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Megaphone, 
  DollarSign, 
  TrendingUp, 
  History, 
  LogOut, 
  ShieldCheck, 
  Radio, 
  Database 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DailyOfferAdminTab } from './DailyOfferAdminTab';
import { IndividualPricingTab } from './IndividualPricingTab';
import { GlobalPriceIncreaseTab } from './GlobalPriceIncreaseTab';
import { AuditLogsTab } from './AuditLogsTab';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'offer' | 'pricing' | 'global' | 'audit';

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, isDemoMode } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('offer');

  if (!isOpen) return null;

  const handleLogout = async () => {
    await logout();
    showToast('Sesión cerrada correctamente', 'info');
    onClose();
  };

  const navTabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: 'offer', label: 'Oferta del Día', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'pricing', label: 'Precios Individuales', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'global', label: 'Aumento Global', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'audit', label: 'Historial', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#140E0A] border-2 border-[#F5A623]/50 rounded-3xl text-white shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden"
      >
        {/* Cabecera Principal del Panel */}
        <div className="p-4 sm:p-6 bg-[#1A120D] border-b border-stone-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
          
          {/* Título & Badge de Conexión */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#781D22] to-[#450A0E] text-[#F5A623] border border-[#F5A623]/40 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                  Panel de Administración
                </h3>
                {isDemoMode ? (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                    <Database className="w-3 h-3" /> Modo Local / Demo
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Firestore Conectado
                  </span>
                )}
              </div>
              <span className="text-[11px] text-stone-400 block">
                Sesión activa: <strong className="text-stone-300">{user?.email || 'admin@megusta.com'}</strong>
              </span>
            </div>
          </div>

          {/* Botones de Cabecera: Logout y Cerrar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-xs font-bold transition-all cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Cerrar panel de administración"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Navegación por Pestañas */}
        <div className="px-4 sm:px-6 bg-[#18110C] border-b border-stone-800 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar shrink-0">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-3 sm:px-5 flex items-center gap-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#F5A623] text-[#F5A623] bg-amber-500/5'
                    : 'border-transparent text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contenedor del Cuerpo con Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 custom-scrollbar">
          {activeTab === 'offer' && <DailyOfferAdminTab />}
          {activeTab === 'pricing' && <IndividualPricingTab />}
          {activeTab === 'global' && <GlobalPriceIncreaseTab />}
          {activeTab === 'audit' && <AuditLogsTab />}
        </div>
      </motion.div>
    </div>
  );
};
