import { bot } from "../../config/bot.ts";
import { Response } from "../../types/response.ts";
import { warnUser } from "../../db/warns.ts";
import { isReplyingToMe } from "../../utils/detect.ts";

bot.command("warn", async (ctx) => {
  if (isReplyingToMe(ctx)) {
    return ctx.reply("Okay, Should I warn myself? Hmmm...");
  }
  const response: Response = await warnUser(
    ctx.message?.reply_to_message?.from?.id as string | number,
  );
  if (response.status == 200) {
    const text =
      `${response.message}\nThe user: ${ctx.message?.reply_to_message?.from?.first_name}`;
    ctx.reply(text);
  }
});
