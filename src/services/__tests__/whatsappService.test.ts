import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatWhatsAppMessage,
  generateWhatsAppUrl,
  generateOrderCode,
  getDailyOrderCode,
  advanceToNextDailyOrderCode,
  resetDailyOrderTracker,
} from '../whatsappService';
import { FIAMBRES_DATA } from '../../data/fiambres';
import { QUESOS_DATA } from '../../data/quesos';
import { EXTRAS_DATA } from '../../data/extras';
import { CartItem } from '../../types/product';

describe('WhatsAppService', () => {
  beforeEach(() => {
    resetDailyOrderTracker();
  });

  it('debe retornar string vacío si el carrito está vacío', () => {
    expect(formatWhatsAppMessage([])).toBe('');
  });

  it('debe generar y avanzar números de pedido correlativos en el mismo día sin repetirse', () => {
    // Primer pedido del día
    const code1 = generateOrderCode();
    expect(code1).toBe('MG - 01');

    // Al finalizar y avanzar al segundo pedido
    const code2 = advanceToNextDailyOrderCode();
    expect(code2).toBe('MG - 02');

    // Tercer pedido
    const code3 = advanceToNextDailyOrderCode();
    expect(code3).toBe('MG - 03');
  });

  it('debe reiniciar automáticamente la secuencia a MG - 01 al pasar al día siguiente', () => {
    // Pedidos del día 25
    getDailyOrderCode(false, '2026-09-25');
    getDailyOrderCode(true, '2026-09-25'); // MG - 02
    getDailyOrderCode(true, '2026-09-25'); // MG - 03

    // Pasa al día siguiente (2026-09-26)
    const codeDiaSiguiente = getDailyOrderCode(false, '2026-09-26');
    expect(codeDiaSiguiente).toBe('MG - 01');
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
