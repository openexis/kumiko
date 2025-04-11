// deno-lint-ignore-file no-explicit-any
import { InlineKeyboard } from "../deps.ts";

/**
 * ### Function to decide which event was triggered in the response.
 * Supported events:
 * - issue
 * - star/unstar
 * - commit
 * - pull request
 * - fork
 * @param event
 * @param body
 * @returns  Text and keyboard to send to a specific `Promise<{ text: string; keyboard: InlineKeyboard }>`
 */
export function decideResponse(
  event: string,
  body: any,
): { text: string; keyboard: InlineKeyboard } {
  // Handle star/unstar
  if (event == "star") {
    switch (body.action) {
      case "created":
        return {
          text:
            `⭐️ New star on <a href="${body.repository.html_url}">${body.repository.full_name}</a> by <b><a href="${body.sender.html_url}">@${body.sender.login}</a></b>`,
          keyboard: new InlineKeyboard().url(
            "Open in GitHub",
            body.repository.html_url,
          ),
        };
      case "deleted":
        return {
          text:
            `❌⭐️ <b><a href="${body.sender.html_url}">@${body.sender.login}</a></b> unstarred the <a href="${body.repository.html_url}">${body.repository.full_name}</a> repository.`,
          keyboard: new InlineKeyboard().url(
            "Open in GitHub",
            body.repository.html_url,
          ),
        };
    }
  }

  // Handle fork
  if (event == "fork") {
    return {
      text:
        `🍴 <b><a href="${body.sender.html_url}">@${body.sender.login}</a></b> has forked the <a href="${body.repository.html_url}">${body.repository.full_name}</a> repository on <a href="${body.forkee.html_url}">${body.forkee.full_name}</a>`,
      keyboard: new InlineKeyboard().url(
        "Open in GitHub",
        body.forkee.html_url,
      ),
    };
  }

  // Handle pull request
  if (event == "pull_request") {
    switch (body.action) {
      case "opened":
        return {
          text:
            `🧩 New pull request <b><a href="${body.pull_request.html_url}">#${body.pull_request.id}</a></b> created on <b><a href="${body.repository.html_url}">${body.repository.full_name}</a></b>\nTitle: ${body.pull_request.title}`,
          keyboard: new InlineKeyboard().url(
            "Open in GitHub",
            body.pull_request.url,
          ),
        };
      case "closed":
        switch (body.pull_request.merged) {
          case true:
            return {
              text:
                `🧩 PR <b><a href="${body.pull_request.html_url}">#${body.pull_request.id}</a></b> on <b><a href="${body.repository.html_url}">${body.repository.full_name}</a></b> is merged.\nTitle: ${body.pull_request.title}`,
              keyboard: new InlineKeyboard().url(
                "Open in GitHub",
                body.pull_request.url,
              ),
            };

          case false:
            return {
              text:
                `🧩 PR <b><a href="${body.pull_request.html_url}">#${body.pull_request.id}</a></b> on <b><a href="${body.repository.html_url}">${body.repository.full_name}</a></b> is closed.\nTitle: ${body.pull_request.title}`,
              keyboard: new InlineKeyboard().url(
                "Open in GitHub",
                body.pull_request.url,
              ),
            };
        }
    }
  }

  // Handle issue
  if (event == "issues") {
    switch (body.action) {
      case "opened":
        return {
          text:
            `⭐️ New issue <b><a href="${body.issue.html_url}">#${body.issue.id}</a></b> was created on <a href="${body.repository.html_url}">${body.repository.full_name}</a> by <b><a href="${body.sender.html_url}">@${body.sender.login}</a></b>\nTitle: ${body.issue.title}`,
          keyboard: new InlineKeyboard().url(
            "Open in GitHub",
            body.issue.html_url,
          ),
        };

      case "closed":
        return {
          text:
            `⭐️ Issue <b><a href="${body.issue.html_url}">#${body.issue.id}</a></b> on <a href="${body.repository.html_url}">${body.repository.full_name}</a> is closed by <b><a href="${body.sender.html_url}">@${body.sender.login}</a></b>\nTitle: ${body.issue.title}`,
          keyboard: new InlineKeyboard().url(
            "Open in GitHub",
            body.issue.html_url,
          ),
        };

      case "deleted":
        return {
          text:
            `⭐️ Issue <b><a href="${body.issue.html_url}">#${body.issue.id}</a></b> on <a href="${body.repository.html_url}">${body.repository.full_name}</a> was deleted by <b><a href="${body.sender.html_url}">@${body.sender.login}</a></b>\nTitle: ${body.issue.title}`,
          keyboard: new InlineKeyboard().url(
            "Open in GitHub",
            body.issue.html_url,
          ),
        };
    }
  }

  // Handle issue/pr comment
  if (event == "issue_comment") {
    switch (body.action) {
      case "created":
        return {
          text:
            `⭐️ New <b><a href="${body.comment.html_url}">comment</a></b> on <b><a href="${body.issue.html_url}">#${body.issue.id}</a></b> on <a href="${body.repository.html_url}">${body.repository.full_name}</a> by <b><a href="${body.sender.html_url}">@${body.sender.login}</a></b>\nTitle: ${body.issue.title}`,
          keyboard: new InlineKeyboard().url(
            "Open in GitHub",
            body.comment.html_url,
          ),
        };

      case "deleted":
        return {
          text:
            `⭐️ <b><a href="${body.comment.html_url}">Comment</a></b> on <b><a href="${body.issue.html_url}">#${body.issue.id}</a></b> on <a href="${body.repository.html_url}">${body.repository.full_name}</a> was deleted by <b><a href="${body.sender.html_url}">@${body.sender.login}</a></b>\nTitle: ${body.issue.title}`,
          keyboard: new InlineKeyboard().url(
            "Open in GitHub",
            body.comment.html_url,
          ),
        };
    }
  }

  // Handle commit

  if (event == "push") {
    return {
      text:
        `🔨 New <b><a href="https://github.com/${body.repository.full_name}/commit/${body.after}">commit</a></b> on <a href="${body.repository.html_url}">${body.repository.full_name}</a> by <b><a href="${body.sender.html_url}">@${body.sender.login}</a></b>`,
      keyboard: new InlineKeyboard().url(
        "Open in GitHub",
        `https://github.com/${body.repository.full_name}/commit/${body.after}`,
      ),
    };
  }

  return { text: "OK", keyboard: new InlineKeyboard() };
}
