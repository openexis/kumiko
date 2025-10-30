import { kv } from "../config/kv.ts";

interface CobaltResponse {
  ok: true | false;
  url: string;
  message: string;
  filetype: "video" | "photo" | "idk";
}

export interface Speicfic {
  youtubeVideoCodec?: "h264" | "av1" | "vp9";
  youtubeVideoContainer?: "auto" | "mp4" | "webm" | "mkv";
}

async function download(
  url: string,
  specific?: Speicfic,
): Promise<CobaltResponse> {
  const entry = await kv.get<string>(["COBALT_API_URL"]);
  const COBALT_API_URL = entry.value;

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
  const entry = await kv.get<string>(["COBALT_API_URL"]);
  const COBALT_API_URL = entry.value;

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

export { download, is_supported };
