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

// Cache for exchange rates to reduce API calls
const ratesCache = new Map<string, { data: ExchangeRates; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour cache (rates don't change that often)

async function fetchWithCache(currencyCode: string): Promise<ExchangeRates> {
	const now = Date.now();
	const cached = ratesCache.get(currencyCode);
	
	// Return cached data if still valid
	if (cached && (now - cached.timestamp) < CACHE_TTL) {
		return cached.data;
	}
	
	// Fetch fresh data
	const url = URL + currencyCode;
	const response = await fetch(url);
	const json: ExchangeRates = await response.json();
	
	// Update cache
	ratesCache.set(currencyCode, { data: json, timestamp: now });
	
	return json;
}

export async function convert(
	amount: number,
	fromCurrency: string,
	toCurrency: string,
): Promise<number> {
	const json = await fetchWithCache(fromCurrency);
	return amount * json.rates[toCurrency];
}

export async function rates(
	currencyCode: string,
): Promise<{ [key: string]: number }> {
	const json = await fetchWithCache(currencyCode);
	return json.rates;
}

export async function base(
	currencyCode: string,
): Promise<ExchangeRates> {
	return await fetchWithCache(currencyCode);
}
