import { FiambreId, QuesoId, Extra, ExtraId, Bebida, BebidaId, CartItem } from '../types/product';
import { SANDWICH_PRICING_MATRIX, EXTRAS_PRICING, BEBIDAS_PRICING } from '../data/pricingMatrix';
import { PricingState } from '../types/admin';

/**
 * Redondea un importe hacia arriba al múltiplo de $100 más cercano (función techo / ceil).
 * Ejemplos: 3960 -> 4000, 3110 -> 3200, 4000 -> 4000, 6300 -> 6300.
 */
export function roundUpToNearestHundred(amount: number): number {
  return Math.ceil(amount / 100) * 100;
}

/**
 * Obtiene el precio base exacto de la combinación Fiambre + Queso
 */
export function getBaseSandwichPrice(
  fiambreId: FiambreId, 
  quesoId: QuesoId,
  customMatrix?: Record<FiambreId, Record<QuesoId, number>>
): number {
  const matrix = customMatrix || SANDWICH_PRICING_MATRIX;
  const fiambreRow = matrix[fiambreId];
  if (!fiambreRow) {
    const fallbackRow = SANDWICH_PRICING_MATRIX[fiambreId];
    if (fallbackRow && typeof fallbackRow[quesoId] === 'number') {
      return fallbackRow[quesoId];
    }
    throw new Error(`Fiambre con id '${fiambreId}' no encontrado en la matriz de precios.`);
  }

  const price = fiambreRow[quesoId];
  if (typeof price !== 'number') {
    const fallbackPrice = SANDWICH_PRICING_MATRIX[fiambreId]?.[quesoId];
    if (typeof fallbackPrice === 'number') {
      return fallbackPrice;
    }
    throw new Error(`Combinación de precios no encontrada para fiambre '${fiambreId}' y queso '${quesoId}'.`);
  }

  return price;
}

/**
 * Calcula la suma total de los extras seleccionados
 */
export function calculateExtrasTotal(
  extras: Extra[],
  customExtrasPricing?: Record<ExtraId, number>
): number {
  const pricing = customExtrasPricing || EXTRAS_PRICING;
  return extras.reduce((sum, extra) => {
    const price = pricing[extra.id as ExtraId] ?? EXTRAS_PRICING[extra.id as ExtraId] ?? extra.price ?? 0;
    return sum + price;
  }, 0);
}

/**
 * Calcula la suma total de las bebidas seleccionadas
 */
export function calculateBebidasTotal(
  bebidas?: Bebida[],
  customBebidasPricing?: Record<BebidaId, number>
): number {
  if (!bebidas || bebidas.length === 0) return 0;
  const pricing = customBebidasPricing || BEBIDAS_PRICING;
  return bebidas.reduce((sum, bebida) => {
    const price = pricing[bebida.id as BebidaId] ?? BEBIDAS_PRICING[bebida.id as BebidaId] ?? bebida.price ?? 0;
    return sum + price;
  }, 0);
}

/**
 * Calcula el precio unitario completo de un sándwich regular (Base Fiambre+Queso + Extras + Bebidas)
 */
export function calculateSandwichUnitPrice(
  fiambreId: FiambreId,
  quesoId: QuesoId,
  extras: Extra[],
  bebidas?: Bebida[],
  customPricing?: PricingState
): number {
  const basePrice = getBaseSandwichPrice(fiambreId, quesoId, customPricing?.matrix);
  const extrasPrice = calculateExtrasTotal(extras, customPricing?.extras);
  const bebidasPrice = calculateBebidasTotal(bebidas, customPricing?.bebidas);
  return basePrice + extrasPrice + bebidasPrice;
}

/**
 * Calcula el precio unitario de un sándwich de oferta con su bebida incluida
 */
export function calculateDailyOfferPrice(
  fiambreId: FiambreId,
  quesoId: QuesoId,
  bebidaId?: BebidaId,
  extras: Extra[] = [],
  discountPercentage: number = 0.10,
  customPricing?: PricingState
): {
  originalBasePrice: number;
  discountedBasePrice: number;
  extrasTotal: number;
  unitPrice: number;
  discountSavings: number;
} {
  const sandwichBase = getBaseSandwichPrice(fiambreId, quesoId, customPricing?.matrix);
  const bebidasPricing = customPricing?.bebidas || BEBIDAS_PRICING;
  const bebidaPrice = bebidaId ? (bebidasPricing[bebidaId] ?? BEBIDAS_PRICING[bebidaId] ?? 0) : 0;
  const originalBasePrice = sandwichBase + bebidaPrice;

  // Descuento porcentual
  const rawDiscounted = originalBasePrice * (1 - discountPercentage);

  // Redondeo hacia arriba al múltiplo de $100 más cercano
  const discountedBasePrice = roundUpToNearestHundred(rawDiscounted);

  // Extras a precio regular completo sin descuento
  const extrasTotal = calculateExtrasTotal(extras, customPricing?.extras);

  const unitPrice = discountedBasePrice + extrasTotal;
  const discountSavings = Math.max(0, originalBasePrice - discountedBasePrice);

  return {
    originalBasePrice,
    discountedBasePrice,
    extrasTotal,
    unitPrice,
    discountSavings,
  };
}

/**
 * Calcula el subtotal para una cantidad dada de sándwiches
 */
export function calculateSandwichSubtotal(
  unitPrice: number,
  quantity: number
): number {
  return unitPrice * Math.max(1, quantity);
}

/**
 * Calcula el total acumulado y la cantidad de sándwiches de un carrito
 */
export function calculateCartTotals(items: CartItem[]): { totalPrice: number; totalQuantity: number } {
  return items.reduce(
    (acc, item) => {
      acc.totalQuantity += item.quantity;
      acc.totalPrice += item.subtotal;
      return acc;
    },
    { totalPrice: 0, totalQuantity: 0 }
  );
}
