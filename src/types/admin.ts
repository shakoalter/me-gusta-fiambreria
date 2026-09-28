import { FiambreId, QuesoId, ExtraId, BebidaId } from './product';
import { DailyOfferConfig } from '../data/dailyOffer';

export interface PricingState {
  matrix: Record<FiambreId, Record<QuesoId, number>>;
  extras: Record<ExtraId, number>;
  bebidas: Record<BebidaId, number>;
  updatedAt?: string;
  updatedBy?: string;
}

export interface DailyOfferState extends DailyOfferConfig {
  active: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export type AuditActionType = 'GLOBAL_INCREASE' | 'SINGLE_PRICE_UPDATE' | 'DAILY_OFFER_UPDATE' | 'MATRIX_RESET';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminEmail: string;
  actionType: AuditActionType;
  description: string;
  details?: {
    amountAdded?: number;
    targetScope?: 'sandwiches' | 'extras' | 'bebidas' | 'all';
    changedItemsCount?: number;
    sampleChanges?: Array<{ item: string; oldPrice: number; newPrice: number }>;
  };
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
