import React from 'react';
import { motion } from 'framer-motion';
import { Check, Beef, Layers, Sparkles } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  hasFiambre: boolean;
  hasQueso: boolean;
  onStepClick: (step: number) => void;
}

interface StepDef {
  number: number;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  hasFiambre,
  hasQueso,
  onStepClick,
}) => {
  const steps: StepDef[] = [
    {
      number: 1,
      label: '1. Fiambre',
      sublabel: 'Obligatorio',
      icon: <Beef className="w-4 h-4" />,
      isCompleted: hasFiambre,
      isUnlocked: true,
    },
    {
      number: 2,
      label: '2. Queso',
      sublabel: 'Obligatorio',
      icon: <Layers className="w-4 h-4" />,
      isCompleted: hasQueso,
      isUnlocked: hasFiambre,
    },
    {
      number: 3,
      label: '3. Aderezos & Extras',
      sublabel: 'Opcional',
      icon: <Sparkles className="w-4 h-4" />,
      isCompleted: false,
      isUnlocked: hasFiambre && hasQueso,
    },
  ];

  return (
    <div className="w-full pt-4">
      <div className="flex items-center justify-between gap-2 max-w-xl">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isDone = step.isCompleted && !isActive;

          return (
            <React.Fragment key={step.number}>
              <button
                type="button"
                onClick={() => step.isUnlocked && onStepClick(step.number)}
                disabled={!step.isUnlocked}
                className={`flex items-center gap-2.5 sm:gap-3 group transition-all text-left focus:outline-none ${
                  !step.isUnlocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
              >
                {/* Círculo indicador con icono */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs shrink-0 ${
                    isActive
                      ? 'bg-[#781D22] text-white ring-4 ring-red-900/15 scale-105 shadow-md'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-stone-300 text-stone-500'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.icon}
                </div>

                {/* Texto del paso */}
                <div>
                  <p
                    className={`text-xs sm:text-sm font-bold leading-tight ${
                      isActive
                        ? 'text-gourmet-dark'
                        : isDone
                        ? 'text-emerald-800'
                        : 'text-stone-600'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium leading-tight mt-0.5">
                    {step.sublabel}
                  </p>
                </div>
              </button>

              {/* Conector lineal */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-3 h-0.5 bg-stone-200 relative overflow-hidden rounded-full">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[#781D22]"
                    initial={false}
                    animate={{
                      width:
                        index === 0 && hasFiambre
                          ? '100%'
                          : index === 1 && hasQueso
                          ? '100%'
                          : '0%',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
