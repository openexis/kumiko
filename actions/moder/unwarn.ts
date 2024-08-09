import { bot } from "../../config/bot.ts";
import { Response } from "../../types/response.ts";
import { unWarnUser } from "../../db/warns.ts";
import {
  isAdmin,
  isReplying,
  isReplyingToAdmin,
  isReplyingToMe,
} from "../../utils/detect.ts";
import { Context } from "../../deps.ts";

// Function to handle the unwarning logic
async function handleUnwarn(ctx: Context): Promise<void> {
  const userId = ctx.message?.reply_to_message?.from?.id as number;
  const response: Response = await unWarnUser(userId);

  if (response.status === 200) {
    const text =
      `${response.message}\nThe user: ${ctx.message?.reply_to_message?.from?.first_name}`;
    await ctx.reply(text);
  }
}

bot
  .filter(async (ctx) => await isAdmin(ctx))
  .filter(async (ctx) => await isReplying(ctx))
  .filter(async (ctx) => !isReplyingToMe(ctx))
  .filter(async (ctx) => !await isReplyingToAdmin(ctx))
  .command("unwarn", async (ctx) => {
    try {
      await handleUnwarn(ctx);
    } catch (error) {
      console.error("Error handling unwarn:", error);
      await ctx.reply("An error occurred while processing the unwarn.");
    }
  });
