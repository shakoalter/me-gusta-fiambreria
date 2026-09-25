import { describe, it, expect } from 'vitest';
import { cartReducer, areSandwichesEquivalent } from '../CartContext';
import { FIAMBRES_DATA } from '../../data/fiambres';
import { QUESOS_DATA } from '../../data/quesos';
import { EXTRAS_DATA } from '../../data/extras';
import { ADEREZOS_DATA } from '../../data/aderezos';
import { SandwichCustomization, CartState, CartItem } from '../../types/product';
import { formatWhatsAppMessage } from '../../services/whatsappService';

const initialState: CartState & { itemToEdit: CartItem | null; resetSignal: number } = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isOpen: false,
  itemToEdit: null,
  resetSignal: 0,
};

const mortadela = FIAMBRES_DATA.find((f) => f.id === 'mortadela')!;
const jamonCrudo = FIAMBRES_DATA.find((f) => f.id === 'jamon-crudo')!;
const quesoPesto = QUESOS_DATA.find((q) => q.id === 'queso-pesto')!;
const quesoAhumado = QUESOS_DATA.find((q) => q.id === 'queso-ahumado')!;
const tomate = EXTRAS_DATA.find((e) => e.id === 'tomate')!;
const aceitunas = EXTRAS_DATA.find((e) => e.id === 'aceitunas')!;
const mayonesa = ADEREZOS_DATA.find((a) => a.id === 'mayonesa')!;
const mostaza = ADEREZOS_DATA.find((a) => a.id === 'mostaza')!;

