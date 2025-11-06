import { kv } from "../config/kv.ts";

interface CobaltResponse {
	ok: true | false;
	url: string;
	message: string;
	filetype: "video" | "photo" | "idk";
}

export interface Specific {
	youtubeVideoCodec?: "h264" | "av1" | "vp9";
	youtubeVideoContainer?: "auto" | "mp4" | "webm" | "mkv";
}

// Cache the Cobalt API URL to avoid repeated KV lookups
let cachedCobaltApiUrl: string | null | undefined = undefined;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute cache

async function getCobaltApiUrl(): Promise<string | undefined> {
	const now = Date.now();
	
	// Return cached value if still valid (check timestamp to ensure cache was set)
	if (cacheTimestamp > 0 && (now - cacheTimestamp) < CACHE_TTL) {
		return cachedCobaltApiUrl ?? undefined;
	}
	
	// Fetch from KV and update cache (cache null values to avoid repeated lookups for missing config)
	const entry = await kv.get<string>(["COBALT_API_URL"]);
	
	// Update cache - including null to avoid repeated KV lookups
	cachedCobaltApiUrl = entry.value;
	cacheTimestamp = now;
	
	return entry.value ?? undefined;
}

async function download(
	url: string,
	specific?: Specific,
): Promise<CobaltResponse> {
	const COBALT_API_URL = await getCobaltApiUrl();

	if (COBALT_API_URL == undefined) {
		return {
			ok: false,
			url: "",
			message: "Cobalt API URL is not defined.",
			filetype: "idk",
		};
	}

	try {
		const response = await fetch(COBALT_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
			},
			body: JSON.stringify({
				url,
				downloadMode: "auto",
				...specific,
			}),
		});

		if (!response.ok) {
			const text = await response.text();
			return {
				ok: false,
				url: "",
				message: `Cobalt API error (${response.status}): ${text}`,
				filetype: "idk",
			};
		}

		const body = await response.json();

		const filename = body.filename;

		const fileExtension = filename.split(".").pop();

		if (["jpg", "png", "jpeg"].includes(fileExtension)) {
			return {
				ok: true,
				url: body.url,
				message: "Photo is downloaded successfully",
				filetype: "photo",
			};
		}

		return {
			ok: true,
			url: body.url,
			message: "Video is downloaded successfully",
			filetype: "video",
		};
	} catch (e) {
		const error = e instanceof Error ? e.message : String(e);
		return {
			ok: false,
			url: "",
			message: `Network or parsing error: ${error}`,
			filetype: "idk",
		};
	}
}

async function is_supported(platform: string): Promise<CobaltResponse> {
	const COBALT_API_URL = await getCobaltApiUrl();

	if (COBALT_API_URL == undefined) {
		return {
			ok: false,
			url: "",
			message: "Cobalt API URL is not defined.",
			filetype: "idk",
		};
	}

	const response = await fetch(COBALT_API_URL);
	const { cobalt, cobalt: { services } } = await response.json() as {
		cobalt: { services: string[] };
	};

	services.push("x");
	console.log("Cobalt: ", cobalt);
	console.log("Services:", services);

	if (!services.includes(platform)) {
		return {
			ok: false,
			url: "",
			message: "This service is not supported.",
			filetype: "idk",
		};
	}

	return {
		ok: true,
		url: "",
		message: "OK",
		filetype: "idk",
	};
}

async function services(): Promise<string[]> {
	const COBALT_API_URL = await getCobaltApiUrl();

	if (COBALT_API_URL == undefined) {
		return [];
	}

	const response = await fetch(COBALT_API_URL);
	const { cobalt: { services } } = await response.json() as {
		cobalt: { services: string[] };
	};

	services.push("x");

	return services.filter((service) => service != "tiktok");
}

export { download, is_supported, services };
