import { bot } from "../../config/bot.ts";
import { Response } from "../../types/response.ts";
import { warnUser } from "../../db/warns.ts";
import {
  isAdmin,
  isReplyingToAdmin,
  isReplyingToMe,
} from "../../utils/detect.ts";

bot.command("warn").filter(
  async (ctx) => await isAdmin(ctx),
  async (ctx) => {
    if (isReplyingToMe(ctx)) {
      return ctx.reply("Okay, Should I warn myself? Hmmm...");
    }

    if (await isReplyingToAdmin(ctx)) {
      await ctx.reply("I can't warn the admins.");
    } else {
      const response: Response = await warnUser(
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
