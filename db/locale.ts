import { kv } from "../config/kv.ts";

export async function getLocale(chat_id: string | number): Promise<string> {
  const data = await kv.get<string>(["locale", chat_id.toString()]);

  console.log("From getlocale: ", data);
  if (data.value === null) {
    await kv.set(["locale", chat_id.toString()], "en");
    return "en";
  }

  return data.value;
}
