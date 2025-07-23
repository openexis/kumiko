import { bot } from "../config/index.ts";
import { Context } from "../deps.ts";

import { getKarma, updateKarma } from "../db/karma.ts";

bot.on(":text").filter(
  (ctx: Context) => /^(\+|-)\1*$/.test(ctx.msg!.text!),
  async (ctx: Context) => {
    if (!ctx.message?.reply_to_message) {
      return;
    }

    const user_id = ctx.from?.id!;
    const reply_user_id = ctx.msg?.reply_to_message?.from?.id as number;

    if (user_id == reply_user_id) {
      return await ctx.reply(
        "You can't give increase or decrease your reputation.",
      );
    }

    const karma_amount = ctx.msg?.text?.startsWith("+") ? 1 : -1;
    await updateKarma(reply_user_id, karma_amount);

    const [fromUserKarma, toUserKarma] = await Promise.all([
      getKarma(user_id),
      getKarma(reply_user_id),
    ]);

    const action = karma_amount === 1 ? "increased" : "decreased";

    await ctx.reply(
      `<a href="tg://user?id=${user_id}">${ctx.from?.first_name}</a> (${fromUserKarma}) has ${action} reputation of <a href="tg://user?id=${reply_user_id}">${ctx.msg?.reply_to_message?.from?.first_name}</a> (${toUserKarma})`,
      {
        parse_mode: "HTML",
      },
    );
  },
);
