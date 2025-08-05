import { MyContext } from "../types/context.ts";

async function setCommands(ctx: MyContext, locale: string = "en") {
  ctx.i18n.useLocale(locale);
  await ctx.api.setMyCommands([
    { command: "start", description: ctx.t("start-description") },
    { command: "anime", description: ctx.t("anime-description") },
    { command: "source", description: ctx.t("source-description") },
    { command: "help", description: ctx.t("help-description") },
    { command: "warn", description: ctx.t("warn-description") },
    { command: "ban", description: ctx.t("ban-description") },
    { command: "unban", description: ctx.t("unban-description") },
    { command: "unwarn", description: ctx.t("unwarn-description") },
    { command: "mute", description: ctx.t("mute-description") },
    { command: "unmute", description: ctx.t("unmute-description") },
    { command: "lang", description: ctx.t("lang-description") },
    { command: "top", description: ctx.t("top-description") },
  ]);
}

export { setCommands };
