import { bot } from "../config/bot.ts";
import {
	getKarma,
	incrementUserChangeCount,
	isUserAtLimit,
	updateKarma,
} from "../db/karma.ts";

import { kv } from "../config/kv.ts";

// HTML escape function to prevent XSS attacks
function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
	};
	return text.replace(/[&<>"']/g, (char) => map[char]);
}

const karma_words = [
	"thanks",
	"tnx",
	"raxmat",
	"rahmat",
	"рахмат",
	"спасибо",
	"спасиба",
	"спасибки",
	"спс",
	"пасиб",
	"пасиба",
	"сяп",
	"пасибки",
	"спасибочки",
	"благодарю",
	"респект",
	// "от души",
	// "thank you",
	"ty",
	"respect",
	"tashakkur",
	"minnatdorman",
];

// Handle + / - karma changes
bot.chatType(["group", "supergroup"]).on(":text").filter(
	(ctx) => {
		const text = ctx.msg!.text!;
		const lowerText = ctx.message.text.toLowerCase();
		const words = lowerText.split(" ");
		return /^(\+|-)\1*$/.test(text) ||
			karma_words.some((word) => words.includes(word));
	},
	async (ctx, next) => {
		if (!ctx.message?.reply_to_message) return await next();

		const chat_id = ctx.chatId!;
		const user_id = ctx.from!.id!;
		const reply_user = ctx.msg!.reply_to_message!.from!;
		const reply_user_id = reply_user.id;

		if (user_id === reply_user_id) {
			return await ctx.reply(ctx.t("cant-change-own-reputation"));
		}

		if (await isUserAtLimit(chat_id, user_id)) {
			return await ctx.reply(ctx.t("cant-change-user-karma"));
		}

		// Check if it's a positive karma change (reuse filter logic)
		const text = ctx.msg!.text!;
		const lowerText = text.toLowerCase();
		const words = lowerText.split(" ");
		const karma_amount = text.startsWith("+") ||
				karma_words.some((word) => words.includes(word))
			? 1
			: -1;
		const reply_user_name = reply_user.first_name;

		await incrementUserChangeCount(chat_id, user_id);
		await updateKarma(chat_id, reply_user_id, karma_amount);

		const fromUserKarma = await getKarma(chat_id, user_id);
		const toUserKarma = await getKarma(chat_id, reply_user_id);

		const action = karma_amount === 1
			? ctx.t("increased")
			: ctx.t("decreased");

		// NOTE: ctx.t() function is producing IDs as 100,000,000 not as 1000000000, breaking Telegram's deeplink scheme.
		// so .replaceAll() method is used to reform the ID.
		await ctx.reply(
			ctx.t("reputation-changed", {
				user_id: user_id,
				user_name: ctx.from!.first_name!,
				from_user_karma: fromUserKarma!,
				action: action,
				reply_user_id: reply_user_id,
				reply_user_name: reply_user_name,
				to_user_karma: toUserKarma!,
			}).replaceAll(
				",",
				"",
			),
			{
				parse_mode: "HTML",
			},
		);
	},
);

bot.command("top", async (ctx) => {
	const topUsers: { id: number; karma: number }[] = [];

	for await (
		const entry of kv.list<number>({
			prefix: ["karma", ctx.chatId!.toString()],
		})
	) {
		const userId = entry.key[2] as string;

		topUsers.push({ id: parseInt(userId), karma: entry.value });
	}

	topUsers.sort((a, b) => b.karma - a.karma);
	const top10 = topUsers.slice(0, 10);

	if (top10.length === 0) {
		return await ctx.reply("📉 Nobody has karma yet.");
	}

	const chatId = ctx.chatId;
	if (chatId == undefined) {
		return;
	}

	// Parallelize getChatMember API calls for better performance
	const userPromises = top10.map((user) =>
		bot.api.getChatMember(chatId, user.id)
			.catch(() => null) // Handle errors gracefully (user might have left)
	);
	const chatMembers = await Promise.all(userPromises);

	let reply = `🏆 <b>${ctx.t("top-10-users-by-karma")}</b>\n\n`;
	for (let i = 0; i < top10.length; i++) {
		const user = top10[i];
		const chatMember = chatMembers[i];
		
		if (chatMember) {
			const escapedName = escapeHtml(chatMember.user.first_name);
			reply += `${i + 1}. <a href="tg://user?id=${user.id}">${escapedName}</a> — <b>${user.karma}</b>\n`;
		} else {
			// Fallback for users who left the chat
			reply += `${i + 1}. User (ID: ${user.id}) — <b>${user.karma}</b>\n`;
		}
	}

	await ctx.reply(reply, { parse_mode: "HTML" });
});
