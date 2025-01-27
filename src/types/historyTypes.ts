export interface HistoryItem {
  expression: string;
  result: number;
  timestamp: Date;
}
export interface HistoryState {
  items: HistoryItem[];
}