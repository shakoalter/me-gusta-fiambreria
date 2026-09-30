import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { 
  PricingState, 
  DailyOfferState 
} from '../types/admin';
import { FiambreId, QuesoId, ExtraId, BebidaId, Extra, Bebida } from '../types/product';
import { 
  subscribeToPricingState, 
  subscribeToDailyOfferState, 
  DEFAULT_PRICING_STATE, 
  DEFAULT_DAILY_OFFER_STATE,
  savePricingState,
  applyGlobalPriceIncrease as applyGlobalPriceIncreaseService,
  updateDailyOffer as updateDailyOfferService
} from '../services/adminService';
import { 
  getBaseSandwichPrice, 
  calculateSandwichUnitPrice, 
  calculateDailyOfferPrice
} from '../services/priceCalculator';

interface PricingContextType {
  pricing: PricingState;
  dailyOffer: DailyOfferState;
  isLoading: boolean;
  getSandwichPrice: (fiambreId: FiambreId, quesoId: QuesoId) => number;
  getSandwichUnitPrice: (fiambreId: FiambreId, quesoId: QuesoId, extras: Extra[], bebidas?: Bebida[]) => number;
  getFiambreMinPrice: (fiambreId: FiambreId) => number;
  getExtraPrice: (extraId: ExtraId) => number;
  getBebidaPrice: (bebidaId: BebidaId) => number;
  isOutOfStock: (itemId: string) => boolean;
  calculateOfferPrice: (
    fiambreId?: FiambreId, 
    quesoId?: QuesoId, 
    bebidaId?: BebidaId | 'sin-bebida', 
    extras?: Extra[], 
    discount?: number
  ) => ReturnType<typeof calculateDailyOfferPrice>;
  savePricing: (newState: PricingState, adminEmail: string, description?: string) => Promise<void>;
  applyGlobalIncrease: (amount: number, targetScope: 'sandwiches' | 'extras' | 'bebidas' | 'all', adminEmail: string) => Promise<PricingState>;
  saveDailyOffer: (newOffer: Partial<DailyOfferState>, adminEmail: string) => Promise<void>;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pricing, setPricing] = useState<PricingState>(DEFAULT_PRICING_STATE);
  const [dailyOffer, setDailyOffer] = useState<DailyOfferState>(DEFAULT_DAILY_OFFER_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let pricingLoaded = false;
    let offerLoaded = false;

    const checkLoading = () => {
      if (pricingLoaded && offerLoaded) {
        setIsLoading(false);
      }
    };

    const unsubscribePricing = subscribeToPricingState((state) => {
      setPricing(state);
      pricingLoaded = true;
      checkLoading();
    });

    const unsubscribeOffer = subscribeToDailyOfferState((state) => {
      setDailyOffer(state);
      offerLoaded = true;
      checkLoading();
    });

    // Fallback de seguridad para terminar loading
    const timer = setTimeout(() => setIsLoading(false), 800);

    return () => {
      unsubscribePricing();
      unsubscribeOffer();
      clearTimeout(timer);
    };
  }, []);

  const getSandwichPrice = (fiambreId: FiambreId, quesoId: QuesoId): number => {
    return getBaseSandwichPrice(fiambreId, quesoId, pricing.matrix);
  };

  const getSandwichUnitPriceCalculated = (
    fiambreId: FiambreId,
    quesoId: QuesoId,
    extras: Extra[],
    bebidas?: Bebida[]
  ): number => {
    return calculateSandwichUnitPrice(fiambreId, quesoId, extras, bebidas, pricing);
  };

  const getFiambreMinPrice = (fiambreId: FiambreId): number => {
    const row = pricing.matrix[fiambreId];
    if (!row) return 0;
    const prices = Object.values(row).filter((p): p is number => typeof p === 'number');
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const getExtraPrice = (extraId: ExtraId): number => {
    return pricing.extras[extraId] ?? 0;
  };

  const getBebidaPrice = (bebidaId: BebidaId): number => {
    return pricing.bebidas[bebidaId] ?? 0;
  };

  const isOutOfStock = (itemId: string): boolean => {
    return Boolean(pricing.outOfStock && pricing.outOfStock.includes(itemId));
  };

  const calculateOfferPrice = (
    fiambreId: FiambreId = dailyOffer.fiambreId,
    quesoId: QuesoId = dailyOffer.quesoId,
    bebidaId?: BebidaId | 'sin-bebida',
    extras: Extra[] = [],
    discount: number = dailyOffer.discountPercentage
  ) => {
    const targetBebidaId = bebidaId !== undefined ? bebidaId : dailyOffer.defaultBebidaId;
    const finalBebidaId = (targetBebidaId === 'sin-bebida' || !targetBebidaId) ? undefined : (targetBebidaId as BebidaId);
    return calculateDailyOfferPrice(fiambreId, quesoId, finalBebidaId, extras, discount, pricing);
  };

  const savePricing = async (newState: PricingState, adminEmail: string, description?: string) => {
    await savePricingState(newState, adminEmail, 'SINGLE_PRICE_UPDATE', description);
    setPricing(newState);
  };

  const applyGlobalIncrease = async (
    amount: number,
    targetScope: 'sandwiches' | 'extras' | 'bebidas' | 'all',
    adminEmail: string
  ): Promise<PricingState> => {
    const updated = await applyGlobalPriceIncreaseService(amount, targetScope, adminEmail);
    setPricing(updated);
    return updated;
  };

  const saveDailyOffer = async (newOffer: Partial<DailyOfferState>, adminEmail: string) => {
    await updateDailyOfferService(newOffer, adminEmail);
    setDailyOffer((prev) => ({ ...prev, ...newOffer }));
  };

  const contextValue = useMemo(
    () => ({
      pricing,
      dailyOffer,
      isLoading,
      getSandwichPrice,
      getSandwichUnitPrice: getSandwichUnitPriceCalculated,
      getFiambreMinPrice,
      getExtraPrice,
      getBebidaPrice,
      isOutOfStock,
      calculateOfferPrice,
      savePricing,
      applyGlobalIncrease,
      saveDailyOffer,
    }),
    [pricing, dailyOffer, isLoading]
  );

  return <PricingContext.Provider value={contextValue}>{children}</PricingContext.Provider>;
};

export const usePricing = (): PricingContextType => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error('usePricing debe ser utilizado dentro de un PricingProvider');
  }
  return context;
};
