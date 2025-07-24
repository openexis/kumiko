import { bot } from "../../config/bot.ts";
import { MyContext } from "../../types/context.ts";
import { isAdmin, isReplying, isReplyingToMe } from "../../utils/detect.ts";

bot.command("unban").filter(
  async (ctx: MyContext) => await isAdmin(ctx),
  async (ctx: MyContext) => {
    if (!isReplying(ctx)) {
      await ctx.reply(ctx.t("reply-to-message"));
      return;
    }
    if (isReplyingToMe(ctx)) {
      await ctx.reply(ctx.t("should-i-ban-myself"));
      return;
    }
    await ctx.unbanChatMember(ctx.msg?.reply_to_message?.from?.id as number).then(
      () => {
        ctx.reply(
          ctx.t("user-unbanned", {
            user_name: ctx.message?.reply_to_message?.from?.first_name!,
            user_id: ctx.message?.reply_to_message?.from?.id!,
          }),
          {
            parse_mode: "Markdown",
          },
        );
      },
    );
  },
);
