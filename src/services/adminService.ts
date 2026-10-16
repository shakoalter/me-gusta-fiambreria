import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  runTransaction 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { SANDWICH_PRICING_MATRIX, EXTRAS_PRICING, BEBIDAS_PRICING } from '../data/pricingMatrix';
import { DAILY_OFFER_CONFIG, DailyOfferConfig } from '../data/dailyOffer';
import { PricingState, DailyOfferState, AuditLogEntry, AuditActionType } from '../types/admin';
import { FiambreId, QuesoId, ExtraId, BebidaId } from '../types/product';

const LOCAL_STORAGE_PRICING_KEY = 'megusta_custom_pricing_v1';
const LOCAL_STORAGE_DAILY_OFFER_KEY = 'megusta_custom_daily_offer_v1';
const LOCAL_STORAGE_AUDIT_LOGS_KEY = 'megusta_custom_audit_logs_v1';

// Memoria fallback para entornos SSR / Test
const memoryStorage: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      return window.localStorage.getItem(key);
    }
    return memoryStorage[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem(key, value);
    } else {
      memoryStorage[key] = value;
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.removeItem(key);
    } else {
      delete memoryStorage[key];
    }
  },
  clear: (): void => {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.clear();
    }
    Object.keys(memoryStorage).forEach((k) => delete memoryStorage[k]);
  },
};

// Estado local fallback inicial
export const DEFAULT_PRICING_STATE: PricingState = {
  matrix: JSON.parse(JSON.stringify(SANDWICH_PRICING_MATRIX)),
  extras: { ...EXTRAS_PRICING },
  bebidas: { ...BEBIDAS_PRICING },
  outOfStock: [],
  updatedAt: new Date().toISOString(),
  updatedBy: 'sistema-inicial',
};

export const DEFAULT_DAILY_OFFER_STATE: DailyOfferState = {
  ...DAILY_OFFER_CONFIG,
  active: true,
  updatedAt: new Date().toISOString(),
  updatedBy: 'sistema-inicial',
};

// ==========================================
// 1. GESTIÓN DE AUDITORÍA (AUDIT LOGS)
// ==========================================

export async function logAdminAction(
  actionType: AuditActionType,
  description: string,
  adminEmail: string,
  details?: AuditLogEntry['details']
): Promise<void> {
  const newLog: AuditLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    adminEmail,
    actionType,
    description,
    details,
  };

  if (!isFirebaseConfigured || !db) {
    try {
      const stored = safeStorage.getItem(LOCAL_STORAGE_AUDIT_LOGS_KEY);
      const logs: AuditLogEntry[] = stored ? JSON.parse(stored) : [];
      logs.unshift(newLog);
      safeStorage.setItem(LOCAL_STORAGE_AUDIT_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
    } catch (e) {
      console.warn('[Audit] Error guardando log:', e);
    }
    return;
  }

  try {
    const logsRef = collection(db, 'priceAuditLogs');
    await addDoc(logsRef, newLog);
  } catch (err) {
    console.error('[Audit] Error guardando log en Firestore:', err);
  }
}

