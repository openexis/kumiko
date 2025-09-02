import { bot } from "../config/index.ts";

bot.command("start", async (ctx) => {
  await ctx.reply(ctx.t("start", {
    name: ctx.from?.first_name ?? "there",
  }));
});
