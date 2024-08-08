import { ExchangeRates } from "../types/exchange.ts";

export class CurrencyConverter {
  private rates: { [key: string]: number };
  private base: string;

  constructor(data: ExchangeRates) {
    this.rates = data.rates;
    this.base = data.base;
  }

  //   convert(amount: number, fromCurrency: string, toCurrency: string): number {
  //     if (fromCurrency === this.base) {
  //       return amount * this.rates[toCurrency];
  //     } else if (toCurrency === this.base) {
  //       return amount / this.rates[fromCurrency];
  //     } else {
  //       const baseAmount = amount / this.rates[fromCurrency];
  //       return baseAmount * this.rates[toCurrency];
  //     }
  //   }

  convert(amount: number, fromCurrency: string, toCurrency: string): number {
    const convertedAmount = this.convertAmount(
      amount,
      fromCurrency,
      toCurrency,
    );

    return Number(convertedAmount.toFixed(2));
  }

  private convertAmount(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): number {
    if (fromCurrency === this.base) {
      return amount * this.rates[toCurrency];
    } else if (toCurrency === this.base) {
      return amount / this.rates[fromCurrency];
    } else {
      const baseAmount = amount / this.rates[fromCurrency];
      return baseAmount * this.rates[toCurrency];
    }
  }
}
