import { Response } from "../types/response.ts";

const kv = await Deno.openKv();
async function warnUser(user_id: string | number): Promise<Response> {
  const data = await kv.get(["warns", user_id.toString()]);
  // Check if data exists
  if (new Boolean(data.value)) {
    let warns_count: number = data.value as number;
    warns_count = ++warns_count;
    kv.set(["warns", user_id.toString()], warns_count);

    return {
      status: 200,
      message: "The user has been warned. Count of warns: " + warns_count,
    };
  } else {
    kv.set(["warns", user_id.toString()], 1);
    return {
      status: 200,
      message: "The user has been warned. Count of warns: 1",
    };
  }
}

async function unWarnUser(user_id: string | number): Promise<Response> {
  const data = await kv.get(["warns", user_id.toString()]);

  // Check if data exists
  if (new Boolean(data.value)) {
    let warns_count: number = data.value as number;
    warns_count = --warns_count;
    await kv.set(["warns", user_id.toString()], warns_count);

    return {
      status: 200,
      message: "The user has been unwarned. Count of warns: " + warns_count,
    };
  } else {
    await kv.set(["warns", user_id.toString()], 0);
    return { status: 200, message: "This user hasn't been warned before." };
  }
}

export { unWarnUser, warnUser };
