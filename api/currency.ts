import { ExchangeRates } from "../types/exchange.ts";

const URL = "https://www.cbr-xml-daily.ru/latest.js";

export const currency: ExchangeRates = await (await fetch(URL)).json();
