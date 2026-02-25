import { bot } from "../config/bot.ts";
import { evaluate } from "../deps.ts";
import { MyContext } from "../types/context.ts";

bot.command("c", async (ctx: MyContext) => {
	if (ctx.msg == undefined) return;
	if (ctx.msg.text == undefined) return;

	const text = ctx.msg.text;
	const expression = text.split("/c")[1].trim();

	try {
		const result = evaluate(expression);

		return await ctx.reply(`Expression: ${expression}\nResult: ${result}`);
	} catch (_e) {
		return;
	}
});
