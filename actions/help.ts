import { bot } from "../config/bot.ts";
import { Context } from "../deps.ts";

bot.command("help", async (ctx: Context) => {
  await ctx.reply(
    `<b>Список доступных команд:</b>` + `\n\n` +
      `/start - Запустить бота` + `\n` +
      `/anime - Поиск аниме` + `\n` +
      `/source - Получить исходный код` + `\n` +
      `/help - Показать это сообщение.` + `\n\n` +
      `<b>Для модераторов:</b>` + `\n\n` +
      `/ban - Забанить пользователя` + `\n` +
      `/unban - Разбанить пользователя` + `\n` +
      `/warn - Предупредить пользователя` + `\n` +
      `/unwarn - Снять предупреждение у пользователя`,
    {
      parse_mode: "HTML",
    },
  );
});
