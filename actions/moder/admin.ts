import { ChatMemberAdministrator } from "https://deno.land/x/grammy_types@v3.2.0/manage.ts";
import { bot } from "../../config/bot.ts";
import { isAdmin, isReplyingToMe } from "../../utils/detect.ts";

bot
  .chatType(["group", "supergroup"])
  .command("admin")
  .filter(
    async (ctx) => await isAdmin(ctx),
    async (ctx) => {
      const user = ctx.message?.reply_to_message?.from;
      if (user == undefined) {
        return await ctx.reply(ctx.t("reply-to-message"));
      }

      if (isReplyingToMe(ctx)) {
        return await ctx.reply(ctx.t("i-am-already-an-admin"));
      }

      const chatId = ctx.chatId;

      if (chatId == undefined) {
        return;
      }

      const bot_member = await bot.api.getChatMember(
        chatId,
        bot.botInfo.id,
      ) as ChatMemberAdministrator;

      if (!bot_member.can_promote_members) {
        return await ctx.reply(ctx.t("i-dont-have-permission-to-add-admin"));
      }

      const member = await bot.api.getChatMember(
        chatId,
        user.id,
      );

      console.log(member.status);

      if (member.status == "creator") {
        return await ctx.reply(ctx.t("owner-permissions-cannot-be-changed"));
      }

      await bot.api.promoteChatMember(chatId, user.id, {
        can_manage_chat: true,
        can_change_info: true,
        can_pin_messages: true,
        can_delete_messages: true,
        can_restrict_members: true,
      });

      const admin_title = ctx.message?.text?.split("/admin")[1].trim();

      if (admin_title) {
        await bot.api.setChatAdministratorCustomTitle(
          chatId,
          member.user.id,
          admin_title,
        );
      }

      await ctx.reply(
        ctx.t("user-is-now-admin", {
          user_link: `https://t.me/${member.user.username}`,
          user_name: member.user.first_name,
        }),
        { parse_mode: "HTML", link_preview_options: { is_disabled: true } },
      );

      console.log(member);
    },
  );
