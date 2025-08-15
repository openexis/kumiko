import { bot } from "../../config/bot.ts";
import { ChatPermissions } from "../../deps.ts";

import {
  isAdmin,
  isReplyingToAdmin,
  isReplyingToMe,
} from "../../utils/detect.ts";

bot.command("unmute").filter(
  async (ctx) => await isAdmin(ctx),
  async (ctx) => {
    const reply_to_message = ctx.message?.reply_to_message;

    if (reply_to_message == undefined) {
      await ctx.reply(ctx.t("reply-to-message"));
      return;
    }

    const replied_user = reply_to_message.from;

    if (replied_user == undefined) {
      return;
    }

    if (isReplyingToMe(ctx)) {
      return await ctx.reply(ctx.t("should-i-unmute-myself"));
    }

    if (await isReplyingToAdmin(ctx)) {
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
      replied_user.id,
      permissions,
    ).then(() => {
      ctx.reply(
        ctx.t("user-unmuted", {
          user_name: replied_user.first_name,
          user_id: replied_user.id,
        }),
        {
          parse_mode: "Markdown",
        },
      );
    });
  },
);
