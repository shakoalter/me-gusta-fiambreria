import { TargetAndTransition, Transition } from 'framer-motion';

/**
 * Animación de pulsación y resplandor dorado para el botón de acceso al carrito
 */
export const cartButtonGlowAnimation: TargetAndTransition = {
  scale: [1, 1.05, 1, 1.03, 1],
  boxShadow: [
    '0 0 0px rgba(251, 191, 36, 0), 0 0 0px rgba(245, 158, 11, 0), 0 4px 12px rgba(120, 29, 34, 0.25)',
    '0 0 16px rgba(251, 191, 36, 0.9), 0 0 28px rgba(245, 158, 11, 0.6), 0 6px 20px rgba(120, 29, 34, 0.45)',
    '0 0 6px rgba(251, 191, 36, 0.4), 0 0 12px rgba(245, 158, 11, 0.25), 0 4px 12px rgba(120, 29, 34, 0.25)',
    '0 0 14px rgba(251, 191, 36, 0.8), 0 0 22px rgba(245, 158, 11, 0.5), 0 5px 16px rgba(120, 29, 34, 0.35)',
    '0 0 0px rgba(251, 191, 36, 0), 0 0 0px rgba(245, 158, 11, 0), 0 4px 12px rgba(120, 29, 34, 0.25)',
  ],
  borderColor: [
    'rgba(251, 191, 36, 0.5)',
    'rgba(254, 240, 138, 1)',
    'rgba(251, 191, 36, 0.6)',
    'rgba(254, 240, 138, 0.95)',
    'rgba(251, 191, 36, 0.5)',
  ],
};

export const cartButtonGlowTransition: Transition = {
  duration: 1.15,
  repeat: Infinity,
  repeatType: 'loop',
  ease: 'easeInOut',
  repeatDelay: 0.25,
};
