# Benchmark Results — cellar-door-exit v0.1.0

> Generated: 2026-02-22T08:22:44.604Z  
> Platform: Node.js v22.22.0, linux x64

## 1. Marker Size (JSON serialization)

| Configuration | Bytes |
|---|---:|
| Core (unsigned) | 442 |
| Core (signed) | 586 |
| Core + Module A | 701 |
| Core + A + B | 847 |
| All modules (A–F) | 1294 |

## 2–3. Cryptographic Operations

| Operation | ops/sec | Avg latency (ms) |
|---|---:|---:|
| Ed25519 sign (raw) | 2,176 | 0.460 |
| Ed25519 verify (raw) | 227,790 | 0.004 |
| signMarker (full) | 2,199 | 0.455 |
| verifyMarker (full) | 525 | 1.903 |

## 4. Ceremony Path Timing

| Path | ops/sec | Avg latency (ms) |
|---|---:|---:|
| Cooperative (5 transitions) | 1,105 | 0.905 |
| Unilateral (4 transitions) | 1,095 | 0.913 |
| Emergency (3 transitions) | 1,000 | 1.000 |

## 5. Batch / Merkle Operations

| N | Tree build (ms) | Proof gen (ms) | Proof verify (ms) |
|---:|---:|---:|---:|
| 10 | 2.683 | 1.099 | 0.547 |
| 100 | 2.641 | 0.791 | 0.071 |
| 1000 | 22.747 | 18.372 | 0.374 |

## 6. quickExit() End-to-End

| Operation | ops/sec | Avg latency (ms) |
|---|---:|---:|
| quickExit() | 1,355 | 0.738 |

## 7. Validation

| Input | ops/sec | Avg latency (ms) |
|---|---:|---:|
| Valid marker | 813,436 | 0.001 |
| Invalid marker | 773,633 | 0.001 |
