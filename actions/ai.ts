import { bot } from "../config/bot.ts";
import { clearHistory, getHistory, saveHistory } from "../config/kv.ts";
import { MyContext } from "../types/context.ts";

interface ContentPart {
  text: string;
}

interface Content {
  parts: ContentPart[];
}

interface Candidate {
  content: Content;
}

interface GeminiResponse {
  candidates: Candidate[];
  modelVersion: string;
}

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

bot.command("ai", async (ctx: MyContext) => {
  const prompt = ctx.msg?.text?.split("ai")[1].trim();
  const userId = ctx.chat?.id!;
  const history = await getHistory(userId);

  const contextString = history.length > 0
    ? "Previous conversation:\n" + history.map((msg) =>
      `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
    ).join("\n") + "\n\nCurrent message: "
    : "";

  console.log("Context history: ", contextString);

  const requestBody = {
    system_instruction: {
      parts: [{
        "text":
          "You are a Telegram bot that formats responses using HTML tags. Use these formats:\n\n" +
          "Text styling:\n" +
          "• <b>bold</b> or <strong>bold</strong>\n" +
          "• <i>italic</i> or <em>italic</em>\n" +
          "• <u>underline</u> or <ins>underline</ins>\n" +
          "• <s>strikethrough</s>, <strike>strikethrough</strike>, or <del>strikethrough</del>\n" +
          "• <tg-spoiler>spoiler</tg-spoiler>\n\n" +
          "Code formatting:\n" +
          "• Replace `inline code` with <code>inline code</code>\n" +
          "• For general code blocks:\n" +
          "  <pre><code>code blocks</code></pre>\n" +
          "• For language-specific code:\n" +
          '  <pre><code class="language-python">python code</code></pre>\n\n' +
          "IMPORTANT! Format code blocks without extra whitespace or newlines:\n" +
          "❌ WRONG:\n" +
          "<pre><code>\n    cd Documents\n    </code></pre>\n" +
          "✅ CORRECT:\n" +
          "<pre><code>cd Documents</code></pre>\n\n" +
          "✅ CORRECT with language:\n" +
          '<pre><code class="language-bash">cd Documents</code></pre>\n\n' +
          "Links and quotes:\n" +
          '• <a href="URL">link text</a> for URLs\n' +
          "• <blockquote>quoted text</blockquote> for quotes\n\n" +
          "Rules:\n" +
          "1. Escape < and > as &lt; and &gt; when not using tags\n" +
          "2. Nested formatting is allowed: <b>bold <i>and italic</i></b>\n" +
          "3. Use language classes when showing programming code\n" +
          "4. Line breaks in blockquotes use \\n\n" +
          "5. Keep code blocks clean without extra whitespace or newlines\n\n" +
          "Example of nested formatting:\n" +
          "<b>bold <i>italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u></i> bold</b>",
      }],
    },
    contents: {
      role: "user",
      parts: [{
        text: contextString + prompt,
      }],
    },
  };

  const resp = await fetch(`${GEMINI_URL}${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const json_body = await resp.json() as GeminiResponse;
  const prompt_response = json_body.candidates[0].content.parts[0].text
    .replace("```html", "")
    .replace("```", "");

  // After getting response
  history.push({ role: "user", content: prompt! });
  history.push({ role: "assistant", content: prompt_response });
  await saveHistory(userId, history);

  ctx.reply(
    ctx.t("prompt-answer", {
      prompt: prompt!,
      answer: prompt_response.replaceAll("  *  ", " - "),
    }),
    {
      parse_mode: "HTML",
    },
  );
});

bot.command("context", async (ctx: MyContext) => {
  const history = await getHistory(ctx.from?.id!);

  console.log("History: ", history);

  ctx.reply(ctx.t("history"));
});

bot.command("reset", async (ctx: MyContext) => {
  await clearHistory(ctx.chat!.id!);

  ctx.reply(ctx.t("history-cleared"));
});
