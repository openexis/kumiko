import { bot } from "../config/index.ts";
import { Context } from "../deps.ts";
import { search_anime, SHIKIMORI } from "../api/mod.ts";

// Define a command "anime" for the bot
bot.command("anime", async (ctx: Context) => {
  // Extract the anime name from the message
  const anime_name: string = ctx.update.message?.text?.split("anime")[1]
    .trim() as string;
  // Search for the anime
  const anime = await search_anime(anime_name);
  // Send the anime details as a photo with caption
  await ctx.api.sendPhoto(
    ctx.update.message?.chat.id as number,
    `${SHIKIMORI}${anime.image}`,
    {
      // Construct the caption with anime details and a link to Shikimori
      caption:
        `${anime.name}/${anime.russian}\nЭпизоды: ${anime.episodes}\nРейтинг: ${anime.rating}\nОписание: ${anime.description}...\n[Продолжать читать в Shikimori...](${SHIKIMORI}${anime.url})`,
      parse_mode: "Markdown",
    },
  );
});
