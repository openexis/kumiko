import { Bot, Context, Middleware, NextFunction } from "../deps.ts";
import { I18n } from "../deps.ts";

import { autoThread } from "https://raw.githubusercontent.com/grammyjs/auto-thread/main/src/auto-thread.ts";
import "https://deno.land/std@0.201.0/dotenv/load.ts";

import { isBotAdmin } from "../utils/detect.ts";
import { MyContext } from "../types/context.ts";
import { getLocale } from "../db/locale.ts";

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

bot.api.setMyCommands([
  { command: "start", description: "Запустить бота." },
  { command: "anime", description: "Искать аниме." },
  { command: "source", description: "Получить ссылку на исходный код." },
  { command: "help", description: "Показать список команд." },
  { command: "warn", description: "Выдать предупреждение." },
  { command: "ban", description: "Забанить пользователя." },
  { command: "unban", description: "Разбанить пользователя." },
  { command: "unwarn", description: "Снять предупреждение." },
  { command: "mute", description: "Замутить пользователя." },
  { command: "unmute", description: "Размутить пользователя." },
]);

// i18n Detection
bot.use(async (ctx: MyContext, next: NextFunction) => {
  const locale = await getLocale(ctx.chat!.id);
  await ctx.i18n.useLocale(locale);
  // await ctx.i18n.setLocale(locale);
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

bot.use(autoThread() as unknown as Middleware<Context>);
bot.use(isBotAdmin);
