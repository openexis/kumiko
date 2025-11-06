import { bot } from "../config/bot.ts";
import { MyContext } from "../types/context.ts";
import { isAdmin, isOwner } from "../utils/detect.ts";
import { kv } from "../config/kv.ts";

bot.chatType([
	"group",
	"supergroup",
])
	.command("set", async (ctx: MyContext) => {
		if (!Deno.env.get("GITHUB_ORG")) {
			return await ctx.reply(
				ctx.t("github-org-not-set"),
			);
		}

		// Parallelize permission checks for better performance
		const [userIsAdmin, userIsOwner] = await Promise.all([
			isAdmin(ctx),
			isOwner(bot, ctx),
		]);

		if (!userIsAdmin || !userIsOwner) {
			return await ctx.reply(ctx.t("only-admins-can-use"));
		}

		await kv.set(["thread_id"], {
			chat_id: ctx.chat?.id,
			thread_id: ctx.message?.message_thread_id,
		});

		await ctx.reply(ctx.t("thread-set-for-webhooks"));
	});
