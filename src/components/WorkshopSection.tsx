import React from 'react';
import { Settings, Cpu, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import { WHATSAPP_PHONE } from '../lib/whatsapp';
import { IMAGES } from '../assets/images';

export const WorkshopSection: React.FC = () => {
  return (
    <section id="taller" className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Nuestra Tecnología y Proceso</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white text-balance">
              De tu idea o archivo STL a una pieza tangible en horas
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              En Universo 3D combinamos impresoras CoreXY de alta velocidad con boquillas de acero endurecido y cámaras cerradas con temperatura controlada. Cada impresión pasa por un riguroso control dimensional y desbarbado manual.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4">
                <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 shrink-0 h-fit">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Slicing optimizado con PrusaSlicer y OrcaSlicer</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Orientamos cada pieza para maximizar la resistencia en el eje Z y reducir los soportes innecesarios.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 shrink-0 h-fit">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Inspección de tolerancia y acabado superficial</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verificamos que los encastres coincidan con tus especificaciones antes de embalar para envío.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 shrink-0 h-fit">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Post-procesado artesanal</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Limpieza por ultrasonido y curado UV para resinas; remoción limpia de soportes y texturizado para termoplásticos.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hola Universo 3D! 👋 Tengo una consulta sobre el proceso de impresión 3D.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Hablar con el técnico del taller (+54 9 388 8202559)</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-[3/4]">
                <img
                  src={IMAGES.productDragon}
                  alt="Detalle de dragón articulado impreso en 3D"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="font-bold text-white mb-1">Print-in-Place</div>
                <div className="text-slate-400">Piezas articuladas sin ensambles posteriores ni pegamentos.</div>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="font-bold text-cyan-400 mb-1">Filamento Premium</div>
                <div className="text-slate-400">Control de diámetro a ±0.02mm para un flujo de extrusión uniforme.</div>
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-[3/4]">
                <img
                  src={IMAGES.productPlanter}
                  alt="Maceta espiral geométrica en PLA terracota"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
