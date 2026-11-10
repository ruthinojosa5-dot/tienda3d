import React, { useState } from 'react';
import { X, Send, Layers, HelpCircle, CheckCircle2 } from 'lucide-react';
import { buildCustomPrintWhatsAppLink } from '../lib/whatsapp';

interface CustomQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomQuoteModal: React.FC<CustomQuoteModalProps> = ({ isOpen, onClose }) => {
  const [tipo, setTipo] = useState('Prototipo / Pieza técnica');
  const [material, setMaterial] = useState('PLA');
  const [color, setColor] = useState('Negro');
  const [relleno, setRelleno] = useState('20% (Estándar resistente)');
  const [dimensiones, setDimensiones] = useState('');
  const [linkModelo, setLinkModelo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildCustomPrintWhatsAppLink({
      tipo,
      material,
      color,
      relleno,
      dimensiones: dimensiones.trim() || undefined,
      linkModelo: linkModelo.trim() || undefined,
      descripcion: descripcion.trim() || undefined,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Servicio de Fabricación a Medida</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Cotizá tu archivo STL o Proyecto 3D
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tenés un archivo de Printables, Thingiverse, MakerWorld o tu propio modelo en CAD? Completá los detalles y te pasamos presupuesto y tiempo de producción por WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Tipo de proyecto:</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="Prototipo / Pieza técnica mecánica">Prototipo / Pieza técnica mecánica</option>
              <option value="Figura / Escultura / Miniatura de alta resolución">Figura / Escultura / Miniatura</option>
              <option value="Decoración / Maceta / Objeto de diseño">Decoración / Maceta / Objeto de diseño</option>
              <option value="Repuesto descatalogado o roto">Repuesto descatalogado o roto</option>
              <option value="Merchandising / Llaveros por cantidad">Merchandising / Llaveros por cantidad</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Material sugerido:</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="PLA (Uso general, decorativo y ecológico)">PLA (Uso general)</option>
                <option value="PETG (Resistente a calor y golpes)">PETG (Mecánico / Exterior)</option>
                <option value="ABS (Alta temperatura e impacto)">ABS (Industrial)</option>
                <option value="TPU (Flexible / Goma)">TPU (Flexible / Goma)</option>
                <option value="Resina UV 8K (Máximo detalle sin capas)">Resina UV 8K (Figuras y miniaturas)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Color aproximado:</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Ej: Cian, Negro, Plata..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Relleno estructural:</label>
              <select
                value={relleno}
                onChange={(e) => setRelleno(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="15% (Económico / Decorativo)">15% (Económico / Decorativo)</option>
                <option value="20% (Estándar equilibrado)">20% (Estándar equilibrado)</option>
                <option value="40% (Reforzado para fuerza mecánica)">40% (Reforzado mecánico)</option>
                <option value="100% Sólido">100% Sólido</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Medidas aproximadas:</label>
              <input
                type="text"
                value={dimensiones}
                onChange={(e) => setDimensiones(e.target.value)}
                placeholder="Ej: 10 x 8 x 5 cm"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Link de archivo STL o modelo (opcional):</span>
              <span className="text-[10px] text-slate-500">Google Drive, Thingiverse, Printables</span>
            </label>
            <input
              type="url"
              value={linkModelo}
              onChange={(e) => setLinkModelo(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Detalles adicionales:</label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Explicá para qué vas a usar la pieza o si necesitás tolerancias especiales..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Consulta a WhatsApp (+54 9 388 8202559)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
