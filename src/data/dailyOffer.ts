import { Fiambre, Queso, Bebida, Extra, Aderezo, FiambreId, QuesoId, BebidaId } from '../types/product';
import { FIAMBRES_DATA } from './fiambres';
import { QUESOS_DATA } from './quesos';
import { BEBIDAS_DATA } from './bebidas';
import { EXTRAS_DATA } from './extras';
import { ADEREZOS_DATA } from './aderezos';

export interface DailyOfferConfig {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  fiambreId: FiambreId;
  quesoId: QuesoId;
  defaultBebidaId: BebidaId;
  // Porcentaje de descuento aplicado al combo base (ej: 0.10 = 10% OFF)
  discountPercentage: number;
}

export const DAILY_OFFER_CONFIG: DailyOfferConfig = {
  id: 'promo-del-dia',
  badge: 'OFERTA DEL DÍA',
  title: 'Sándwich de salame + queso + bebida 500/600cc',
  subtitle: 'Sándwich de Salame + Queso + Bebida 500/600cc',
  description: 'El clásico de siempre, con el mejor fiambre y queso artesanal. ¡Incluye una bebida de 500/600cc a elección!',
  image: '/images/hero-sandwich.jpg',
  fiambreId: 'salame',
  quesoId: 'queso-clasico',
  defaultBebidaId: 'coca-cola-600',
  discountPercentage: 0.10,
};

/**
 * Obtiene el fiambre base de la oferta del día
 */
export function getDailyOfferFiambre(): Fiambre {
  const fiambre = FIAMBRES_DATA.find((f) => f.id === DAILY_OFFER_CONFIG.fiambreId);
  return fiambre || FIAMBRES_DATA[0];
}

/**
 * Obtiene el queso base de la oferta del día
 */
export function getDailyOfferQueso(): Queso {
  const queso = QUESOS_DATA.find((q) => q.id === DAILY_OFFER_CONFIG.quesoId);
  return queso || QUESOS_DATA[0];
}

/**
 * Lista de bebidas individuales (500cc / 600cc / lata) aplicables para la oferta
 */
export function getDailyOfferBebidas(): Bebida[] {
  return BEBIDAS_DATA.filter((b) => b.category === 'Individuales' || b.category === 'Aguas & Isotónicas');
}

/**
 * Lista de extras disponibles
 */
export function getDailyOfferExtras(): Extra[] {
  return EXTRAS_DATA;
}

/**
 * Lista de aderezos disponibles
 */
export function getDailyOfferAderezos(): Aderezo[] {
  return ADEREZOS_DATA;
}
