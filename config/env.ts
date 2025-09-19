function getEnv(key: string): string {
  const value = Deno.env.get(key);

  if (value == undefined) {
    throw new Error(`${key} is not set in .env`);
  }

  return value;
}

const BOT_TOKEN = getEnv("BOT_TOKEN");
const STATISTICS_URL = getEnv("STATISTICS_URL");

export { BOT_TOKEN, STATISTICS_URL };
