import { bot } from "../config/bot.ts";
import { rates } from "../utils/converter.ts";

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim().toLowerCase();

  const match = text.match(
    /\b(\d+(?:\.\d+)?)\s([a-z]{3})\b|\b([a-z]{3})\s(\d+(?:\.\d+)?)\b/,
  );
  if (!match) {
    return;
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
      return;
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

    return;
  }
});
