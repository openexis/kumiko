import { bot } from "../config/index.ts";
import { Context } from "../deps.ts";
import { isAdmin, isOwner } from "../utils/detect.ts";
import { kv } from "../config/index.ts";

bot.filter((ctx: Context) => ["group", "supergroup"].includes(ctx.chat?.type!))
  .command("set", async (ctx: Context) => {
    if (!Deno.env.get("GITHUB_ORG")) {
      return await ctx.reply(
        "You haven't set any GitHub organization in .env file.",
      );
    }

    if (!await isAdmin(ctx) || !await isOwner(bot, ctx)) {
      return await ctx.reply("Only admins can use this command!");
    }

    await kv.set(["thread_id"], {
      chat_id: ctx.chat?.id,
      thread_id: ctx.message?.message_thread_id,
    });

    await ctx.reply("The thread is set for GitHub webhooks!");
  });
