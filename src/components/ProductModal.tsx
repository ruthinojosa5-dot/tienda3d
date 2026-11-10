import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Check, Layers, Clock, Maximize2, ShieldAlert } from 'lucide-react';
import { Producto } from '../types';
import { formatCurrency } from '../lib/whatsapp';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  producto: Producto | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ producto, onClose }) => {
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [notas, setNotas] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Sync state when product opens
  React.useEffect(() => {
    if (producto) {
      setCantidad(1);
      setSelectedColor(producto.colores_disponibles?.[0] || 'Original');
      setNotas('');
      setIsAdded(false);
      setImgError(false);
    }
  }, [producto]);

  if (!producto) return null;

  const handleAdd = () => {
    addToCart(producto, cantidad, selectedColor, notas);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  const isOutOfStock = producto.stock <= 0;
  const totalPrice = producto.precio * cantidad;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-950/60 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Canvas */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-neutral-950 flex items-center justify-center overflow-hidden">
            {!imgError && producto.imagen_url ? (
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-center p-8 text-neutral-500">
                <Layers className="w-16 h-16 mx-auto mb-2 text-neutral-700 stroke-[1]" />
                <span className="text-sm font-mono">{producto.material}</span>
              </div>
            )}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-neutral-950/85 border border-neutral-800 text-xs font-semibold text-amber-400">
              {producto.material}
            </div>
          </div>

          {/* Right Column: Specifications & Purchasing Controls */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Stock */}
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>{producto.categoria || 'Impresión 3D'}</span>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span>Stock disponible: {producto.stock} unidades</span>
              </div>

              {/* Title & Price */}
              <div>
                <h2 className="text-2xl font-bold font-display text-white tracking-tight leading-snug">
                  {producto.nombre}
                </h2>
                <div className="mt-2 text-3xl font-extrabold font-display text-amber-400 tabular-nums">
                  {formatCurrency(producto.precio)}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-300 leading-relaxed">
                {producto.descripcion ||
                  'Pieza impresa en nuestro taller con calibración de alta precisión, garantizando acabado superficial suave y máxima resistencia estructural.'}
              </p>

              {/* Technical Specifications Pills/Row */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                {producto.dimensiones && (
                  <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                    <span className="text-neutral-400 flex items-center gap-1 mb-1">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> Dimensiones
                    </span>
                    <span className="font-medium text-neutral-200">{producto.dimensiones}</span>
                  </div>
                )}
                {producto.tiempo_estimado && (
                  <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                    <span className="text-neutral-400 flex items-center gap-1 mb-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Tiempo estimado
                    </span>
                    <span className="font-medium text-neutral-200">{producto.tiempo_estimado}</span>
                  </div>
                )}
              </div>

              {/* Color Selection if available */}
              {producto.colores_disponibles && producto.colores_disponibles.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-neutral-300 block">
                    Color de Filamento / Resina:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {producto.colores_disponibles.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedColor === color
                            ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom personalization note */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
                  <span>Nota o Personalización (opcional):</span>
                  <span className="text-[10px] text-neutral-500">Ej: Iniciales, sin soporte</span>
                </label>
                <input
                  type="text"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Escribí aquí si necesitás algún detalle..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-neutral-500"
                />
              </div>
            </div>

            {/* Stepper + Add to Cart Action */}
            <div className="pt-4 border-t border-neutral-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-medium">Cantidad:</span>
                <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-lg p-1">
                  <button
                    type="button"
                    disabled={cantidad <= 1}
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-40"
                    aria-label="Restar cantidad"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-semibold text-white tabular-nums px-2 min-w-8 text-center">
                    {cantidad}
                  </span>
                  <button
                    type="button"
                    disabled={cantidad >= (producto.stock > 0 ? producto.stock : 99)}
                    onClick={() => setCantidad((c) => Math.min(producto.stock > 0 ? producto.stock : 99, c + 1))}
                    className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-40"
                    aria-label="Sumar cantidad"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isOutOfStock ? (
                <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-950 text-neutral-400 text-xs border border-neutral-800">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Sin stock inmediato · Podés pedirlo por encargo vía WhatsApp</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 active:scale-95 shadow-md'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5 stroke-[2.5]" />
                      <span>¡Agregado al Carrito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Agregar al Carrito · {formatCurrency(totalPrice)}</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
