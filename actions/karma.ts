import { bot } from "../config/index.ts";
import { MyContext } from "../types/context.ts";
import {
  getKarma,
  incrementUserChangeCount,
  isUserAtLimit,
  updateKarma,
} from "../db/karma.ts";

import { kv } from "../config/index.ts";

// Handle + / - karma changes
bot.chatType(["group", "supergroup"]).on(":text").filter(
  (ctx: MyContext) =>
    /^(\+|-)\1*$/.test(ctx.msg!.text!) || ["thanks"].includes(ctx.msg!.text!),
  async (ctx: MyContext) => {
    if (!ctx.message?.reply_to_message) return;

    const chat_id = ctx.chatId!;
    const user_id = ctx.from!.id!;
    const reply_user = ctx.msg!.reply_to_message!.from!;
    const reply_user_id = reply_user.id;

    if (user_id === reply_user_id) {
      return await ctx.reply(ctx.t("cant-change-own-reputation"));
    }

    if (await isUserAtLimit(user_id)) {
      return await ctx.reply(ctx.t("cant-change-user-karma"));
    }

    const karma_amount = ctx.msg!.text!.startsWith("+") ? 1 : -1;
    const reply_user_name = reply_user.first_name;

    await incrementUserChangeCount(user_id);
    await updateKarma(chat_id, reply_user_id, karma_amount);

    const fromUserKarma = await getKarma(chat_id, user_id);
    const toUserKarma = await getKarma(chat_id, reply_user_id);

    const action = karma_amount === 1 ? ctx.t("increased") : ctx.t("decreased");

    await ctx.reply(
      ctx.t("reputation-changed", {
        user_id: user_id,
        user_name: ctx.from!.first_name!,
        from_user_karma: fromUserKarma!,
        action: action,
        reply_user_id: reply_user_id,
        reply_user_name: reply_user_name,
        to_user_karma: toUserKarma!,
      }),
      {
        parse_mode: "HTML",
      },
    );
  },
);

bot.command("top", async (ctx: MyContext) => {
  const topUsers: { id: string; karma: number }[] = [];

  for await (
    const entry of kv.list<number>({
      prefix: ["karma", ctx.chatId!.toString()],
    })
  ) {
    const userId = entry.key[2] as string;

    topUsers.push({ id: userId, karma: entry.value });
  }

  topUsers.sort((a, b) => b.karma - a.karma);
  const top10 = topUsers.slice(0, 10);

  if (top10.length === 0) {
    return await ctx.reply("📉 Nobody has karma yet.");
  }

  let reply = `🏆 <b>${ctx.t("top-10-users-by-karma")}</b>\n\n`;
  for (let i = 0; i < top10.length; i++) {
    const user = top10[i];
    const getChatUser = await bot.api.getChat(user.id);
    reply += `${
      i + 1
    }. <a href="tg://user?id=${user.id}">${getChatUser.first_name}</a> — <b>${user.karma}</b>\n`;
  }

  await ctx.reply(reply, { parse_mode: "HTML" });
});
