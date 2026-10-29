# Impatient first-time desktop visitor

Tested 2026-10-29 on https://www.weartimeless.xyz in independent headless Chromium, 1440 × 1000, fresh browser contexts. Final run followed confirmation that the new public deployment was ready.

## Result

PASS: Home “Explore the First Drop” → collection → Timeless Essential Tee → Black / M → Add to Bag. Bag opened with quantity 1 and ₦15,000 items subtotal. Measurement consent remained undecided throughout the successful journey.

The prepared checkout link uses wa.me. Its decoded message correctly contains product, Black, M, quantity 1, unit price and line total ₦15,000, and shipping/availability confirmation wording. Link was inspected only; WhatsApp was never opened and no order or message was sent.

## Observed friction

- Fit decision still requires another conversation: “Fit & sizing help” provides a relaxed-fit note and explicitly says it is not a measurement chart. Only M, L and XL are available. An unsure first-time buyer cannot compare body/garment measurements on the page before ordering.
- Navigation was inconsistent in this session: one fresh run did not expose the collection product link within a 12-second wait after the home CTA. A subsequent fresh run with a 45-second allowance completed the same route successfully. This is an observed timing problem, not a diagnosed application defect; network or deployment transition may contribute.

## Before / after

Before: the old consent card sat over the lower-right product information, covering part of the returns area (baseline-product.png).
After: the consent aside is position: relative and appears in normal document flow above the header (current-home.png). It no longer covers the shopping controls or product information. No consent choice was needed to shop.

## Evidence

- current-home.png: current consent placement and primary CTA.
- current-shop.png: collection and product entry.
- current-product.png: selected M.
- current-bag.png: correct variant, quantity, subtotal and checkout affordance.
- baseline-product.png: old floating consent placement.

No subscription was submitted. No source, CMS, git state or production data was changed. Only this audit directory was written.
