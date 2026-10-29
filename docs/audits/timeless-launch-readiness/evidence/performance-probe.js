async (page) => {
  const results = [];
  for (const route of ['/', '/shop/essential-tee']) {
    for (let run = 1; run <= 3; run++) {
      const c = await page.context().browser().newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 });
      await c.addInitScript(() => {
        window.__audit = { lcp: [], cls: [], long: [] };
        for (const [type, key] of [['largest-contentful-paint', 'lcp'], ['layout-shift', 'cls'], ['longtask', 'long']]) {
          try {
            new PerformanceObserver(list => {
              for (const e of list.getEntries()) window.__audit[key].push({ start: e.startTime, duration: e.duration, value: e.value, recent: e.hadRecentInput, size: e.size, element: e.element?.tagName });
            }).observe({ type, buffered: true });
          } catch { /* unsupported observation remains empty */ }
        }
      });
      const p = await c.newPage();
      const failures = [];
      p.on('requestfailed', r => failures.push({ url: r.url(), error: r.failure()?.errorText }));
      await p.route('**/_next/image*', async r => r.fulfill({ response: await p.request.get(r.request().url()) }));
      const cd = await c.newCDPSession(p);
      await cd.send('Network.enable');
      await cd.send('Network.setCacheDisabled', { cacheDisabled: true });
      await cd.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
      await cd.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await p.goto('http://127.0.0.1:3107' + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await p.waitForTimeout(6500);
      const data = await p.evaluate(() => ({
        paint: performance.getEntriesByType('paint').map(e => ({ name: e.name, ms: e.startTime })),
        observer: window.__audit,
        resources: performance.getEntriesByType('resource').map(e => ({ name: e.name.split(location.origin).pop(), type: e.initiatorType, transfer: e.transferSize, encoded: e.encodedBodySize, duration: e.duration })),
        navigation: performance.getEntriesByType('navigation').map(e => ({ ttfb: e.responseStart, dom: e.domContentLoadedEventEnd, load: e.loadEventEnd }))
      }));
      results.push({ route, run, viewport: '375x812 DPR1', cpu: 4, latencyMs: 150, downloadBytesPerSec: 200000, imageDelivery: 'API-fetched response fulfillment; bypasses normal image delivery; timings diagnostic only', failures, ...data });
      await c.close();
    }
  }
  return results;
}
