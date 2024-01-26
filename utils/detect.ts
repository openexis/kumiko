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

async function isReplyingToAdmin(ctx: Context): Promise<boolean> {
  const status = (await ctx.api.getChatMember(
    ctx.message?.chat.id as number,
    ctx.message?.reply_to_message?.from?.id as number,
  )).status;

  return status == "administrator" || status == "creator";
}

async function isAdmin(ctx: Context) {
  const status = (await ctx.api.getChatMember(
    ctx.message?.chat.id as number,
    ctx.message?.from.id as number,
  )).status;

  return status == "administrator" || status == "creator";
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

async function isReplying(ctx: Context): Promise<boolean> {
  return await Boolean(ctx.msg?.reply_to_message);
}

export {
  isAdmin,
  isBotAdmin,
  isOwner,
  isReplying,
  isReplyingSelf,
  isReplyingToAdmin,
  isReplyingToMe,
};
