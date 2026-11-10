import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, RefreshCw, AlertCircle, Sparkles, MessageCircle } from 'lucide-react';
import { Producto } from './types';
import { fetchProductosFromSupabase } from './lib/supabase';
import { WHATSAPP_PHONE } from './lib/whatsapp';
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      
      {/* Top Navigation */}
      <Navbar
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenCustomQuote={() => setIsCustomQuoteOpen(true)}
        isUsingFallback={isUsingFallback}
      />

      {/* Hero Section */}
      <Hero onOpenCustomQuote={() => setIsCustomQuoteOpen(true)} />

      {/* Main Catalog Section */}
      <main id="catalogo" className="flex-1 py-14 sm:py-20 border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Piezas Listas para Impresión</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                Catálogo de Impresiones 3D
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
                Seleccioná tus modelos con especificación técnica de filamento y stock en taller. Despachamos pedidos a todo el país.
              </p>
            </div>

            {/* Supabase status micro alert */}
            {isUsingFallback && (
              <button
                onClick={() => setIsSupabaseModalOpen(true)}
                className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 transition-colors cursor-pointer text-left self-start md:self-auto"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Modo catálogo local activo · Ver estado de Supabase</span>
              </button>
            )}
          </div>

          {/* Interactive Controls Bar: Search & Material Filter Tabs */}
          <div className="p-2 sm:p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              
              {/* Search input */}
              <div className="relative w-full md:flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, material o uso (ej: dragon, maceta, petg)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-neutral-500 transition-colors"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-neutral-400 hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full md:w-auto px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none cursor-pointer"
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
                  className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer disabled:opacity-50"
                  aria-label="Refrescar catálogo"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

            </div>

            {/* Material Segmented Filter Controls */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 whitespace-nowrap">
                Material:
              </span>
              {availableMaterials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedMaterial.toLowerCase() === mat.toLowerCase()
                      ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                      : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
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
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-sm font-medium text-white">Cargando piezas desde Supabase...</p>
              <p className="text-xs text-neutral-500">Consultando tabla 'productos'</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 p-8 space-y-3">
              <p className="text-base font-semibold text-white">No se encontraron piezas con ese filtro</p>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Probá con otro término de búsqueda o material, o solicitanos una pieza personalizada por WhatsApp.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedMaterial('Todos');
                }}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
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
