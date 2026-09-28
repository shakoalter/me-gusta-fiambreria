import React, { useState, useEffect } from 'react';
import { History, RefreshCw, User, Calendar } from 'lucide-react';
import { fetchAuditLogs } from '../../services/adminService';
import { AuditLogEntry, AuditActionType } from '../../types/admin';

export const AuditLogsTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const entries = await fetchAuditLogs(40);
      setLogs(entries);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const getActionBadge = (type: AuditActionType) => {
    switch (type) {
      case 'GLOBAL_INCREASE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-red-950/80 text-red-300 border border-red-500/40">
            Aumento Global
          </span>
        );
      case 'DAILY_OFFER_UPDATE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-950/80 text-amber-300 border border-amber-500/40">
            Oferta del Día
          </span>
        );
      case 'SINGLE_PRICE_UPDATE':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-950/80 text-blue-300 border border-blue-500/40">
            Precios Individuales
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-stone-800 text-stone-300">
            Sistema
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div>
          <h4 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#F5A623]" />
            Historial de Auditoría
          </h4>
          <p className="text-xs sm:text-sm text-stone-400">
            Registro cronológico de modificaciones de precios, aumentos y cambios de oferta.
          </p>
        </div>

        <button
          type="button"
          onClick={loadLogs}
          disabled={isLoading}
          className="p-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 transition-all cursor-pointer"
          title="Recargar historial"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Lista de Logs */}
      {isLoading ? (
        <div className="py-12 text-center text-stone-400">
          <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-xs">Cargando registros de auditoría...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center text-stone-500 bg-stone-900/40 rounded-2xl border border-stone-800">
          <History className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Aún no hay cambios registrados en el historial.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {getActionBadge(log.actionType)}
                  <span className="font-bold text-white text-sm">
                    {log.description}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-stone-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    {log.adminEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    {new Date(log.timestamp).toLocaleString('es-AR', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              {log.details?.amountAdded && (
                <div className="shrink-0 text-right">
                  <span className="text-[10px] text-stone-400 block uppercase">Aumento</span>
                  <span className="font-black text-sm text-[#F5A623]">
                    +${log.details.amountAdded.toLocaleString('es-AR')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
