# Remediation verification evidence

Captured locally on 28 October 2026. See [the current status](../REMEDIATION-STATUS.md) for scope, limitations and release conditions.

- `unit-tests.txt`, `browser-tests.txt`, `lint.txt`, `typecheck.txt`: automated verification outputs.
- `build.txt`, `build-connected.txt`: production build outputs without and with existing public Sanity configuration.
- `dependency-audit.json`, `dependency-tree.txt`: final installed dependency scan and resolution.
- `configuration-check.txt`: expected missing Brevo/origin environment setup; no secrets printed.
- `visual-accessibility.json`, `visual-review.txt`: viewport observations and sampled axe results.
- `contact-sheet-*.jpg`: reviewed seven-page matrices at four widths. Individual page screenshots and four mobile policy captures are also retained.
- `connected-smoke.json`, `connected-smoke.txt`, `connected-bag-375.jpg`: read-only published catalogue through bag/handoff preparation. WhatsApp was not opened.

Newsletter responses in automated tests are mocked. No actual recipient, provider dashboard, deployed environment, physical device or field metric is verified by these files.

The Brevo integration follows the official [double-opt-in endpoint reference](https://developers.brevo.com/reference/create-doi-contact), including the API template link `{{ params.DOIurl }}`. Credentials and actual email delivery still require owner setup and controlled verification.
