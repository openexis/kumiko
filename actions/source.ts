import { bot } from "../config/index.ts";

bot.command("source", (ctx) => {
  ctx.reply(ctx.t("source"));
});
