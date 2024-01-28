import { bot } from "../../config/bot.ts";
import { Response } from "../../types/response.ts";
import { clearWarns, warnUser } from "../../db/warns.ts";
import {
  isAdmin,
  isReplyingToAdmin,
  isReplyingToMe,
} from "../../utils/detect.ts";
import { Context } from "../../deps.ts";
import { isReplying } from "../../utils/detect.ts";

// Define a command "warn" and filter the execution based on the user's admin status
bot.command("warn").filter(
  async (ctx: Context) => await isAdmin(ctx), // Check if the user is an admin
  async (ctx: Context) => { // Execute if the user is an admin
    // Check if the user is replying to a message
    if (!await isReplying(ctx)) {
      await ctx.reply("Reply to a message.");
      return;
    }

    // Check if the user is replying to themselves
    if (isReplyingToMe(ctx)) {
      return await ctx.reply("Okay, Should I warn myself? Hmmm...");
    }

    // Check if the user is replying to an admin
    if (await isReplyingToAdmin(ctx)) {
      await ctx.reply("I can't warn the admins.");
    } else {
      // Warn the user and get the response
      const response: Response = await warnUser(
        ctx.message?.reply_to_message?.from?.id as string | number,
      );

      // Get the number of warnings the user has
      const warns_count = response.message.match(/\d+/g)
        ?.[0] as unknown as number;

      // If the user has 3 or more warnings, ban them and notify the chat
      if (warns_count >= 3) {
        await ctx.banChatMember(
          ctx.message?.reply_to_message?.from?.id as number,
        );

        await clearWarns(
          ctx.message?.reply_to_message?.from?.id as string | number,
        );

        await ctx.api.sendMessage(
          ctx.message?.chat.id as string | number,
          `The user ${ctx.message?.reply_to_message?.from?.first_name} has reached 3 warns and has been banned.`,
        );
        return;
      }

      // If the warning was successful, notify the user
      if (response.status == 200) {
        const text =
          `${response.message}\nThe user: ${ctx.message?.reply_to_message?.from?.first_name}`;
        await ctx.reply(text);
      }
    }
  },
);
