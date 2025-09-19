import { Bot, NextFunction } from "../deps.ts";
import { MyContext } from "../types/context.ts";

async function isOwner(bot: Bot<MyContext>, ctx: MyContext): Promise<boolean> {
  const member = await bot.api.getChatMember(
    ctx.message!.chat.id as number,
    ctx.message!.from.id as number,
  );

  return member.status == "creator";
}

function isReplyingToMe(ctx: MyContext): boolean {
  return ctx.message!.reply_to_message!.from!.id == ctx.me.id;
}

async function isReplyingToAdmin(ctx: MyContext): Promise<boolean> {
  const member = await ctx.api.getChatMember(
    ctx.chatId!,
    ctx.message!.reply_to_message!.from!.id,
  );
  const status = member.status;

  return status == "administrator" || status == "creator";
}

async function isAdmin(ctx: MyContext): Promise<boolean> {
  const member = await ctx.api.getChatMember(
    ctx.chatId!,
    ctx.message!.from.id as number,
  );
  const status = member.status;

  return status == "administrator" || status == "creator";
}

function isReplyingSelf(ctx: MyContext): boolean {
  return ctx.message!.from.id == ctx.message!.reply_to_message!.from!.id;
}

async function isBotAdmin(ctx: MyContext, next: NextFunction): Promise<void> {
  if (
    ctx.msg == undefined || ctx.msg.chat == undefined || ctx.me == undefined
  ) {
    await next();
    return;
  }

  if (ctx.msg.chat.type == "private") {
    await next();
    return;
  }

  const member = await ctx.api.getChatMember(
    ctx.chatId!,
    ctx.me.id,
  );

  if (
    member.status == "administrator"
  ) {
    await next();
    return;
  }

  await ctx.reply(
    ctx.t("i-cant-work-without-admin"),
  );
}

export {
  isAdmin,
  isBotAdmin,
  isOwner,
  isReplyingSelf,
  isReplyingToAdmin,
  isReplyingToMe,
};
