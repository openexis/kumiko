import { kv } from "../config/kv.ts";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function ask_grok(
  prompt: string,
  replied_message?: string,
): Promise<string> {
  const entry = await kv.get<string>(["GEMINI_API_KEY"]);
  const GEMINI_API_KEY = entry.value;

  console.log("GEMINI: ", GEMINI_API_KEY);
  if (GEMINI_API_KEY == undefined) return "Gemini API KEY is not set.";

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
      "contents": [
        {
          "parts": content,
        },
      ],
    }),
  });

  const body = await request.json();
  console.log(body.candidates);
  console.log(body);

  return body.candidates[0].content.parts[0].text;
}

export { ask_grok };
