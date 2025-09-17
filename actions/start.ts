import { bot } from "../config/bot.ts";

bot.command("start", async (ctx) => {
  await ctx.reply(ctx.t("start", {
    name: ctx.from?.first_name ?? "there",
  }));
});
