import { ChatMemberAdministrator } from "https://deno.land/x/grammy_types@v3.2.0/manage.ts";
import { bot } from "../../config/index.ts";
import { MyContext } from "../../types/context.ts";
import { isAdmin, isReplying, isReplyingToMe } from "../../utils/detect.ts";

bot.command("admin").filter(
  async (ctx: MyContext) => await isAdmin(ctx),
  async (ctx: MyContext) => {
    if (!isReplying(ctx)) return await ctx.reply(ctx.t("reply-to-message"));

    if (isReplyingToMe(ctx)) return await ctx.reply(ctx.t("i-am-already-an-admin"));

    const bot_member = await bot.api.getChatMember(
      ctx.chat?.id!,
      bot.botInfo.id,
    ) as ChatMemberAdministrator;

    if (!bot_member.can_promote_members) {
      return await ctx.reply(ctx.t("i-dont-have-permission-to-add-admin"));
    }

    const user = ctx.message?.reply_to_message?.from;

    const member = await bot.api.getChatMember(
      ctx.message?.chat.id!,
      user?.id!,
    );

    console.log(member.status);

    if (member.status == "creator") {
      return await ctx.reply(ctx.t("owner-permissions-cannot-be-changed"));
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
      ctx.t("user-is-now-admin", {
        user_link:
          `https://t.me/${member.user.username}`,
        user_name: member.user.first_name,
      }),
      { parse_mode: "HTML", disable_web_page_preview: true },
    );

    console.log(member);
  },
);
