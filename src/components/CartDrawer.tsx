import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, Truck, Store, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { formatCurrency, buildWhatsAppLink } from '../lib/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    shippingCost,
    freeShippingThreshold,
    total,
    isCartOpen,
    setIsCartOpen,
    customerInfo,
    setCustomerInfo,
  } = useCart();

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formErrors, setFormErrors] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckoutWhatsApp = () => {
    // Validate minimal customer information
    if (!customerInfo.nombre.trim()) {
      setFormErrors('Por favor, ingresá tu nombre para identificar el pedido.');
      setShowCheckoutForm(true);
      return;
    }
    if (customerInfo.metodoEntrega === 'envio' && !customerInfo.direccion.trim()) {
      setFormErrors('Por favor, ingresá tu dirección para coordinar el despacho.');
      setShowCheckoutForm(true);
      return;
    }

    setFormErrors(null);

    // Fire confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#06b6d4', '#10b981', '#38bdf8', '#ffffff'],
      });
    } catch {
      // fallback if canvas-confetti is not loaded
    }

    // Build the WhatsApp URL
    const whatsappUrl = buildWhatsAppLink(items, subtotal, shippingCost, total, customerInfo);

    // Open WhatsApp URL
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold font-display text-white">Tu Carrito de Pedido</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {totalItems}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Items or Empty state */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            
            {/* Free shipping progress indicator */}
            {items.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                    <Truck className="w-3.5 h-3.5 text-cyan-400" />
                    {remainingForFreeShipping === 0
                      ? '¡Tenés ENVÍO GRATIS a todo el país!'
                      : `Faltan ${formatCurrency(remainingForFreeShipping)} para envío gratis`}
                  </span>
                  <span className="text-cyan-400 font-mono font-semibold">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-neutral-400">
                <ShoppingBag className="w-16 h-16 text-neutral-700 stroke-[1.2] mb-3" />
                <p className="text-base font-semibold text-white">Tu carrito está vacío</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  Elegí tus piezas favoritas en el catálogo o solicitá un modelo a medida por encargo.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
                >
                  Volver al Catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={`${item.producto.id}-${item.colorSeleccionado || 'orig'}-${idx}`}
                    className="flex gap-3 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 group"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
                      <img
                        src={item.producto.imagen_url}
                        alt={item.producto.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-semibold text-white leading-snug line-clamp-1">
                          {item.producto.nombre}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.producto.id)}
                          className="text-slate-500 hover:text-red-400 p-0.5 transition-colors"
                          title="Eliminar del carrito"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span className="text-cyan-400 font-medium">{item.producto.material}</span>
                        {item.colorSeleccionado && (
                          <>
                            <span>·</span>
                            <span>{item.colorSeleccionado}</span>
                          </>
                        )}
                      </div>

                      {item.notasPersonalizadas && (
                        <div className="text-[10px] text-slate-400 italic truncate">
                          Nota: {item.notasPersonalizadas}
                        </div>
                      )}

                      {/* Stepper & Price */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-slate-800 rounded-md bg-slate-900">
                          <button
                            onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                            className="p-1 text-slate-400 hover:text-white"
                            aria-label="Restar uno"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-medium text-white tabular-nums">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                            className="p-1 text-slate-400 hover:text-white"
                            aria-label="Sumar uno"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-white tabular-nums">
                          {formatCurrency(item.producto.precio * item.cantidad)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={clearCart}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Vaciar todo el carrito
                  </button>
                  <button
                    onClick={() => setShowCheckoutForm(!showCheckoutForm)}
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {showCheckoutForm ? 'Ocultar datos de entrega' : 'Completar datos de entrega'}
                  </button>
                </div>
              </div>
            )}

            {/* Customer Details Form (Drawer sub-section) */}
            {items.length > 0 && showCheckoutForm && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Datos para el Pedido
                </h4>

                {formErrors && (
                  <div className="flex items-center gap-1.5 p-2 rounded bg-red-950/60 border border-red-800 text-xs text-red-300">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formErrors}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Nombre completo *</label>
                  <input
                    type="text"
                    value={customerInfo.nombre}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, nombre: e.target.value })}
                    placeholder="Ej: Sofía Gómez"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Teléfono WhatsApp</label>
                  <input
                    type="tel"
                    value={customerInfo.telefono}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, telefono: e.target.value })}
                    placeholder="Ej: +54 9 388..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Modalidad de Entrega</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, metodoEntrega: 'retiro' })}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${
                        customerInfo.metodoEntrega === 'retiro'
                          ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Retiro en Taller</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, metodoEntrega: 'envio' })}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${
                        customerInfo.metodoEntrega === 'envio'
                          ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Envío a Domicilio</span>
                    </button>
                  </div>
                </div>

                {customerInfo.metodoEntrega === 'envio' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">Dirección de entrega *</label>
                      <input
                        type="text"
                        value={customerInfo.direccion}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, direccion: e.target.value })}
                        placeholder="Calle, Número, Piso/Depto"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">Ciudad y Provincia</label>
                      <input
                        type="text"
                        value={customerInfo.ciudad}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, ciudad: e.target.value })}
                        placeholder="San Salvador de Jujuy, Jujuy"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Observaciones extras</label>
                  <input
                    type="text"
                    value={customerInfo.notas}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notas: e.target.value })}
                    placeholder="Horarios de entrega, color alternativo, etc."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-800/90 bg-slate-950/80 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({totalItems} piezas)</span>
                  <span className="font-mono text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Entrega ({customerInfo.metodoEntrega === 'retiro' ? 'Retiro en taller' : 'Envío nacional'})</span>
                  <span className="font-mono text-white">
                    {customerInfo.metodoEntrega === 'retiro'
                      ? 'Gratis'
                      : shippingCost === 0
                      ? '¡Gratis!'
                      : formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-bold text-white">
                  <span>Total Estimado</span>
                  <span className="text-xl font-display text-cyan-400 tabular-nums">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Requirement 3: Checkout button generating WhatsApp link */}
              <button
                type="button"
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-slate-950 stroke-none" />
                <span>Pedir por WhatsApp (+54 9 388...)</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="text-[11px] text-center text-slate-400 leading-tight">
                Se abrirá WhatsApp con el pedido listo para enviar. Sin pagos automáticos por la web; coordinamos seña y entrega directamente con vos.
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
