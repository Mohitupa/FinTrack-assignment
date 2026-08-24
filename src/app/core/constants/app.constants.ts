import { TransactionStatus } from '../models/transaction.model';

export const APP_CONSTANTS = {
  SEARCH_DEBOUNCE_MS: 400,
  API_DELAY_MIN_MS: 500,
  API_DELAY_MAX_MS: 1000,
  LIST_LOAD_FAILURE_RATE: 0.05,
  DETAILS_LOAD_FAILURE_RATE: 0.1,   
  STATUS_CHECK_FAILURE_RATE: 0.15,
} as const;

export const STATUS_CHECK_OUTCOMES: TransactionStatus[] = [
  'SUCCESS',
  'FAILED',
  'PROCESSING',
];
