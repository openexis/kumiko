import { bot } from "../../config/bot.ts";
import { Context } from "../../deps.ts";

bot.command("unban", async (ctx: Context) => {
  await ctx.reply("");
});
