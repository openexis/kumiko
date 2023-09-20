import { bot } from "../config/index.ts"
import { Context } from "../deps.ts"

bot.command('start', async(ctx: Context) => {
    console.log(ctx)
    await ctx.reply("Welcome!", 
        {
            message_thread_id: ctx.update.message?.message_thread_id
        }
    )
})