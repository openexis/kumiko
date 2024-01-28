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

// Command to handle unwarning a user
bot.command("unwarn").filter(
  async (ctx: Context) => await isAdmin(ctx), // Check if the user is an admin
  async (ctx: Context) => { // Handle the unwarning process
    if (!await isReplying(ctx)) { // Check if the user is replying to a message
      await ctx.reply("Reply to a message."); // Send a message to ask the user to reply to a message
      return;
    }

    if (isReplyingToMe(ctx)) { // Check if the user is replying to the bot
      return await bot.api.sendMessage( // Send a message to the original chat
        ctx.message?.chat.id as number,
        "This guy needs therapist...", // Message to send
        {
          reply_to_message_id: ctx.message?.message_id, // Specify the message to reply to
        },
      );
    }

    if (await isReplyingToAdmin(ctx)) { // Check if the user is replying to an admin
      await ctx.reply("Admins don't have a warn count."); // Send a message indicating that admins don't have a warn count
    } else {
      const response: Response = await unWarnUser( // Call the function to unwarn the user
        ctx.message?.reply_to_message?.from?.id as string | number, // Get the user ID to unwarn
      );

      if (response.status == 200) { // Check if the response status is successful
        const text =
          `${response.message}\nThe user: ${ctx.message?.reply_to_message?.from?.first_name}`; // Compose the response message
        await ctx.reply(text); // Send the response message
      }
    }
  },
);