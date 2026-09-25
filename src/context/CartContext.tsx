import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, CartState, SandwichCustomization } from '../types/product';
import { calculateCartTotals } from '../services/priceCalculator';

type CartAction =
  | { type: 'ADD_ITEM'; payload: SandwichCustomization }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updated: SandwichCustomization } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_ITEM_TO_EDIT'; payload: CartItem | null }
  | { type: 'START_NEW_SANDWICH' }
  | { type: 'LOAD_STORED_CART'; payload: CartItem[] };

interface CartContextType extends CartState {
  itemToEdit: CartItem | null;
  resetSignal: number;
  addItem: (item: SandwichCustomization) => void;
  updateItem: (id: string, updated: SandwichCustomization) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setItemToEdit: (item: CartItem | null) => void;
  startNewSandwich: () => void;
}

const STORAGE_KEY = 'megusta_fiambreria_cart_v1';

const initialCartState: CartState & { itemToEdit: CartItem | null; resetSignal: number } = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isOpen: false,
  itemToEdit: null,
  resetSignal: 0,
};

/**
 * Determina si dos configuraciones de sándwich son comercialmente idénticas
 * (mismo fiambre, mismo queso, mismos aderezos, mismos extras y notas).
 */
export function areSandwichesEquivalent(
  a: SandwichCustomization,
  b: SandwichCustomization
): boolean {
  if (a.fiambre.id !== b.fiambre.id || a.queso.id !== b.queso.id) {
    return false;
  }

  // Comparación de extras (conjunto de IDs)
  const aExtras = a.extras ?? [];
  const bExtras = b.extras ?? [];
  if (aExtras.length !== bExtras.length) {
    return false;
  }
  if (!aExtras.every((ae) => bExtras.some((be) => be.id === ae.id))) {
    return false;
  }

  // Comparación de aderezos (conjunto de IDs)
  const aAderezos = a.aderezos ?? [];
  const bAderezos = b.aderezos ?? [];
  if (aAderezos.length !== bAderezos.length) {
    return false;
  }
  if (!aAderezos.every((aa) => bAderezos.some((ba) => ba.id === aa.id))) {
    return false;
  }

  // Comparación de notas
  const aNotes = (a.notes ?? '').trim();
  const bNotes = (b.notes ?? '').trim();
  if (aNotes !== bNotes) {
    return false;
  }

  return true;
}

export function cartReducer(
  state: CartState & { itemToEdit: CartItem | null; resetSignal: number },
  action: CartAction
): CartState & { itemToEdit: CartItem | null; resetSignal: number } {
  switch (action.type) {
    case 'START_NEW_SANDWICH':
      return {
        ...state,
        isOpen: false,
        itemToEdit: null,
        resetSignal: state.resetSignal + 1,
      };
    case 'LOAD_STORED_CART': {
      const items = action.payload;
      const { totalPrice, totalQuantity } = calculateCartTotals(items);
      return { ...state, items, totalPrice, totalQuantity };
    }

    case 'ADD_ITEM': {
      // Verificamos si existe un sándwich idéntico (mismo fiambre, queso, extras y aderezos)
      const newItem = action.payload;
      const existingIndex = state.items.findIndex((item) =>
        areSandwichesEquivalent(item, newItem)
      );

      let updatedItems: CartItem[];
      if (existingIndex > -1) {
        // Incrementamos la cantidad del ítem existente
        updatedItems = state.items.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + newItem.quantity;
            return {
              ...item,
              quantity: newQty,
              subtotal: item.unitPrice * newQty,
            };
          }
          return item;
        });
      } else {
        updatedItems = [...state.items, newItem];
      }

      const { totalPrice, totalQuantity } = calculateCartTotals(updatedItems);
      return { ...state, items: updatedItems, totalPrice, totalQuantity };
    }

    case 'UPDATE_ITEM': {
      const { id, updated } = action.payload;
      const updatedItems = state.items.map((item) => (item.id === id ? updated : item));
      const { totalPrice, totalQuantity } = calculateCartTotals(updatedItems);
      return { ...state, items: updatedItems, totalPrice, totalQuantity, itemToEdit: null };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter((item) => item.id !== action.payload);
      const { totalPrice, totalQuantity } = calculateCartTotals(updatedItems);
      const itemToEdit = state.itemToEdit?.id === action.payload ? null : state.itemToEdit;
      return { ...state, items: updatedItems, totalPrice, totalQuantity, itemToEdit };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      let updatedItems: CartItem[];

      if (quantity <= 0) {
        updatedItems = state.items.filter((item) => item.id !== id);
      } else {
        updatedItems = state.items.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              quantity,
              subtotal: item.unitPrice * quantity,
            };
          }
          return item;
        });
      }

      const { totalPrice, totalQuantity } = calculateCartTotals(updatedItems);
      const itemToEdit = quantity <= 0 && state.itemToEdit?.id === id ? null : state.itemToEdit;
      return { ...state, items: updatedItems, totalPrice, totalQuantity, itemToEdit };
    }

    case 'CLEAR_CART':
      return { ...state, items: [], totalQuantity: 0, totalPrice: 0, itemToEdit: null };

    case 'SET_OPEN':
      return { ...state, isOpen: action.payload };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_ITEM_TO_EDIT':
      return { ...state, itemToEdit: action.payload };

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Cargar estado inicial de localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: 'LOAD_STORED_CART', payload: parsed });
        }
      }
    } catch {
      // Ignorar errores de parseo
    }
  }, []);

  // Guardar en localStorage ante cambios
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // QuotaExceeded u otros
    }
  }, [state.items]);

  const addItem = (item: SandwichCustomization) => dispatch({ type: 'ADD_ITEM', payload: item });
  const updateItem = (id: string, updated: SandwichCustomization) =>
    dispatch({ type: 'UPDATE_ITEM', payload: { id, updated } });
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const openCart = () => dispatch({ type: 'SET_OPEN', payload: true });
  const closeCart = () => dispatch({ type: 'SET_OPEN', payload: false });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const setItemToEdit = (item: CartItem | null) => dispatch({ type: 'SET_ITEM_TO_EDIT', payload: item });
  const startNewSandwich = () => dispatch({ type: 'START_NEW_SANDWICH' });

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        updateItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        setItemToEdit,
        startNewSandwich,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
}
