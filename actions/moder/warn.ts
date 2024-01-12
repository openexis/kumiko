// deno-lint-ignore-file
import { bot } from "../../config/bot.ts";
import { Response } from "../../types/response.ts";
import { clearWarns, warnUser } from "../../db/warns.ts";
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

      const warns_count = response.message.match(/\d+/g)
        ?.[0] as unknown as number;

      if (warns_count >= 3) {
        await ctx.banChatMember(
          ctx.message?.reply_to_message?.from?.id as number,
        );

        await clearWarns(
          ctx.message?.reply_to_message?.from?.id as string | number,
        );

        await ctx.api.sendMessage(
          ctx.msg.chat.id,
          `The user ${ctx.message?.reply_to_message?.from?.first_name} has reached 3 warns and has been banned.`,
        );
        return;
      }

      if (response.status == 200) {
        const text =
          `${response.message}\nThe user: ${ctx.message?.reply_to_message?.from?.first_name}`;
        await ctx.reply(text);
      }
    }
  },
);
