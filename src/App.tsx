import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, RefreshCw, AlertCircle, Sparkles, MessageCircle } from 'lucide-react';
import { Producto } from './types';
import { fetchProductosFromSupabase } from './lib/supabase';
import { WHATSAPP_PHONE } from './lib/whatsapp';
import { IMAGES } from './assets/images';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CustomQuoteModal } from './components/CustomQuoteModal';
import { SupabaseModal } from './components/SupabaseModal';
import { MaterialsSection } from './components/MaterialsSection';
import { WorkshopSection } from './components/WorkshopSection';
import { Footer } from './components/Footer';

function StoreApp() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isCustomQuoteOpen, setIsCustomQuoteOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'destacados' | 'precio-asc' | 'precio-desc' | 'nombre'>('destacados');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchProductosFromSupabase();
      setProductos(res.productos);
      setIsUsingFallback(res.source === 'fallback');
      setErrorMessage(res.errorMessage);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Material options computed from products
  const availableMaterials = useMemo(() => {
    const set = new Set<string>();
    productos.forEach((p) => {
      if (p.material) set.add(p.material.trim());
    });
    return ['Todos', ...Array.from(set)];
  }, [productos]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return productos
      .filter((p) => {
        const matchesQuery =
          p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesMaterial =
          selectedMaterial === 'Todos' ||
          p.material.toLowerCase() === selectedMaterial.toLowerCase() ||
          p.material.toLowerCase().includes(selectedMaterial.toLowerCase());

        return matchesQuery && matchesMaterial;
      })
      .sort((a, b) => {
        if (sortBy === 'precio-asc') return a.precio - b.precio;
        if (sortBy === 'precio-desc') return b.precio - a.precio;
        if (sortBy === 'nombre') return a.nombre.localeCompare(b.nombre);
        // default: destacados first, then by id
        if (a.destacado && !b.destacado) return -1;
        if (!a.destacado && b.destacado) return 1;
        return 0;
      });
  }, [productos, searchQuery, selectedMaterial, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenCustomQuote={() => setIsCustomQuoteOpen(true)}
        isUsingFallback={isUsingFallback}
      />

      {/* Hero Section */}
      <Hero onOpenCustomQuote={() => setIsCustomQuoteOpen(true)} />

      {/* Main Catalog Section */}
      <main id="catalogo" className="flex-1 py-14 sm:py-20 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Piezas Listas para Impresión</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                Catálogo de Impresiones 3D
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Seleccioná tus modelos con especificación técnica de filamento y stock en taller. Despachamos pedidos a todo el país.
              </p>
            </div>

            {/* Supabase status micro alert */}
            {isUsingFallback && (
              <button
                onClick={() => setIsSupabaseModalOpen(true)}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer text-left self-start md:self-auto"
              >
                <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Modo catálogo local activo · Ver estado de Supabase</span>
              </button>
            )}
          </div>

          {/* New High-Tech 3D Printers Showcase Banner at Start of Products */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>GRANJA DE IMPRESORAS 3D · CAPACIDAD ACTIVA</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Producción continua con más de 15 impresoras CoreXY y SLA
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Nuestra granja cuenta con equipamiento cerrado y control de humedad para extruir filamentos técnicos con máxima adherencia de capas. Si necesitás producción en serie o repuestos a medida, cotizá directamente con nuestros operadores.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => setIsCustomQuoteOpen(true)}
                    className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all shadow cursor-pointer active:scale-95"
                  >
                    Encargar Producción por Lote
                  </button>
                  <a
                    href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hola Universo 3D! 👋 Quisiera consultar por capacidad de impresión 3D en granja.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Consultar por WhatsApp</span>
                  </a>
                </div>
              </div>
              <div className="lg:col-span-5 h-56 lg:h-full relative overflow-hidden bg-slate-950">
                <img
                  src={IMAGES.heroWorkshop}
                  alt="Granja de impresoras 3D en el taller de Universo 3D"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent hidden lg:block" />
              </div>
            </div>
          </div>

          {/* Interactive Controls Bar: Search & Material Filter Tabs */}
          <div className="p-2 sm:p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              
              {/* Search input */}
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, material o uso (ej: turbina, dragon, petg)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500 transition-colors"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full md:w-auto px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="destacados">Destacados primero</option>
                  <option value="precio-asc">Precio: Menor a Mayor</option>
                  <option value="precio-desc">Precio: Mayor a Menor</option>
                  <option value="nombre">Orden alfabético (A-Z)</option>
                </select>

                <button
                  onClick={loadData}
                  disabled={loading}
                  title="Recargar catálogo desde Supabase"
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
                  aria-label="Refrescar catálogo"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

            </div>

            {/* Material Segmented Filter Controls */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 whitespace-nowrap">
                Material:
              </span>
              {availableMaterials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedMaterial.toLowerCase() === mat.toLowerCase()
                      ? 'bg-cyan-400 text-slate-950 font-semibold shadow-sm'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid Area */}
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-sm font-medium text-white">Cargando piezas desde Supabase...</p>
              <p className="text-xs text-slate-500">Consultando tabla 'productos'</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8 space-y-3">
              <p className="text-base font-semibold text-white">No se encontraron piezas con ese filtro</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Probá con otro término de búsqueda o material, o solicitanos una pieza personalizada por WhatsApp.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMaterial('Todos');
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  producto={prod}
                  onOpenDetails={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Materials Guide Section */}
      <MaterialsSection />

      {/* Workshop Craft & Technology Section */}
      <WorkshopSection />

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductModal
        producto={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Custom Quote Modal */}
      <CustomQuoteModal
        isOpen={isCustomQuoteOpen}
        onClose={() => setIsCustomQuoteOpen(false)}
      />

      {/* Supabase Connection Settings Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        isUsingFallback={isUsingFallback}
        errorMessage={errorMessage}
        onRefresh={loadData}
        productCount={productos.length}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <aside aria-label="Contacto directo" className="fixed bottom-5 right-5 z-30">
        <a
          href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hola Universo 3D! 👋 Tengo una consulta sobre sus impresiones.')}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 border border-emerald-400/40"
        >
          <MessageCircle className="w-5 h-5 fill-neutral-950 stroke-none" />
          <span className="hidden sm:inline">WhatsApp Taller</span>
        </a>
      </aside>

    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <StoreApp />
    </CartProvider>
  );
}
