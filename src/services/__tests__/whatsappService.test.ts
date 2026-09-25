import { describe, it, expect } from 'vitest';
import { formatWhatsAppMessage, generateWhatsAppUrl, generateOrderCode } from '../whatsappService';
import { FIAMBRES_DATA } from '../../data/fiambres';
import { QUESOS_DATA } from '../../data/quesos';
import { EXTRAS_DATA } from '../../data/extras';
import { CartItem } from '../../types/product';

describe('WhatsAppService', () => {
  it('debe retornar string vacío si el carrito está vacío', () => {
    expect(formatWhatsAppMessage([])).toBe('');
  });

  it('debe generar un código de pedido en formato MG - XX', () => {
    const code = generateOrderCode();
    expect(code).toMatch(/^MG - \d{2}$/);
  });

  it('debe estructurar correctamente el mensaje con código, listas y formato simplificado', () => {
    const mortadela = FIAMBRES_DATA.find((f) => f.id === 'mortadela')!;
    const quesoPesto = QUESOS_DATA.find((q) => q.id === 'queso-pesto')!;
    const tomate = EXTRAS_DATA.find((e) => e.id === 'tomate')!;

    const item: CartItem = {
      id: 'item-1',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [tomate],
      aderezos: [{ id: 'mayonesa', name: 'Mayonesa', description: '' }, { id: 'mostaza', name: 'Mostaza', description: '' }],
      quantity: 2,
      unitPrice: 5700,
      subtotal: 11400,
    };

    const message = formatWhatsAppMessage([item], {
      customerName: 'Mariano López',
      orderCode: 'MG - 42',
      notes: 'Bien tostado por favor',
    });

    expect(message).toContain('Les paso mi pedido');
    expect(message).toContain('👤 *Cliente:* Mariano López (MG - 42)');
    expect(message).toContain('📦 *Pedido (2 sándwiches):*');
    expect(message).toContain('2x Mortadela + Queso al Pesto');
    expect(message).toContain('Rodajas de Tomate');
    expect(message).toContain('Mayonesa, Mostaza');
    expect(message).toContain('11.400');
    expect(message).toContain('Bien tostado por favor');
    expect(message).toContain('_¿Me confirman si recibieron el pedido? ¡Muchas gracias!_');
    // Verificamos que las frases eliminadas NO aparezcan
    expect(message).not.toContain('Forma de pago');
    expect(message).not.toContain('Abono en el local al retirar');
    expect(message).not.toContain('demora aproximada');
  });

  it('debe generar una URL wa.me válida y codificada correctamente', () => {
    const bondiola = FIAMBRES_DATA.find((f) => f.id === 'bondiola')!;
    const quesoAhumado = QUESOS_DATA.find((q) => q.id === 'queso-ahumado')!;

    const item: CartItem = {
      id: 'item-bondiola',
      fiambre: bondiola,
      queso: quesoAhumado,
      extras: [],
      quantity: 1,
      unitPrice: 6700,
      subtotal: 6700,
    };

    const url = generateWhatsAppUrl([item], { customerName: 'Ana', orderCode: 'MG - 05' }, '5491199998888');

    expect(url.startsWith('https://api.whatsapp.com/send?phone=5491199998888&text=')).toBe(true);
    expect(url).toContain(encodeURIComponent('Bondiola + Queso Ahumado'));
    expect(url).toContain(encodeURIComponent('Ana (MG - 05)'));
  });
});
