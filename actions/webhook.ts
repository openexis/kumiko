import { bot, kv } from "../config/index.ts";
import { decideResponse } from "../utils/decidewebhook.ts";

export async function handleGithubWebhook(req: Request): Promise<void> {
  const body = await req.json();

  const organization = Deno.env.get("GITHUB_ORG");

  if (organization == undefined) {
    return;
  }

  // Ignore IN ANY CASE, it's update from another organization
  if (
    organization.toLowerCase() !=
      body.organization.login.toString().toLowerCase()
  ) return;

  const id_credentials = await kv.get<{ chat_id: number; thread_id: number }>([
    "thread_id",
  ]);

  if (!id_credentials || !id_credentials.value) return;

  const { chat_id, thread_id } = id_credentials.value;
  const x_github_event = req.headers.get("X-GITHUB-EVENT") as string;
  const response = await decideResponse(x_github_event, body);

  if (response.text == "OK") return;

  await bot.api.sendMessage(chat_id, response.text, {
    message_thread_id: thread_id,
    parse_mode: "HTML",
    reply_markup: response.keyboard,
  });
}
