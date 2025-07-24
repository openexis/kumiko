import { bot } from "../config/index.ts";
import { MyContext } from "../types/context.ts";

import { getKarma, updateKarma } from "../db/karma.ts";

bot.on(":text").filter(
  (ctx: MyContext) => /^(\+|-)\1*$/.test(ctx.msg!.text!),
  async (ctx: MyContext) => {
    if (!ctx.message?.reply_to_message) {
      return;
    }

    const user_id = ctx.from?.id!;
    const reply_user_id = ctx.msg?.reply_to_message?.from?.id as number;

    if (user_id == reply_user_id) {
      return await ctx.reply(ctx.t("cant-change-own-reputation"));
    }

    const karma_amount = ctx.msg?.text?.startsWith("+") ? 1 : -1;
    await updateKarma(reply_user_id, karma_amount);

    const fromUserKarma = await getKarma(user_id);
    const toUserKarma = await getKarma(reply_user_id);

    const action = karma_amount === 1 ? ctx.t("increased") : ctx.t("decreased");

    await ctx.reply(
      ctx.t("reputation-changed", {
        user_id: user_id,
        user_name: ctx.from?.first_name!,
        from_user_karma: fromUserKarma!,
        action: action,
        reply_user_id: reply_user_id,
        reply_user_name: ctx.msg?.reply_to_message?.from?.first_name!,
        to_user_karma: toUserKarma!,
      }),
      {
        parse_mode: "HTML",
      },
    );
  },
);
