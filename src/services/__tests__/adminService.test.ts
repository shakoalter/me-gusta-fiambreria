import { describe, it, expect, beforeEach } from 'vitest';
import {
  applyGlobalPriceIncrease,
  updateDailyOffer,
  fetchAuditLogs,
  getCurrentPricing,
  getCurrentDailyOffer,
  DEFAULT_PRICING_STATE,
  safeStorage,
} from '../adminService';
import {
  calculateSandwichUnitPrice,
  calculateDailyOfferPrice,
  getBaseSandwichPrice,
} from '../priceCalculator';
import { PricingState } from '../../types/admin';

describe('Admin Service & Dynamic Pricing', () => {
  beforeEach(() => {
    safeStorage.clear();
  });

  it('debe obtener el estado de precios inicial por defecto', async () => {
    const pricing = await getCurrentPricing();
    expect(pricing.matrix['jamon-cocido']['queso-clasico']).toBe(4200);
    expect(pricing.extras['aceitunas']).toBe(1000);
    expect(pricing.bebidas['coca-cola-600']).toBe(2600);
  });

  it('debe aplicar un aumento global de +$500 a todos los sándwiches', async () => {
    const updated = await applyGlobalPriceIncrease(500, 'sandwiches', 'admin@megusta.com');
    
    // Jamón Cocido + Queso Clásico: 4200 + 500 = 4700
    expect(updated.matrix['jamon-cocido']['queso-clasico']).toBe(4700);
    // Jamón Crudo + Queso Clásico: 6700 + 500 = 7200
    expect(updated.matrix['jamon-crudo']['queso-clasico']).toBe(7200);
    
    // Extras y Bebidas NO deben haber cambiado
    expect(updated.extras['aceitunas']).toBe(1000);
    expect(updated.bebidas['coca-cola-600']).toBe(2600);

    // Debe registrar el evento en el log de auditoría
    const logs = await fetchAuditLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].actionType).toBe('GLOBAL_INCREASE');
    expect(logs[0].details?.amountAdded).toBe(500);
  });

  it('debe aplicar un aumento global a todo el catálogo (all)', async () => {
    const updated = await applyGlobalPriceIncrease(300, 'all', 'admin@megusta.com');
    
    expect(updated.matrix['jamon-cocido']['queso-clasico']).toBe(4500);
    expect(updated.extras['aceitunas']).toBe(1300);
    expect(updated.bebidas['coca-cola-600']).toBe(2900);
  });

  it('debe actualizar la oferta del día correctamente', async () => {
    await updateDailyOffer(
      {
        fiambreId: 'jamon-crudo',
        quesoId: 'queso-pesto',
        discountPercentage: 0.15,
        title: 'Promo Jamón Crudo + Pesto',
      },
      'admin@megusta.com'
    );

    const offer = await getCurrentDailyOffer();
    expect(offer.fiambreId).toBe('jamon-crudo');
    expect(offer.quesoId).toBe('queso-pesto');
    expect(offer.discountPercentage).toBe(0.15);
    expect(offer.title).toBe('Promo Jamón Crudo + Pesto');
  });

  it('debe calcular precios utilizando una matriz dinámica modificada', () => {
    const customPricing: PricingState = JSON.parse(JSON.stringify(DEFAULT_PRICING_STATE));
    customPricing.matrix['salame']['queso-clasico'] = 5000;
    customPricing.extras['tomate'] = 1000;

    const basePrice = getBaseSandwichPrice('salame', 'queso-clasico', customPricing.matrix);
    expect(basePrice).toBe(5000);

    const unitPrice = calculateSandwichUnitPrice(
      'salame',
      'queso-clasico',
      [{ id: 'tomate', name: 'Tomate', description: 'Fresco', image: '/img/tomate.jpg', price: 800 }],
      undefined,
      customPricing
    );
    // 5000 + 1000 = 6000
    expect(unitPrice).toBe(6000);
  });

  it('debe calcular la oferta del día con descuento y redondeo sobre matriz dinámica', () => {
    const customPricing: PricingState = JSON.parse(JSON.stringify(DEFAULT_PRICING_STATE));
    // Base sandwich: 5000 + Bebida: 2000 = 7000
    customPricing.matrix['salame']['queso-clasico'] = 5000;
    customPricing.bebidas['coca-cola-600'] = 2000;

    // Con 10% OFF: 7000 * 0.9 = 6300
    const result = calculateDailyOfferPrice(
      'salame',
      'queso-clasico',
      'coca-cola-600',
      [],
      0.10,
      customPricing
    );

    expect(result.originalBasePrice).toBe(7000);
    expect(result.discountedBasePrice).toBe(6300);
    expect(result.unitPrice).toBe(6300);
    expect(result.discountSavings).toBe(700);
  });
});
