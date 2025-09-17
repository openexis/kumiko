import { bot } from "../config/bot.ts";
import { MyContext } from "../types/context.ts";
import { search_anime, SHIKIMORI } from "../api/mod.ts";
import { InlineQueryResultBuilder } from "../deps.ts";
import * as uuid from "https://deno.land/std@0.202.0/uuid/mod.ts";

bot.command("anime", async (ctx: MyContext) => {
  const anime_name: string = ctx.update.message?.text?.split("anime")[1]
    .trim() as string;

  if (anime_name == "@" + ctx.me.username) {
    return;
  }

  if (anime_name == "") {
    return await ctx.reply("Anime name can not be empty.");
  }

  const anime = await search_anime(anime_name);

  await ctx.api.sendPhoto(
    ctx.update.message?.chat.id as number,
    `${SHIKIMORI}${anime.image}`,
    {
      caption: ctx.t("anime_info", {
        name: anime.name,
        russian: anime.russian,
        episodes: anime.episodes,
        rating: anime.rating,
        description: anime.description,
        shikimori: SHIKIMORI,
        url: anime.url,
      }),
      message_thread_id: ctx.message?.message_thread_id,
      parse_mode: "HTML",
    },
  );
});

bot.on("inline_query", async (ctx) => {
  const query = ctx.inlineQuery.query;
  const anime = await search_anime(query);
  const result = InlineQueryResultBuilder
    .photo(
      uuid.v1.generate() as string,
      `${SHIKIMORI}${anime.image}`,
      {
        thumbnail_url: `${SHIKIMORI}${anime.image}`,
        caption: ctx.t("anime_info", {
          name: anime.name,
          russian: anime.russian,
          episodes: anime.episodes,
          rating: anime.rating,
          description: anime.description,
          shikimori: SHIKIMORI,
          url: anime.url,
        }),
        parse_mode: "HTML",
      },
    );

  await ctx.answerInlineQuery([result], {});
});
