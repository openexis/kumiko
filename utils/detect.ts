import { Bot, Context, NextFunction } from "../deps.ts";

async function isOwner(bot: Bot, ctx: Context): Promise<boolean> {
  return (await bot.api.getChatMember(
    ctx.message?.chat.id as number,
    ctx.message?.from.id as number,
  )).status == "creator";
}

function isReplyingToMe(ctx: Context): boolean {
  return ctx.message?.reply_to_message?.from?.id == ctx.me.id;
}

async function isAdmin(bot: Bot, ctx: Context) {
  return (await bot.api.getChatMember(
    ctx.message?.chat.id as number,
    ctx.message?.from.id as number,
  )).status == "administrator";
}

function isReplyingSelf(ctx: Context): boolean {
  return ctx.message?.from.id == ctx.message?.reply_to_message?.from?.id;
}

async function isBotAdmin(ctx: Context, next: NextFunction): Promise<void> {
  if (ctx.msg?.chat.type != "private") {
    if (
      (await ctx.getChatMember(
        ctx.me.id as number,
      ))?.status != "administrator"
    ) {
      await ctx.reply(
        "I can't work unless you give me admin permissions.",
      );
    } else {
      await next();
    }
  } else {
    await next();
  }
}

export { isAdmin, isBotAdmin, isOwner, isReplyingSelf, isReplyingToMe };
