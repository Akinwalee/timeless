export const NEWSLETTER_MESSAGE = "Check your inbox for a confirmation email. Use its link to finish joining the list. If you already subscribe, you do not need to join again.";

export function validEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// A bounded per-process burst guard. Use the hosting firewall for a distributed limit.
const attempts = new Map<string, { count: number; reset: number }>();
export function newsletterRateLimit(key: string, now = Date.now()) {
  for (const [id, value] of attempts) if (value.reset <= now) attempts.delete(id);
  const current = attempts.get(key);
  if (current && current.count >= 5) return false;
  if (!current && attempts.size >= 5000) return false;
  attempts.set(key, { count: (current?.count || 0) + 1, reset: current?.reset || now + 15 * 60 * 1000 });
  return true;
}

export async function readNewsletterBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.byteLength;
    if (size > 2048) { await reader.cancel(); throw new Error("body_too_large"); }
    chunks.push(chunk.value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}
