import { describe, it, expect } from 'vitest';
import {
  getBaseSandwichPrice,
  calculateSandwichUnitPrice,
  calculateSandwichSubtotal,
  calculateCartTotals,
  roundUpToNearestHundred,
  calculateDailyOfferPrice,
} from '../priceCalculator';
import { FIAMBRES_DATA } from '../../data/fiambres';
import { QUESOS_DATA } from '../../data/quesos';
import { EXTRAS_DATA } from '../../data/extras';
import { BEBIDAS_DATA } from '../../data/bebidas';
import { CartItem } from '../../types/product';

describe('PriceCalculator Service', () => {
  it('debe calcular correctamente un sándwich con Bebida sumada', () => {
    const jamonCocido = FIAMBRES_DATA.find((f) => f.id === 'jamon-cocido')!;
    const quesoClasico = QUESOS_DATA.find((q) => q.id === 'queso-clasico')!;
    const coca600 = BEBIDAS_DATA.find((b) => b.id === 'coca-cola-600')!;

    // Base $4200 + Coca 600cc $2600 = $6800
    const unitPrice = calculateSandwichUnitPrice(jamonCocido.id, quesoClasico.id, [], [coca600]);
    expect(unitPrice).toBe(6800);

    const subtotal = calculateSandwichSubtotal(unitPrice, 2);
    expect(subtotal).toBe(13600);
  });

  it('debe tener precios válidos para las 128 combinaciones posibles (16 fiambres x 8 quesos)', () => {
    expect(FIAMBRES_DATA).toHaveLength(16);
    expect(QUESOS_DATA).toHaveLength(8);

    FIAMBRES_DATA.forEach((fiambre) => {
      QUESOS_DATA.forEach((queso) => {
        const price = getBaseSandwichPrice(fiambre.id, queso.id);
        expect(typeof price).toBe('number');
        expect(price).toBeGreaterThan(0);
      });
    });
  });

  it('debe calcular correctamente los precios base exactos del volante', () => {
    // Jamón Cocido
    expect(getBaseSandwichPrice('jamon-cocido', 'queso-clasico')).toBe(4200);
    expect(getBaseSandwichPrice('jamon-cocido', 'queso-pesto')).toBe(5200);
    expect(getBaseSandwichPrice('jamon-cocido', 'cheddar')).toBe(5000);
    expect(getBaseSandwichPrice('jamon-cocido', 'queso-aji')).toBe(4700);

    // Jamón Crudo
    expect(getBaseSandwichPrice('jamon-crudo', 'queso-clasico')).toBe(6700);
    expect(getBaseSandwichPrice('jamon-crudo', 'queso-ahumado')).toBe(7700);
    expect(getBaseSandwichPrice('jamon-crudo', 'fiambrin')).toBe(7500);
    expect(getBaseSandwichPrice('jamon-crudo', 'queso-albahaca')).toBe(7200);

    // Salchichón Primavera
    expect(getBaseSandwichPrice('salchichon-primavera', 'queso-clasico')).toBe(3400);
    expect(getBaseSandwichPrice('salchichon-primavera', 'queso-pesto')).toBe(4400);
  });

  it('debe calcular el caso testigo del requerimiento: (Mortadela + Queso Pesto + Tomate) x 3 = $17.100', () => {
    const mortadela = FIAMBRES_DATA.find((f) => f.id === 'mortadela')!;
    const quesoPesto = QUESOS_DATA.find((q) => q.id === 'queso-pesto')!;
    const tomate = EXTRAS_DATA.find((e) => e.id === 'tomate')!;

    const basePrice = getBaseSandwichPrice(mortadela.id, quesoPesto.id);
    expect(basePrice).toBe(4900);

    const unitPrice = calculateSandwichUnitPrice(mortadela.id, quesoPesto.id, [tomate]);
    expect(unitPrice).toBe(4900 + 800); // 5700

    const subtotal = calculateSandwichSubtotal(unitPrice, 3);
    expect(subtotal).toBe(17100);
  });

  it('debe calcular el total acumulado del carrito del ejemplo oficial: Total $21.100', () => {
    const mortadela = FIAMBRES_DATA.find((f) => f.id === 'mortadela')!;
    const quesoPesto = QUESOS_DATA.find((q) => q.id === 'queso-pesto')!;
    const tomate = EXTRAS_DATA.find((e) => e.id === 'tomate')!;
    const aceitunas = EXTRAS_DATA.find((e) => e.id === 'aceitunas')!;

    const jamonCrudo = FIAMBRES_DATA.find((f) => f.id === 'jamon-crudo')!;
    const quesoAhumado = QUESOS_DATA.find((q) => q.id === 'queso-ahumado')!;

    // Item 1: 2 x Mortadela + Queso Pesto con Tomate y Aceitunas ($4900 + $800 + $1000 = $6700 * 2 = $13400)
    const unitPrice1 = calculateSandwichUnitPrice(mortadela.id, quesoPesto.id, [tomate, aceitunas]);
    expect(unitPrice1).toBe(6700);
    const subtotal1 = calculateSandwichSubtotal(unitPrice1, 2);
    expect(subtotal1).toBe(13400);

    const item1: CartItem = {
      id: 'item-1',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [tomate, aceitunas],
      quantity: 2,
      unitPrice: unitPrice1,
      subtotal: subtotal1,
    };

    // Item 2: 1 x Jamón Crudo + Queso Ahumado ($7700)
    const unitPrice2 = calculateSandwichUnitPrice(jamonCrudo.id, quesoAhumado.id, []);
    expect(unitPrice2).toBe(7700);
    const subtotal2 = calculateSandwichSubtotal(unitPrice2, 1);
    expect(subtotal2).toBe(7700);

    const item2: CartItem = {
      id: 'item-2',
      fiambre: jamonCrudo,
      queso: quesoAhumado,
      extras: [],
      quantity: 1,
      unitPrice: unitPrice2,
      subtotal: subtotal2,
    };

    const totals = calculateCartTotals([item1, item2]);
    expect(totals.totalQuantity).toBe(3);
    expect(totals.totalPrice).toBe(21100);
  });

  describe('Redondeo hacia arriba a múltiplos de $100 (ceil)', () => {
    it('debe redondear números no redondos hacia el siguiente múltiplo de $100', () => {
      // Casos explícitos del requerimiento
      expect(roundUpToNearestHundred(3960)).toBe(4000);
      expect(roundUpToNearestHundred(3110)).toBe(3200);
      expect(roundUpToNearestHundred(5490)).toBe(5500);
      expect(roundUpToNearestHundred(5220)).toBe(5300);
    });

    it('debe mantener intactos los valores que ya son múltiplos de $100', () => {
      expect(roundUpToNearestHundred(4000)).toBe(4000);
      expect(roundUpToNearestHundred(6300)).toBe(6300);
      expect(roundUpToNearestHundred(7000)).toBe(7000);
    });
  });

  describe('Cálculo de Oferta del Día (Sándwich + Bebida -10% OFF + Redondeo + Extras sin descuento)', () => {
    it('debe calcular correctamente el combo del día Salame + Queso Clásico + Coca 600cc ($7000 - 10% = $6300)', () => {
      // Salame $4400 + Coca 600cc $2600 = $7000 -> 10% OFF = $6300
      const result = calculateDailyOfferPrice('salame', 'queso-clasico', 'coca-cola-600', []);
      expect(result.originalBasePrice).toBe(7000);
      expect(result.discountedBasePrice).toBe(6300);
      expect(result.unitPrice).toBe(6300);
      expect(result.discountSavings).toBe(700);
    });

    it('debe aplicar redondeo ceil a $100 cuando el 10% de descuento no resulte en múltiplo de $100', () => {
      // Mortadela + Queso Clásico ($3900) + Agua Benedictino 500 ($1900) = $5800
      // 10% OFF = $5220 -> ceil($100) = $5300
      const result = calculateDailyOfferPrice('mortadela', 'queso-clasico', 'agua-benedictino-500', []);
      expect(result.originalBasePrice).toBe(5800);
      expect(result.discountedBasePrice).toBe(5300);
      expect(result.unitPrice).toBe(5300);
      expect(result.discountSavings).toBe(500);
    });

    it('debe sumar los extras a precio completo sin aplicarles descuento', () => {
      const tomate = EXTRAS_DATA.find((e) => e.id === 'tomate')!; // $800
      const aceitunas = EXTRAS_DATA.find((e) => e.id === 'aceitunas')!; // $1000

      // Combo base Salame + Queso Clásico + Coca 600 = $6300 promo + $800 tomate + $1000 aceitunas = $8100
      const result = calculateDailyOfferPrice('salame', 'queso-clasico', 'coca-cola-600', [tomate, aceitunas]);
      expect(result.originalBasePrice).toBe(7000);
      expect(result.discountedBasePrice).toBe(6300);
      expect(result.extrasTotal).toBe(1800);
      expect(result.unitPrice).toBe(8100);
    });
  });
});

