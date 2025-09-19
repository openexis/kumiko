import { bot } from "../../config/bot.ts";
import { clearWarns, warnUser } from "../../db/warns.ts";
import {
  isAdmin,
  isReplyingToAdmin,
  isReplyingToMe,
} from "../../utils/detect.ts";
import { MyContext } from "../../types/context.ts";

// Function to handle the warning logic
// deno-lint-ignore no-explicit-any
async function handleWarning(ctx: MyContext): Promise<any> {
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
    return await ctx.reply(ctx.t("should-i-warn-myself"));
  }

  if (await isReplyingToAdmin(ctx)) {
    return await ctx.reply(ctx.t("i-cant-warn-admins"));
  }

  if (replied_user == undefined) {
    return;
  }
  const userId = replied_user.id;
  const response = await warnUser(userId);

  const warnsCount = parseInt(response.message.match(/\d+/g)?.[0] || "0"); // Extract warns count safely

  if (warnsCount >= 3) {
    await ctx.banChatMember(userId);
    await clearWarns(userId);
    await ctx.api.sendMessage(
      ctx.message?.chat.id as number,
      ctx.t("user-banned-after-3-warns", {
        user_name: replied_user.first_name,
      }),
      { message_thread_id: ctx.message?.message_thread_id },
    );
    return;
  }

  if (response.status === 200) {
    const text = ctx.t("warn-success", {
      message: response.message,
      user_name: replied_user.first_name,
    });
    await ctx.reply(text);
  }
}

bot
  .filter(async (ctx) => await isAdmin(ctx)) // Check if the user is an admin
  .command("warn", async (ctx) => {
    try {
      await handleWarning(ctx);
    } catch (error) {
      console.error("Error handling warning:", error);
      await ctx.reply(ctx.t("warn-error"));
    }
  });
