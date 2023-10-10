import { bot } from "../../config/bot.ts";
import { Response } from "../../types/response.ts";
import { warnUser } from "../../db/warns.ts";


bot.command("warn", async(ctx) => {
    const response: Response = await warnUser(ctx.message?.from.id as string | number);
    if (response.status == 200){
        const text = `${response.message}\nThe user: ${ctx.message?.from.first_name}`
        ctx.reply(text)
    }
})