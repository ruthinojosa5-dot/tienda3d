import React from 'react';
import { ArrowDown, MessageCircle, Layers, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onOpenCustomQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCustomQuote }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Editorial & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Taller de Impresión 3D Profesional · Granja de Impresoras</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[1.1] text-balance">
              Manufactura aditiva y piezas 3D de alta fidelidad
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Diseño, prototipado rápido y fabricación en <strong className="text-white font-medium">PLA, PETG, ABS y Resina 8K</strong>. Elegí modelos de nuestro catálogo o envianos tu archivo STL para cotización inmediata por WhatsApp.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalogo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <span>Explorar Catálogo</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenCustomQuote}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-100 font-medium text-sm border border-slate-700 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Cotizar STL a Medida</span>
              </button>
            </div>

            {/* Micro guarantees */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Calibración a 0.12mm
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Despachos a todo el país
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Asesoramiento técnico directo
              </span>
            </div>
          </div>

          {/* Right Column: High-Fidelity 3D Printer Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl aspect-[4/3] lg:aspect-auto lg:h-[440px] group">
              <img
                src="/src/assets/images/showcase_3d_printers_1794347023025.jpg"
                alt="Impresora 3D de alta velocidad extruyendo turbina mecánica en Universo 3D"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none" />

              {/* Live telemetry floating badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-md flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-400">Extrusor Voronoi 2.4 Active</div>
                  <div className="font-semibold text-white">Nozzle endurecido · Cama PEI</div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-mono font-medium">CoreXY 300 mm/s</div>
                  <div className="text-slate-400">Tolerancia ±0.1mm</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Full-width KPI strip below the hero */}
        <div className="mt-14 pt-8 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Precisión</span>
            </div>
            <div className="text-2xl font-bold font-display text-white tabular-nums">0.12 - 0.28 mm</div>
            <div className="text-xs text-slate-400">Altura de capa personalizable</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Materiales</span>
            </div>
            <div className="text-2xl font-bold font-display text-white">5 Variedades</div>
            <div className="text-xs text-slate-400">PLA, PETG, ABS, TPU y Resina UV</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantía</span>
            </div>
            <div className="text-2xl font-bold font-display text-white">100% Reposición</div>
            <div className="text-xs text-slate-400">Si la pieza tiene fallas de capa</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <MessageCircle className="w-4 h-4" />
              <span>Canal Directo</span>
            </div>
            <div className="text-2xl font-bold font-display text-white">WhatsApp</div>
            <div className="text-xs text-slate-400">Cotización y seguimiento al instante</div>
          </div>
        </div>

      </div>
    </section>
  );
};
