# Independent skeptic production QA

Completed after root reported main17702e5 public-ready, in fresh isolated desktop Chromium contexts. Earlier sandbox-only blocker was overcome through the supported approval path. No source or Git edits.

## Tested

1. Read shipping, returns, privacy and terms before attempting newsletter/bag. All four rendered. Shipping, delivery availability and final total require WhatsApp confirmation before payment.
2. Verified Essential Tee at ₦15,000; reviewed explicit sizing limitations; selected Black M.
3. Newsletter invalid email and unchecked consent both blocked natively before a request. Valid requests were intercepted: mocked rejection displayed; mocked success instructed email confirmation.
4. Invalid-only live POST with www Origin returned 503 and the temporary-unavailable message. Brevo is not ready per owner; this is external setup, not an origin/code failure.
5. Added Black M to bag, increased quantity to two. Bag shows ₦30,000 items subtotal plus shipping caveat. Inspected the unsent WhatsApp draft: item, colour, size, quantity, unit price and line total are present. Did not open WhatsApp.

## Findings

- **P2 copy clarity:** WhatsApp draft says “ORDER TOTAL: ₦30,000” even though shipping is additional. Bag correctly says “Items subtotal”. Use “ITEMS SUBTOTAL” in the draft. A subsequent caveat already explains shipping, so this is ambiguity rather than an arithmetic defect.
- **Business content:** no fixed voluntary return window or return/exchange terms are published. The page explicitly asks the buyer to confirm them before paying.
- **Business content:** M/L/XL lacks actual garment measurements. The fit note explicitly directs questions to WhatsApp. A cautious buyer still needs support to choose.

## Evidence and limits

Screenshots: 01 sizing confusion; 02 mocked unavailable; 03 mocked success; 04 settled bag with two units. JSON evidence records validation, invalid-only preflight and the sanitized unsent draft. No phone/key recorded.

The first newsletter rejection mock deliberately used a noncanonical error shape and correctly displayed a generic error. A follow-up canonical response check captured its unavailable screenshot; the subsequent canonical200 removed the sole footer form and the harness timed out trying to read that removed form. The earlier home mocked-success run independently verified confirmation copy. This harness timeout is not reported as a site defect.

No actual email/subscription/order/message, CMS mutation or payment. Analytics collectors were blocked and measurement declined when visible. Desktop only; real Brevo confirmation/delivery/unsubscribe and WhatsApp sending remain untested.
