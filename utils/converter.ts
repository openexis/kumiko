export interface ExchangeRates {
  result: string;
  provider: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  time_eol_unix: number;
  base_code: string;
  rates: { [key: string]: number };
}
const URL = `https://open.er-api.com/v6/latest/`;

export async function convert(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): Promise<number> {
  const url = URL + `${fromCurrency}`;
  const response = await fetch(url);
  const json: ExchangeRates = await response.json();

  return amount * json.rates[toCurrency];
}

export async function rates(
  currencyCode: string,
): Promise<{ [key: string]: number }> {
  const url = URL + currencyCode;
  const response = await fetch(url);
  const json: ExchangeRates = await response.json();

  return json.rates;
}
