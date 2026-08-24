export interface TransactionRowState {
  readonly checking: boolean;
  readonly error: string | null;
}

export type TransactionRowStateMap = Readonly<Record<string, TransactionRowState>>;

export const INITIAL_ROW_STATE: TransactionRowState = {
  checking: false,
  error: null,
};