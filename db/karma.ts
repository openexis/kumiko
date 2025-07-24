import { kv } from "../config/index.ts";

async function updateKarma(user_id: string | number, amount: 1 | -1) {
  const key = ["karma", user_id.toString()];

  const data = await kv.get<number>(key);

  if (data.value === null) {
    await kv.set(key, 1);
  } else {
    await kv.set(key, data.value + amount);
  }

  return await getKarma(user_id);
}

async function getKarma(user_id: string | number): Promise<number> {
  const data = await kv.get<number>(["karma", user_id.toString()]);

  if (data.value === null) {
    await kv.set(["karma", user_id.toString()], 0);
    return 0;
  }

  return data.value;
}

export { getKarma, updateKarma };
