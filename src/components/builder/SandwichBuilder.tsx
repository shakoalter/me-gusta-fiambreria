import React, { useState, useEffect, useRef } from 'react';
import { useSandwichBuilder } from '../../hooks/useSandwichBuilder';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { StepIndicator } from './StepIndicator';
import { StepFiambre } from './StepFiambre';
import { StepQueso } from './StepQueso';
import { StepExtras } from './StepExtras';
import { SandwichAddedModal } from './SandwichAddedModal';
import { LivePriceBar } from './LivePriceBar';
import { Fiambre, Queso, SandwichCustomization } from '../../types/product';

export const SandwichBuilder: React.FC = () => {
  const {
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
    incrementQuantity,
    decrementQuantity,
    resetBuilder,
    loadForEdit,
    buildSandwich,
  } = useSandwichBuilder();

  const { addItem, updateItem, itemToEdit, setItemToEdit, openCart, resetSignal } = useCart();
  const { showToast } = useToast();
  const builderContainerRef = useRef<HTMLDivElement>(null);

  const [addedSandwich, setAddedSandwich] = useState<SandwichCustomization | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  // Si se emite la señal de nuevo sándwich (desde el carrito vacío, hero o modal), reseteamos el builder
  useEffect(() => {
    if (resetSignal > 0) {
      resetBuilder();
    }
  }, [resetSignal, resetBuilder]);

  // Si hay un ítem para editar desde el carrito, lo cargamos en el builder
  useEffect(() => {
    if (itemToEdit) {
      loadForEdit(itemToEdit);
      builderContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [itemToEdit, loadForEdit]);

  const handleFiambreSelect = (fiambre: Fiambre) => {
    selectFiambre(fiambre);
    setCurrentStep(2);
    showToast(`Fiambre elegido: ${fiambre.name}`, 'info');
  };

  const handleQuesoSelect = (queso: Queso) => {
    selectQueso(queso);
    setCurrentStep(3);
    showToast(`Queso elegido: ${queso.name}`, 'info');
  };

  const handleAddToCart = () => {
    const sandwich = buildSandwich();
    if (!sandwich) {
      showToast('Por favor seleccioná un fiambre y un queso antes de agregar.', 'error');
      return;
    }

    if (editingId) {
      updateItem(editingId, sandwich);
      setItemToEdit(null);
      resetBuilder();
      showToast('Sándwich actualizado correctamente en tu pedido', 'success');
      openCart();
    } else {
      addItem(sandwich);
      setAddedSandwich(sandwich);
      setIsSuccessModalOpen(true);
    }
  };

  const handleBuildAnother = () => {
    setIsSuccessModalOpen(false);
    resetBuilder();
    builderContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFinishOrder = () => {
    setIsSuccessModalOpen(false);
    openCart();
  };

  return (
    <section
      id="builder-section"
      ref={builderContainerRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 scroll-mt-24"
    >
      {/* Encabezado Paso a Paso + Bodegón de Charcuterie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center mb-8">
        
        {/* Columna Izquierda: Título y Stepper */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#781D22]">
            Paso a Paso
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gourmet-dark tracking-tight leading-tight">
            Armá tu Sándwich Gourmet
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
            Elegí Fiambre + Queso. Los extras y aderezos son opcionales a tu gusto.
          </p>

          {/* Indicador de Pasos */}
          <StepIndicator
            currentStep={currentStep}
            hasFiambre={Boolean(selectedFiambre)}
            hasQueso={Boolean(selectedQueso)}
            onStepClick={(step) => setCurrentStep(step)}
          />
        </div>

        {/* Columna Derecha: Frase Manuscrita + Bodegón Gastronómico */}
        <div className="hidden lg:flex lg:col-span-5 items-center justify-end relative">
          <div className="relative">
            {/* Frase manuscrita inclinada */}
            <div className="absolute -top-3.5 -left-10 z-10 text-stone-800 transform -rotate-12 font-serif italic text-sm font-bold tracking-wide">
              <span>Tu sándwich,</span><br />
              <span className="text-[#781D22]">como lo querés</span>
            </div>

            {/* Imagen del bodegón de fiambres y quesos */}
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-stone-200/80 bg-white p-1 max-w-sm">
              <img
                src="/images/bodegon-charcuterie.jpg"
                alt="Tabla de fiambres artesanales, quesos seleccionados y vegetales frescos"
                className="w-full h-44 object-cover rounded-xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Tarjeta Contenedora Principal de los Pasos */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200/90 shadow-sm">
        {currentStep === 1 && (
          <StepFiambre
            selectedFiambre={selectedFiambre}
            onSelect={handleFiambreSelect}
            onNextStep={() => selectedFiambre && setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <StepQueso
            selectedFiambre={selectedFiambre}
            selectedQueso={selectedQueso}
            onSelect={handleQuesoSelect}
            onGoToFiambreStep={() => setCurrentStep(1)}
            onNextStep={() => selectedQueso && setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <StepExtras
            selectedExtras={selectedExtras}
            onToggleExtra={toggleExtra}
            isExtraSelected={isExtraSelected}
            selectedAderezos={selectedAderezos}
            onToggleAderezo={toggleAderezo}
            isAderezoSelected={isAderezoSelected}
            onClearAderezos={clearAderezos}
          />
        )}
      </div>

      {/* Barra Flotante de Resumen y Precio */}
      <LivePriceBar
        selectedFiambre={selectedFiambre}
        selectedQueso={selectedQueso}
        selectedExtras={selectedExtras}
        selectedAderezos={selectedAderezos}
        quantity={quantity}
        unitPrice={unitPrice}
        subtotal={subtotal}
        isComplete={isComplete}
        isEditing={Boolean(editingId)}
        onIncrementQuantity={incrementQuantity}
        onDecrementQuantity={decrementQuantity}
        onAddToCart={handleAddToCart}
        onReset={resetBuilder}
      />

      {/* Cartel / Modal de confirmación al completar un sándwich */}
      <SandwichAddedModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        sandwich={addedSandwich}
        onBuildAnother={handleBuildAnother}
        onFinishOrder={handleFinishOrder}
      />
    </section>
  );
};
