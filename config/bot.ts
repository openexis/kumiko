import { Bot } from "../deps.ts";
import { I18n } from "../deps.ts";

import "https://deno.land/std@0.201.0/dotenv/load.ts";

import { isBotAdmin } from "../utils/detect.ts";
import { MyContext } from "../types/context.ts";
import { getLocale } from "../db/locale.ts";

export const bot = new Bot<MyContext>(Deno.env.get("BOT_TOKEN") as string);
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
