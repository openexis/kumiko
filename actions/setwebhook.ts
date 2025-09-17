import { bot } from "../config/bot.ts";
import { MyContext } from "../types/context.ts";
import { isAdmin, isOwner } from "../utils/detect.ts";
import { kv } from "../config/kv.ts";

bot.filter((ctx: MyContext) =>
  ["group", "supergroup"].includes(ctx.chat?.type ?? "")
)
  .command("set", async (ctx: MyContext) => {
    if (!Deno.env.get("GITHUB_ORG")) {
      return await ctx.reply(
        ctx.t("github-org-not-set"),
      );
    }

    if (!await isAdmin(ctx) || !await isOwner(bot, ctx)) {
      return await ctx.reply(ctx.t("only-admins-can-use"));
    }

    await kv.set(["thread_id"], {
      chat_id: ctx.chat?.id,
      thread_id: ctx.message?.message_thread_id,
    });

    await ctx.reply(ctx.t("thread-set-for-webhooks"));
  });
