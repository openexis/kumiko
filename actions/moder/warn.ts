import { bot } from "../../config/bot.ts";
import { Response } from "../../types/response.ts";
import { clearWarns, warnUser } from "../../db/warns.ts";
import {
  isAdmin,
  isReplying,
  isReplyingToAdmin,
  isReplyingToMe,
} from "../../utils/detect.ts";
import { Context } from "../../deps.ts";

// Function to handle the warning logic
async function handleWarning(ctx: Context): Promise<void> {
  const userId = ctx.message?.reply_to_message?.from?.id as number; // Type assertion for clarity
  const response: Response = await warnUser(userId);

  const warnsCount = parseInt(response.message.match(/\d+/g)?.[0] || "0"); // Extract warns count safely

  if (warnsCount >= 3) {
    await ctx.banChatMember(userId);
    await clearWarns(userId);
    await ctx.api.sendMessage(
      ctx.message?.chat.id as number,
      `The user ${ctx.message?.reply_to_message?.from?.first_name} has reached 3 warns and has been banned.`,
    );
    return;
  }

  if (response.status === 200) {
    const text =
      `${response.message}\nThe user: ${ctx.message?.reply_to_message?.from?.first_name}`;
    await ctx.reply(text);
  }
}

bot
  .filter(async (ctx) => await isAdmin(ctx)) // Check if the user is an admin
  .filter(async (ctx) => await isReplying(ctx)) // Check if replying to a message
  .filter(async (ctx) => !isReplyingToMe(ctx)) // Check if not replying to self
  .filter(async (ctx) => !await isReplyingToAdmin(ctx)) // Check if not replying to admin
  .command("warn", async (ctx) => {
    try {
      await handleWarning(ctx);
    } catch (error) {
      console.error("Error handling warning:", error);
      await ctx.reply("An error occurred while processing the warning.");
    }
  });
