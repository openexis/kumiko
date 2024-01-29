import { bot } from "../../config/bot.ts";
import { Context } from "../../deps.ts";
import { isReplyingToAdmin } from "../../utils/detect.ts";
import { isAdmin, isReplying, isReplyingToMe } from "../../utils/detect.ts";
import { ChatPermissions } from "../../deps.ts"; // Command to handle mute process

import { TimeError } from "../../types/response.ts";

import { convertAll } from "../../utils/time.ts";

// Command to handle mute process
bot.command("mute").filter(
  // Check if the user is an admin
  async (ctx: Context) => await isAdmin(ctx),
  // Handle the mute process
  async (ctx: Context) => {
    // Check if the user is replying to a message
    if (!await isReplying(ctx)) {
      // Send a message to ask the user to reply to a message
      await ctx.reply("Reply to a message.");
      return;
    }

    // Check if the user is replying to the bot
    if (isReplyingToMe(ctx)) {
      // Send a message indicating that I should mute myself
      return await ctx.reply("Okay, Should I mute myself? Hmmm...");
    }

    // Check if the user is replying to an admin
    if (await isReplyingToAdmin(ctx)) {
      // Send a message indicating that I can't mute the admins
      await ctx.reply("I can't mute the admins.");
    }

    const permissions: ChatPermissions = {};

    let time = ctx.msg?.text?.split(" ")[1];

    if (time == undefined) {
      time = "1h";
    }

    try {
      const limit = convertAll(time!.trim() as string) / 1000;

      await ctx.restrictChatMember(
        ctx.msg?.reply_to_message?.from?.id as number,
        permissions,
        {
          until_date: limit,
        },
      ).then(() => {
        ctx.reply(
          // Notify about the mute with user's first name and id
          `The user [${ctx.message?.reply_to_message?.from?.first_name}](tg://user?id=${ctx.message?.reply_to_message?.from?.id}) has been muted.`,
          {
            parse_mode: "Markdown", // Set parse mode for message formatting
          },
        );
      });
    } catch (error) {
      if (error instanceof TimeError) {
        ctx.reply("Invalid time unit, please use 1m, 1h or 1d", {
          parse_mode: "Markdown",
        });
      }
    }
  },
);
