import { download } from "../api/cobalt.ts";
import { bot } from "../config/bot.ts";

import { InputFile } from "../deps.ts";

bot
  .chatType(["group", "supergroup"])
  .on(":text", async (ctx, next) => {
    const text = ctx.message.text;

    if (!URL.canParse(text)) return await next();

    const url = new URL(text);

    const isYouTube =
      (url.host.includes("youtube") || url.host.includes("youtu.be")) &&
      url.pathname.includes("/shorts");

    const isInstagram = url.host.includes("instagram");
    // NOTE:
    // tiktok is blocked, will be fixed after a proxy is installed

    const doesInclude = isYouTube || isInstagram;
    if (!doesInclude) return await next();

    const response = isYouTube
      ? await download(url.href, {
        youtubeVideoCodec: "h264",
        youtubeVideoContainer: "mp4",
      })
      : await download(url.href);

    if (!response.ok) {
      console.log(response.message);
      return await ctx.reply(
        "Something's wrong with Cobalt API, try sending another link. ",
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
      return await ctx.reply(
        `Error occured while sending media: ${error}`,
        {
          message_thread_id: ctx.message.message_thread_id,
        },
      );
    }
  });
