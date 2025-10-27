import { bot } from "../config/bot.ts";
import { base, rates } from "../utils/converter.ts";

bot.on(":text", async (ctx, next) => {
  if (ctx.message == undefined) return next();

  const text = ctx.message.text.trim().toLowerCase();

  const match = text.match(
    /\b(\d+(?:\.\d+)?)\s([a-z]{3})\b|\b([a-z]{3})\s(\d+(?:\.\d+)?)\b/,
  );
  if (!match) {
    return await next();
  }

  const amount = parseFloat(match[1] || match[4]);
  const sourceCurrency = (match[2] || match[3]).toUpperCase();

  try {
    const exchangeRates = await rates(sourceCurrency);

    const TARGET_CURRENCIES = ["USD", "EUR", "UZS", "RUB"];
    const currenciesToConvertTo = TARGET_CURRENCIES.filter(
      (c) => c !== sourceCurrency,
    );

    if (currenciesToConvertTo.length === 0) {
      return await next();
    }

    let responseMessage = `**${amount} ${sourceCurrency} is:**\n\n`;

    for (const targetCode of currenciesToConvertTo) {
      const rate = exchangeRates[targetCode];
      if (rate) {
        const convertedAmount = amount * rate;
        const formattedAmount = convertedAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        responseMessage += `• ${formattedAmount} **${targetCode}**\n`;
      }
    }

    await ctx.reply(responseMessage, { parse_mode: "Markdown" });
  } catch (error) {
    console.error(
      `Could not find rates for '${sourceCurrency}'. Message ignored. Error: ${error}`,
    );

    return await next();
  }
});

bot.command("currency", async (ctx) => {
  const currencies = await base("USD");

  const keys = Object.keys(currencies.rates);
  const last_update = new Date(currencies.time_last_update_unix * 1000);
  const next_update = new Date(currencies.time_next_update_unix * 1000);

  const last_update_hours = last_update.getHours().toString().length < 2
    ? `0${last_update.getHours()}`
    : last_update.getHours();

  const last_update_minutes = last_update.getMinutes().toString().length < 2
    ? `0${last_update.getMinutes()}`
    : last_update.getMinutes();

  const next_update_hours = next_update.getHours().toString().length < 2
    ? `0${next_update.getHours()}`
    : next_update.getHours();

  const next_update_minutes = next_update.getMinutes().toString().length < 2
    ? `0${next_update.getMinutes()}`
    : next_update.getMinutes();

  const message =
    `Last Update: ${last_update.getDate()}.${
      last_update.getMonth() + 1
    }.${last_update.getFullYear()} ${last_update_hours}:${last_update_minutes}` +
    `\n` +
    `Next Update: ${next_update.getDate()}.${
      next_update.getMonth() + 1
    }.${next_update.getFullYear()} ${next_update_hours}:${next_update_minutes}` +
    `\n` +
    `Available currencies: ` + `\n` +
    `<blockquote expandable>\n-` + keys.join("\n-") + `</blockquote>`;

  await ctx.reply(message, {
    parse_mode: "HTML",
  });
});
