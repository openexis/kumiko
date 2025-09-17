import { Response } from "../types/response.ts";
import { kv } from "../config/kv.ts";

async function clearWarns(user_id: string | number): Promise<Response> {
  await kv.delete(["warns", user_id.toString()]);
  return {
    status: 200,
    message: "User's warns have been cleared. Count of warns: 0",
  };
}

async function warnUser(user_id: string | number): Promise<Response> {
  const data = await kv.get<number>(["warns", user_id.toString()]);
  // Check if data exists

  if (data.value) {
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
  const data = await kv.get<number>(["warns", user_id.toString()]);

  // Check if data exists
  if (data.value) {
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

export { clearWarns, unWarnUser, warnUser };
