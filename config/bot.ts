import { Bot, Middleware, NextFunction } from "../deps.ts";
import { I18n } from "../deps.ts";

import { autoThread } from "https://raw.githubusercontent.com/grammyjs/auto-thread/main/src/auto-thread.ts";
import "https://deno.land/std@0.201.0/dotenv/load.ts";

import { isBotAdmin } from "../utils/detect.ts";
import { MyContext } from "../types/context.ts";
import { getLocale } from "../db/locale.ts";
import { setCommands } from "../utils/setcommands.ts";

export const bot = new Bot<MyContext>(Deno.env.get("BOT_TOKEN") as string);
await bot.init();

// @ts-ignore deno-lint-ignore
const i18n = new I18n<MyContext>({
  defaultLocale: "en", // see below for more information
  // Load all translation files from locales/. (Not working in Deno Deploy.)
});

await i18n.loadLocalesDir("locales");

bot.use(i18n);
export const instance = bot.botInfo;

// i18n Detection
bot.use(async (ctx: MyContext, next: NextFunction) => {
  const chatId = ctx.chatId;

  if (chatId == undefined) {
    return;
  }

  const locale = await getLocale(chatId);
  await ctx.i18n.useLocale(locale);
  // await ctx.i18n.setLocale(locale);

  // Set my commands
  await setCommands(ctx, locale);

  await next();
});

// Debugger
bot.use(async (ctx: MyContext, next: NextFunction) => {
  console.log(
    `%c[INFO]`,
    "color: green",
    ctx.update,
  );

  await next();
});

bot.use(autoThread() as unknown as Middleware<MyContext>);
bot.use(isBotAdmin);
