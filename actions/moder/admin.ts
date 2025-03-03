import { ChatMemberAdministrator } from "https://deno.land/x/grammy_types@v3.2.0/manage.ts";
import { bot } from "../../config/index.ts";
import { Context } from "../../deps.ts";
import { isAdmin, isReplying, isReplyingToMe } from "../../utils/detect.ts";

bot.command("admin").filter(
  async (ctx: Context) => await isAdmin(ctx),
  async (ctx: Context) => {
    if (!isReplying(ctx)) return await ctx.reply("Reply to a message.");

    if (isReplyingToMe(ctx)) return await ctx.reply("I'm already an admin.");

    const bot_member = await bot.api.getChatMember(
      ctx.chat?.id!,
      bot.botInfo.id,
    ) as ChatMemberAdministrator;

    if (!bot_member.can_promote_members) {
      return await ctx.reply("I don't have a permission to add a new admin.");
    }

    const user = ctx.message?.reply_to_message?.from;

    const member = await bot.api.getChatMember(
      ctx.message?.chat.id!,
      user?.id!,
    );

    console.log(member.status);

    if (member.status == "creator") {
      return await ctx.reply("Owner's permissions can not be changed.");
    }

    await bot.api.promoteChatMember(ctx.chat?.id!, user?.id!, {
      can_manage_chat: true,
      can_change_info: true,
      can_pin_messages: true,
      can_delete_messages: true,
      can_restrict_members: true,
    });

    const admin_title = ctx.message?.text?.split("/admin")[1].trim();

    if (admin_title) {
      await bot.api.setChatAdministratorCustomTitle(
        ctx.chat?.id!,
        member.user.id,
        admin_title,
      );
    }

    await ctx.reply(
      `<a href="${
        member.user.username
          ? `https://t.me/${member.user.username}`
          : `tg://openmessage?chat_id=${member.user.id}`
      }">${member.user.first_name}</a> is now admin with basic permissions.`,
      { parse_mode: "HTML", disable_web_page_preview: true },
    );

    console.log(member);
  },
);
