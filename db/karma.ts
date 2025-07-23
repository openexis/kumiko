import { kv } from "../config/index.ts";

async function increaseKarma(user_id: string | number) {
  const data = await kv.get(["karma", user_id.toString()]);
  // Check if data exists
  if (new Boolean(data.value)) {
    let karma_count: number = data.value as number;
    karma_count = ++karma_count;
    kv.set(["karma", user_id.toString()], karma_count);
  } else {
    kv.set(["karma", user_id.toString()], 1);
  }
}

async function decreaseKarma(user_id: string | number) {
  const data = await kv.get(["karma", user_id.toString()]);
  // Check if data exists
  if (new Boolean(data.value)) {
    let karma_count: number = data.value as number;
    karma_count = --karma_count;
    kv.set(["karma", user_id.toString()], karma_count);
  } else {
    kv.set(["karma", user_id.toString()], -1);
  }
}

async function getKarma(user_id: string | number) {
  const data = await kv.get(["karma", user_id.toString()]);

  console.log(data.value);

  if (data.value == null) {
    kv.set(["karma", user_id.toString()], 0);
    return 0;
  }

  return data.value;
}

export { decreaseKarma, getKarma, increaseKarma };
