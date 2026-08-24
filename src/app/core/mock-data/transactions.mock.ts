import { Transaction } from '../models/transaction.model';

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-9823-XYZ', customerName: 'Acme Corp Ltd.', amount: 45000, paymentMethod: 'UPI', status: 'SUCCESS', createdAt: '2026-08-06T09:15:00Z', updatedAt: '2026-08-06T09:15:42Z' },
  { id: 'TRX-9824-ABC', customerName: 'Stark Industries', amount: 12500, paymentMethod: 'CARD', status: 'PENDING', createdAt: '2026-08-06T09:45:00Z', updatedAt: '2026-08-06T09:45:00Z' },
  { id: 'TRX-9825-DEF', customerName: 'Wayne Enterprises', amount: 8750, paymentMethod: 'NET_BANKING', status: 'SUCCESS', createdAt: '2026-08-06T10:10:00Z', updatedAt: '2026-08-06T10:11:03Z' },
  { id: 'TRX-9826-GHI', customerName: 'Globex Corp', amount: 1200, paymentMethod: 'UPI', status: 'FAILED', createdAt: '2026-08-06T10:22:00Z', updatedAt: '2026-08-06T10:22:19Z' },
  { id: 'TRX-9827-JKL', customerName: 'Soylent Corp', amount: 55000, paymentMethod: 'CARD', status: 'PENDING', createdAt: '2026-08-06T11:05:00Z', updatedAt: '2026-08-06T11:05:00Z' },
  { id: 'TRX-9828-MNO', customerName: 'Initech LLC', amount: 3400, paymentMethod: 'UPI', status: 'PROCESSING', createdAt: '2026-08-07T08:30:00Z', updatedAt: '2026-08-07T08:30:00Z' },
  { id: 'TRX-9829-PQR', customerName: 'Umbrella Corp', amount: 98000, paymentMethod: 'NET_BANKING', status: 'SUCCESS', createdAt: '2026-08-07T09:12:00Z', updatedAt: '2026-08-07T09:13:05Z' },
  { id: 'TRX-9830-STU', customerName: 'Hooli Inc', amount: 27500, paymentMethod: 'CARD', status: 'REFUNDED', createdAt: '2026-08-07T09:50:00Z', updatedAt: '2026-08-08T14:00:00Z' },
  { id: 'TRX-9831-VWX', customerName: 'Cyberdyne Systems', amount: 610, paymentMethod: 'UPI', status: 'FAILED', createdAt: '2026-08-07T10:40:00Z', updatedAt: '2026-08-07T10:40:33Z' },
  { id: 'TRX-9832-YZA', customerName: 'Oscorp Industries', amount: 15750, paymentMethod: 'NET_BANKING', status: 'PENDING', createdAt: '2026-08-08T09:05:00Z', updatedAt: '2026-08-08T09:05:00Z' },
  { id: 'TRX-9833-BCD', customerName: 'Massive Dynamic', amount: 220000, paymentMethod: 'CARD', status: 'SUCCESS', createdAt: '2026-08-08T09:47:00Z', updatedAt: '2026-08-08T09:48:11Z' },
  { id: 'TRX-9834-EFG', customerName: 'Gringotts Bank', amount: 5000, paymentMethod: 'UPI', status: 'SUCCESS', createdAt: '2026-08-08T10:15:00Z', updatedAt: '2026-08-08T10:15:29Z' },
  { id: 'TRX-9835-HIJ', customerName: 'Prestige Worldwide', amount: 41200, paymentMethod: 'NET_BANKING', status: 'PROCESSING', createdAt: '2026-08-08T11:30:00Z', updatedAt: '2026-08-08T11:30:00Z' },
  { id: 'TRX-9836-KLM', customerName: 'Sirius Cybernetics', amount: 990, paymentMethod: 'CARD', status: 'FAILED', createdAt: '2026-08-09T08:20:00Z', updatedAt: '2026-08-09T08:20:47Z' },
  { id: 'TRX-9837-NOP', customerName: 'Tyrell Corp', amount: 76000, paymentMethod: 'UPI', status: 'SUCCESS', createdAt: '2026-08-09T09:05:00Z', updatedAt: '2026-08-09T09:05:52Z' },
  { id: 'TRX-9838-QRS', customerName: 'Aperture Science', amount: 13300, paymentMethod: 'NET_BANKING', status: 'REFUNDED', createdAt: '2026-08-09T09:40:00Z', updatedAt: '2026-08-10T16:20:00Z' },
  { id: 'TRX-9839-TUV', customerName: 'Wayne Foundation', amount: 60500, paymentMethod: 'CARD', status: 'SUCCESS', createdAt: '2026-08-09T10:55:00Z', updatedAt: '2026-08-09T10:56:14Z' },
  { id: 'TRX-9840-WXY', customerName: 'Acme Corp Ltd.', amount: 2100, paymentMethod: 'UPI', status: 'PENDING', createdAt: '2026-08-09T11:20:00Z', updatedAt: '2026-08-09T11:20:00Z' },
];
