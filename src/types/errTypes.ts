export type ErrorType = 'DIVISION_BY_ZERO' | 'INVALID_INPUT' | 'OVERFLOW';

export interface ErrorState {
  show: boolean;
  message: string;
  type: ErrorType | null;
}