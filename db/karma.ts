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

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

async function getUserChangeCount(user_id: number): Promise<number> {
  const key = ["karma_limit", user_id.toString(), getToday()];
  const res = await kv.get<number>(key);
  return res.value ?? 0;
}

async function incrementUserChangeCount(user_id: number): Promise<void> {
  const key = ["karma_limit", user_id.toString(), getToday()];
  const current = await getUserChangeCount(user_id);
  await kv.set(key, current + 1);
}

async function isUserAtLimit(user_id: number, maxPerDay = 5): Promise<boolean> {
  const current = await getUserChangeCount(user_id);
  return current >= maxPerDay;
}

export { getKarma, updateKarma, getUserChangeCount, incrementUserChangeCount, isUserAtLimit};
