import { bot } from "../config/bot.ts";
import { kv } from "../config/kv.ts";
import { InlineKeyboard } from "../deps.ts";
import { MyContext } from "../types/context.ts";
import { setCommands } from "../utils/setCommands.ts";

const locales = [
  {
    code: "en",
    name: "English",
    emoji: "🇬🇧",
  },
  {
    code: "ru",
    name: "Русский",
    emoji: "🇷🇺",
  },
  {
    code: "uz",
    name: "O'zbek",
    emoji: "🇺🇿",
  },
];

const keyboard = new InlineKeyboard();
locales.map((locale: { code: string; name: string; emoji: string }) => {
  keyboard.text(`${locale.name} ${locale.emoji}`, locale.code).row();
});

bot.command("lang", async (ctx: MyContext) => {
  await ctx.reply(ctx.t("choose-language"), {
    reply_markup: keyboard,
  });
});

bot.on("callback_query", async (ctx) => {
  const locale = ctx.callbackQuery.data;
  await kv.set(["locale", ctx.chat!.id.toString()], locale);

  await setCommands(ctx, locale);

  await ctx.answerCallbackQuery({
    text: ctx.t("language-changed", { locale: locale! }),
    show_alert: true,
  });
});
