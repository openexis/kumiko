import { kv } from "../config/kv.ts";

async function updateKarma(
  chat_id: string | number,
  user_id: string | number,
  amount: 1 | -1,
) {
  const key = ["karma", chat_id.toString(), user_id.toString()];

  const data = await kv.get<number>(key);

  if (data.value === null) {
    await kv.set(key, 1);
  } else {
    await kv.set(key, data.value + amount);
  }

  return await getKarma(chat_id, user_id);
}

async function getKarma(
  chat_id: string | number,
  user_id: string | number,
): Promise<number> {
  const data = await kv.get<number>([
    "karma",
    chat_id.toString(),
    user_id.toString(),
  ]);

  if (data.value === null) {
    await kv.set(["karma", chat_id.toString(), user_id.toString()], 0);
    return 0;
  }

  return data.value;
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

async function deleteUserChangeCount(
  chat_id: number,
  user_id: number,
): Promise<void> {
  const key = [
    "karma_limit",
    chat_id.toString(),
    user_id.toString(),
    getToday(),
  ];

  await kv.delete(key);
}

async function getUserChangeCount(
  chat_id: number,
  user_id: number,
): Promise<number> {
  const key = [
    "karma_limit",
    chat_id.toString(),
    user_id.toString(),
    getToday(),
  ];

  const res = await kv.get<number>(key);
  return res.value ?? 0;
}

async function incrementUserChangeCount(
  chat_id: number,
  user_id: number,
): Promise<void> {
  const key = [
    "karma_limit",
    chat_id.toString(),
    user_id.toString(),
    getToday(),
  ];

  const current = await getUserChangeCount(chat_id, user_id);
  await kv.set(key, current + 1);
}

async function isUserAtLimit(
  chat_id: number,
  user_id: number,
  maxPerDay = 5,
): Promise<boolean> {
  const current = await getUserChangeCount(chat_id, user_id);
  return current >= maxPerDay;
}

export {
  deleteUserChangeCount,
  getKarma,
  getUserChangeCount,
  incrementUserChangeCount,
  isUserAtLimit,
  updateKarma,
};
