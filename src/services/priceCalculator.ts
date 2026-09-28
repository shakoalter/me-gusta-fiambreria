import { FiambreId, QuesoId, Extra, Bebida, CartItem } from '../types/product';
import { SANDWICH_PRICING_MATRIX, EXTRAS_PRICING, BEBIDAS_PRICING } from '../data/pricingMatrix';

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
 * Calcula el precio unitario completo de un sándwich (Base Fiambre+Queso + Extras + Bebidas)
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
