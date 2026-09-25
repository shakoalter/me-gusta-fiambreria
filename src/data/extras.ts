import { Extra } from '../types/product';
import { EXTRAS_PRICING } from './pricingMatrix';

export const EXTRAS_DATA: Extra[] = [
  {
    id: 'aceitunas',
    name: 'Aceitunas Verdes',
    price: EXTRAS_PRICING['aceitunas'],
    description: 'Aceitunas descarozadas seleccionadas de primera calidad.',
    image: '/images/extras/aceitunas.jpg',
  },
  {
    id: 'tomate',
    name: 'Rodajas de Tomate',
    price: EXTRAS_PRICING['tomate'],
    description: 'Rodajas frescas de tomates maduros de huerta.',
    image: '/images/extras/rodajas-tomate.jpg',
  },
  {
    id: 'cebollitas',
    name: 'Cebollitas en Vinagre',
    price: EXTRAS_PRICING['cebollitas'],
    description: 'Cebollitas perladas encurtidas crujientes y aromáticas.',
    image: '/images/extras/cebollitas-en-vinagre.jpg',
  },
  {
    id: 'pepinos-agridulces',
    name: 'Pepinos Agridulces',
    price: EXTRAS_PRICING['pepinos-agridulces'],
    description: 'Pickles agridulces estilo artesanal en rodajas finas.',
    image: '/images/extras/pepinos-agridulces.jpg',
  },
  {
    id: 'pepinitos-vinagre',
    name: 'Pepinitos en Vinagre',
    price: EXTRAS_PRICING['pepinitos-vinagre'],
    description: 'Cornichons crocantes macerados en vinagre fino.',
    image: '/images/extras/pepinitos-en-vinagre.jpg',
  },
];
