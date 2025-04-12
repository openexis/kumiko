# Kumiko

Kumiko is a versatile Telegram bot written in TypeScript using Deno and the
Grammy framework. It serves as both an anime information bot and a moderation
tool for Telegram groups.

## Features

### Anime Information

- Utilizes the Shikimori API to fetch anime details
- Two ways to search for anime:
  1. Inline mode: `@kumikorobot anime name`
  2. Command: `/anime anime name`

### Moderation Commands

(For admins and owners - wield your power wisely!)

- `/ban`: Give a troublemaker an extended vacation from the chat
- `/mute`: Put a chatty user's keyboard on silent mode
- `/unban`: Grant a banned user a second chance at redemption
- `/unmute`: Restore a muted user's voice to the chat
- `/warn`: Issue a yellow card to a user who's skating on thin ice
- `/unwarn`: Erase a warning and wipe the slate clean
- `/admin`: Add new admin

Remember: Three strikes and they're out! (3 warnings = automatic ban)

### User Role Detection

- Uses middlewares to detect and handle:
  - Admin users
  - Owner
  - Regular users

### Additional Features

- Currency exchange functionality
- Post Github Webhook Updates in a Group

## Technology Stack

- Language: TypeScript
- Runtime: Deno
- Framework: Grammy (Telegram Bot API framework for Deno)
- Deployment: Deno Deploy

## Installation

As Kumiko is a Telegram bot, there's no need for end-users to install anything.
To add Kumiko to your Telegram group, simply search for `@kumikorobot` on
Telegram and start a chat or add it to your group.

## Usage

### Anime Search

- Inline mode: In any chat, type `@kumiko_bot` followed by the anime name you
  want to search for.
- Command mode: In a chat where Kumiko is present, use `/anime` followed by the
  anime name.

### Moderation Commands

(Only available for admins and owners)

- `/ban`, `/mute`, `/unban`, `/unmute`: Manage user restrictions
- `/warn`, `/unwarn`: Manage user warnings Note: 3 warnings result in an
  automatic ban, resetting the warning count
- `/admin`: Promote user to an admin

### Currency Exchange

Simply type an amount followed by a valid currency code. Kumiko will respond
with the equivalent amounts in UZS (Uzbek Som) and RUB (Russian Ruble).

Examples:

- `100 USD`
- `50 EUR`
- `1000 JPY`

Kumiko automatically detects the currency and provides the exchange rates.

## Development

To set up the development environment:

1. Install Deno: [Deno Installation Guide](https://deno.land/#installation)
2. Clone the repository:

```bash
git clone https://github.com/openexis/kumiko.git
```

3. Navigate to the project directory:

```bash
cd kumiko
```

4. Run the bot locally:

```bash
deno run -A --env --unstable-kv mod.ts
```

### Explanation

- `-A` - Allow all, in case we need access, in our case, we need access to
  network, kv and env variables, so instead of typing all of that I simply use
  this flag, the project doesn't have suspicious dependency or piece of code.
- `--env` - It is required to read env variables by Deno.
- `--unstable-kv` - As of know, as far as I know, KV feature is unstable, so it
  requires a special flag to use Deno KV.

## Deployment

Kumiko is deployed using Deno Deploy. For deployment instructions, refer to the
[Deno Deploy documentation](https://deno.com/deploy/docs).

## Contributing

Contributions to Kumiko are welcome! Please feel free to submit pull requests,
create issues or spread the word.

## License

This project is licensed under the MIT License - see the LICENSE file for
details.
