# Authorized observation corrections

Exactly 3 new config-test observations change; all 99 cases remain.
1. A stale write still rejects409 and preserves external bytes. Fresh GET must show the valid external file and its exact SHA-256 revision.
2. Aborted/disposed saves explicitly reject408; old disposed GET rejects408. A new live factory proves preserved maxNodes4.
3. Unsafe-path save and GET explicitly reject500. Sentinel/no-temp checks remain. Only the sandbox restores the exact prior bytes at0600, then checks the exact settings/revision.
No original56 case or confirmed PhaseA race/getter/form-render condition is removed. No business/client/package change.
