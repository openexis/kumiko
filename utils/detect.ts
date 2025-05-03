import { Bot, Context, NextFunction } from "../deps.ts";

/**
 * Check if the user is the owner of the chat.
 *
 * @param {Bot} bot - The bot instance
 * @param {Context} ctx - The context object
 * @return {Promise<boolean>} A boolean indicating if the user is the owner
 */
async function isOwner(bot: Bot, ctx: Context): Promise<boolean> {
  return (await bot.api.getChatMember(
    ctx.message?.chat.id as number,
    ctx.message?.from.id as number,
  )).status == "creator";
}

/**
 * Check if the message is a replied to the bot.
 *
 * @param {Context} ctx - the context object
 * @return {boolean} true if the message is a reply to me, otherwise false
 */
function isReplyingToMe(ctx: Context): boolean {
  return ctx.message?.reply_to_message?.from?.id == ctx.me.id;
}

/**
 * Check if the user is an administrator or creator of the chat.
 *
 * @param {Context} ctx - the context object
 * @return {boolean} true if the user is an administrator or creator, otherwise false
 */
async function isReplyingToAdmin(ctx: Context): Promise<boolean> {
  const status = (await ctx.api.getChatMember(
    ctx.message?.chat.id as number,
    ctx.message?.reply_to_message?.from?.id as number,
  )).status;

  return status == "administrator" || status == "creator";
}

/**
 * Check if the user is an administrator or creator of the chat.
 *
 * @param {Context} ctx - the context object
 * @return {boolean} true if the user is an administrator or creator, otherwise false
 */
async function isAdmin(ctx: Context): Promise<boolean> {
  const status = (await ctx.api.getChatMember(
    ctx.message?.chat.id as number,
    ctx.message?.from.id as number,
  )).status;

  return status == "administrator" || status == "creator";
}

/**
 * Checks if the message is a reply from the same user
 *
 * @param {Context} ctx - the context object
 * @return {boolean} true if the message is a reply from the same user, false otherwise
 */
function isReplyingSelf(ctx: Context): boolean {
  return ctx.message?.from.id == ctx.message?.reply_to_message?.from?.id;
}

/**
 * Checks if the bot is an admin in the given chat and prompts the user to grant
 * admin permissions if not in a private chat. Calls the next middleware if the
 * bot is an admin or if the chat is private.
 *
 * @param {Context} ctx - the context object
 * @param {NextFunction} next - the next function to call
 * @return {Promise<void>} a promise that resolves when the function completes
 */
async function isBotAdmin(ctx: Context, next: NextFunction): Promise<void> {
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
    "I can't work unless you give me admin permissions.",
  );
}

/**
 * Checks if the message is a reply to another message
 *
 * @param {Context} ctx - the context object
 * @return {boolean} true if the message is a reply to another message, false otherwise
 */
function isReplying(ctx: Context): boolean {
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
