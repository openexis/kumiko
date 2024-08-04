export interface ExchangeRates {
  disclaimer?: string;
  timestamp?: number;
  date: string;
  base: string;
  rates: { [key: string]: number };
}
