import { bot } from "../config/bot.ts";
import { currency } from "../api/mod.ts";
import { CurrencyConverter } from "../utils/converter.ts";

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.toLowerCase();
  const converter = new CurrencyConverter(currency);

  const sourceCurrency = Object.keys(currency.rates).filter((code) =>
    text.toLowerCase().includes(code.toLowerCase())
  )[0];

  const pattern =
    `\\b(\\d+(?:\\.\\d+)?(?:k|m)?)(?=\\s?${sourceCurrency.toLowerCase()})`;
  const regex = new RegExp(pattern, "i");

  const match = text.toLowerCase().match(regex);
  const amountStr = match?.[0] || "";

  let amount = 0;
  if (amountStr.includes("k")) {
    amount = Number(amountStr.replace("k", "")) * 1000;
  } else if (amountStr.includes("m")) {
    amount = Number(amountStr.replace("m", "")) * 1000000;
  } else {
    amount = Number(amountStr.replace(".", ""));
  }

  const targetCurrencies = ["USD", "UZS", "RUB"].filter((c) =>
    c !== sourceCurrency
  );

  const conversions = targetCurrencies.map((targetCurrency) => {
    const convertedAmount = converter.convert(
      amount,
      sourceCurrency,
      targetCurrency,
    );
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: targetCurrency,
    }).format(convertedAmount);
    return `${formattedAmount}`;
  }).join("\n");

  const formattedSourceAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: sourceCurrency.toUpperCase(),
  }).format(amount);
  const answer = `${formattedSourceAmount} is equivalent to:\n\n${conversions}`;

  await ctx.reply(answer);
});
