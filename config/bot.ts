import { Bot} from "../deps.ts"
import { autoThread } from "https://raw.githubusercontent.com/grammyjs/auto-thread/main/src/auto-thread.ts"
import "https://deno.land/std@0.201.0/dotenv/load.ts";

export const bot = new Bot(Deno.env.get("BOT_TOKEN") as string)
export const instance = await bot.api.getMe();

bot.api.setMyCommands([
    { command: "start",  description: "Start the bot."},
    { command: "anime",  description:"To search anime from shikimori."},
    { command: "source",  description:"Get link to the source code."},
])

bot.use(autoThread())