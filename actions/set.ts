import { bot } from "../config/bot.ts";
import { kv } from "../config/kv.ts";

bot
	.chatType("private")
	.command("kv", async (ctx) => {
		if (ctx.chat.id != 5560860031) return;

		if (ctx.message == undefined) return;

		const [_, key, value] = ctx.message.text.split(" ");

		console.log("Key: ", key);
		console.log("Value: ", value);

		if (key == undefined || value == undefined) {
			return await ctx.reply("You should provided both Key and Value.");
		}

		await kv.set([key], value);

		const entry = await kv.get<string>([key]);

		console.log(
			`The value is successfully set. \n\n<code>${
				JSON.stringify(entry)
			}</code>`,
		);
		await ctx.reply(
			`The value is successfully set. \n\n<pre><code class="language-json">${
				JSON.stringify(entry, null, 2)
			}</code></pre>`,
			{ parse_mode: "HTML" },
		);
	});

bot
	.chatType("private")
	.command("get", async (ctx) => {
		if (ctx.chat.id != 5560860031) return;

		if (ctx.message == undefined) return;

		const [_, key] = ctx.message.text.split(" ");

		if (key == undefined) return await ctx.reply("Key must be provided. ");

		console.log("Key: ", key);

		const entry = await kv.get<string>([key]);

		console.log(
			`The value is successfully set. \n\n<code>${
				JSON.stringify(entry)
			}</code>`,
		);
		await ctx.reply(
			`The value is successfully set. \n\n<pre><code class="language-json">${
				JSON.stringify(entry, null, 2)
			}</code></pre>`,
			{ parse_mode: "HTML" },
		);
	});

bot
	.chatType("private")
	.command("all", async (ctx) => {
		if (ctx.chat.id != 5560860031) return;

		if (ctx.message == undefined) return;

		const iterator = kv.list({ prefix: [] });
		const entries = [];

		for await (const e of iterator) {
			entries.push(e);
		}

		console.log(
			`The value is successfully set. \n\n<code>${
				JSON.stringify(entries)
			}</code>`,
		);
		await ctx.reply(
			`The value is successfully set. \n\n<blockquote expandable>${
				JSON.stringify(entries, null, 2)
			}</blockquote>`,
			{ parse_mode: "HTML" },
		);
	});
