import { bot } from "../config/index.ts";
import { MyContext } from "../types/context.ts";

bot.command("start", async (ctx: MyContext) => {
  await ctx.reply(ctx.t("start", {
    name: ctx.from?.first_name ?? "there",
  }));
});
