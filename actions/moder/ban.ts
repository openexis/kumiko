import { bot } from "../../config/bot.ts";
import { Context } from "../../deps.ts";
import { isReplying } from "../../utils/detect.ts";
import { isAdmin, isReplyingToMe } from "../../utils/detect.ts";

// Command to ban users.
bot.command("ban").filter(
  async (ctx: Context) => await isAdmin(ctx), // Check if user is admin
  async (ctx: Context) => { // Perform ban action
    if (!await isReplying(ctx)) {
      await ctx.reply("Reply to a message."); // Prompt user to reply to a message
      return;
    }

    if (isReplyingToMe(ctx)) {
      await ctx.reply("Okay, Should I ban myself? Hmmm..."); // Inform user about replying to self
      return;
    }

    await ctx.banChatMember( // Ban the user
      ctx.msg?.reply_to_message?.from?.id as number,
    ).then(() => {
      ctx.reply( // Notify about the ban
        `The user [${ctx.message?.reply_to_message?.from?.first_name}](tg://user?id=${ctx.message?.reply_to_message?.from?.id}) has been banned.`,
        {
          parse_mode: "Markdown", // Set parse mode for message formatting
        },
      );
    });
  },
);