import { bot } from "../config/bot.ts";
import { InlineQueryResultBuilder } from "../deps.ts";
import * as uuid from "https://deno.land/std@0.202.0/uuid/mod.ts";
import { SHIKIMORI } from "../api/mod.ts";
import { search_anime } from "../api/mod.ts";

bot.on("inline_query", async (ctx) => {
  const query = ctx.inlineQuery.query;
  const anime = await search_anime(query);

  const result = InlineQueryResultBuilder
    .photo(
      uuid.v1.generate() as string,
      `${SHIKIMORI}${anime.image}`,
      {
        thumbnail_url: `${SHIKIMORI}${anime.image}`,
        caption:
          `${anime.name}/${anime.russian}\nЭпизоды: ${anime.episodes}\nРейтинг: ${anime.rating}\nОписание: ${anime.description}...\n[Продолжать читать в Shikimori...](${SHIKIMORI}${anime.url})`,
        parse_mode: "Markdown",
      },
    );

  await ctx.answerInlineQuery([result], {});
});