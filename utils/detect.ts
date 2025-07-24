import { Bot, NextFunction } from "../deps.ts";
import { MyContext } from "../types/context.ts";

/**
 * Check if the user is the owner of the chat.
 *
 * @param {Bot} bot - The bot instance
 * @param {MyContext} ctx - The context object
 * @return {Promise<boolean>} A boolean indicating if the user is the owner
 */
async function isOwner(bot: Bot<MyContext>, ctx: MyContext): Promise<boolean> {
  return (await bot.api.getChatMember(
    ctx.message?.chat.id as number,
    ctx.message?.from.id as number,
  )).status == "creator";
}

/**
 * Check if the message is a replied to the bot.
 *
 * @param {MyContext} ctx - the context object
 * @return {boolean} true if the message is a reply to me, otherwise false
 */
function isReplyingToMe(ctx: MyContext): boolean {
  return ctx.message?.reply_to_message?.from?.id == ctx.me.id;
}

/**
 * Check if the user is an administrator or creator of the chat.
 *
 * @param {MyContext} ctx - the context object
 * @return {boolean} true if the user is an administrator or creator, otherwise false
 */
async function isReplyingToAdmin(ctx: MyContext): Promise<boolean> {
  const status = (await ctx.api.getChatMember(
    ctx.message?.chat.id as number,
    ctx.message?.reply_to_message?.from?.id as number,
  )).status;

  return status == "administrator" || status == "creator";
}

/**
 * Check if the user is an administrator or creator of the chat.
 *
 * @param {MyContext} ctx - the context object
 * @return {boolean} true if the user is an administrator or creator, otherwise false
 */
async function isAdmin(ctx: MyContext): Promise<boolean> {
  const status = (await ctx.api.getChatMember(
    ctx.message?.chat.id as number,
    ctx.message?.from.id as number,
  )).status;

  return status == "administrator" || status == "creator";
}

/**
 * Checks if the message is a reply from the same user
 *
 * @param {MyContext} ctx - the context object
 * @return {boolean} true if the message is a reply from the same user, false otherwise
 */
function isReplyingSelf(ctx: MyContext): boolean {
  return ctx.message?.from.id == ctx.message?.reply_to_message?.from?.id;
}

/**
 * Checks if the bot is an admin in the given chat and prompts the user to grant
 * admin permissions if not in a private chat. Calls the next middleware if the
 * bot is an admin or if the chat is private.
 *
 * @param {MyContext} ctx - the context object
 * @param {NextFunction} next - the next function to call
 * @return {Promise<void>} a promise that resolves when the function completes
 */
async function isBotAdmin(ctx: MyContext, next: NextFunction): Promise<void> {
  if (ctx.msg?.chat.type == "private" || !ctx.update.message) {
    await next();
    return;
  }

  const member = await ctx.api.getChatMember(
    ctx.chat!.id,
    ctx.me.id as number,
  );

  if (
    member?.status == "administrator"
  ) {
    await next();
    return;
  }

  await ctx.reply(
    ctx.t("i-cant-work-without-admin"),
  );
}

/**
 * Checks if the message is a reply to another message
 *
 * @param {MyContext} ctx - the context object
 * @return {boolean} true if the message is a reply to another message, false otherwise
 */
function isReplying(ctx: MyContext): boolean {
  if (ctx.msg?.reply_to_message?.forum_topic_created) {
    return false;
  }

  return Boolean(ctx.msg?.reply_to_message);
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
