import { InlineKeyboard } from "../deps.ts";

import {
  ForkEvent,
  IssueCommentEvent,
  IssuesEvent,
  PullRequestEvent,
  PushEvent,
  StarEvent,
} from "npm:@octokit/webhooks-types";

function constructKeyboard(url: string): InlineKeyboard {
  return new InlineKeyboard().url(
    "Open in GitHub",
    url,
  );
}

type Event =
  | StarEvent
  | IssuesEvent
  | ForkEvent
  | PullRequestEvent
  | IssueCommentEvent
  | PushEvent;

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
  event: Event,
): { text: string; keyboard: InlineKeyboard } {
  if ("starred_at" in event) {
    // StarEvent
    switch (event.action) {
      case "created":
        return {
          text:
            `⭐️ New star on <a href="${event.repository.html_url}">${event.repository.full_name}</a> by <b><a href="${event.sender.html_url}">@${event.sender.login}</a></b>`,
          keyboard: constructKeyboard(event.repository.html_url),
        };
      case "deleted":
        return {
          text:
            `❌⭐️ <b><a href="${event.sender.html_url}">@${event.sender.login}</a></b> unstarred the <a href="${event.repository.html_url}">${event.repository.full_name}</a> repository.`,
          keyboard: constructKeyboard(
            event.repository.html_url,
          ),
        };
    }
  } else if ("issue" in event && !("comment" in event)) {
    // IssuesEvent
    switch (event.action) {
      case "opened":
        return {
          text:
            `⭐️ New issue <b><a href="${event.issue.html_url}">#${event.issue.id}</a></b> was created on <a href="${event.repository.html_url}">${event.repository.full_name}</a> by <b><a href="${event.sender.html_url}">@${event.sender.login}</a></b>\nTitle: ${event.issue.title}`,
          keyboard: constructKeyboard(event.issue.html_url),
        };

      case "closed":
        return {
          text:
            `⭐️ Issue <b><a href="${event.issue.html_url}">#${event.issue.id}</a></b> on <a href="${event.repository.html_url}">${event.repository.full_name}</a> is closed by <b><a href="${event.sender.html_url}">@${event.sender.login}</a></b>\nTitle: ${event.issue.title}`,
          keyboard: constructKeyboard(event.issue.html_url),
        };

      case "deleted":
        return {
          text:
            `⭐️ Issue <b><a href="${event.issue.html_url}">#${event.issue.id}</a></b> on <a href="${event.repository.html_url}">${event.repository.full_name}</a> was deleted by <b><a href="${event.sender.html_url}">@${event.sender.login}</a></b>\nTitle: ${event.issue.title}`,
          keyboard: constructKeyboard(event.issue.html_url),
        };
    }
  } else if ("forkee" in event) {
    // ForkEvent
    return {
      text:
        `🍴 <b><a href="${event.sender.html_url}">@${event.sender.login}</a></b> has forked the <a href="${event.repository.html_url}">${event.repository.full_name}</a> repository on <a href="${event.forkee.html_url}">${event.forkee.full_name}</a>`,
      keyboard: constructKeyboard(event.forkee.html_url),
    };
  } else if ("pull_request" in event) {
    // PullRequestEvent
    switch (event.action) {
      case "opened":
        return {
          text:
            `🧩 New pull request <b><a href="${event.pull_request.html_url}">#${event.pull_request.id}</a></b> created on <b><a href="${event.repository.html_url}">${event.repository.full_name}</a></b>\nTitle: ${event.pull_request.title}`,
          keyboard: constructKeyboard(event.pull_request.url),
        };
      case "closed":
        switch (event.pull_request.merged) {
          case true:
            return {
              text:
                `🧩 PR <b><a href="${event.pull_request.html_url}">#${event.pull_request.id}</a></b> on <b><a href="${event.repository.html_url}">${event.repository.full_name}</a></b> is merged.\nTitle: ${event.pull_request.title}`,
              keyboard: constructKeyboard(event.pull_request.url),
            };

          case false:
            return {
              text:
                `🧩 PR <b><a href="${event.pull_request.html_url}">#${event.pull_request.id}</a></b> on <b><a href="${event.repository.html_url}">${event.repository.full_name}</a></b> is closed.\nTitle: ${event.pull_request.title}`,
              keyboard: constructKeyboard(
                event.pull_request.url,
              ),
            };
        }
    }
  } else if ("comment" in event) {
    // IssueCommentEvent
    switch (event.action) {
      case "created":
        return {
          text:
            `⭐️ New <b><a href="${event.comment.html_url}">comment</a></b> on <b><a href="${event.issue.html_url}">#${event.issue.id}</a></b> on <a href="${event.repository.html_url}">${event.repository.full_name}</a> by <b><a href="${event.sender.html_url}">@${event.sender.login}</a></b>\nTitle: ${event.issue.title}`,
          keyboard: constructKeyboard(event.comment.html_url),
        };

      case "deleted":
        return {
          text:
            `⭐️ <b><a href="${event.comment.html_url}">Comment</a></b> on <b><a href="${event.issue.html_url}">#${event.issue.id}</a></b> on <a href="${event.repository.html_url}">${event.repository.full_name}</a> was deleted by <b><a href="${event.sender.html_url}">@${event.sender.login}</a></b>\nTitle: ${event.issue.title}`,
          keyboard: constructKeyboard(event.comment.html_url),
        };
    }
  } else if ("pusher" in event) {
    // PushEvent
    return {
      text:
        `🔨 New <b><a href="https://github.com/${event.repository.full_name}/commit/${event.after}">commit</a></b> on <a href="${event.repository.html_url}">${event.repository.full_name}</a> by <b><a href="${event.sender.html_url}">@${event.sender.login}</a></b>`,
      keyboard: constructKeyboard(
        `https://github.com/${event.repository.full_name}/commit/${event.after}`,
      ),
    };
  } else void (event satisfies never);

  return { text: "OK", keyboard: new InlineKeyboard() };
}
