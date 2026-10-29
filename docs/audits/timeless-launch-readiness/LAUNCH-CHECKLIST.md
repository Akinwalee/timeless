# Executable launch verification gate

Current result: **FAIL / NO-GO**. Empty checkboxes mean **not verified**, never implicitly passed. Record candidate commit/build ID, environment, checker, timestamp and evidence URL for every gate. Run against the immutable release candidate and then its actual production domain; the audit's localhost/dummy build is not a release artifact.

| Release record | Value |
|---|---|
| Candidate commit / immutable deployment ID | Pending |
| Verified production domain / provider / runtime | Pending |
| Release owner / incident contact | Pending |
| Last known good deployment and restoration command/link | Pending |
| Approved residual P2/P3 deferrals, owner and due date | Pending |
| Gate evidence location / signoff time | Pending |

## Before deployment: mandatory stop conditions

- [ ] **All P1 findings closed.** Pass: TL-001/002/003/004/015 have reviewed fixes and candidate-specific validation evidence; no unresolved applicable severe advisory is accepted merely because the site builds.
- [ ] **Clean reproducible artifact.** Pass: clean lockfile install on supported Node 22.x, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` all exit 0; build/lockfile/commit are recorded. No audit instrumentation, dummy recipients or development tooling is included in the deployed artifact.
- [ ] **Dependency review.** Pass: `npm audit --omit=dev --json` plus full build-tool review completed; exact installed Next/Sharp and other severe paths are patched or have documented platform/source exclusions. No automatic `audit fix --force` without compatibility review.
- [ ] **Visible-safe motion.** Pass: Home, Shop, Product and article are visibly readable on fresh load and client navigation with normal/reduced motion, JS disabled, and delayed JS; no full-screen opaque leftover transition. Test actual styles and screenshot, not only DOM text presence.
- [ ] **Accessible colour and semantics.** Pass: verified contrast failures resolved across all nine route templates and bag/menu states; meaningful normal text ≥4.5:1, qualifying large text ≥3:1; main home heading appears in heading navigation and no prohibited ARIA is added after animation.
- [ ] **Visible keyboard navigation.** Pass: Tab/Shift+Tab after downward scroll keeps focused header controls at least partially visible, with a visible indicator. Skip link, size selection, Add, bag controls, gallery and menu are usable without pointer; no unexpected trap; Escape/focus return work.
- [ ] **Newsletter is real or absent.** Pass: valid controlled submission reaches the test processor once and only then confirms success, or signup UI is removed. Invalid input, server rejection, timeout, double submit and offline tests show correct recovery; no false positive status.
- [ ] **Approved commerce/privacy information.** Pass: Shipping, Returns, Privacy and Terms each resolve to approved readable 200 documents; shipping threshold, returns window, support identity and processing disclosures match actual operations.
- [ ] **Owned checkout configuration.** Pass: actual candidate uses the owner-verified WhatsApp destination from environment/CMS precedence; no dummy/default number. In a non-sending test, decoded URL has correct product, colour, size, quantity, currency and total; no bag loss occurs when activating/returning from the handoff.
- [ ] **CMS-backed and degraded modes.** Pass: intended published products, variants, sizes, status, prices and media are correct; empty/malformed content has deliberate states. Controlled failed reads and stale bags follow an approved last-known-good/checkout-disable policy; sold-out inventory does not silently become available fallback stock.
- [ ] **Storage resilience.** Pass: denied reads/writes, quota errors, malformed/version-mismatched bag data and ordinary cross-tab changes do not crash. Nonpersistent shopping works and saved-data limitations are described honestly.
- [ ] **Responsive layout.** Pass: inspect 320/375/767/768/820/1024/1440/1920 at representative portrait/landscape heights; document and image-frame bounds fit; no clipped purchase controls, hidden focused elements or broken typography. Confirm fixed mobile CTA respects safe areas and does not cover actionable footer content.
- [ ] **Real-browser/device and AT matrix.** Pass: record current Chrome, Safari, Firefox and Edge versions plus actual iOS Safari and Android Chrome devices; critical browse→bag→handoff URL and newsletter journeys pass. Record a human screen-reader run, 200% text resize/400% zoom reflow and touch target checks; any unsupported platform is an explicit approved limitation.
- [ ] **Failure recovery.** Pass: block product media/CMS/newsletter requests in staging, slow JS/network, and force controlled client/service faults; customers can recover, correct selections are retained, and important failures reach monitoring without PII.
- [ ] **SEO/migration.** Pass: production canonical origin and route-specific metadata are correct, OG/Twitter preview images return 200, sitemap/robots return valid 200 resources, Studio/errors are noindex, preview domains are not indexed, and reviewed legacy indexed URLs permanently redirect or intentionally retire. Dynamic streamed not-found status/noindex is explicitly accepted and tested.
- [ ] **Analytics contract.** Pass: initial and client-navigation pageviews, product/bag/handoff and newsletter attempt/result events arrive once at the test collection destination with expected properties. Consent refusal and internal/test traffic exclusion work; no raw email, phone, WhatsApp message or arbitrary query is transmitted. Handoff is never reported as confirmed purchase.
- [ ] **Production security configuration.** Pass: operator confirms TLS/HTTP→HTTPS/canonical redirects, CSP/embed policy/nosniff/referrer policy and appropriate HSTS at actual edge; public data and Studio roles/CORS are reviewed; no private token, debug endpoint or unwanted source map is publicly exposed. Newly connected forms have validation, abuse controls and safe error responses.
- [ ] **Genuine performance check.** Pass: ordinary image requests complete without the audit workaround on the target; repeat production-like mobile Lighthouse/Web Vitals checks with documented device/network/cache conditions. Investigate lab LCP >2.5s or CLS >0.1; profile actual interactions and long tasks. Do not label lab results field p75 or use them as field INP.
- [ ] **Alert and rollback rehearsal.** Pass: an intentional safe staging failure triggers an alert received by the named owner; synthetic Home/Product/checkout-availability probes are active; previous immutable release is restored in staging and its core journey passes. CMS rollback/recovery ownership is documented separately from application rollback.

## Immediate post-deployment: before public promotion

Set a task-specific variable to the **verified** origin for read-only probes; do not put credentials in it:

```sh
TIMELESS_AUDIT_ORIGIN='https://verified-production-origin'
curl -sS -D - -o /dev/null "$TIMELESS_AUDIT_ORIGIN/"
curl -sS -D - -o /dev/null "$TIMELESS_AUDIT_ORIGIN/shop/essential-tee"
curl -sS -D - -o /dev/null "$TIMELESS_AUDIT_ORIGIN/robots.txt"
curl -sS -D - -o /dev/null "$TIMELESS_AUDIT_ORIGIN/sitemap.xml"
curl -sS -D - -o /dev/null "$TIMELESS_AUDIT_ORIGIN/journal/in-the-wild-akure"
```

Use the actual published product slug if it changes. Expected: intended content and discovery resources 200; the legacy Journal URL 308/301 to the approved archive target; headers consistent with the approved edge policy. These commands are checklist instructions, not claims that production was probed during this audit.

- [ ] **Correct artifact/domain.** Pass: deployment ID/commit matches signoff; production serves the redesign, valid TLS and approved canonical host; no dummy content/config leaks; preview-to-production behavior correct.
- [ ] **Nine-route smoke and deep links.** Pass: Home, Shop, Product, About, Journal, all published article URLs and Wild load/refresh; a global unknown URL is 404/noindex; missing content returns accepted not-found/noindex behavior; internal links and the legacy redirect work. Check actual CMS inventory, not just the fallback list.
- [ ] **Real image delivery.** Pass: hero/product/editorial media and fonts complete normally with no audit route interception, missing assets, mixed content or optimizer error. Save Network/console evidence; confirm optimized formats/cache headers at the actual edge.
- [ ] **Customer conversion smoke.** Pass: select colour and size, add/increment/remove, refresh and navigate, inspect exact WhatsApp target/message without sending a real order. Test controlled subscription only through an approved test path; verify backend acceptance and failure handling.
- [ ] **Accessibility/responsive smoke.** Pass: fresh reduced-motion Home/Product renders; 375px and the failing tablet portrait viewport look correct; keyboard header focus, bag/gallery/menu work; policies/support are reachable.
- [ ] **Measurement destination check.** Pass: marked test pageview and one add/handoff/signup test event have correct release/source/properties at collector; duplicates and PII absent; consent and test filters behave as approved.
- [ ] **Alerts and logs.** Pass: owner sees healthy synthetic results, no new systematic exceptions/5xx, no exposed sensitive payloads; monitoring identifies this release; restore link and incident contact are available to the release team.
- [ ] **Returning browser / cache smoke.** Pass: a browser with the previous release and saved bag can load the new release, navigate without chunk errors and preserve/handle bag data deliberately; clean profile also passes. Confirm restoration of previous application release would not corrupt new CMS/state assumptions.

## First launch observation window

- [ ] **Named active observer.** Pass: release owner monitors at least the initial 30 minutes of public traffic with working synthetic/error/conversion dashboards; observation times and results recorded.
- [ ] **Alert threshold agreement.** Pass: before launch, owner records thresholds appropriate to actual traffic. Proposed starting trigger: any confirmed synthetic failure of Home/Product/checkout availability on two consecutive one-minute checks, or a new release-caused critical-journey exception, requires immediate investigation and traffic pause.
- [ ] **Field performance collection.** Pass: RUM is receiving meaningful LCP/INP/CLS samples grouped by device and release. Good p75 targets are LCP≤2.5s, INP≤200ms, CLS≤0.1 when sufficient representative data exists. Do not claim success from an empty or tiny dataset.
- [ ] **Funnel sanity.** Pass: pageviews/item views/additions/handoffs reconcile logically; real merchant-confirmed purchases are not equated with clicks; no newsletter successes without accepted records. Diagnose missing/duplicate collection before judging campaign conversion.

## Stop / rollback criteria and action

Stop promotion immediately and restore the last validated application release (or disable the affected feature under an approved mitigation) if any of these are confirmed release regressions:

1. Blank page, inaccessible reduced-motion rendering, widespread asset/chunk failure or sustained Home/Product synthetic failure.
2. Checkout points to the wrong recipient, produces wrong selections/prices/totals under the approved pricing policy, loses bags, or is systematically unavailable.
3. Newsletter reports success without accepted records, loses accepted data, or exposes personal data/secrets.
4. A credible security exposure/advisory affecting the actual deployment has no verified mitigation; do not wait for exploitation.
5. New critical accessibility barrier prevents the purchase path on supported devices/AT.
6. Release-caused sustained server errors or major performance regression beyond the agreed baseline, with no safe immediate mitigation.

Broken analytics alone should pause campaign spend and interpretation until corrected; roll back when the release causes the failure and no isolated mitigation exists. A single noisy lab run is not a field-CWV rollback trigger. DNS/TLS incidents may require platform restoration rather than code rollback.

Record the incident, restore the immutable prior version using the rehearsed provider operation, verify Home/Product/bag/handoff/policies immediately, and confirm monitors recover. Keep CMS changes and order handling consistent with the restored version. Preserve sanitized failure evidence; restart the gate before redeploying a fix. This audit did not execute or verify a rollback.
