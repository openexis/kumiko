start = Hi {$name}, how can I help you today?

top-10-users-by-karma = Top 10 Users by Karma

help-commands =
    <b>List of available commands:</b>

    /start - Start the bot
    /anime - Search for anime
    /source - Get the source code
    /help - Show this message
    /lang - Change the language of the bot
    /top - ListTop 10 users by karma

    <b>For moderators:</b>

    /ban - Ban a user
    /unban - Unban a user
    /warn - Warn a user
    /unwarn - Remove warning from a user
    /mute - Mute a user
    /unmute - Unmute a user


source = Source code: { $url }

increased = increased

decreased = decreased

cant-change-user-karma = You can't change user's rating more than 5 times for day.

choose-language = Please choose a language:

language-changed = Language changed to {$locale}.

history = History

history-cleared = The conversation history has been cleared.

reputation-changed =
    <a href="tg://user?id={$user_id}">{$user_name}</a> ({$from_user_karma}) has {$action} the reputation of <a href="tg://user?id={$reply_user_id}">{$reply_user_name}</a> ({$to_user_karma}).

cant-change-own-reputation = You can’t change your own reputation.

reply-to-message = Please reply to a message.

i-am-already-an-admin = I'm already an admin.

i-dont-have-permission-to-add-admin = I don’t have permission to add new admins.

owner-permissions-cannot-be-changed = The owner's permissions can't be changed.

user-is-now-admin =
    <a href="{$user_link}">{$user_name}</a> is now an admin with basic permissions.

should-i-ban-myself = I'll let you in on a secret: you can't do this.

user-banned = The user [{$user_name}](tg://user?id={$user_id}) has been banned.

user-unbanned = The user [{$user_name}](tg://user?id={$user_id}) has been unbanned.

should-i-mute-myself = I'll let you in on a secret: you can't do this.

i-cant-mute-admins = I can’t mute admins.

user-muted = The user [{$user_name}](tg://user?id={$user_id}) has been muted.

invalid-time-unit = Invalid time unit. Use formats like 1m, 1h, or 1d.

should-i-unmute-myself = Hmm… Should I unmute myself?

i-cant-unmute-admins = I can’t unmute admins.

user-unmuted = The user [{$user_name}](tg://user?id={$user_id}) has been unmuted.

unwarn-success =
    {$message}
    User: {$user_name}

unwarn-error = Something went wrong while removing the warning.

user-banned-after-3-warns =
    The user {$user_name} has received 3 warnings and has been banned.

warn-success =
    {$message}
    User: {$user_name}

warn-error = Something went wrong while issuing the warning.

should-i-warn-myself = Hmm... Should I warn myself?

i-cant-warn-admins = I can't warn admins, pretty obvious right?

should-i-unwarn-myself = Hmm... Should I unwarn myself?

i-cant-unwarn-admins = I can't unwarn admins, because they can not be even warned, pretty obvious right?

github-org-not-set = No GitHub organization was configured in the .env file.

only-admins-can-use = This command can only be used by admins.

thread-set-for-webhooks = This thread has been set to receive GitHub webhooks.

i-cant-work-without-admin = I need admin rights to function properly.

currency-conversion =
    {$source_amount} is equal to:
    {$conversions}

prompt-answer =
    Prompt: <b>{$prompt}</b>

    <b>Answer:</b>
    {$answer}

anime_info =
    {$name} / {$russian}
    Episodes: {$episodes}
    Rating: {$rating}
    Description: {$description}...
    <a href="{$shikimori}{$url}">Continue reading on Shikimori</a>

start-description = Start the bot.
anime-description = Search for anime.
source-description = Get the source code link.
help-description = Show the list of commands.
warn-description = Issue a warning.
ban-description = Ban a user.
unban-description = Unban a user.
unwarn-description = Remove a warning.
mute-description = Mute a user.
unmute-description = Unmute a user.
lang-description = Change the language.
top-description = ListTop 10 users by karma