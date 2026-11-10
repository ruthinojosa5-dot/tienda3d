import React from 'react';
import { Layers, Shield, Flame, Droplet, Sparkles, Feather } from 'lucide-react';

export const MaterialsSection: React.FC = () => {
  const materials = [
    {
      name: 'PLA & PLA Silk',
      tag: 'Ecológico & Estético',
      icon: Feather,
      description: 'Termoplástico biodegradable de origen vegetal (almidón de maíz). Ideal para figuras coleccionables, decoración, organizadores y macetas. Acabado brillante o mate sedoso sin olores.',
      temp: 'Hasta 55°C',
      resistencia: 'Media / Rigidez alta',
      usos: 'Decoración, esculturas, props, litofanías',
    },
    {
      name: 'PETG Reforzado',
      tag: 'Resistente & Funcional',
      icon: Shield,
      description: 'El equilibrio perfecto entre facilidad de impresión y tenacidad mecánica. Resistente al agua, rayos solares UV y esfuerzos de flexión. No se quiebra fácilmente ante impactos.',
      temp: 'Hasta 75°C',
      resistencia: 'Muy alta / Tenaz',
      usos: 'Soportes de monitor, piezas para bicis, carcasas',
    },
    {
      name: 'ABS Industrial',
      tag: 'Térmico & Mecánico',
      icon: Flame,
      description: 'El mismo plástico que se usa en piezas automotrices y bloques LEGO. Tolera temperaturas elevadas, solventes y esfuerzos de fricción continua. Se imprime en cámara cerrada calefaccionada.',
      temp: 'Hasta 95°C',
      resistencia: 'Extrema al calor e impacto',
      usos: 'Engranajes, repuestos de motor, carcasas electrónicas',
    },
    {
      name: 'TPU 95A Flexible',
      tag: 'Elástico & Antigolpe',
      icon: Droplet,
      description: 'Elastómero con propiedades de goma de caucho. Permite ser aplastado, doblado o torcido regresando siempre a su forma original. Excelente absorción de impactos y vibraciones.',
      temp: 'Hasta 70°C',
      resistencia: 'Flexible / Amortiguador',
      usos: 'Bumpers de drones, sellos, fundas resistentes, ruedas',
    },
    {
      name: 'Resina UV 8K',
      tag: 'Micro-Detalle Óptico',
      icon: Sparkles,
      description: 'Fotopolimerización líquida por pantalla LCD monocromática 8K. Resuelve detalles microscópicos de 28 a 50 micras sin líneas de capa perceptibles al tacto ni a la vista.',
      temp: 'Hasta 60°C',
      resistencia: 'Detalle fino para pintura',
      usos: 'Miniaturas RPG/Warhammer, joyería, prototipos dentales',
    },
  ];

  return (
    <section id="materiales" className="py-16 sm:py-20 border-b border-neutral-800/80 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Guía Técnica de Filamentos y Resinas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white text-balance">
            El material justo para cada necesidad
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            En Universo 3D trabajamos con filamentos de marcas líderes (Printalot, Grilon3, eSun) rigurosamente deshidratados para asegurar capas libres de burbujas y máxima adhesión estructural.
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((mat) => {
            const Icon = mat.icon;
            return (
              <div
                key={mat.name}
                className="flex flex-col justify-between p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-neutral-700 transition-colors space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-xl bg-neutral-800 text-amber-400">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-xs font-medium text-neutral-400 font-mono">
                      {mat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-display">
                    {mat.name}
                  </h3>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/60 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Resistencia térmica:</span>
                    <span className="text-neutral-200 font-medium font-mono">{mat.temp}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Comportamiento:</span>
                    <span className="text-neutral-200 font-medium">{mat.resistencia}</span>
                  </div>
                  <div className="text-[11px] text-amber-400/90 pt-1">
                    🎯 <em>{mat.usos}</em>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
