import { kv } from "../config/kv.ts";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function ask_grok(
  prompt: string,
  locale: string,
  replied_message?: string,
): Promise<string> {
  const entry = await kv.get<string>(["GEMINI_API_KEY"]);
  const GEMINI_API_KEY = entry.value;

  console.log("GEMINI: ", GEMINI_API_KEY);
  if (GEMINI_API_KEY == undefined) return "Gemini API KEY is not set.";

  const system_instruction = {
    parts: [
      {
        "text": "Your response should be Telegram-compatible HTML format",
      },
      {
        "text":
          "Your name is Kumiko, you are a Telegram bot that moderates telegram group and has a lot of useful features such as anime searching from shikimori, currency exchanger, moderation commands and karma system",
      },
      {
        "text": "Use the language of prompt, or this: " + locale,
      },
    ],
  };

  const content = [];
  if (replied_message != undefined) {
    content.push({
      "text": replied_message,
    });
  }

  content.push({ "text": prompt });

  const request = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      system_instruction,
      contents: [
        {
          parts: content,
        },
      ],
    }),
  });

  const body = await request.json();
  console.log(body);

  if (body.error) {
    return `${body.error.code}: ${body.error.message}`;
  }

  console.log(body.candidates);

  return body
    .candidates[0]
    .content
    .parts[0]
    .text
    .replaceAll("```html")
    .replaceAll("```");
}

export { ask_grok };
