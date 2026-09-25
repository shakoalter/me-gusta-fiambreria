export type FiambreId =
  | 'jamon-cocido'
  | 'jamon-cocido-natural'
  | 'paleta'
  | 'mortadela'
  | 'mortadela-pistacho'
  | 'salame'
  | 'bondiola'
  | 'jamon-crudo'
  | 'lomito'
  | 'lomo-hierbas'
  | 'cantimpalo'
  | 'salchichon-primavera'
  | 'pastron'
  | 'matambre-carne'
  | 'panceta-ahumada'
  | 'longaniza';

export type QuesoId =
  | 'queso-clasico'
  | 'queso-pesto'
  | 'queso-ahumado'
  | 'cheddar'
  | 'fiambrin'
  | 'queso-zaatar'
  | 'queso-aji'
  | 'queso-albahaca';

export type ExtraId =
  | 'aceitunas'
  | 'tomate'
  | 'cebollitas'
  | 'pepinos-agridulces'
  | 'pepinitos-vinagre';

export type AderezoId = 'mayonesa' | 'ketchup' | 'mostaza';

export type FiambreCategory = 'Clásicos' | 'Especiales' | 'Curados & Ahumados';

export interface Fiambre {
  id: FiambreId;
  name: string;
  category: FiambreCategory;
  description: string;
  badge?: string;
  image: string;
  basePriceMin: number; // Precio con queso base para mostrar "Desde $X.XXX"
}

export interface Queso {
  id: QuesoId;
  name: string;
  description: string;
  flavorProfile: 'Clásico' | 'Aromático' | 'Ahumado' | 'Cremoso' | 'Especiado';
  image: string;
  badge?: string;
}

export interface Extra {
  id: ExtraId;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface Aderezo {
  id: AderezoId;
  name: string;
  description: string;
  image?: string;
  badge?: string;
  color?: string;
}

export interface SandwichCustomization {
  id: string; // Identificador único de instancia para carrito y edición
  fiambre: Fiambre;
  queso: Queso;
  extras: Extra[];
  aderezos?: Aderezo[];
  quantity: number;
  unitPrice: number; // Precio (Fiambre + Queso) + sum(Extras)
  subtotal: number;  // unitPrice * quantity
  notes?: string;
}

export interface CartItem extends SandwichCustomization {}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  isOpen: boolean;
}
