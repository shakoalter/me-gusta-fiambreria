import { FiambreId, QuesoId, Extra, Bebida, BebidaId, CartItem } from '../types/product';
import { SANDWICH_PRICING_MATRIX, EXTRAS_PRICING, BEBIDAS_PRICING } from '../data/pricingMatrix';

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
export function getBaseSandwichPrice(fiambreId: FiambreId, quesoId: QuesoId): number {
  const fiambreRow = SANDWICH_PRICING_MATRIX[fiambreId];
  if (!fiambreRow) {
    throw new Error(`Fiambre con id '${fiambreId}' no encontrado en la matriz de precios.`);
  }

  const price = fiambreRow[quesoId];
  if (typeof price !== 'number') {
    throw new Error(`Combinación de precios no encontrada para fiambre '${fiambreId}' y queso '${quesoId}'.`);
  }

  return price;
}

/**
 * Calcula la suma total de los extras seleccionados
 */
export function calculateExtrasTotal(extras: Extra[]): number {
  return extras.reduce((sum, extra) => {
    const price = EXTRAS_PRICING[extra.id] ?? extra.price ?? 0;
    return sum + price;
  }, 0);
}

/**
 * Calcula la suma total de las bebidas seleccionadas
 */
export function calculateBebidasTotal(bebidas?: Bebida[]): number {
  if (!bebidas || bebidas.length === 0) return 0;
  return bebidas.reduce((sum, bebida) => {
    const price = BEBIDAS_PRICING[bebida.id] ?? bebida.price ?? 0;
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
  bebidas?: Bebida[]
): number {
  const basePrice = getBaseSandwichPrice(fiambreId, quesoId);
  const extrasPrice = calculateExtrasTotal(extras);
  const bebidasPrice = calculateBebidasTotal(bebidas);
  return basePrice + extrasPrice + bebidasPrice;
}

/**
 * Calcula el precio unitario de un sándwich de oferta con su bebida incluida:
 * - Subtotal base = Precio Sándwich (Fiambre + Queso) + Precio Bebida
 * - Descuento del 10% sobre la base
 * - Redondeo hacia arriba al múltiplo de $100 más cercano (ceil) para facilitar cambio
 * - Extras sumados a precio regular completo (sin descuento)
 */
export function calculateDailyOfferPrice(
  fiambreId: FiambreId,
  quesoId: QuesoId,
  bebidaId?: BebidaId,
  extras: Extra[] = [],
  discountPercentage: number = 0.10
): {
  originalBasePrice: number;
  discountedBasePrice: number;
  extrasTotal: number;
  unitPrice: number;
  discountSavings: number;
} {
  const sandwichBase = getBaseSandwichPrice(fiambreId, quesoId);
  const bebidaPrice = bebidaId ? (BEBIDAS_PRICING[bebidaId] ?? 0) : 0;
  const originalBasePrice = sandwichBase + bebidaPrice;

  // Descuento porcentual (10% por defecto)
  const rawDiscounted = originalBasePrice * (1 - discountPercentage);

  // Redondeo hacia arriba al múltiplo de $100 más cercano
  const discountedBasePrice = roundUpToNearestHundred(rawDiscounted);

  // Extras a precio regular completo sin descuento
  const extrasTotal = calculateExtrasTotal(extras);

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

