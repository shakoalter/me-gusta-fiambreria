import { CartItem } from '../types/product';
import { STORE_CONFIG } from '../config/storeConfig';
import { formatCurrency } from '../utils/formatters';

export interface CustomerOrderData {
  customerName?: string;
  notes?: string;
  orderCode?: string;
}

export const DAILY_ORDER_TRACKER_KEY = 'megusta_daily_order_tracker_v1';

export interface DailyOrderTracker {
  date: string;
  lastNumber: number;
}

/**
 * Obtiene la fecha local en formato YYYY-MM-DD
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

let memoryTracker: DailyOrderTracker | null = null;

/**
 * Obtiene el código de pedido diario registrado o genera el siguiente.
 * Si cambió el día, reinicia automáticamente el contador a 01.
 */
export function getDailyOrderCode(advance = false, customDate?: string): string {
  const today = customDate || getLocalDateString();
  let tracker: DailyOrderTracker = { date: today, lastNumber: 1 };

  const hasLocalStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

  try {
    if (hasLocalStorage) {
      const raw = window.localStorage.getItem(DAILY_ORDER_TRACKER_KEY);
      if (raw) {
        const parsed: DailyOrderTracker = JSON.parse(raw);
        if (parsed && parsed.date === today && typeof parsed.lastNumber === 'number') {
          tracker = {
            date: today,
            lastNumber: advance ? parsed.lastNumber + 1 : parsed.lastNumber,
          };
        } else {
          // Si es un día distinto, se reinicia la cuenta a 1
          tracker = { date: today, lastNumber: 1 };
        }
      }
    } else if (memoryTracker) {
      if (memoryTracker.date === today) {
        tracker = {
          date: today,
          lastNumber: advance ? memoryTracker.lastNumber + 1 : memoryTracker.lastNumber,
        };
      } else {
        tracker = { date: today, lastNumber: 1 };
      }
    }
  } catch {
    tracker = { date: today, lastNumber: 1 };
  }

  memoryTracker = tracker;

  if (hasLocalStorage) {
    try {
      window.localStorage.setItem(DAILY_ORDER_TRACKER_KEY, JSON.stringify(tracker));
    } catch {
      // Ignorar excepciones de cuota de almacenamiento
    }
  }

  const formattedNum = tracker.lastNumber < 100
    ? String(tracker.lastNumber).padStart(2, '0')
    : String(tracker.lastNumber);

  return `MG - ${formattedNum}`;
}

/**
 * Avanza y registra el siguiente número para el próximo pedido del día
 */
export function advanceToNextDailyOrderCode(): string {
  return getDailyOrderCode(true);
}

/**
 * Función para reiniciar el tracker (útil para pruebas y limpiezas)
 */
export function resetDailyOrderTracker(): void {
  memoryTracker = null;
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    try {
      window.localStorage.removeItem(DAILY_ORDER_TRACKER_KEY);
    } catch {
      // ignore
    }
  }
}

/**
 * Función compatible con el resto del sistema
 */
export function generateOrderCode(): string {
  return getDailyOrderCode(false);
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
