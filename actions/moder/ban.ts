import { bot } from "../../config/bot.ts";
import { isAdmin, isReplyingToMe } from "../../utils/detect.ts";

bot.command("ban").filter(
  async (ctx) => await isAdmin(ctx),
  async (ctx) => {
    const reply_to_message = ctx.message?.reply_to_message;

    if (reply_to_message == undefined) {
      await ctx.reply(ctx.t("reply-to-message"));
      return;
    }

    const replied_user = reply_to_message.from;

    if (replied_user == undefined) {
      return;
    }

    if (isReplyingToMe(ctx)) {
      await ctx.reply(ctx.t("should-i-ban-myself"));
      return;
    }

    await ctx.banChatMember( // Ban the user
      ctx.msg?.reply_to_message?.from?.id as number,
    ).then(() => {
      ctx.reply(
        ctx.t("user-banned", {
          user_name: replied_user.first_name,
          user_id: replied_user.id,
        }),
        {
          parse_mode: "Markdown",
        },
      );
    });
  },
);
