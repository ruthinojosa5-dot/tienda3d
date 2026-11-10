import { CartItem, CustomerOrderInfo } from '../types';

export const WHATSAPP_PHONE = '5493888202559';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateWhatsAppMessage(
  items: CartItem[],
  subtotal: number,
  shippingCost: number,
  total: number,
  customer?: CustomerOrderInfo
): string {
  const dateStr = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const lines: string[] = [];

  lines.push('🌌 *UNIVERSO 3D - SOLICITUD DE PEDIDO*');
  lines.push(`📅 _Fecha: ${dateStr}_`);
  lines.push('');

  if (customer && customer.nombre.trim()) {
    lines.push('👤 *DATOS DEL CLIENTE:*');
    lines.push(`• *Nombre:* ${customer.nombre.trim()}`);
    if (customer.telefono.trim()) {
      lines.push(`• *Teléfono:* ${customer.telefono.trim()}`);
    }
    const envioTxt = customer.metodoEntrega === 'envio' 
      ? `Envío a domicilio (${customer.direccion ? `${customer.direccion}, ${customer.ciudad}` : customer.ciudad || 'Por coordinar'})`
      : 'Retiro en taller (San Salvador de Jujuy)';
    lines.push(`• *Entrega:* ${envioTxt}`);
    if (customer.notas.trim()) {
      lines.push(`• *Observaciones:* ${customer.notas.trim()}`);
    }
    lines.push('');
  }

  lines.push('📦 *DETALLE DE PIEZAS 3D:*');
  items.forEach((item, index) => {
    const itemTotal = item.producto.precio * item.cantidad;
    const materialTag = item.producto.material ? `[${item.producto.material}]` : '';
    const colorTag = item.colorSeleccionado ? ` - Color: ${item.colorSeleccionado}` : '';
    lines.push(
      `${index + 1}. *${item.producto.nombre}* ${materialTag}`
    );
    lines.push(
      `   Cant: ${item.cantidad} x ${formatCurrency(item.producto.precio)} = *${formatCurrency(itemTotal)}*${colorTag}`
    );
    if (item.notasPersonalizadas?.trim()) {
      lines.push(`   _Nota:_ ${item.notasPersonalizadas.trim()}`);
    }
  });

  lines.push('');
  lines.push('──────────────────────');
  lines.push(`💵 *Subtotal:* ${formatCurrency(subtotal)}`);
  if (customer?.metodoEntrega === 'envio') {
    lines.push(`🚚 *Envío:* ${shippingCost === 0 ? '¡Gratis!' : formatCurrency(shippingCost)}`);
  } else {
    lines.push('🏬 *Retiro en taller:* Sin cargo');
  }
  lines.push(`💰 *TOTAL A ABONAR: ${formatCurrency(total)}*`);
  lines.push('──────────────────────');
  lines.push('');
  lines.push('Hola Universo 3D! 👋 Quisiera confirmar este pedido. ¿Tienen disponibilidad y me pasan los datos para la transferencia bancaria / seña? ¡Muchas gracias!');

  return lines.join('\n');
}

export function buildWhatsAppLink(
  items: CartItem[],
  subtotal: number,
  shippingCost: number,
  total: number,
  customer?: CustomerOrderInfo
): string {
  const text = generateWhatsAppMessage(items, subtotal, shippingCost, total, customer);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export function buildCustomPrintWhatsAppLink(details: {
  tipo: string;
  material: string;
  color?: string;
  relleno?: string;
  dimensiones?: string;
  linkModelo?: string;
  descripcion?: string;
}): string {
  const lines: string[] = [
    '🌌 *UNIVERSO 3D - CONSULTA DE IMPRESIÓN PERSONALIZADA*',
    '',
    `🛠️ *Tipo de Proyecto:* ${details.tipo}`,
    `🧵 *Material Deseado:* ${details.material}`,
  ];

  if (details.color) lines.push(`🎨 *Color Preferido:* ${details.color}`);
  if (details.relleno) lines.push(`🧱 *Relleno / Densidad:* ${details.relleno}`);
  if (details.dimensiones) lines.push(`📐 *Medidas aproximadas:* ${details.dimensiones}`);
  if (details.linkModelo) lines.push(`🔗 *Link STL/Archivo:* ${details.linkModelo}`);
  if (details.descripcion) lines.push(`📝 *Detalles:* ${details.descripcion}`);

  lines.push('');
  lines.push('Hola Universo 3D! 👋 Me gustaría cotizar esta pieza 3D personalizada. ¿Podrían asesorarme con el tiempo de producción y presupuesto? ¡Muchas gracias!');

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}
