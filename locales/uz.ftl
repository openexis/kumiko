start = Salom {$name}, sizga qanday yordam bera olaman?

top-10-users-by-karma = Eng yuqori karmaga ega 10 foydalanuvchi

help-commands =
    <b>Mavjud buyruqlar ro'yxati:</b>

    /start - Botni ishga tushurish
    /anime - Anime qidirish
    /source - Manba kodini olish
    /help - Ushbu xabarni ko‘rsatish
    /lang - Bot tilini o‘zgartirish
    /top - Eng yuqori karmaga ega 10 foydalanuvchini ro‘yxatini oling

    <b>Moderatorlar uchun:</b>

    /ban - Foydalanuvchini bloklash
    /unban - Foydalanuvchining blokini olib tashlash
    /warn - Ogohlantirish berish
    /unwarn - Ogohlantirishni olib tashlash
    /mute - Foydalanuvchini ovozsizlantirish
    /unmute - Ovozini qayta yoqish

source = https://github.com/openexis/kumiko

increased = oshirdi

decreased = tushirdi

cant-change-user-karma = Siz ushbu foydalanuvchi reytingini bir kunda 5 martadan ziyod o'zgartira olmaysiz.

choose-language = Tilni tanlang:

language-changed = Til {$locale} ga o‘zgartirildi.

history = Tarix

history-cleared = Kontekst tarixi tozalandi.

reputation-changed =
    <a href="tg://user?id={$user_id}">{$user_name}</a> ({$from_user_karma}) <a href="tg://user?id={$reply_user_id}">{$reply_user_name}</a>ning ({$to_user_karma}) reytingini <b>{$action}</b>.

cant-change-own-reputation = Siz o‘zingizning obro‘yingizni oshira olmaysiz yoki kamaytira olmaysiz.

reply-to-message = Iltimos, xabarga javob bering.

i-am-already-an-admin = Men allaqachon adminman.

i-dont-have-permission-to-add-admin = Menda yangi admin qo‘shish huquqi yo‘q.

owner-permissions-cannot-be-changed = Egasi ruxsatlarini o‘zgartirib bo‘lmaydi.

user-is-now-admin =
    <a href="{$user_link}">{$user_name}</a> endi asosiy ruxsatlarga ega admin.

should-i-ban-myself = Qiziqarli narsa etaman, bu sizni qo'lingizdan kelmaydi.

user-banned = Foydalanuvchi [{$user_name}](tg://user?id={$user_id}) ban qilindi.

user-unbanned = Foydalanuvchi [{$user_name}](tg://user?id={$user_id}) unban qilindi.

should-i-mute-myself = Qiziqarli narsa etaman, bu sizni qo'lingizdan kelmaydi.

i-cant-mute-admins = Men adminlarni ovozsizlantira olmayman.

user-muted = Foydalanuvchi [{$user_name}](tg://user?id={$user_id}) ovozsizlantirildi.

invalid-time-unit = Noto‘g‘ri vaqt birligi. Iltimos, 1m, 1h yoki 1d formatidan foydalaning.

should-i-unmute-myself = Yaxshi, o‘zimni ovozli qilsam bo‘ladimi? Hmmm...

i-cant-unmute-admins = Men adminlarni ovozli qila olmayman.

user-unmuted = Foydalanuvchi [{$user_name}](tg://user?id={$user_id})ga gapirish huquqi qaytarildi.

unwarn-success =
    {$message}
    Foydalanuvchi: {$user_name}

unwarn-error = Ogohlantirishni olib tashlashda xatolik yuz berdi.

user-banned-after-3-warns =
    Foydalanuvchi {$user_name} 3 ta ogohlantirish oldi va ban qilindi.

warn-success =
    {$message}
    Foydalanuvchi: {$user_name}

warn-error = Ogohlantirishni berishda xatolik yuz berdi.

should-i-warn-myself = Hmm... O'zimga ogohlantirish berishim kerakm?

i-cant-warn-admins = Adminlarga ogohlantirish bera olmayman.

should-i-unwarn-myself = Hmm... O'zimdan ogohlantirishni olib tashlashim kerakmi?

i-cant-unwarn-admins = Adminlardan ogohlantirishni olib tashlay olmayman, chunki ularni hatto ogohlantirib bo'lmaydi, bu aniq, to'g'rimi?  

github-org-not-set = Siz .env faylida hech qanday GitHub tashkilotini ko‘rsatmagansiz.

only-admins-can-use = Bu buyruqdan faqat adminlar foydalanishi mumkin!

thread-set-for-webhooks = Bu mavzu GitHub veb-xuklari uchun o‘rnatildi!

i-cant-work-without-admin = Menga admin huquqlari berilmaguncha ishlay olmayman.

currency-conversion =
    {$source_amount} quyidagilarga teng:

    {$conversions}

prompt-answer =
    So‘rov: <b>{$prompt}</b>

    <b>Javob:</b>  
    {$answer}

anime_info =
    {$name} / {$russian}  
    Epizodlar: {$episodes}  
    Reyting: {$rating}  
    Tavsif: {$description}...  
    <a href="{$shikimori}{$url}">Shikimori’da o‘qishni davom eting</a>

start-description = Botni ishga tushirish.
anime-description = Anime qidirish.
source-description = Manba kodiga havola olish.
help-description = Buyruqlar ro'yxatini ko'rsatish.
warn-description = Ogohlantirish berish.
ban-description = Foydalanuvchini bloklash.
unban-description = Foydalanuvchining blokini olib tashlash.
unwarn-description = Ogohlantirishni olib tashlash.
mute-description = Foydalanuvchini ovozsiz qilish.
unmute-description = Foydalanuvchini ovozini qayta yoqish.
lang-description = Tilni o'zgartirish.
top-description = Eng yuqori karmaga ega 10 foydalanuvchini ro‘yxatini oling