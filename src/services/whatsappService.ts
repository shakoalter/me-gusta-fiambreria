import { CartItem } from '../types/product';
import { STORE_CONFIG } from '../config/storeConfig';
import { formatCurrency } from '../utils/formatters';

export interface CustomerOrderData {
  customerName?: string;
  notes?: string;
  orderCode?: string;
}

/**
 * Genera un código de pedido de 2 dígitos asignado (ej: MG - 00 a MG - 99)
 */
export function generateOrderCode(): string {
  const randomNum = Math.floor(Math.random() * 100);
  return `MG - ${String(randomNum).padStart(2, '0')}`;
}

/**
 * Genera el texto estructurado del pedido para WhatsApp
 */
export function formatWhatsAppMessage(items: CartItem[], customerData?: CustomerOrderData): string {
  if (items.length === 0) return '';

  const totalSandwiches = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);

  const lines: string[] = [];

  lines.push(`🥪 *¡Hola ${STORE_CONFIG.storeName}! Les paso mi pedido:*`);
  lines.push(`----------------------------------------`);

  if (customerData?.customerName?.trim()) {
    const codeSuffix = customerData.orderCode ? ` (${customerData.orderCode})` : '';
    lines.push(`👤 *Cliente:* ${customerData.customerName.trim()}${codeSuffix}`);
  }

  lines.push(`📦 *Pedido (${totalSandwiches} sándwich${totalSandwiches > 1 ? 'es' : ''}):*`);
  lines.push(``);

  items.forEach((item, index) => {
    lines.push(`*${index + 1}) ${item.quantity}x ${item.fiambre.name} + ${item.queso.name}*`);
    
    if (item.aderezos && item.aderezos.length > 0) {
      const aderezosList = item.aderezos.map((a) => a.name).join(', ');
      lines.push(`   - _Aderezos:_ ${aderezosList}`);
    } else {
      lines.push(`   - _Aderezos:_ Sin aderezos`);
    }

    if (item.extras.length > 0) {
      const extrasList = item.extras.map((e) => e.name).join(', ');
      lines.push(`   - _Extras:_ ${extrasList}`);
    } else {
      lines.push(`   - _Extras:_ Sin extras`);
    }

    if (item.quantity > 1) {
      lines.push(`   - _Unitario:_ ${formatCurrency(item.unitPrice)} | _Subtotal:_ ${formatCurrency(item.subtotal)}`);
    } else {
      lines.push(`   - _Precio:_ ${formatCurrency(item.subtotal)}`);
    }
    
    lines.push(``);
  });

  lines.push(`----------------------------------------`);
  lines.push(`💰 *TOTAL: ${formatCurrency(totalPrice)}*`);
  lines.push(`----------------------------------------`);

  if (customerData?.notes?.trim()) {
    lines.push(`📝 *Aclaraciones:* ${customerData.notes.trim()}`);
    lines.push(``);
  }

  lines.push(`_¿Me confirman si recibieron el pedido? ¡Muchas gracias!_`);

  return lines.join('\n');
}

/**
 * Genera la URL completa de WhatsApp con el mensaje codificado
 */
export function generateWhatsAppUrl(
  items: CartItem[],
  customerData?: CustomerOrderData,
  customPhoneNumber?: string
): string {
  const message = formatWhatsAppMessage(items, customerData);
  const rawNumber = customPhoneNumber || STORE_CONFIG.whatsappNumber;
  // Elimina espacios, guiones y signos más para el enlace de WhatsApp
  const sanitizedNumber = rawNumber.replace(/[^0-9]/g, '');

  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${sanitizedNumber}&text=${encodedMessage}`;
}
