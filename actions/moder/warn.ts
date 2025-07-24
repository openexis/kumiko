import { bot } from "../../config/bot.ts";
import { Response } from "../../types/response.ts";
import { clearWarns, warnUser } from "../../db/warns.ts";
import {
  isAdmin,
  isReplying,
  isReplyingToAdmin,
  isReplyingToMe,
} from "../../utils/detect.ts";
import { MyContext } from "../../types/context.ts";

// Function to handle the warning logic
async function handleWarning(ctx: MyContext): Promise<void> {
  const userId = ctx.message?.reply_to_message?.from?.id as number; // Type assertion for clarity
  const response: Response = await warnUser(userId);

  const warnsCount = parseInt(response.message.match(/\d+/g)?.[0] || "0"); // Extract warns count safely

  if (warnsCount >= 3) {
    await ctx.banChatMember(userId);
    await clearWarns(userId);
    await ctx.api.sendMessage(
      ctx.message?.chat.id as number,
      ctx.t("user-banned-after-3-warns", {
        user_name: ctx.message?.reply_to_message?.from?.first_name!,
      }),
    );
    return;
  }

  if (response.status === 200) {
    const text = ctx.t("warn-success", {
      message: response.message,
      user_name: ctx.message?.reply_to_message?.from?.first_name!,
    });
    await ctx.reply(text);
  }
}

bot
  .filter(async (ctx: MyContext) => await isAdmin(ctx)) // Check if the user is an admin
  .filter(async (ctx: MyContext) => await isReplying(ctx)) // Check if replying to a message
  .filter(async (ctx: MyContext) => await !isReplyingToMe(ctx)) // Check if not replying to self
  .filter(async (ctx: MyContext) => !await isReplyingToAdmin(ctx)) // Check if not replying to admin
  .command("warn", async (ctx: MyContext) => {
    try {
      await handleWarning(ctx);
    } catch (error) {
      console.error("Error handling warning:", error);
      await ctx.reply(ctx.t("warn-error"));
    }
  });
