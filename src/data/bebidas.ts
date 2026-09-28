import { Bebida } from '../types/product';
import { BEBIDAS_PRICING } from './pricingMatrix';

export const BEBIDAS_DATA: Bebida[] = [
  // Individuales - 600cc / Lata
  {
    id: 'coca-cola-600',
    name: 'Coca-Cola Original',
    volume: '600 cc',
    category: 'Individuales',
    price: BEBIDAS_PRICING['coca-cola-600'],
  },
  {
    id: 'coca-cola-zero-600',
    name: 'Coca-Cola Zero',
    volume: '600 cc',
    category: 'Individuales',
    badge: 'Sin Azúcar',
    price: BEBIDAS_PRICING['coca-cola-zero-600'],
  },
  {
    id: 'sprite-600',
    name: 'Sprite Lima-Limón',
    volume: '600 cc',
    category: 'Individuales',
    price: BEBIDAS_PRICING['sprite-600'],
  },
  {
    id: 'fanta-600',
    name: 'Fanta Naranja',
    volume: '600 cc',
    category: 'Individuales',
    price: BEBIDAS_PRICING['fanta-600'],
  },
  {
    id: 'fanta-carmesi-354',
    name: 'Fanta Carmesí',
    volume: '354 cc',
    category: 'Individuales',
    badge: 'Lata',
    price: BEBIDAS_PRICING['fanta-carmesi-354'],
  },

  // Aguas & Saborizadas / Isotónicas
  {
    id: 'agua-benedictino-500',
    name: 'Agua Mineral Benedictino',
    volume: '500 cc',
    category: 'Aguas & Isotónicas',
    badge: 'Sin Gas',
    price: BEBIDAS_PRICING['agua-benedictino-500'],
  },
  {
    id: 'aquarius-pera-600',
    name: 'Aquarius Pera',
    volume: '600 cc',
    category: 'Aguas & Isotónicas',
    price: BEBIDAS_PRICING['aquarius-pera-600'],
  },
  {
    id: 'aquarius-pomelo-600',
    name: 'Aquarius Pomelo',
    volume: '600 cc',
    category: 'Aguas & Isotónicas',
    price: BEBIDAS_PRICING['aquarius-pomelo-600'],
  },
  {
    id: 'powerade-uva-500',
    name: 'Powerade Ion4 Uva',
    volume: '500 cc',
    category: 'Aguas & Isotónicas',
    badge: 'Isotónica',
    price: BEBIDAS_PRICING['powerade-uva-500'],
  },

  // Grandes / Familiares
  {
    id: 'coca-cola-175',
    name: 'Coca-Cola Original',
    volume: '1,75 L',
    category: 'Grandes',
    badge: 'Familiar',
    price: BEBIDAS_PRICING['coca-cola-175'],
  },
  {
    id: 'coca-cola-zero-175',
    name: 'Coca-Cola Zero',
    volume: '1,75 L',
    category: 'Grandes',
    badge: 'Familiar Sin Azúcar',
    price: BEBIDAS_PRICING['coca-cola-zero-175'],
  },
  {
    id: 'aquarius-manzana-1500',
    name: 'Aquarius Manzana',
    volume: '1,5 L',
    category: 'Grandes',
    badge: 'Familiar',
    price: BEBIDAS_PRICING['aquarius-manzana-1500'],
  },
  {
    id: 'aquarius-pera-1500',
    name: 'Aquarius Pera',
    volume: '1,5 L',
    category: 'Grandes',
    badge: 'Familiar',
    price: BEBIDAS_PRICING['aquarius-pera-1500'],
  },
];
