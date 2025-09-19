import { Bot } from "../deps.ts";
import { I18n } from "../deps.ts";

import "https://deno.land/std@0.201.0/dotenv/load.ts";

import { isBotAdmin } from "../utils/detect.ts";
import { MyContext } from "../types/context.ts";
import { getLocale } from "../db/locale.ts";

import { BOT_TOKEN, STATISTICS_URL } from "./env.ts";

export const bot = new Bot<MyContext>(BOT_TOKEN);
await bot.init();

// @ts-ignore deno-lint-ignore
const i18n = new I18n<MyContext>({
  defaultLocale: "en",
});

await i18n.loadLocalesDir("locales");

bot.use(i18n);
export const instance = bot.botInfo;

// i18n Detection
bot.use(async (ctx, next) => {
  const chatId = ctx.chatId;

  if (chatId == undefined) {
    return;
  }

  const locale = await getLocale(chatId);
  await ctx.i18n.useLocale(locale);

  await next();
});

// Statistics
bot.chatType(["group", "supergroup"]).use(async (ctx, next) => {
  if (!ctx.message?.text) {
    return await next();
  }

  const user_count = await ctx.api.getChatMemberCount(ctx.chatId);

  const request_body = {
    chat_id: ctx.chatId,
    title: ctx.chat?.title,
    username: ctx.chat?.username,
    from_field: {
      id: ctx.from?.id,
      is_bot: ctx.from?.is_bot,
      first_name: ctx.from?.first_name,
      last_name: ctx.from?.last_name,
      username: ctx.from?.username,
      language_code: ctx.from?.language_code,
    },
    user_count,
    message_id: ctx.message.message_id,
    date: ctx.message.date,
    text: ctx.message.text,
  };

  console.log("Sending statistics:", request_body);

  try {
    const request = await fetch(
      `${STATISTICS_URL}/stats/update/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request_body),
      },
    );
    if (request.ok) {
      console.log("Status:", request.status);
      console.log("Body:", await request.text());
    }
  } catch (err) {
    console.log("Error: ", err);
  }

  return await next();
});

// Debugger
bot.use(async (ctx, next) => {
  console.log(
    `%c[INFO]`,
    "color: green",
    ctx.update,
  );

  await next();
});

bot.use(isBotAdmin);
