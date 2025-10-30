import { services } from "../api/cobalt.ts";
import { bot } from "../config/bot.ts";

bot.command("services", async (ctx) => {
  const list = await services();

  if (list.length == 0) {
    return await ctx.reply("Something is wrong with Cobalt API URL.");
  }

  return await ctx.reply(
    "<b>List of supported services:</b> \n" + `<blockquote expandable>\n-` +
      list.join("\n-") + `</blockquote>`,
    {
      parse_mode: "HTML",
    },
  );
});
