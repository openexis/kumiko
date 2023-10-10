import { Context, Bot } from "../deps.ts"

async function isOwner(bot: Bot, ctx: Context): Promise<boolean> {
    return (await bot.api.getChatMember(
        ctx.message?.chat.id as number,
        ctx.message?.from.id as number
    )).status == "creator";
}

async function isAdmin(bot:Bot , ctx: Context) {
    return (await bot.api.getChatMember(
        ctx.message?.chat.id as number,
        ctx.message?.from.id as number
    )).status == "administrator";
}

function isReplyingSelf(ctx: Context): boolean {
    return ctx.message?.from.id == ctx.message?.reply_to_message?.from?.id;
}

export { isOwner, isAdmin, isReplyingSelf }