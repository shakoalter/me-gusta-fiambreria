import { useState, useMemo, useCallback } from 'react';
import { Fiambre, Queso, Extra, Aderezo, SandwichCustomization, CartItem } from '../types/product';
import { calculateSandwichUnitPrice, calculateSandwichSubtotal } from '../services/priceCalculator';

export function useSandwichBuilder(initialItem?: CartItem | null) {
  const [selectedFiambre, setSelectedFiambre] = useState<Fiambre | null>(initialItem?.fiambre ?? null);
  const [selectedQueso, setSelectedQueso] = useState<Queso | null>(initialItem?.queso ?? null);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>(initialItem?.extras ?? []);
  const [selectedAderezos, setSelectedAderezos] = useState<Aderezo[]>(initialItem?.aderezos ?? []);
  const [quantity, setQuantityState] = useState<number>(initialItem?.quantity ?? 1);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [editingId, setEditingId] = useState<string | null>(initialItem?.id ?? null);

  // Calcula el precio unitario en tiempo real
  const unitPrice = useMemo(() => {
    if (!selectedFiambre || !selectedQueso) return 0;
    return calculateSandwichUnitPrice(selectedFiambre.id, selectedQueso.id, selectedExtras);
  }, [selectedFiambre, selectedQueso, selectedExtras]);

  // Calcula el subtotal en tiempo real
  const subtotal = useMemo(() => {
    return calculateSandwichSubtotal(unitPrice, quantity);
  }, [unitPrice, quantity]);

  // Validación: Un sándwich está completo únicamente con 1 Fiambre + 1 Queso
  const isComplete = Boolean(selectedFiambre && selectedQueso);

  const selectFiambre = useCallback((fiambre: Fiambre) => {
    setSelectedFiambre(fiambre);
  }, []);

  const selectQueso = useCallback((queso: Queso) => {
    setSelectedQueso(queso);
  }, []);

  const toggleExtra = useCallback((extra: Extra) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.id === extra.id);
      if (exists) {
        return prev.filter((e) => e.id !== extra.id);
      }
      return [...prev, extra];
    });
  }, []);

  const isExtraSelected = useCallback(
    (extraId: string) => {
      return selectedExtras.some((e) => e.id === extraId);
    },
    [selectedExtras]
  );

  const toggleAderezo = useCallback((aderezo: Aderezo) => {
    setSelectedAderezos((prev) => {
      const exists = prev.some((a) => a.id === aderezo.id);
      if (exists) {
        return prev.filter((a) => a.id !== aderezo.id);
      }
      return [...prev, aderezo];
    });
  }, []);

  const isAderezoSelected = useCallback(
    (aderezoId: string) => {
      return selectedAderezos.some((a) => a.id === aderezoId);
    },
    [selectedAderezos]
  );

  const clearAderezos = useCallback(() => {
    setSelectedAderezos([]);
  }, []);

  const setQuantity = useCallback((qty: number) => {
    setQuantityState(Math.max(1, Math.min(99, qty)));
  }, []);

  const incrementQuantity = useCallback(() => {
    setQuantityState((prev) => Math.min(99, prev + 1));
  }, []);

  const decrementQuantity = useCallback(() => {
    setQuantityState((prev) => Math.max(1, prev - 1));
  }, []);

  const resetBuilder = useCallback(() => {
    setSelectedFiambre(null);
    setSelectedQueso(null);
    setSelectedExtras([]);
    setSelectedAderezos([]);
    setQuantityState(1);
    setCurrentStep(1);
    setEditingId(null);
  }, []);

  const loadForEdit = useCallback((item: CartItem) => {
    setSelectedFiambre(item.fiambre);
    setSelectedQueso(item.queso);
    setSelectedExtras(item.extras);
    setSelectedAderezos(item.aderezos ?? []);
    setQuantityState(item.quantity);
    setEditingId(item.id);
    setCurrentStep(1);
  }, []);

  const buildSandwich = useCallback((): SandwichCustomization | null => {
    if (!selectedFiambre || !selectedQueso) return null;

    const id = editingId || `sw_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const finalUnitPrice = calculateSandwichUnitPrice(selectedFiambre.id, selectedQueso.id, selectedExtras);
    const finalSubtotal = calculateSandwichSubtotal(finalUnitPrice, quantity);

    return {
      id,
      fiambre: selectedFiambre,
      queso: selectedQueso,
      extras: selectedExtras,
      aderezos: selectedAderezos,
      quantity,
      unitPrice: finalUnitPrice,
      subtotal: finalSubtotal,
    };
  }, [selectedFiambre, selectedQueso, selectedExtras, selectedAderezos, quantity, editingId]);

  return {
    selectedFiambre,
    selectedQueso,
    selectedExtras,
    selectedAderezos,
    quantity,
    currentStep,
    editingId,
    unitPrice,
    subtotal,
    isComplete,
    setCurrentStep,
    selectFiambre,
    selectQueso,
    toggleExtra,
    isExtraSelected,
    toggleAderezo,
    isAderezoSelected,
    clearAderezos,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    resetBuilder,
    loadForEdit,
    buildSandwich,
  };
}
