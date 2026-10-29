import { expect, it } from "vitest";
import { sanitizeErrorEvent } from "./monitoring";

it("keeps error locations without forwarding user/request/message data", () => {
  const event = sanitizeErrorEvent({ type: undefined, message: "private@example.invalid", user: { email: "private@example.invalid" }, request: { url: "https://site.invalid/?email=private" }, extra: { secret: "hidden" }, exception: { values: [{ type: "TypeError", value: "private@example.invalid", stacktrace: { frames: [{ filename: "https://site.invalid/app.js?secret=hidden", lineno: 42, vars: { email: "private" } }] } }] } });
  expect(JSON.stringify(event)).not.toMatch(/private|hidden|secret|vars/);
  expect(event.exception?.values?.[0].stacktrace?.frames?.[0]).toMatchObject({ filename: "https://site.invalid/app.js", lineno: 42 });
});