describe('CartReducer — Suite Integral de Estado y Negocio', () => {
  it('Caso A: Mismo fiambre + mismo queso + mismos aderezos -> debe fusionar sumando cantidades', () => {
    const sw1: SandwichCustomization = {
      id: 'sw-1',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [],
      aderezos: [mayonesa],
      quantity: 1,
      unitPrice: 4900,
      subtotal: 4900,
    };

    const sw2: SandwichCustomization = {
      id: 'sw-2',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [],
      aderezos: [mayonesa],
      quantity: 1,
      unitPrice: 4900,
      subtotal: 4900,
    };

    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: sw1 });
    const state2 = cartReducer(state1, { type: 'ADD_ITEM', payload: sw2 });

    expect(state2.items).toHaveLength(1);
    expect(state2.items[0].quantity).toBe(2);
    expect(state2.items[0].subtotal).toBe(9800);
    expect(state2.totalQuantity).toBe(2);
    expect(state2.totalPrice).toBe(9800);
  });

  it('Caso B: Mismo fiambre + mismo queso + aderezos DIFERENTES -> NO debe fusionar (2 líneas independientes)', () => {
    const swMayo: SandwichCustomization = {
      id: 'sw-mayo',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [],
      aderezos: [mayonesa],
      quantity: 1,
      unitPrice: 4900,
      subtotal: 4900,
    };

    const swMostaza: SandwichCustomization = {
      id: 'sw-mostaza',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [],
      aderezos: [mostaza],
      quantity: 1,
      unitPrice: 4900,
      subtotal: 4900,
    };

    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: swMayo });
    const state2 = cartReducer(state1, { type: 'ADD_ITEM', payload: swMostaza });

    expect(state2.items).toHaveLength(2);
    expect(state2.items[0].aderezos?.[0].id).toBe('mayonesa');
    expect(state2.items[1].aderezos?.[0].id).toBe('mostaza');
    expect(state2.totalQuantity).toBe(2);
    expect(state2.totalPrice).toBe(9800);

    // Verificamos que el mensaje de WhatsApp refleje ambos aderezos individualmente
    const message = formatWhatsAppMessage(state2.items);
    expect(message).toContain('Mayonesa');
    expect(message).toContain('Mostaza');
    expect(message).toContain('1) 1x Mortadela + Queso al Pesto');
    expect(message).toContain('2) 1x Mortadela + Queso al Pesto');
  });

  it('Caso C: Mismo fiambre + mismo queso + extras DIFERENTES -> NO debe fusionar', () => {
    const swTomate: SandwichCustomization = {
      id: 'sw-tomate',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [tomate],
      aderezos: [],
      quantity: 1,
      unitPrice: 5700,
      subtotal: 5700,
    };

    const swAceituna: SandwichCustomization = {
      id: 'sw-aceituna',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [aceitunas],
      aderezos: [],
      quantity: 1,
      unitPrice: 5900,
      subtotal: 5900,
    };

    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: swTomate });
    const state2 = cartReducer(state1, { type: 'ADD_ITEM', payload: swAceituna });

    expect(state2.items).toHaveLength(2);
    expect(state2.totalQuantity).toBe(2);
    expect(state2.totalPrice).toBe(11600);
  });

  it('Caso D: Aderezos en diferente orden en el array -> debe reconocerlos como equivalentes y fusionar', () => {
    const sw1: SandwichCustomization = {
      id: 'sw-1',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [],
      aderezos: [mayonesa, mostaza],
      quantity: 1,
      unitPrice: 4900,
      subtotal: 4900,
    };

    const sw2: SandwichCustomization = {
      id: 'sw-2',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [],
      aderezos: [mostaza, mayonesa], // Mismos aderezos en distinto orden
      quantity: 1,
      unitPrice: 4900,
      subtotal: 4900,
    };

    expect(areSandwichesEquivalent(sw1, sw2)).toBe(true);

    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: sw1 });
    const state2 = cartReducer(state1, { type: 'ADD_ITEM', payload: sw2 });

    expect(state2.items).toHaveLength(1);
    expect(state2.items[0].quantity).toBe(2);
  });

  it('Caso E: Uno con aderezos y otro sin aderezos -> NO debe fusionar', () => {
    const swCon: SandwichCustomization = {
      id: 'sw-con',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [],
      aderezos: [mayonesa],
      quantity: 1,
      unitPrice: 4900,
      subtotal: 4900,
    };

    const swSin: SandwichCustomization = {
      id: 'sw-sin',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [],
      aderezos: [],
      quantity: 1,
      unitPrice: 4900,
      subtotal: 4900,
    };

    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: swCon });
    const state2 = cartReducer(state1, { type: 'ADD_ITEM', payload: swSin });

    expect(state2.items).toHaveLength(2);
  });

  it('Caso F: UPDATE_QUANTITY debe actualizar la cantidad y el subtotal correctamente', () => {
    const sw: SandwichCustomization = {
      id: 'sw-1',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [],
      aderezos: [],
      quantity: 1,
      unitPrice: 4900,
      subtotal: 4900,
    };

    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: sw });
    const state2 = cartReducer(state1, {
      type: 'UPDATE_QUANTITY',
      payload: { id: 'sw-1', quantity: 5 },
    });

    expect(state2.items[0].quantity).toBe(5);
    expect(state2.items[0].subtotal).toBe(24500);
    expect(state2.totalQuantity).toBe(5);
    expect(state2.totalPrice).toBe(24500);
  });

  it('Caso G: UPDATE_QUANTITY con cantidad <= 0 debe eliminar el ítem del carrito', () => {
    const sw: SandwichCustomization = {
      id: 'sw-1',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [],
      aderezos: [],
      quantity: 2,
      unitPrice: 4900,
      subtotal: 9800,
    };

    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: sw });
    const state2 = cartReducer(state1, {
      type: 'UPDATE_QUANTITY',
      payload: { id: 'sw-1', quantity: 0 },
    });

    expect(state2.items).toHaveLength(0);
    expect(state2.totalQuantity).toBe(0);
    expect(state2.totalPrice).toBe(0);
  });

  it('Caso H: LOAD_STORED_CART debe recalcular totales correctamente a partir de items guardados', () => {
    const storedItems: CartItem[] = [
      {
        id: 'stored-1',
        fiambre: mortadela,
        queso: quesoPesto,
        extras: [],
        aderezos: [mayonesa],
        quantity: 2,
        unitPrice: 4900,
        subtotal: 9800,
      },
    ];

    const state = cartReducer(initialState, {
      type: 'LOAD_STORED_CART',
      payload: storedItems,
    });

    expect(state.items).toHaveLength(1);
    expect(state.totalQuantity).toBe(2);
    expect(state.totalPrice).toBe(9800);
  });

  it('Caso I: UPDATE_ITEM debe reemplazar el sándwich editado y recalcular totales', () => {
    const swOriginal: SandwichCustomization = {
      id: 'sw-1',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [],
      aderezos: [mayonesa],
      quantity: 1,
      unitPrice: 4900,
      subtotal: 4900,
    };

    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: swOriginal });

    const swActualizado: SandwichCustomization = {
      id: 'sw-1',
      fiambre: jamonCrudo,
      queso: quesoAhumado,
      extras: [tomate],
      aderezos: [mostaza],
      quantity: 2,
      unitPrice: 7700 + 800, // 8500
      subtotal: 17000,
    };

    const state2 = cartReducer(state1, {
      type: 'UPDATE_ITEM',
      payload: { id: 'sw-1', updated: swActualizado },
    });

    expect(state2.items).toHaveLength(1);
    expect(state2.items[0].fiambre.name).toBe('Jamón Crudo');
    expect(state2.items[0].quantity).toBe(2);
    expect(state2.totalPrice).toBe(17000);
    expect(state2.itemToEdit).toBeNull();
  });

  it('Caso J: CLEAR_CART y START_NEW_SANDWICH deben restablecer el estado', () => {
    const sw: SandwichCustomization = {
      id: 'sw-1',
      fiambre: mortadela,
      queso: quesoPesto,
      extras: [],
      aderezos: [],
      quantity: 1,
      unitPrice: 4900,
      subtotal: 4900,
    };

    const state1 = cartReducer(initialState, { type: 'ADD_ITEM', payload: sw });
    expect(state1.items).toHaveLength(1);

    const stateCleared = cartReducer(state1, { type: 'CLEAR_CART' });
    expect(stateCleared.items).toHaveLength(0);
    expect(stateCleared.totalPrice).toBe(0);
    expect(stateCleared.totalQuantity).toBe(0);

    const stateResetSignal = cartReducer(state1, { type: 'START_NEW_SANDWICH' });
    expect(stateResetSignal.resetSignal).toBe(1);
    expect(stateResetSignal.isOpen).toBe(false);
  });
});
