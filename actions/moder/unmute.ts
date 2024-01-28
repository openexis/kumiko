import { bot } from "../../config/bot.ts";
import { ChatPermissions, Context } from "../../deps.ts";

import {
  isAdmin,
  isReplying,
  isReplyingToAdmin,
  isReplyingToMe,
} from "../../utils/detect.ts";

// Command to handle unmute process
bot.command("unmute").filter(
  // Check if the user is an admin
  async (ctx: Context) => await isAdmin(ctx),
  // Handle the unmute process
  async (ctx: Context) => {
    // Check if the user is replying to a message
    if (!await isReplying(ctx)) {
      // Send a message to ask the user to reply to a message
      await ctx.reply("Reply to a message.");
      return;
    }

    if (isReplyingToMe(ctx)) {
      // Send a message indicating that I should unmute myself
      return await ctx.reply("Okay, Should I unmute myself? Hmmm...");
    }

    if (await isReplyingToAdmin(ctx)) {
      // Send a message indicating that I can't unmute the admins
      await ctx.reply("I can't unmute the admins.");
    }

    const permissions: ChatPermissions = {
      can_send_messages: true,
      can_send_audios: true,
      can_send_documents: true,
      can_send_photos: true,
      can_send_videos: true,
      can_send_video_notes: true,
      can_send_voice_notes: true,
      can_send_polls: true,
      can_send_other_messages: true,
      can_add_web_page_previews: true,
      can_invite_users: true,
    };

    await ctx.restrictChatMember(
      ctx.msg?.reply_to_message?.from?.id as number,
      permissions,
    ).then(() => {
      ctx.reply( // Notify about the unmute
        // Notify about the unmute with user's first name and id
        `The user [${ctx.message?.reply_to_message?.from?.first_name}](tg://user?id=${ctx.message?.reply_to_message?.from?.id}) has been unmuted.`,
        {
          parse_mode: "Markdown", // Set parse mode for message formatting
        },
      );
    });
  },
);
