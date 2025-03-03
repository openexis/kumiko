import { Bot, Context, Middleware, NextFunction } from "../deps.ts";
import { autoThread } from "https://raw.githubusercontent.com/grammyjs/auto-thread/main/src/auto-thread.ts";
import "https://deno.land/std@0.201.0/dotenv/load.ts";

import { isBotAdmin } from "../utils/detect.ts";

export const bot = new Bot(Deno.env.get("BOT_TOKEN") as string);
await bot.init();

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

// Debugger
bot.use(async (ctx: Context, next: NextFunction) => {
  console.log(
    `%c[INFO]`,
    "color: green",
    ctx.update,
  );

  await next();
});

bot.use(autoThread() as unknown as Middleware<Context>);
bot.use(isBotAdmin);
