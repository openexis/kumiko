import { bot } from "../../config/bot.ts";
import { MyContext } from "../../types/context.ts";
import { isReplyingToAdmin } from "../../utils/detect.ts";
import { isAdmin, isReplying, isReplyingToMe } from "../../utils/detect.ts";
import { ChatPermissions } from "../../deps.ts"; // Command to handle mute process

import { TimeError } from "../../types/response.ts";

import { convertAll } from "../../utils/time.ts";

// Command to handle mute process
bot.command("mute").filter(
  // Check if the user is an admin
  async (ctx: MyContext) => await isAdmin(ctx),
  // Handle the mute process
  async (ctx: MyContext) => {
    // Check if the user is replying to a message
    if (!await isReplying(ctx)) {
      // Send a message to ask the user to reply to a message
      await ctx.reply(ctx.t("reply-to-message"));
      return;
    }

    // Check if the user is replying to the bot
    if (isReplyingToMe(ctx)) {
      // Send a message indicating that I should mute myself
      return await ctx.reply(ctx.t("should-i-mute-myself"));
    }

    // Check if the user is replying to an admin
    if (await isReplyingToAdmin(ctx)) {
      // Send a message indicating that I can't mute the admins
      await ctx.reply(ctx.t("i-cant-mute-admins"));
    }

    // Define the permissions object
    const permissions: ChatPermissions = {};

    // Get the time from the message text
    let time = ctx.msg?.text?.split(" ")[1];

    // Set a default time if not provided
    if (time == undefined) {
      time = "1h";
    }

    try {
      // Convert the time to the limit in seconds
      const limit = convertAll(time!.trim() as string) / 1000;

      // Restrict the chat member and notify about the mute
      await ctx.restrictChatMember(
        ctx.msg?.reply_to_message?.from?.id as number,
        permissions,
        {
          until_date: limit,
        },
      ).then(() => {
        ctx.reply(
          ctx.t("user-muted", {
            user_name: ctx.message?.reply_to_message?.from?.first_name!,
            user_id: ctx.message?.reply_to_message?.from?.id!,
          }),
          {
            parse_mode: "Markdown",
          },
        );
      });
    } catch (error) {
      // Handle TimeError and reply with an error message
      if (error instanceof TimeError) {
        ctx.reply(ctx.t("invalid-time-unit"), {
          parse_mode: "Markdown",
        });
      }
    }
  },
);
