import { bot } from "../config/index.ts";
import { MyContext } from "../types/context.ts";
import {
  getKarma,
  updateKarma,
  isUserAtLimit,
  incrementUserChangeCount,
} from "../db/karma.ts";

const kv = await Deno.openKv();

// Handle + / - karma changes
bot.on(":text").filter(
  (ctx: MyContext) => /^(\+|-)\1*$/.test(ctx.msg!.text!),
  async (ctx: MyContext) => {
    if (!ctx.message?.reply_to_message) return;

    const user_id = ctx.from?.id!;
    const reply_user = ctx.msg.reply_to_message.from!;
    const reply_user_id = reply_user.id;

    if (user_id === reply_user_id) {
      return await ctx.reply(ctx.t("cant-change-own-reputation"));
    }

    if (await isUserAtLimit(user_id)) {
      return await ctx.reply(ctx.t("cant-change-user-karma"));
    }

    const karma_amount = ctx.msg.text.startsWith("+") ? 1 : -1;

    await incrementUserChangeCount(user_id);

    const reply_user_name = reply_user.first_name || "User";

    await updateKarma(reply_user_id, karma_amount, reply_user_name);

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
  const topUsers: { id: string; name: string; karma: number }[] = [];

  for await (const entry of kv.list({ prefix: ["karma"] })) {
    const userId = entry.key[1] as string;

    let karma: number;
    let name: string;

    if (typeof entry.value === "number") {
      karma = entry.value;
      name = "User";
    } else {
      karma = entry.value?.score ?? 0;
      name = entry.value?.name ?? "User";
    }

    topUsers.push({ id: userId, name, karma });
  }

  topUsers.sort((a, b) => b.karma - a.karma);
  const top10 = topUsers.slice(0, 10);

  if (top10.length === 0) {
    return await ctx.reply("📉 Nobody has karma yet.");
  }

  let reply = "🏆 <b>Top 10 Users by Karma</b>\n\n";
  for (let i = 0; i < top10.length; i++) {
    const user = top10[i];
    reply += `${i + 1}. <a href="tg://user?id=${user.id}">${user.name}</a> — <b>${user.karma}</b>\n`;
  }

  await ctx.reply(reply, { parse_mode: "HTML" });
});
