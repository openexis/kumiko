import { bot } from "../config/bot.ts";
import { MyContext } from "../types/context.ts";

bot.command("help", async (ctx: MyContext) => {
  await ctx.reply(ctx.t("help-commands"), {
    parse_mode: "HTML",
  });
});
