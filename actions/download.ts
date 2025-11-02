import { download, is_supported } from "../api/cobalt.ts";
import { bot } from "../config/bot.ts";

import { InputFile } from "../deps.ts";

bot.chatType(["group", "supergroup"]).on(":text", async (ctx, next) => {
	const text = ctx.message.text;

	if (!URL.canParse(text)) return await next();
	const url = new URL(text);

	const parts = url.hostname.split(".");
	const domain = parts.length > 2 ? parts[parts.length - 2] : parts[0];

	const isYouTube =
		(url.host.includes("youtube") || url.host.includes("youtu.be")) &&
		url.pathname.includes("/shorts");

	const isTikTok = url.host.includes("tiktok");
	// NOTE: ignoring TikTok untill the proxy problem is solved
	const isInstagram = url.host.includes("instagram");

	console.log(await is_supported(domain));

	const doesInclude = isYouTube || isInstagram || isTikTok ||
		((await is_supported(domain)).ok);
	if (!doesInclude) return await next();

	// isYouTube
	// // ?
	const response = await download(url.href, {
		youtubeVideoCodec: "h264",
		youtubeVideoContainer: "mp4",
	});
	// : await download(url.href);

	if (!response.ok) {
		console.log(response.message);
		return await ctx.reply(
			"Something's wrong with Cobalt API.",
		);
	}

	try {
		if (response.filetype === "photo") {
			return await ctx.api.sendPhoto(
				ctx.chatId,
				new InputFile(new URL(response.url)),
				{
					caption: response.message,
					message_thread_id: ctx.message.message_thread_id,
				},
			);
		}

		console.log(response.url);

		return await ctx.api.sendVideo(
			ctx.chatId,
			new InputFile(new URL(response.url)),
			{
				caption: response.message,
				message_thread_id: ctx.message.message_thread_id,
			},
		);
	} catch (error) {
		return await ctx.reply(`Error occured while sending media: ${error}`, {
			message_thread_id: ctx.message.message_thread_id,
		});
	}
});
