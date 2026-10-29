# Literal visible-instruction mobile QA

Date: 2026-10-29. Live site: https://www.weartimeless.xyz. Fresh isolated Chromium; 375×812; fr-NG locale. Persona: non-native English reader who follows visible instructions. No source inspection used to navigate.

## Final deployment confirmation

PASS on fresh isolated Chromium after parent signalled public a8235e2. Followed home first CTA, clicked the catalogue title “Timeless Essential Tee” (not the photo), reached /shop/essential-tee, chose White / M, and added one item to bag. The title is now a real working link. Inspected checkout href without navigating: the message now reads “ITEMS SUBTOTAL: ₦15,000”, followed by shipping-quote and final-confirmation wording. Automated check for that exact subtotal label passed. Final evidence: 06-final-catalogue-title.png, 07-final-success-bag.png and result.json. No functional blocker found on this required route.

## Initial journey outcome

PASS for first shopping success: home “EXPLORE THE FIRST DROP” → /shop → product “VIEW” → /shop/essential-tee → White → M → Add to bag. Bag opened with one White / M Timeless Essential Tee, quantity 1, subtotal ₦15,000. Screenshot: 05-first-success-bag.png. This is an order-request readiness result, not a completed sale.

Inspected the WhatsApp anchor without opening or sending. Host is wa.me. The encoded request correctly contains White, M, quantity 1, unit and line price ₦15,000, initial “ORDER TOTAL” label (corrected to “ITEMS SUBTOTAL” in final deployment), and instructions to quote shipping and confirm availability/final total before payment. Recipient phone excluded from saved evidence.

## Observed friction

- Initial deployment: product title “Timeless Essential Tee” was plain text and clicking it did not navigate. RESOLVED and verified on final deployment: the title link navigates to the product.
- At the post-selection scroll position, the fixed logo/header overlaps the top colour controls (04-options-selected.png). White / M remained selected and Add to bag was usable. This is a single captured scroll position, not a functional defect: no action was prevented and persistence after settled scrolling was not established.
- No concrete English comprehension failure occurred on the required path. “Choose a size before adding this piece” gives the necessary next action; shipping/WhatsApp wording explains the handoff.

## Language suggestions (subjective)

“Explore the first drop” assumes familiarity with fashion usage of “drop.” “Shop the first collection” would be more literal. This did not prevent navigation in this run and is not classified as a functional defect.

## Consent and limits

Consent banner had readable text and visible Decline/Allow controls on 375×812 (01-consent.png); Decline worked. Google collectors were blocked at browser-context routing. No signup submitted; deferred newsletter service was not exercised. No WhatsApp page opened and no message or email sent. No app, env or Git changes. Bag dismissal and payment/fulfilment were not independently tested in this run. The deployment commit identity was supplied by the parent, not independently verified here.

## Evidence

- 01-consent.png: initial mobile consent notice.
- 02-first-cta.png: navigation-stage screenshot from an earlier attempt; do not use as definitive route proof because client transitions were still settling.
- 03-product.png: product page.
- 04-options-selected.png: White / M selected, header overlap.
- 05-first-success-bag.png: successful bag state and checkout instruction.
- 06-final-catalogue-title.png: final catalogue with title link.
- 07-final-success-bag.png: final successful bag.
- result.json: final structured result and redacted WhatsApp message metadata.

Automation-only notes: early locator failures came from matching CSS-uppercase display text as case-sensitive accessible names and reading before SPA navigation settled. These are test harness issues, not user-facing failures. Final successful run used visible labels with correct accessible names and explicit URL waits.
