import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertTriangle, RefreshCw, KeyRound, Globe, RotateCcw } from 'lucide-react';
import {
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_KEY,
  getActiveSupabaseConfig,
  saveSupabaseConfig,
  resetSupabaseConfig,
} from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUsingFallback: boolean;
  errorMessage?: string;
  onRefresh: () => Promise<void>;
  productCount: number;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  isUsingFallback,
  errorMessage,
  onRefresh,
  productCount,
}) => {
  const currentConfig = getActiveSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [isTesting, setIsTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setStatusMessage(null);
    try {
      saveSupabaseConfig(url, key);
      await onRefresh();
      setStatusMessage('¡Configuración guardada y tabla consultada exitosamente!');
    } catch (err: unknown) {
      setStatusMessage(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = async () => {
    resetSupabaseConfig();
    setUrl(DEFAULT_SUPABASE_URL);
    setKey(DEFAULT_SUPABASE_KEY);
    setIsTesting(true);
    try {
      await onRefresh();
      setStatusMessage('Valores restablecidos a los originales del taller.');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-950/60 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Integración Base de Datos</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Estado de Conexión a Supabase
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Universo 3D lee la tabla <code className="text-amber-400 font-mono">productos</code> (nombre, precio, imagen_url, material, stock) directamente de tu proyecto.
          </p>
        </div>

        {/* Current status card */}
        <div className={`p-4 rounded-xl border mb-6 ${
          isUsingFallback
            ? 'bg-amber-950/20 border-amber-800/60 text-amber-200'
            : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
        }`}>
          <div className="flex items-start gap-3">
            {isUsingFallback ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-sm">
                {isUsingFallback
                  ? 'Catálogo en Modo Respaldo Activo'
                  : 'Sincronizado en Vivo con Supabase'}
              </div>
              <p className="opacity-90 leading-relaxed">
                {isUsingFallback
                  ? `La clave anon provista devolvió: "${errorMessage || 'Invalid API key'}". Para que la tienda funcione sin interrupciones, estamos mostrando el catálogo completo del taller (${productCount} piezas en stock).`
                  : `Se cargaron ${productCount} productos en tiempo real desde la tabla 'productos'.`}
              </p>
            </div>
          </div>
        </div>

        {/* Form to view / update credentials */}
        <form onSubmit={handleSaveAndTest} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Supabase Project URL:</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Supabase Anon Key:</span>
              </span>
              <span className="text-[10px] text-neutral-500">API Key</span>
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sb_publishable_... o eyJhbGciOi..."
              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {statusMessage && (
            <div className="text-xs text-amber-300 p-2 rounded bg-neutral-950 border border-neutral-800">
              {statusMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isTesting}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Verificando...' : 'Guardar y Probar Conexión'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isTesting}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 leading-normal">
          💡 <strong>Tip para el administrador:</strong> Si tu Supabase está configurado con Row Level Security (RLS), asegurate de haber creado una política de lectura pública en la tabla <code>productos</code> (<code>CREATE POLICY "Permitir lectura publica" ON productos FOR SELECT USING (true);</code>).
        </div>
      </div>
    </div>
  );
};
