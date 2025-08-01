import { bot } from "../config/bot.ts";
import { currency } from "../api/mod.ts";
import { CurrencyConverter } from "../utils/converter.ts";
import { MyContext } from "../types/context.ts";

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.toLowerCase();
  const converter = new CurrencyConverter(currency);

  let sourceCurrency = Object.keys(currency.rates).find((code) =>
    text.includes(code.toLowerCase())
  );

  if (!sourceCurrency && text.toLowerCase().includes("rub")) {
    sourceCurrency = "RUB";
  }

  if (!sourceCurrency) {
    return;
  }

  const [, amountStr] = text.match(
    new RegExp(
      `(\\d+(?:\\.\\d+)?(?:k|m)?)\\s?${sourceCurrency.toLowerCase()}`,
      "i",
    ),
  ) || [];

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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: targetCurrency,
    }).format(convertedAmount);
  }).join("\n");

  const formattedSourceAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: sourceCurrency.toUpperCase(),
  }).format(amount);
  const answer = ctx.t("currency-conversion", {
    source_amount: formattedSourceAmount,
    conversions: conversions,
  }).replaceAll("$", "USD ");

  await ctx.reply(answer);
});
