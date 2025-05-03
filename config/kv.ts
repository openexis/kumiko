export const kv = await Deno.openKv();

// Helper functions for managing conversation history
export async function getHistory(userId: number) {
  const history = await kv.get(["conversations", userId]);
  return history.value as Array<{ role: string; content: string }> || [];
}

export async function saveHistory(
  userId: number,
  history: Array<{ role: string; content: string }>,
) {
  // Optionally limit history length
  const limitedHistory = history.slice(-10); // Keep last 10 messages
  await kv.set(["conversations", userId], limitedHistory);
}

export async function clearHistory(userId: number) {
  await kv.delete(["conversations", userId]);
}
