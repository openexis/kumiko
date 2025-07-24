import { bot } from "../config/bot.ts";
import { MyContext } from "../types/context.ts";

bot.command("help", async (ctx: MyContext) => {
  // await ctx.reply(
  //   `<b>Список доступных команд:</b>` + `\n\n` +
  //     `/start - Запустить бота` + `\n` +
  //     `/anime - Поиск аниме` + `\n` +
  //     `/source - Получить исходный код` + `\n` +
  //     `/help - Показать это сообщение.` + `\n\n` +
  //     `<b>Для модераторов:</b>` + `\n\n` +
  //     `/ban - Забанить пользователя` + `\n` +
  //     `/unban - Разбанить пользователя` + `\n` +
  //     `/warn - Предупредить пользователя` + `\n` +
  //     `/unwarn - Снять предупреждение у пользователя` + "\n" +
  //     `/mute - Замутить пользователя` + "\n" +
  //     `/unmute - Размутить пользователя`,
  //   {
  //     parse_mode: "HTML",
  //   },
  // );

  await ctx.reply(ctx.t("help"));
});
