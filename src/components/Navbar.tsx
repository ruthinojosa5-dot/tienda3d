import React from 'react';
import { ShoppingBag, Database, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onOpenSupabaseModal: () => void;
  onOpenCustomQuote: () => void;
  isUsingFallback: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSupabaseModal,
  onOpenCustomQuote,
  isUsingFallback,
}) => {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="flex items-center gap-2.5 group whitespace-nowrap shrink-0">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-base shadow-sm">
            3D
          </span>
          <span className="text-xl font-bold tracking-tight text-white font-display group-hover:text-cyan-400 transition-colors">
            UNIVERSO 3D
          </span>
        </a>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#catalogo"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Catálogo
          </a>
          <a
            href="#materiales"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Materiales
          </a>
          <button
            onClick={onOpenCustomQuote}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-left"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cotizar STL</span>
          </button>
          <a
            href="#taller"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            El Taller
          </a>
          <a
            href="#contacto"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Contacto
          </a>
        </nav>

        {/* Zone 3: Primary action + Supabase status */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Supabase status pill */}
          <button
            onClick={onOpenSupabaseModal}
            title={isUsingFallback ? 'Supabase en modo respaldo (Click para configurar)' : 'Supabase conectado en vivo'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Supabase</span>
            <span className={`w-2 h-2 rounded-full ${isUsingFallback ? 'bg-amber-400' : 'bg-cyan-400'}`} />
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Abrir carrito de compras"
            className="relative flex items-center gap-2.5 px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold bg-slate-950 text-cyan-400 rounded-full tabular-nums">
                {totalItems}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
