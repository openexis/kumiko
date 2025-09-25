import { bot } from "../config/bot.ts";
import { ask_grok } from "../utils/ai.ts";

bot.on(":text", async (ctx) => {
  if (ctx.message == undefined) return;

  if (!ctx.message.text.startsWith("@grok")) return;

  if (![5560860031, 7364646175].includes(ctx.message.from.id)) return;

  const prompt = ctx.message.text.split("@grok")[1].trim();
  console.log("Prompt: ", prompt);
  const result = await ask_grok(prompt, ctx.message.reply_to_message?.text);

  await ctx.reply(result);
});
