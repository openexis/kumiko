import { bot } from "../../config/bot.ts";
import { isReplyingToAdmin } from "../../utils/detect.ts";
import { isAdmin, isReplyingToMe } from "../../utils/detect.ts";
import { ChatPermissions } from "../../deps.ts";

import { TimeError } from "../../types/response.ts";

import { convertAll } from "../../utils/time.ts";

bot.command("mute").filter(
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
      return await ctx.reply(ctx.t("should-i-mute-myself"));
    }

    if (await isReplyingToAdmin(ctx)) {
      await ctx.reply(ctx.t("i-cant-mute-admins"));
    }

    const permissions: ChatPermissions = {};
    let time = ctx.msg?.text?.split(" ")[1];

    if (time == undefined) {
      time = "1h";
    }

    try {
      const limit = convertAll(time!.trim() as string) / 1000;

      await ctx.restrictChatMember(
        replied_user.id,
        permissions,
        {
          until_date: limit,
        },
      ).then(() => {
        ctx.reply(
          ctx.t("user-muted", {
            user_name: replied_user.first_name,
            user_id: replied_user.id,
          }),
          {
            parse_mode: "Markdown",
          },
        );
      });
    } catch (error) {
      if (error instanceof TimeError) {
        ctx.reply(ctx.t("invalid-time-unit"), {
          parse_mode: "Markdown",
        });
      }
    }
  },
);
