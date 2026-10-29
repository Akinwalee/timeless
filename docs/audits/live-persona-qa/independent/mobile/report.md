# Independent mobile production QA

**Pass:** fresh mobile shopper reached an itemized WhatsApp request for White / M / quantity 1, ₦15,000. WhatsApp was not opened and no message, order, payment, subscription or CMS change occurred.

Run began after the parent confirmed public deployment main17702e5. Isolated Chromium: 375×812, touch/mobile enabled, actual images, CDP 500kbps down/up + 400ms latency + 4× CPU slowdown. GA collectors blocked; measurement declined after testing the initial CTA.

No reproducible product defects found in this journey. The consent choices end at y148 and hero CTA sits y758–780 inside the 812px viewport. It remains visible and works before choosing consent. Landing and product document widths equal 375px. No page exceptions observed. The bag preserves colour, size, quantity and price; shipping and final-total confirmation are clear.

White selection briefly retained the previous image with an explicit “Loading White photograph…” announcement. Shopping controls stayed usable and the correct White image appeared in the bag. Fit help provides notes and WhatsApp measurement support, rather than numerical measurements; sizing confidence remains a possible first-order friction, not a newly established functional defect.

Single lab navigation: DOMContentLoaded 4.14s; load 8.78s. These are throttled lab values, not field Core Web Vitals or a performance distribution.

Evidence: [landing](01-landing.png), [product first view](02-product-first-view.png), [colour loading](03-colour-switch.png), [size selected](04-size-selected.png), [stable purchase controls](05-purchase-ready.png), [bag success](06-bag-success.png), [structured report](report.json). Recipient number is omitted.

Limitations: no physical-phone/Safari/keyboard/safe-area verification. One scripted independent persona, not human research. Add was tapped in the final purchase section; main and sticky Add controls were visible/enabled at size selection, but sticky activation was not independently exercised. Two accessible-name selector mistakes timed out and were corrected; they are harness errors, excluded from findings. A screenshot during header transition is also excluded; the stable purchase screenshot confirms the header moves away.
