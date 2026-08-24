export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING';

export type TransactionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'REFUNDED';

export interface Transaction {
  readonly id: string;
  readonly customerName: string;
  readonly amount: number;
  readonly paymentMethod: PaymentMethod;
  readonly status: TransactionStatus;
  readonly createdAt: string;   
  readonly updatedAt: string;  
}

interface BaseTransactionDetails extends Transaction {
  readonly referenceId: string; 
}

export interface PendingDetails extends BaseTransactionDetails {
  readonly status: 'PENDING';
  readonly lastStatusCheckAt?: string;
}

export interface ProcessingDetails extends BaseTransactionDetails {
  readonly status: 'PROCESSING';
  readonly lastStatusCheckAt?: string;
}

export interface SuccessDetails extends BaseTransactionDetails {
  readonly status: 'SUCCESS';
  readonly bankReference: string;
}

export interface FailedDetails extends BaseTransactionDetails {
  readonly status: 'FAILED';
  readonly failureReason: string;
}

export interface RefundedDetails extends BaseTransactionDetails {
  readonly status: 'REFUNDED';
  readonly refundReference: string;
  readonly refundedAt: string;
}

export type TransactionDetails =
  | PendingDetails
  | ProcessingDetails
  | SuccessDetails
  | FailedDetails
  | RefundedDetails;