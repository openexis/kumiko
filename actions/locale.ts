import { bot, kv } from "../config/index.ts";
import { InlineKeyboard } from "../deps.ts";

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

bot.command("lang", async (ctx) => {
  await ctx.reply("Choose a language:", {
    reply_markup: keyboard,
  });
});

bot.on("callback_query", async (ctx) => {
  const locale = ctx.callbackQuery.data;
  await kv.set(["locale", ctx.chat!.id.toString()], locale);

  await ctx.answerCallbackQuery({
    text: `Language changed to ${locale}`,
    show_alert: true,
  });
});
