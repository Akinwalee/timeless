import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.route(/google-analytics\.com|googletagmanager\.com/, route => route.abort());
});

test("measurement preferences do not cover the mobile hero or purchase controls", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const prompt = page.getByRole("complementary", { name: "Optional measurement" });
  await expect(prompt).toBeVisible();
  const cta = page.getByRole("link", { name: /Explore the first drop/i });
  const bannerBounds = await prompt.boundingBox();
  const ctaBounds = await cta.boundingBox();
  expect(bannerBounds!.y + bannerBounds!.height).toBeLessThan(ctaBounds!.y);
  expect(ctaBounds!.y + ctaBounds!.height).toBeLessThanOrEqual(812);
  await cta.click();
  await expect(page).toHaveURL(/\/shop$/);
  await page.getByRole("button", { name: "Decline", exact: true }).click();
  await expect(prompt).toHaveCount(0);
  await page.getByRole("button", { name: "Measurement preferences", exact: true }).click();
  await expect(prompt).toBeVisible();
  await expect(prompt).toBeFocused();
});

test("reduced-motion and no-JavaScript visits retain visible content", async ({ browser }) => {
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({ reducedMotion: "reduce", javaScriptEnabled });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3110/shop");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("The First Drop");
    expect(await page.locator(".route-transition").evaluate(e => e.getBoundingClientRect().height)).toBe(0);
    await context.close();
  }
});

test("tablet image containers fit their pages", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  for (const path of ["/shop", "/about", "/journal"]) {
    await page.goto(path);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(768);
    const bounds = await page.locator(".image-frame").evaluateAll(es => es.map(e => e.getBoundingClientRect().right));
    expect(bounds.every(right => right <= 769)).toBe(true);
  }
});

test("storage denial preserves shopping and the itemized handoff", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException("blocked", "SecurityError"); };
    Storage.prototype.setItem = () => { throw new DOMException("blocked", "SecurityError"); };
  });
  await page.goto("/shop/essential-tee");
  await page.getByRole("button", { name: "M", exact: true }).first().click();
  await page.getByRole("button", { name: "Add to Bag", exact: true }).first().click();
  const bag = page.getByRole("dialog");
  await expect(bag).toContainText("This browser cannot save it for later");
  const href = await bag.getByRole("link", { name: "Continue checkout on WhatsApp" }).getAttribute("href");
  expect(decodeURIComponent(href!)).toContain("Size: M");
  expect(decodeURIComponent(href!)).toContain("Shipping is additional");
});

test("double-clicking Add keeps the bag open with one added item", async ({ page }) => {
  await page.goto("/shop/essential-tee");
  await page.getByRole("button", { name: "Decline", exact: true }).click();
  await page.getByRole("button", { name: "M", exact: true }).first().click();
  await page.getByRole("button", { name: "Add to Bag", exact: true }).first().dblclick();
  const bag = page.getByRole("dialog", { name: "Your bag" });
  await expect(bag).toBeVisible();
  await expect(bag.locator('[aria-live="polite"]')).toHaveText("1");
  await page.getByRole("button", { name: "Close bag" }).click();
  await expect(bag).not.toBeVisible();
});

test("newsletter failure stays recoverable and success asks for confirmation", async ({ page }) => {
  await page.route("**/api/newsletter", route => route.fulfill({ status: 502, json: { ok: false, message: "Try again later." } }));
  await page.goto("/shop");
  await page.getByRole("textbox", { name: "Email address" }).fill("audit@example.invalid");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Join Timeless" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Try again later." })).toHaveText("Try again later.");
  await expect(page.getByRole("textbox", { name: "Email address" })).toBeVisible();
  await page.unroute("**/api/newsletter");
  await page.route("**/api/newsletter", route => route.fulfill({ json: { ok: true, message: "Check your inbox to confirm your email." } }));
  await page.getByRole("button", { name: "Join Timeless" }).click();
  await expect(page.getByText("Check your inbox to confirm your email.")).toBeVisible();
});

test("customer policies, discovery and headers are delivered", async ({ request }) => {
  for (const path of ["/shipping", "/returns", "/privacy", "/terms", "/robots.txt", "/sitemap.xml", "/opengraph-image"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  }
});

test("header focus remains visible after scrolling and the carousel is keyboard operable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/shop");
  await page.evaluate(() => window.scrollTo(0, 1800));
  await page.locator(".skip-link").focus();
  await page.keyboard.press("Tab");
  await expect.poll(() => page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Timeless home" }).evaluate(e => e.getBoundingClientRect().bottom)).toBeGreaterThan(0);
  await page.goto("/");
  const track = page.getByRole("group", { name: "Story photographs" });
  await track.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('[aria-label="Timeless in the Wild"] [aria-live]')).toHaveText("02 / 03");
});
