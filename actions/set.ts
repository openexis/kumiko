import { bot } from "../config/bot.ts";
import { kv } from "../config/kv.ts";

bot.chatType("private").on(":text", async (ctx) => {
  if (ctx.chat.id != 5560860031) return;

  if (ctx.message == undefined) return;

  const [_, key, value] = ctx.message.text.split(" ");

  console.log("Key: ", key);
  console.log("Value: ", value);

  await kv.set([key], value);

  const entry = await kv.get<string>([key]);

  console.log(
    `The value is successfully set. \n\n<code>${JSON.stringify(entry)}</code>`,
  );
  await ctx.reply(
    `The value is successfully set. \n\n<code>${JSON.stringify(entry)}</code>`,
    { parse_mode: "HTML" },
  );
});
