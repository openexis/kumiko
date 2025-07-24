import { bot } from "../../config/bot.ts";
import { Response } from "../../types/response.ts";
import { unWarnUser } from "../../db/warns.ts";
import {
  isAdmin,
  isReplying,
  isReplyingToAdmin,
  isReplyingToMe,
} from "../../utils/detect.ts";
import { MyContext } from "../../types/context.ts";

// Function to handle the unwarning logic
async function handleUnwarn(ctx: MyContext): Promise<void> {
  const userId = ctx.message?.reply_to_message?.from?.id as number;
  const response: Response = await unWarnUser(userId);

  if (response.status === 200) {
    const text = ctx.t("unwarn-success", {
      message: response.message,
      user_name: ctx.message?.reply_to_message?.from?.first_name!,
    });
    await ctx.reply(text);
  }
}

bot
  .filter(async (ctx: MyContext) => await isAdmin(ctx))
  .filter(async (ctx: MyContext) => await isReplying(ctx))
  .filter(async (ctx: MyContext) => await !isReplyingToMe(ctx))
  .filter(async (ctx: MyContext) => !await isReplyingToAdmin(ctx))
  .command("unwarn", async (ctx: MyContext) => {
    try {
      await handleUnwarn(ctx);
    } catch (error) {
      console.error("Error handling unwarn:", error);
      await ctx.reply(ctx.t("unwarn-error"));
    }
  });
