import { bot } from "../../config/bot.ts";
import { Response } from "../../types/response.ts";
import { unWarnUser } from "../../db/warns.ts";

bot.command("unwarn", async(ctx) => {
    const response: Response = await unWarnUser(ctx.message?.from.id as string | number);
    if (response.status == 200){
        const text = `${response.message}\nThe user: ${ctx.message?.from.first_name}`
        ctx.reply(text)
    }
})