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
    selectedBebidas,
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
    clearExtras,
    isExtraSelected,
    toggleAderezo,
    isAderezoSelected,
    clearAderezos,
    toggleBebida,
    isBebidaSelected,
    clearBebidas,
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
  const isFirstMount = useRef(true);

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

  // Scroll suave al inicio del armador cada vez que avanza o cambia de paso (Paso 1 -> Paso 2 -> Paso 3)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const el = document.getElementById('builder-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep]);

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
      className="relative w-full py-6 sm:py-16 scroll-mt-24 bg-cover bg-top bg-no-repeat overflow-hidden border-t border-stone-300/30"
      style={{ backgroundImage: "url('/images/builder-bg.png')" }}
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado Paso a Paso + Bodegón de Charcuterie */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center mb-6 sm:mb-8">
          
          {/* Columna Izquierda: Título y Stepper */}
          <div className="lg:col-span-7 space-y-2">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#781D22]">
              — PASO A PASO —
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-[44px] font-extrabold text-stone-900 tracking-tight leading-[1.15]">
              Armá tu Sándwich Gourmet
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
              Elegí Fiambre + Queso. Los extras y aderezos son opcionales, a tu gusto.
            </p>

            {/* Indicador de Pasos */}
            <StepIndicator
              currentStep={currentStep}
              hasFiambre={Boolean(selectedFiambre)}
              hasQueso={Boolean(selectedQueso)}
              onStepClick={(step) => setCurrentStep(step)}
            />
          </div>

          {/* Columna Derecha: Frase Manuscrita + Medallón del Logo Oficial */}
          <div className="hidden lg:flex lg:col-span-5 items-center justify-end relative">
            <div className="relative flex items-center gap-5">
              {/* Frase manuscrita inclinada */}
              <div className="text-right text-stone-900 transform -rotate-6 font-handwriting text-2xl lg:text-3xl font-bold tracking-wide select-none drop-shadow-xs">
                <span className="text-stone-900">Tu sándwich,</span><br />
                <span className="text-[#781D22]">como lo querés</span>
              </div>

              {/* Medallón del Logo Oficial con Sombra y Elevación Directa */}
              <div className="relative group shrink-0">
                <img
                  src="/images/logo-me-gusta.png"
                  alt="Logo oficial de Fiambrería Me Gusta"
                  className="w-36 h-36 sm:w-40 sm:h-40 lg:w-44 lg:h-44 object-contain rounded-full filter drop-shadow-[0_16px_28px_rgba(42,21,14,0.45)] transition-all duration-300 transform group-hover:scale-105 group-hover:drop-shadow-[0_22px_36px_rgba(42,21,14,0.6)]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Tarjeta Contenedora Principal de los Pasos */}
        <div className="bg-white/95 backdrop-blur-xs rounded-2xl sm:rounded-3xl p-2.5 sm:p-8 border border-stone-200/90 shadow-md">
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
              onClearExtras={clearExtras}
              selectedAderezos={selectedAderezos}
              onToggleAderezo={toggleAderezo}
              isAderezoSelected={isAderezoSelected}
              onClearAderezos={clearAderezos}
              selectedBebidas={selectedBebidas}
              onToggleBebida={toggleBebida}
              isBebidaSelected={isBebidaSelected}
              onClearBebidas={clearBebidas}
            />
          )}
        </div>

        {/* Barra Flotante de Resumen y Precio */}
        <LivePriceBar
          selectedFiambre={selectedFiambre}
          selectedQueso={selectedQueso}
          selectedExtras={selectedExtras}
          selectedAderezos={selectedAderezos}
          selectedBebidas={selectedBebidas}
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
      </div>
    </section>
  );
};
