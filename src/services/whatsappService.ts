import { doc, runTransaction, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
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

export function formatOrderNumber(num: number): string {
  const formattedNum = num < 100 ? String(num).padStart(2, '0') : String(num);
  return `MG - ${formattedNum}`;
}

/**
 * Reserva y obtiene de forma ATÓMICA en Firestore el siguiente número de pedido global del día.
 * Si dos personas envían al mismo tiempo, garantiza números consecutivos sin duplicados.
 * En caso de falla de red o Firebase no disponible, recurre a un fallback seguro.
 */
export async function claimNextGlobalOrderCode(customDate?: string): Promise<string> {
  const today = customDate || getLocalDateString();

  if (isFirebaseConfigured && db) {
    try {
      const firestoreDb = db;
      const counterRef = doc(firestoreDb, 'orderCounters', today);

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore timeout')), 1500)
      );

      const transactionPromise = runTransaction(firestoreDb, async (transaction) => {
        const docSnap = await transaction.get(counterRef);

        if (!docSnap.exists()) {
          transaction.set(counterRef, {
            date: today,
            count: 1,
            lastOrderAt: new Date().toISOString(),
          });
          return 1;
        }

        const currentData = docSnap.data();
        const currentCount = typeof currentData?.count === 'number' ? currentData.count : 0;
        const newCount = currentCount + 1;

        transaction.update(counterRef, {
          count: newCount,
          lastOrderAt: new Date().toISOString(),
        });

        return newCount;
      });

      const nextNumber = await Promise.race([transactionPromise, timeoutPromise]);
      return formatOrderNumber(nextNumber);
    } catch (error) {
      console.warn('[Firestore] Error o timeout en transacción de contador diario, usando fallback:', error);
    }
  }

  // Fallback si no hay conexión, timeout o no está configurado Firebase
  return advanceToNextDailyOrderCode();
}

/**
 * Se suscribe en TIEMPO REAL al contador del día para mostrar el próximo número esperado.
 */
export function subscribeToDailyOrderCounter(
  onUpdate: (previewCode: string) => void,
  customDate?: string
): () => void {
  const today = customDate || getLocalDateString();

  if (!isFirebaseConfigured || !db) {
    onUpdate(getDailyOrderCode(false, today));
    return () => {};
  }

  try {
    const firestoreDb = db;
    const counterRef = doc(firestoreDb, 'orderCounters', today);

    return onSnapshot(
      counterRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const currentCount = typeof data?.count === 'number' ? data.count : 0;
          const nextExpected = currentCount + 1;
          onUpdate(formatOrderNumber(nextExpected));
        } else {
          // El día recién comienza
          onUpdate('MG - 01');
        }
      },
      (error) => {
        console.warn('[Firestore] Error escuchando contador diario:', error);
        onUpdate(getDailyOrderCode(false, today));
      }
    );
  } catch (error) {
    console.warn('[Firestore] Fallo al iniciar suscripción de contador:', error);
    onUpdate(getDailyOrderCode(false, today));
    return () => {};
  }
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
  } else if (customerData?.orderCode) {
    lines.push(`🔖 *Pedido:* ${customerData.orderCode}`);
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

    if (item.bebidas && item.bebidas.length > 0) {
      const bebidasList = item.bebidas.map((b) => `${b.name} (${b.volume})`).join(', ');
      lines.push(`   - _Bebidas:_ ${bebidasList}`);
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

/**
 * Abre la URL de WhatsApp de manera universal y segura en cualquier dispositivo
 * (iOS Safari, Android Chrome, navegadores in-app como Instagram/Facebook/TikTok, y Desktop).
 * 
 * Evita el bloqueo silencioso de 'Popup Blockers' que ocurre con window.open()
 * después de operaciones asíncronas (como la reserva del número en Firebase).
 */
export function openWhatsAppUrl(url: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const userAgent = navigator.userAgent || '';
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
      ('ontouchstart' in window && window.innerWidth <= 1024);

    if (isMobile) {
      // En dispositivos móviles y WebViews in-app, window.location.href dispara
      // el enlace universal directo a la aplicación instalada de WhatsApp
      // y nunca es interceptado por bloqueadores de ventanas emergentes.
      window.location.href = url;
      return true;
    }

    // En computadoras de escritorio intentamos abrir una nueva pestaña
    const openedWindow = window.open(url, '_blank', 'noopener,noreferrer');

    // Si el navegador bloqueó la ventana emergente (openedWindow es null o bloqueado),
    // realizamos fallback a window.location.href para garantizar que el pedido salga.
    if (!openedWindow || openedWindow.closed || typeof openedWindow.closed === 'undefined') {
      window.location.href = url;
    }
    return true;
  } catch (error) {
    console.warn('[WhatsApp] Fallback a redirección directa tras error:', error);
    window.location.href = url;
    return true;
  }
}

