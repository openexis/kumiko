import { Context, Composer } from "../deps.ts";
import { isBotAdmin } from "../utils/detect.ts";

const composer = new Composer();

composer.on("message", isBotAdmin, (ctx: Context) => {})