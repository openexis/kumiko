import { bot } from "../config/bot.ts";

bot.command("source", (ctx) => {
  ctx.reply(ctx.t("source"));
});
