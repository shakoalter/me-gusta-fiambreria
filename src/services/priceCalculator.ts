import { FiambreId, QuesoId, Extra, CartItem } from '../types/product';
import { SANDWICH_PRICING_MATRIX, EXTRAS_PRICING } from '../data/pricingMatrix';

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
 * Calcula el precio unitario completo de un sándwich (Base Fiambre+Queso + Extras)
 */
export function calculateSandwichUnitPrice(
  fiambreId: FiambreId,
  quesoId: QuesoId,
  extras: Extra[]
): number {
  const basePrice = getBaseSandwichPrice(fiambreId, quesoId);
  const extrasPrice = calculateExtrasTotal(extras);
  return basePrice + extrasPrice;
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
