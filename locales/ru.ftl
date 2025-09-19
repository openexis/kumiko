start = Привет, {$name}! Чем я могу тебе помочь? Напиши /help

top-10-users-by-karma = Топ 10 пользователей по карме

help-commands =
    <b>Список доступных команд:</b>

    /start - Запустить бота
    /anime - Поиск аниме
    /source - Получить исходный код
    /help - Показать это сообщение
    /lang - Изменить язык бота
    /top - Список топ-10 пользователей по карме

    <b>Для модераторов:</b>

    /ban - Забанить пользователя
    /unban - Разбанить пользователя
    /warn - Предупредить пользователя
    /unwarn - Снять предупреждение у пользователя
    /mute - Замутить пользователя
    /unmute - Размутить пользователя


source = https://github.com/openexis/kumiko

increased = повысил(а)
decreased = понизил(а)

cant-change-user-karma = Ты не можешь изменять рейтинг этого пользователя более чем 5 раз в день.

choose-language = Выберите язык:

language-changed = Язык изменён на {$locale}.

history = История

history-cleared = История контекста была очищена.

reputation-changed =
    <a href="tg://user?id={$user_id}">{$user_name}</a> ({$from_user_karma}) {$action} репутацию <a href="tg://user?id={$reply_user_id}">{$reply_user_name}</a> ({$to_user_karma}).

cant-change-own-reputation = Вы не можете изменить свою собственную репутацию.

reply-to-message = Ответьте на сообщение.

i-am-already-an-admin = Я уже являюсь администратором.

i-dont-have-permission-to-add-admin = У меня нет прав для добавления нового администратора.

owner-permissions-cannot-be-changed = Права владельца нельзя изменить.

user-is-now-admin =
    <a href="{$user_link}">{$user_name}</a> теперь администратор с базовыми правами.

should-i-ban-myself = Открою тебе секрет, ты сможешь это сделать.

user-banned = Пользователь [{$user_name}](tg://user?id={$user_id}) был забанен.

user-unbanned = Пользователь [{$user_name}](tg://user?id={$user_id}) был разбанен.

should-i-mute-myself = Открою тебе секрет, ты сможешь это сделать.

i-cant-mute-admins = Я не могу мутить администраторов.

user-muted = Пользователь [{$user_name}](tg://user?id={$user_id}) был замучен.

invalid-time-unit = Неверная единица времени. Используйте 1m, 1h или 1d.

should-i-unmute-myself = Ладно, мне размутить себя? Хм...

i-cant-unmute-admins = Я не могу размутить администраторов.

user-unmuted = Пользователь [{$user_name}](tg://user?id={$user_id}) был размучен.

unwarn-success =
    {$message}
    Пользователь: {$user_name}

unwarn-error = Произошла ошибка при снятии предупреждения.

user-banned-after-3-warns =
    Пользователь {$user_name} получил 3 предупреждения и был забанен.

warn-success =
    {$message}
    Пользователь: {$user_name}

warn-error = Произошла ошибка при выдаче предупреждения.

should-i-warn-myself = Хм... Я должен предупредить себя?

i-cant-warn-admins = Я не могу предупредить администраторов, довольно очевидно, верно?

should-i-unwarn-myself = Хм... Должен ли я снять предупреждение с себя?

i-cant-unwarn-admins =  Я не могу снять предупреждение с админов, потому что их даже нельзя предупредить, это же очевидно, правда?

github-org-not-set = Вы не указали организацию GitHub в файле .env.

only-admins-can-use = Только администраторы могут использовать эту команду!

thread-set-for-webhooks = Этот тред назначен для веб-хуков GitHub!

i-cant-work-without-admin = Я не могу работать без прав администратора.

currency-conversion =
    {$source_amount} эквивалентно:

    {$conversions}

prompt-answer =
    Запрос: <b>{$prompt}</b>

    <b>Ответ:</b>  
    {$answer}

anime_info =
    {$name} / {$russian}  
    Эпизоды: {$episodes}  
    Рейтинг: {$rating}  
    Описание: {$description}...  
    <a href="{$shikimori}{$url}">Продолжить чтение на Shikimori</a>

start-description = Запустить бота.
anime-description = Искать аниме.
source-description = Получить ссылку на исходный код.
help-description = Показать список команд.
warn-description = Выдать предупреждение.
ban-description = Забанить пользователя.
unban-description = Разбанить пользователя.
unwarn-description = Снять предупреждение.
mute-description = Замутить пользователя.
unmute-description = Размутить пользователя.
lang-description = Изменить язык.
top-description = Список топ-10 пользователей по карме