export async function fetchAuditLogs(limitCount: number = 30): Promise<AuditLogEntry[]> {
  if (!isFirebaseConfigured || !db) {
    try {
      const stored = safeStorage.getItem(LOCAL_STORAGE_AUDIT_LOGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  try {
    const logsRef = collection(db, 'priceAuditLogs');
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as AuditLogEntry[];
  } catch (err) {
    console.warn('[Audit] Error leyendo logs de Firestore, fallback local:', err);
    try {
      const stored = safeStorage.getItem(LOCAL_STORAGE_AUDIT_LOGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

export function getInitialPricingState(): PricingState {
  try {
    const local = safeStorage.getItem(LOCAL_STORAGE_PRICING_KEY);
    if (local) {
      const parsed = JSON.parse(local) as PricingState;
      if (parsed && parsed.matrix && parsed.extras && parsed.bebidas) {
        return parsed;
      }
    }
  } catch {
    // Fallback al estado inicial por defecto
  }
  return DEFAULT_PRICING_STATE;
}

export function getInitialDailyOfferState(): DailyOfferState {
  try {
    const local = safeStorage.getItem(LOCAL_STORAGE_DAILY_OFFER_KEY);
    if (local) {
      const parsed = JSON.parse(local) as DailyOfferState;
      if (parsed && parsed.fiambreId && parsed.quesoId) {
        return parsed;
      }
    }
  } catch {
    // Fallback al estado inicial por defecto
  }
  return DEFAULT_DAILY_OFFER_STATE;
}

// ==========================================
// 2. SUBSCRIPCIONES REACTIVAS A FIRESTORE
// ==========================================

export function subscribeToPricingState(
  onUpdate: (state: PricingState) => void,
  onError?: (error: Error) => void
): () => void {
  if (!isFirebaseConfigured || !db) {
    onUpdate(getInitialPricingState());
    if (typeof window !== 'undefined') {
      const handler = (e: StorageEvent) => {
        if (e.key === LOCAL_STORAGE_PRICING_KEY && e.newValue) {
          try {
            onUpdate(JSON.parse(e.newValue));
          } catch {
            // No-op
          }
        }
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    }
    return () => {};
  }

  const firestoreDb = db;
  const docRef = doc(firestoreDb, 'config', 'pricing');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PricingState;
        try {
          safeStorage.setItem(LOCAL_STORAGE_PRICING_KEY, JSON.stringify(data));
        } catch {
          // Ignorar errores de cuota en storage
        }
        onUpdate(data);
      } else {
        seedInitialPricingData().then(() => {
          onUpdate(DEFAULT_PRICING_STATE);
        });
      }
    },
    (err) => {
      console.warn('[Firestore] Error en suscripción de precios, usando fallback:', err);
      onError?.(err);
      onUpdate(getInitialPricingState());
    }
  );
}

export function subscribeToDailyOfferState(
  onUpdate: (state: DailyOfferState) => void,
  onError?: (error: Error) => void
): () => void {
  if (!isFirebaseConfigured || !db) {
    onUpdate(getInitialDailyOfferState());
    if (typeof window !== 'undefined') {
      const handler = (e: StorageEvent) => {
        if (e.key === LOCAL_STORAGE_DAILY_OFFER_KEY && e.newValue) {
          try {
            onUpdate(JSON.parse(e.newValue));
          } catch {
            // No-op
          }
        }
      };
      window.addEventListener('storage', handler);
      return () => window.removeEventListener('storage', handler);
    }
    return () => {};
  }

  const firestoreDb = db;
  const docRef = doc(firestoreDb, 'config', 'dailyOffer');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as DailyOfferState;
        try {
          safeStorage.setItem(LOCAL_STORAGE_DAILY_OFFER_KEY, JSON.stringify(data));
        } catch {
          // Ignorar errores de cuota en storage
        }
        onUpdate(data);
      } else {
        seedInitialDailyOfferData().then(() => {
          onUpdate(DEFAULT_DAILY_OFFER_STATE);
        });
      }
    },
    (err) => {
      console.warn('[Firestore] Error en suscripción de oferta diaria, usando fallback:', err);
      onError?.(err);
      onUpdate(getInitialDailyOfferState());
    }
  );
}

// ==========================================
// 3. ACTUALIZACIONES DE PRECIOS Y OFERTAS
// ==========================================

export async function savePricingState(
  newState: PricingState,
  adminEmail: string,
  actionType: AuditActionType = 'SINGLE_PRICE_UPDATE',
  description: string = 'Actualización de precios',
  details?: AuditLogEntry['details']
): Promise<void> {
  const payload: PricingState = {
    ...newState,
    updatedAt: new Date().toISOString(),
    updatedBy: adminEmail,
  };

  try {
    safeStorage.setItem(LOCAL_STORAGE_PRICING_KEY, JSON.stringify(payload));
  } catch {
    // Ignorar error de cuota
  }

  if (!isFirebaseConfigured || !db) {
    await logAdminAction(actionType, description, adminEmail, details);
    return;
  }

  const docRef = doc(db, 'config', 'pricing');
  await setDoc(docRef, payload, { merge: true });
  await logAdminAction(actionType, description, adminEmail, details);
}

export async function updateDailyOffer(
  newOffer: Partial<DailyOfferConfig> & { active?: boolean },
  adminEmail: string
): Promise<void> {
  const currentOffer = await getCurrentDailyOffer();
  const payload: DailyOfferState = {
    ...currentOffer,
    ...newOffer,
    updatedAt: new Date().toISOString(),
    updatedBy: adminEmail,
  };

  try {
    safeStorage.setItem(LOCAL_STORAGE_DAILY_OFFER_KEY, JSON.stringify(payload));
  } catch {
    // Ignorar error de cuota
  }

  if (!isFirebaseConfigured || !db) {
    await logAdminAction(
      'DAILY_OFFER_UPDATE',
      `Oferta del día actualizada: ${payload.title} (${Math.round(payload.discountPercentage * 100)}% OFF)`,
      adminEmail
    );
    return;
  }

  const docRef = doc(db, 'config', 'dailyOffer');
  await setDoc(docRef, payload, { merge: true });
  await logAdminAction(
    'DAILY_OFFER_UPDATE',
    `Oferta del día actualizada: ${payload.title} (${Math.round(payload.discountPercentage * 100)}% OFF)`,
    adminEmail
  );
}

/**
 * Aplica un aumento global en pesos (+$X) a los sándwiches, extras y/o bebidas de forma atómica.
 */
export async function applyGlobalPriceIncrease(
  amount: number,
  targetScope: 'sandwiches' | 'extras' | 'bebidas' | 'all',
  adminEmail: string
): Promise<PricingState> {
  if (amount <= 0) {
    throw new Error('El monto de aumento debe ser mayor a 0 pesos.');
  }

  if (!isFirebaseConfigured || !db) {
    const current = await getCurrentPricing();
    const updated: PricingState = JSON.parse(JSON.stringify(current));
    let changedCount = 0;

    if (targetScope === 'sandwiches' || targetScope === 'all') {
      Object.keys(updated.matrix).forEach((fiambreKey) => {
        const fiambre = fiambreKey as FiambreId;
        Object.keys(updated.matrix[fiambre]).forEach((quesoKey) => {
          const queso = quesoKey as QuesoId;
          updated.matrix[fiambre][queso] += amount;
          changedCount++;
        });
      });
    }

    if (targetScope === 'extras' || targetScope === 'all') {
      Object.keys(updated.extras).forEach((extraKey) => {
        const extra = extraKey as ExtraId;
        updated.extras[extra] += amount;
        changedCount++;
      });
    }

    if (targetScope === 'bebidas' || targetScope === 'all') {
      Object.keys(updated.bebidas).forEach((bebidaKey) => {
        const bebida = bebidaKey as BebidaId;
        updated.bebidas[bebida] += amount;
        changedCount++;
      });
    }

    updated.updatedAt = new Date().toISOString();
    updated.updatedBy = adminEmail;

    safeStorage.setItem(LOCAL_STORAGE_PRICING_KEY, JSON.stringify(updated));
    await logAdminAction(
      'GLOBAL_INCREASE',
      `Aumento global de +$${amount.toLocaleString('es-AR')} aplicado a: ${targetScope} (${changedCount} items modificados)`,
      adminEmail,
      { amountAdded: amount, targetScope, changedItemsCount: changedCount }
    );

    return updated;
  }

  const firestoreDb = db;
  const docRef = doc(firestoreDb, 'config', 'pricing');
  const result = await runTransaction(firestoreDb, async (transaction) => {
    const docSnap = await transaction.get(docRef);
    const current: PricingState = docSnap.exists()
      ? (docSnap.data() as PricingState)
      : getInitialPricingState();

    const updated: PricingState = JSON.parse(JSON.stringify(current));
    let changedCount = 0;

    if (targetScope === 'sandwiches' || targetScope === 'all') {
      Object.keys(updated.matrix).forEach((fiambreKey) => {
        const fiambre = fiambreKey as FiambreId;
        Object.keys(updated.matrix[fiambre]).forEach((quesoKey) => {
          const queso = quesoKey as QuesoId;
          updated.matrix[fiambre][queso] += amount;
          changedCount++;
        });
      });
    }

    if (targetScope === 'extras' || targetScope === 'all') {
      Object.keys(updated.extras).forEach((extraKey) => {
        const extra = extraKey as ExtraId;
        updated.extras[extra] += amount;
        changedCount++;
      });
    }

    if (targetScope === 'bebidas' || targetScope === 'all') {
      Object.keys(updated.bebidas).forEach((bebidaKey) => {
        const bebida = bebidaKey as BebidaId;
        updated.bebidas[bebida] += amount;
        changedCount++;
      });
    }

    updated.updatedAt = new Date().toISOString();
    updated.updatedBy = adminEmail;

    transaction.set(docRef, updated);

    const logsRef = collection(firestoreDb, 'priceAuditLogs');
    const newLogRef = doc(logsRef);
    transaction.set(newLogRef, {
      id: newLogRef.id,
      timestamp: new Date().toISOString(),
      adminEmail,
      actionType: 'GLOBAL_INCREASE',
      description: `Aumento global de +$${amount.toLocaleString('es-AR')} aplicado a: ${targetScope} (${changedCount} items modificados)`,
      details: {
        amountAdded: amount,
        targetScope,
        changedItemsCount: changedCount,
      },
    });

    return updated;
  });

  try {
    safeStorage.setItem(LOCAL_STORAGE_PRICING_KEY, JSON.stringify(result));
  } catch {
    // Ignorar error de cuota
  }

  return result;
}

// ==========================================
// 4. HELPERS DE LECTURA Y SEED
// ==========================================

export async function getCurrentPricing(): Promise<PricingState> {
  if (!isFirebaseConfigured || !db) {
    return getInitialPricingState();
  }

  try {
    const docRef = doc(db, 'config', 'pricing');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as PricingState;
      try {
        safeStorage.setItem(LOCAL_STORAGE_PRICING_KEY, JSON.stringify(data));
      } catch {
        // Ignorar error de cuota
      }
      return data;
    }
  } catch (e) {
    console.warn('[Pricing] Error al leer pricing de Firestore:', e);
  }
  return getInitialPricingState();
}

export async function getCurrentDailyOffer(): Promise<DailyOfferState> {
  if (!isFirebaseConfigured || !db) {
    return getInitialDailyOfferState();
  }

  try {
    const docRef = doc(db, 'config', 'dailyOffer');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as DailyOfferState;
      try {
        safeStorage.setItem(LOCAL_STORAGE_DAILY_OFFER_KEY, JSON.stringify(data));
      } catch {
        // Ignorar error de cuota
      }
      return data;
    }
  } catch (e) {
    console.warn('[DailyOffer] Error al leer dailyOffer de Firestore:', e);
  }
  return getInitialDailyOfferState();
}

export async function seedInitialPricingData(): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    const docRef = doc(db, 'config', 'pricing');
    await setDoc(docRef, DEFAULT_PRICING_STATE);
  } catch (e) {
    console.warn('[Seed] Error al inicializar pricing en Firestore:', e);
  }
}

export async function seedInitialDailyOfferData(): Promise<void> {
  if (!isFirebaseConfigured || !db) return;
  try {
    const docRef = doc(db, 'config', 'dailyOffer');
    await setDoc(docRef, DEFAULT_DAILY_OFFER_STATE);
  } catch (e) {
    console.warn('[Seed] Error al inicializar dailyOffer en Firestore:', e);
  }
}
