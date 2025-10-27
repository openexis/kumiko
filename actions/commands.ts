import { bot } from "../config/bot.ts";
import { LanguageCode } from "../deps.ts";

import entries from "../commands.json" with { type: "json" };

bot
  .chatType("private")
  .command("commands", async (ctx) => {
    if (ctx.chat.id != 5560860031) return;

    const success: { status: boolean; language: string }[] = [];

    for (const entry of entries) {
      success.push(
        {
          status: await ctx.api.setMyCommands(entry.commands, {
            language_code: entry.language as LanguageCode,
          }),
          language: entry.language,
        },
      );
    }

    await ctx.reply(
      `Operation results: \n\n<pre><code class="language-json">${
        JSON.stringify(success, null, 2)
      }</code></pre>`,
      {
        parse_mode: "HTML",
      },
    );
  });
