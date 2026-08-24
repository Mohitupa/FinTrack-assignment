import { Transaction } from '../models/transaction.model';

const METHOD_LABELS: Record<Transaction['paymentMethod'], string> = {
  UPI: 'UPI',
  CARD: 'CARD',
  NET_BANKING: 'NETBANKING',
};

export function getMethodLabel(method: Transaction['paymentMethod']): string {
  return METHOD_LABELS[method];
}