import { bot } from "../config/bot.ts";
import { ask_grok } from "../utils/ai.ts";

bot.on(":text", async (ctx, next) => {
	if (ctx.message == undefined) return await next();

	if (!ctx.message.text.startsWith("@grok")) return await next();

	if (![5560860031, 7364646175].includes(ctx.message.from.id)) {
		return await next();
	}

	const prompt = ctx.message.text.split("@grok")[1].trim();
	console.log("Prompt: ", prompt);

	const result = await ask_grok(
		prompt,
		await ctx.i18n.getLocale(),
		ctx.message.reply_to_message?.text ||
			ctx.message.reply_to_message?.caption,
	);

	await ctx.reply(result, { parse_mode: "HTML" });
});
