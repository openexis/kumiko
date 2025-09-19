import { bot } from "../../config/bot.ts";
import { unWarnUser } from "../../db/warns.ts";
import {
  isAdmin,
  isReplyingToAdmin,
  isReplyingToMe,
} from "../../utils/detect.ts";
import { MyContext } from "../../types/context.ts";

// Function to handle the unwarning logic
// deno-lint-ignore no-explicit-any
async function handleUnwarn(ctx: MyContext): Promise<any> {
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
    return await ctx.reply(ctx.t("should-i-unwarn-myself"));
  }

  if (await isReplyingToAdmin(ctx)) {
    return await ctx.reply(ctx.t("i-cant-unwarn-admins"));
  }

  if (replied_user == undefined) {
    return;
  }

  const userId = replied_user.id as number;
  const response = await unWarnUser(userId);

  if (response.status === 200) {
    const text = ctx.t("unwarn-success", {
      message: response.message,
      user_name: ctx.message?.reply_to_message?.from?.first_name ?? "",
    });
    await ctx.reply(text);
  }
}

bot
  .filter(async (ctx: MyContext) => await isAdmin(ctx))
  .command("unwarn", async (ctx: MyContext) => {
    try {
      await handleUnwarn(ctx);
    } catch (error) {
      console.error("Error handling unwarn:", error);
      await ctx.reply(ctx.t("unwarn-error"));
    }
  });
