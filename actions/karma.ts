import { bot } from "../config/index.ts";
import { Context } from "../deps.ts";

import { decreaseKarma, getKarma, increaseKarma } from "../db/karma.ts";

bot.on(":text").filter(
  (ctx: Context) => ["+", "-"].includes(ctx.msg!.text!),
  async (ctx: Context) => {
    const user_id = ctx.from?.id!;
    const reply_user_id = ctx.msg?.reply_to_message?.from?.id as number;

    if (user_id == reply_user_id) {
      return await ctx.reply(
        "You can't give increase or decrease your reputation.",
      );
    }

    if (ctx.msg?.text == "+") {
      await increaseKarma(reply_user_id);

      await ctx.reply(
        `<a href="tg://user?id=${user_id}">${ctx.from?.first_name}</a> (${await getKarma(
          user_id,
        )}) has increased reputation of <a href="tg://user?id=${reply_user_id}">${ctx.msg?.reply_to_message?.from?.first_name}</a> (${await getKarma(
          reply_user_id,
        )})`,
        {
          parse_mode: "HTML",
        },
      );
    }

    if (ctx.msg?.text == "-") {
      await decreaseKarma(reply_user_id);

      await ctx.reply(
        `<a href="tg://user?id=${user_id}">${ctx.from?.first_name}</a> (${await getKarma(
          user_id,
        )}) has decreased reputation of <a href="tg://user?id=${reply_user_id}">${ctx.msg?.reply_to_message?.from?.first_name}</a> (${await getKarma(
          reply_user_id,
        )})`,
        {
          parse_mode: "HTML",
        },
      );
    }
  },
);
