import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Mail, KeyRound, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { login, isDemoMode } = useAuth();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState<string>(isDemoMode ? 'admin@megusta.com' : '');
  const [password, setPassword] = useState<string>(isDemoMode ? 'admin123' : '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor completá todos los campos.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await login(email.trim(), password.trim());
      showToast('Sesión de administración iniciada', 'success');
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setErrorMsg(msg.includes('invalid-credential') || msg.includes('wrong-password')
        ? 'Correo o contraseña incorrectos.'
        : msg);
      showToast('No se pudo acceder al panel', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-[#18120C] border-2 border-[#F5A623]/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
      >
        {/* Glow de fondo decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors cursor-pointer"
          aria-label="Cerrar modal de acceso"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#781D22] to-[#450A0E] text-[#F5A623] border border-[#F5A623]/30 shadow-lg mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Panel de Administración
          </h3>
          <p className="text-xs sm:text-sm text-stone-300">
            Ingresá con tus credenciales de administradora de <span className="text-amber-400 font-bold">Me Gusta</span>.
          </p>
        </div>

        {/* Banner de Modo Demo si no hay Firebase configurado */}
        {isDemoMode && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block text-amber-300">Modo Demo Local Activado</span>
              <p className="text-[11px] text-stone-300">
                Credenciales precompletadas: <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">admin@megusta.com</code> / <code className="bg-black/40 px-1 py-0.5 rounded text-amber-200">admin123</code>
              </p>
            </div>
          </div>
        )}

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5 uppercase tracking-wider">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@megusta.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900/90 border border-stone-700 text-white text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1.5 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-900/90 border border-stone-700 text-white text-sm focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#F5A623] hover:bg-[#f8b438] text-stone-950 font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Ingresar al Panel</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
