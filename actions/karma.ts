import { bot } from "../config/bot.ts";
import {
  getKarma,
  incrementUserChangeCount,
  isUserAtLimit,
  updateKarma,
} from "../db/karma.ts";

import { kv } from "../config/kv.ts";

const karma_words = [
  "thanks",
  "tnx",
  "raxmat",
  "rahmat",
  "рахмат",
  "спасибо",
  "спасиба",
  "спасибки",
  "спс",
  "пасиб",
  "пасиба",
  "сяп",
  "пасибки",
  "спасибочки",
  "благодарю",
  "респект",
  // "от души",
  // "thank you",
  "ty",
  "respect",
  "tashakkur",
  "minnatdorman",
];

// Handle + / - karma changes
bot.chatType(["group", "supergroup"]).on(":text").filter(
  (ctx) =>
    /^(\+|-)\1*$/.test(ctx.msg!.text!) ||
    karma_words.filter((word) => ctx.message.text.split(" ").includes(word))
        .length > 0,
  async (ctx) => {
    if (!ctx.message?.reply_to_message) return;

    const chat_id = ctx.chatId!;
    const user_id = ctx.from!.id!;
    const reply_user = ctx.msg!.reply_to_message!.from!;
    const reply_user_id = reply_user.id;

    if (user_id === reply_user_id) {
      return await ctx.reply(ctx.t("cant-change-own-reputation"));
    }

    if (await isUserAtLimit(chat_id, user_id)) {
      return await ctx.reply(ctx.t("cant-change-user-karma"));
    }

    const karma_amount = ctx.msg!.text!.startsWith("+") ||
        karma_words.filter((word) => ctx.msg!.text.split(" ").includes(word))
            .length > 0
      ? 1
      : -1;
    const reply_user_name = reply_user.first_name;

    await incrementUserChangeCount(chat_id, user_id);
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

bot.command("top", async (ctx) => {
  const topUsers: { id: number; karma: number }[] = [];

  for await (
    const entry of kv.list<number>({
      prefix: ["karma", ctx.chatId!.toString()],
    })
  ) {
    const userId = entry.key[2] as string;

    topUsers.push({ id: parseInt(userId), karma: entry.value });
  }

  topUsers.sort((a, b) => b.karma - a.karma);
  const top10 = topUsers.slice(0, 10);

  if (top10.length === 0) {
    return await ctx.reply("📉 Nobody has karma yet.");
  }

  let reply = `🏆 <b>${ctx.t("top-10-users-by-karma")}</b>\n\n`;
  for (let i = 0; i < top10.length; i++) {
    const user = top10[i];
    const chatId = ctx.chatId;

    if (chatId == undefined) {
      return;
    }

    const getChatUser = await bot.api.getChatMember(chatId, user.id);
    reply += `${
      i + 1
    }. <a href="tg://user?id=${user.id}">${getChatUser.user.first_name}</a> — <b>${user.karma}</b>\n`;
  }

  await ctx.reply(reply, { parse_mode: "HTML" });
});
