import { bot } from "../../config/bot.ts";
import { MyContext } from "../../types/context.ts";
import { isReplying } from "../../utils/detect.ts";
import { isAdmin, isReplyingToMe } from "../../utils/detect.ts";

// Command to ban users.
bot.command("ban").filter(
  async (ctx: MyContext) => await isAdmin(ctx), // Check if user is admin
  async (ctx: MyContext) => { // Perform ban action
    if (!isReplying(ctx)) {
      await ctx.reply(ctx.t("reply-to-message")); // Prompt user to reply to a message
      return;
    }

    if (isReplyingToMe(ctx)) {
      await ctx.reply(ctx.t("should-i-ban-myself")); // Inform user about replying to self
      return;
    }

    await ctx.banChatMember( // Ban the user
      ctx.msg?.reply_to_message?.from?.id as number,
    ).then(() => {
      ctx.reply(
          ctx.t("user-banned", {
            user_name: ctx.message?.reply_to_message?.from?.first_name!,
            user_id: ctx.message?.reply_to_message?.from?.id!,
          }),
          {
            parse_mode: "Markdown",
          },
        );
    });
  },
);
