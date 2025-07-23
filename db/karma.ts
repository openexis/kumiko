import { kv } from "../config/index.ts";

async function updateKarma(user_id: string | number, amount: 1 | -1) {
  const key = ["karma", user_id.toString()];
  
  await kv.atomic()
    .mutate({
      type: "sum",
      key: key,
      value: new Deno.KvU64(BigInt(amount)),
    })
    .commit();
}

async function getKarma(user_id: string | number) {
  const data = await kv.get(["karma", user_id.toString()]);

  if (data.value === null) {
    await kv.set(["karma", user_id.toString()], 0);
    return 0;
  }

  return data.value;
}

export { getKarma, updateKarma };
