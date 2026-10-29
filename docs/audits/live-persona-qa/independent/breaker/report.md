# Breaker live QA

- PASS: Consent decline {"name":"Consent decline","passed":true}
- PASS: Junk email native validation {"name":"Junk email native validation","passed":true,"valid":false,"typeMismatch":true,"requests":0}
- PASS: Double submit mocked unavailable {"name":"Double submit mocked unavailable","passed":true,"requests":1}
- PASS: Double submit mocked success {"name":"Double submit mocked success","passed":true,"requestsForRetry":1}
- PASS: Back and forward mid shopping flow {"name":"Back and forward mid shopping flow","passed":true}
- PASS: Initial double Add leaves drawer open {"name":"Initial double Add leaves drawer open","passed":true}
- PASS: Initial double Add quantity {"name":"Initial double Add quantity","passed":true,"quantity":"1"}
- PASS: Prepared WhatsApp URL (never opened) {"name":"Prepared WhatsApp URL (never opened)","passed":true,"host":"wa.me","includesProduct":true,"includesSize":true,"includesSubtotal":true,"usesItemsSubtotal":false,"mentionsShippingAdditional":true,"usesOrderTotal":true}
- PASS: Saved bag reopens after reload {"name":"Saved bag reopens after reload","passed":true,"quantity":"1"}
- PASS: Deliberate later Add increments once {"name":"Deliberate later Add increments once","passed":true,"quantity":"2"}

Reproducible defects: None established.

Harness errors: None.

All valid newsletter submissions intercepted. No WhatsApp URL opened. Google collectors blocked; measurement declined. Initial sandbox launch failed with MachPort denial; automatically reviewed isolated launch succeeded.

Final production verification: PASS — initial double Add leaves the drawer open with quantity 1. Draft now uses ITEMS SUBTOTAL, includes additional shipping, and omits ORDER TOTAL. Prepared URL inspected only; never opened.

Historical harness issues resolved: restricted Chromium MachPort launch, bag accessible-name selector, and scroll restoration leaving header outside viewport. None were counted as product defects.
