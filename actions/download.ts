import { download } from "../api/cobalt.ts";
import { bot } from "../config/bot.ts";

import { InputFile } from "../deps.ts";

bot
  .chatType(["group", "supergroup"])
  .on(":text", async (ctx, next) => {
    const isURL = URL.canParse(ctx.message.text);

    if (!isURL) {
      return await next();
    }

    const url = new URL(ctx.message.text);

    const doesInclude = url.host.includes("instagram");
    // NOTE: it has some issues with youtube, will be fixed later
    // tiktok is blocked, will be fixed after a proxy is installed

    // ||
    //   url.host.includes("youtube") ||
    //   url.host.includes("youtu.be") ||
    //   url.host.includes("tiktok");

    if (!doesInclude) return await next();

    const response = await download(url.href);

    if (!response.ok) {
      return await ctx.reply(response.message);
    }

    if (response.filetype == "photo") {
      return await ctx.api.sendPhoto(
        ctx.chatId,
        new InputFile(new URL(response.url)),
        {
          caption: response.message,
          message_thread_id: ctx.message.message_thread_id,
        },
      );
    }

    return await ctx.api.sendVideo(
      ctx.chatId,
      response.url,
      {
        caption: response.message,
        message_thread_id: ctx.message.message_thread_id,
      },
    );
  });
