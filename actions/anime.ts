import { bot } from "../config/index.ts";
import { Context } from "../deps.ts";
import { search_anime, SHIKIMORI } from "../api/mod.ts";

bot.command("anime", async (ctx: Context) => {
  const anime_name: string = ctx.update.message?.text?.split("anime")[1]
    .trim() as string;
  const anime = await search_anime(anime_name);
  await ctx.api.sendPhoto(
    ctx.update.message?.chat.id as number,
    `${SHIKIMORI}${anime.image}`,
    {
      caption:
        `${anime.name}/${anime.russian}\nЭпизоды: ${anime.episodes}\nРейтинг: ${anime.rating}\nОписание: ${anime.description}...\n[Продолжать читать в Shikimori...](${SHIKIMORI}${anime.url})`,
      parse_mode: "Markdown",
    },
  );
});
