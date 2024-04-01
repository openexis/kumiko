import { bot } from "../config/index.ts";
import { Context } from "../deps.ts";
import { search_anime, SHIKIMORI } from "../api/mod.ts";
import { InlineQueryResultBuilder } from "../deps.ts";
import * as uuid from "https://deno.land/std@0.202.0/uuid/mod.ts";

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

// Listens for inline queries and processes them
bot.on("inline_query", async (ctx) => {
  // Extracts the query from the inline query context
  const query = ctx.inlineQuery.query;
  // Searches for anime based on the query
  const anime = await search_anime(query);
  // Builds the inline query result with the retrieved anime information
  const result = InlineQueryResultBuilder
    .photo(
      // Generates a unique identifier for the result
      uuid.v1.generate() as string,
      // Sets the photo URL for the result
      `${SHIKIMORI}${anime.image}`,
      {
        // Sets the thumbnail URL and caption for the photo result
        thumbnail_url: `${SHIKIMORI}${anime.image}`,
        caption:
          // Formats the caption with the anime details and a link to Shikimori
          `${anime.name}/${anime.russian}\nЭпизоды: ${anime.episodes}\nРейтинг: ${anime.rating}\nОписание: ${anime.description}...\n[Продолжать читать в Shikimori...](${SHIKIMORI}${anime.url})`,
        // Sets the parse mode to Markdown for the caption
        parse_mode: "Markdown",
      },
    );

  // Answers the inline query with the constructed result
  await ctx.answerInlineQuery([result], {});
});
