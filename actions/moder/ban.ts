import { bot } from "../../config/bot.ts";
import { Context } from "../../deps.ts";
import { isReplying } from "../../utils/detect.ts";
import { isAdmin, isReplyingToMe } from "../../utils/detect.ts";

bot.command("ban").filter(
  async (ctx: Context) => await isAdmin(ctx),
  async (ctx: Context) => {
    if (!await isReplying(ctx)) {
      await ctx.reply("Reply to a message.");
      return;
    }

    if (isReplyingToMe(ctx)) {
      await ctx.reply("Okay, Should I ban myself? Hmmm...");
      return;
    }

    await ctx.banChatMember(
      ctx.msg?.reply_to_message?.from?.id as number,
    ).then(() => {
      ctx.reply(
        `The user [${ctx.message?.reply_to_message?.from?.first_name}](tg://user?id=${ctx.message?.reply_to_message?.from?.id}) has been banned.`,
        {
          parse_mode: "Markdown",
        },
      );
    });
  },
);
