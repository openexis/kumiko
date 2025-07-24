import { bot } from "../../config/bot.ts";
import { ChatPermissions, MyContext } from "../../deps.ts";

import {
  isAdmin,
  isReplying,
  isReplyingToAdmin,
  isReplyingToMe,
} from "../../utils/detect.ts";

// Command to handle unmute process
bot.command("unmute").filter(
  // Check if the user is an admin
  async (ctx: MyContext) => await isAdmin(ctx),
  // Handle the unmute process
  async (ctx: MyContext) => {
    // Check if the user is replying to a message
    if (!await isReplying(ctx)) {
      // Send a message to ask the user to reply to a message
      await ctx.reply(ctx.t("reply-to-message"));
      return;
    }

    if (isReplyingToMe(ctx)) {
      // Send a message indicating that I should unmute myself
      return await ctx.reply(ctx.t("should-i-unmute-myself"));
    }

    if (await isReplyingToAdmin(ctx)) {
      // Send a message indicating that I can't unmute the admins
      await ctx.reply(ctx.t("i-cant-unmute-admins"));
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
      ctx.reply(
        ctx.t("user-unmuted", {
          user_name: ctx.message?.reply_to_message?.from?.first_name!,
          user_id: ctx.message?.reply_to_message?.from?.id!,
        }),
        {
          parse_mode: "Markdown",
        },
      );
    });
  },
);
