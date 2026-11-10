import React, { useState } from 'react';
import { Plus, Check, Eye, Package } from 'lucide-react';
import { Producto } from '../types';
import { formatCurrency } from '../lib/whatsapp';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  producto: Producto;
  onOpenDetails: (producto: Producto) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ producto, onOpenDetails }) => {
  const { addToCart } = useCart();
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(producto, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const isOutOfStock = producto.stock <= 0;

  return (
    <article
      onClick={() => onOpenDetails(producto)}
      className="group relative flex flex-col rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* Visual Canvas (65%-70% of upper visual weight) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950/60">
        {!imgError && producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            onError={() => setImgError(true)}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-600 bg-slate-950">
            <Package className="w-12 h-12 stroke-[1.2] mb-2 text-slate-700" />
            <span className="text-xs text-slate-500 font-mono">Pieza 3D · {producto.material}</span>
          </div>
        )}

        {/* Hover Quick Action Layer */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 p-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(producto);
            }}
            className="p-2.5 rounded-full bg-slate-900/90 text-white hover:bg-slate-800 backdrop-blur-sm transition-transform active:scale-90"
            title="Ver detalles de la pieza"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-xs font-medium bg-slate-950/90 text-slate-400 border border-slate-800">
            Agotado temporalmente
          </div>
        )}
      </div>

      {/* Card Content & Action Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        
        {/* Unboxed Metadata (Zero-pill rule: unboxed text with middle dot) */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-medium text-cyan-400">{producto.material}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Stock: {producto.stock} un.</span>
          {producto.tiempo_estimado && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="truncate">{producto.tiempo_estimado}</span>
            </>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-base font-semibold text-white tracking-tight leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {producto.nombre}
        </h3>

        {/* Price & Add to Cart button */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-slate-400">Precio unidad</div>
            <div className="text-lg font-bold font-display text-white tabular-nums">
              {formatCurrency(producto.precio)}
            </div>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isAddedRecently
                ? 'bg-emerald-500 text-white'
                : isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 active:scale-95'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>¡Agregado!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>

      </div>
    </article>
  );
};
