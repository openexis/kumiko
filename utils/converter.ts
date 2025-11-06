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
	
	// Fetch fresh data with error handling
	try {
		const url = `${URL}${currencyCode}`;
		const response = await fetch(url);
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
		}
		
		const text = await response.text();
		let json: ExchangeRates;
		try {
			json = JSON.parse(text);
		} catch (parseError) {
			throw new Error(`Invalid JSON response from ${url}: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
		}
		
		// Update cache only on successful fetch
		ratesCache.set(currencyCode, { data: json, timestamp: now });
		
		return json;
	} catch (error) {
		// If fetch fails and we have cached data, return it even if stale
		if (cached) {
			const ageMinutes = Math.floor((now - cached.timestamp) / 60000);
			console.error(
				`Failed to fetch rates for ${currencyCode}, using stale cache (${ageMinutes} minutes old):`,
				error
			);
			return cached.data;
		}
		// Otherwise, re-throw the error
		throw error;
	}
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
