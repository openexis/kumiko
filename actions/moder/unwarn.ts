// deno-lint-ignore-file
import { bot } from "../../config/bot.ts";
import { Response } from "../../types/response.ts";
import { unWarnUser } from "../../db/warns.ts";
import {
  isAdmin,
  isReplyingToAdmin,
  isReplyingToMe,
} from "../../utils/detect.ts";

bot.command("unwarn").filter(
  async (ctx) => isAdmin(ctx),
  async (ctx) => {
    if (isReplyingToMe(ctx)) {
      return await bot.api.sendMessage(
        ctx.message?.chat.id as number,
        "This guy needs therapist...",
        {
          reply_to_message_id: ctx.message?.message_id,
        },
      );
    }

    if (await isReplyingToAdmin(ctx)) {
      await ctx.reply("Admins don't have a warn count.");
    } else {
      const response: Response = await unWarnUser(
        ctx.message?.reply_to_message?.from?.id as string | number,
      );

      if (response.status == 200) {
        const text =
          `${response.message}\nThe user: ${ctx.message?.reply_to_message?.from?.first_name}`;
        await ctx.reply(text);
      }
    }
  },
);
