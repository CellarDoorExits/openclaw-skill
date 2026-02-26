# P21 — Cloud Solutions Architect Assessment

**Persona:** Principal Cloud Architect (AWS/GCP)
**Target:** cellar-door-exit (EXIT markers)
**Date:** 2026-02-25

---

## 1. Architecture Proposal: EXIT as a Managed Service

### AWS Reference Architecture

```
                          ┌──────────────┐
                          │  CloudFront  │
                          │   (CDN/WAF)  │
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │  API Gateway  │
                          │  (REST/HTTP)  │
                          └──────┬───────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
       ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
       │   Lambda:   │   │   Lambda:   │   │   Lambda:   │
       │   create    │   │   verify    │   │   ceremony  │
       │   + sign    │   │             │   │   (Step Fn) │
       └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
              │                  │                  │
       ┌──────▼──────┐          │           ┌──────▼──────┐
       │  AWS KMS    │          │           │ Step        │
       │  (P-256)    │          │           │ Functions   │
       └─────────────┘          │           └─────────────┘
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                          ┌──────▼───────┐
                          │  DynamoDB    │
                          │  (markers)   │
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │  S3 (archive │
                          │  + bulk      │
                          │  export)     │
                          └──────────────┘

         Observability: X-Ray + CloudWatch (OTel collector via Lambda layer)
```

### GCP Equivalent

| AWS | GCP |
|-----|-----|
| API Gateway | Cloud Endpoints / API Gateway |
| Lambda | Cloud Functions (2nd gen) / Cloud Run |
| KMS (P-256) | Cloud KMS (EC_SIGN_P256_SHA256) |
| DynamoDB | Firestore (native mode) |
| Step Functions | Workflows |
| S3 | Cloud Storage |
| X-Ray | Cloud Trace |

### Key Design Decisions

1. **Verify is stateless** — pure compute, no KMS call needed. This is the hot path and scales trivially.
2. **Sign requires KMS** — the private key never leaves the HSM. Each sign = 1 KMS API call.
3. **Ceremony = state machine** — Step Functions / Workflows models the ALIVE → INTENT → SNAPSHOT → FINAL → DEPARTED lifecycle naturally, with timeouts and contest windows.
4. **Markers are immutable** — DynamoDB with partition key = `marker.id`, no updates. Perfect for on-demand billing.

---

## 2. Serverless Architecture Detail

### Lambda Functions

| Function | Runtime | Memory | Timeout | Trigger |
|----------|---------|--------|---------|---------|
| `exit-create` | Node 20 | 256 MB | 10s | API GW POST /exits |
| `exit-sign` | Node 20 | 256 MB | 10s | API GW POST /exits/{id}/sign |
| `exit-verify` | Node 20 | 128 MB | 5s | API GW POST /verify |
| `exit-inspect` | Node 20 | 128 MB | 5s | API GW GET /exits/{id} |
| `exit-ceremony` | Node 20 | 256 MB | 30s | Step Functions task |

### DynamoDB Schema

```
Table: exit-markers
  PK: marker_id (string)
  SK: "MARKER"
  GSI1: origin (PK) + timestamp (SK)  — query by origin
  GSI2: subject (PK) + timestamp (SK) — query by subject
  TTL: optional (for ephemeral markers)
```

### KMS Key Configuration

```hcl
resource "aws_kms_key" "exit_signing" {
  description              = "EXIT marker signing key"
  key_usage               = "SIGN_VERIFY"
  customer_master_key_spec = "ECC_NIST_P256"
  deletion_window_in_days  = 30

  policy = jsonencode({
    Statement = [{
      Effect    = "Allow"
      Principal = { AWS = aws_iam_role.exit_lambda.arn }
      Action    = ["kms:Sign", "kms:Verify", "kms:GetPublicKey"]
      Resource  = "*"
    }]
  })
}
```

---

## 3. Cost Estimates

### Assumptions
- 1 sign = 1 KMS call, 1 DynamoDB write (1KB avg marker), 1 Lambda invocation (200ms avg)
- 1 verify = 1 Lambda invocation (50ms avg), 1 DynamoDB read
- 70/30 split: 70% creates (sign), 30% verify-only
- Marker storage: ~1KB per marker

### Monthly Cost Breakdown

| Component | 10K exits/mo | 100K exits/mo | 1M exits/mo |
|-----------|-------------|---------------|-------------|
| **Lambda** (create+verify) | $0.10 | $1.00 | $10.00 |
| **API Gateway** | $3.50 | $35.00 | $350.00 |
| **KMS** (sign ops @ $0.03/10K) | $0.21 | $2.10 | $21.00 |
| **DynamoDB** (on-demand WCU/RCU) | $0.18 | $1.75 | $17.50 |
| **DynamoDB** (storage) | $0.01 | $0.06 | $0.63 |
| **S3** (archive) | $0.01 | $0.01 | $0.02 |
| **CloudWatch/X-Ray** | $2.00 | $5.00 | $15.00 |
| **Total** | **~$6** | **~$45** | **~$414** |

**Notes:**
- API Gateway dominates cost. At 1M+, consider ALB + Lambda or Cloud Run for 3-5x savings.
- KMS is surprisingly cheap at $0.03/10K operations.
- Verify-only deployments (no KMS, no writes) cost nearly nothing.
- Free tier covers most of the 10K tier.

### GCP Comparison (Cloud Run + Firestore + Cloud KMS)

| Volume | GCP Estimate |
|--------|-------------|
| 10K/mo | ~$5 |
| 100K/mo | ~$35 |
| 1M/mo | ~$300 |

GCP edges out slightly cheaper at scale due to Cloud Run's per-request billing model vs API Gateway pricing.

---

## 4. HSM / Cloud KMS Integration Analysis

The `Signer` interface is **excellently designed for cloud KMS**:

### What Works Well

1. **Async-native** — `sign()` and `verify()` return `Promise | sync`, so KMS network calls work natively without wrapper hacks.
2. **Lazy init pattern** — `init()` fetches the public key once, then caches it. This maps perfectly to Lambda cold starts (init in handler setup, reuse across invocations).
3. **Algorithm abstraction** — P-256 is the only algorithm supported by all cloud KMS providers. The library defaults to Ed25519 but cleanly supports P-256 for FIPS.
4. **DER parsing helpers** — The `extractP256PublicKey` utility handles the annoying SPKI-to-raw conversion that every cloud KMS returns.

### Practical Considerations

| Concern | Assessment |
|---------|-----------|
| Cold start latency | KMS `GetPublicKey` adds ~100ms on cold start. Cache in Lambda global scope. |
| Cross-region | KMS keys are regional. Multi-region keys available but add complexity. |
| Key rotation | KMS supports automatic rotation but EXIT markers reference specific key versions via DID. Need a DID→key version registry. |
| FIPS compliance | AWS KMS = FIPS 140-2 Level 2 by default, Level 3 with CloudHSM. GCP Cloud KMS = FIPS 140-2 Level 3 (Cloud HSM tier). |
| Cost at scale | KMS sign operations at $0.03/10K are negligible. Not a concern even at 10M/mo ($30). |

### Lambda Cold Start Optimization

```typescript
// Global scope — survives across invocations
let signer: AwsKmsSigner | undefined;

export async function handler(event: APIGatewayEvent) {
  if (!signer) {
    signer = await new AwsKmsSigner(process.env.KMS_KEY_ID!).init();
  }
  // signer.sign() ~5-15ms per KMS call
}
```

---

## 5. OpenTelemetry Integration: Cloud-Native Readiness

### Verdict: ✅ Cloud-native friendly, well-designed

**Strengths:**

1. **Zero-overhead no-op** — If no OTel SDK is configured, everything is a no-op. No performance penalty for users who don't want telemetry. This is the correct pattern.
2. **Peer dependency model** — Users bring their own `@opentelemetry/api`. No SDK bundling bloat. Works with any exporter (X-Ray, Cloud Trace, Jaeger, etc.).
3. **Custom attribute namespace** — `cellar_door.*` attributes won't collide with other instrumentation.
4. **PII controls** — `includeMarkerIds` and `includeSubjects` flags. Smart for GDPR/compliance-sensitive deployments.
5. **Span naming convention** — `cellar-door.sign`, `cellar-door.verify`, `cellar-door.ceremony` — clean, greppable.

**Integration with cloud-native observability:**

| Platform | Integration Path |
|----------|-----------------|
| AWS X-Ray | `aws-otel-lambda` layer + ADOT collector. Works out of the box. |
| GCP Cloud Trace | `@google-cloud/opentelemetry-cloud-trace-exporter`. Direct export. |
| Datadog | `dd-trace` OTel bridge or OTLP exporter to Datadog agent. |
| Grafana Cloud | OTLP exporter to Grafana Tempo. |

**One minor suggestion:** Add metric counters (not just spans) for `exits.created`, `exits.verified`, `exits.failed`. Metrics are cheaper than traces for dashboards/alerting at scale. The current implementation is trace-only.

---

## 6. Managed Service Opportunity

### The Business Case

EXIT solves a real problem: **portable, verifiable departure proofs for agents and platforms**. As autonomous agents proliferate, the need for exit credentials becomes non-trivial.

### Managed Service Tiers

| Tier | Target | Features | Price Point |
|------|--------|----------|-------------|
| **Free** | OSS / indie devs | Self-hosted, Ed25519, no SLA | $0 |
| **Starter** | Startups | Managed API, KMS signing, 10K/mo | $29/mo |
| **Pro** | Mid-market | FIPS compliance, ceremony orchestration, 100K/mo | $199/mo |
| **Enterprise** | Regulated industries | CloudHSM, audit logs, SLA, custom domains, 1M+/mo | Custom |

### What Makes This Viable as a Managed Service

1. **KMS abstraction** — Most teams don't want to manage signing keys. A managed service that handles key lifecycle is valuable.
2. **Ceremony orchestration** — The state machine (intent → snapshot → final → departed) is complex. Step Functions as a service removes operational burden.
3. **Registry / discovery** — A global marker registry where you can look up any agent's exit history is a network effect play.
4. **Compliance** — FIPS, SOC 2, audit logs. Selling compliance-as-a-service on top of EXIT.

### What Makes This Risky

1. **Nascent market** — Agent departures aren't a mainstream problem yet. Timing risk.
2. **Offline-verifiable by design** — The core value prop is that you *don't* need a service to verify. This cuts against recurring revenue.
3. **No lock-in** — Markers are portable JSON. Switching cost is near-zero. Retention risk.
4. **OSS core** — Anyone can self-host for free. The managed service must add enough value beyond the library.

---

## 7. Build / Don't Build Verdict

### 🟡 BUILD — but as an add-on to a broader agent infrastructure platform, not standalone

**Reasoning:**

EXIT as a *standalone* managed service is too narrow. The TAM for "agent departure proofs" alone doesn't justify building a dedicated product. However:

1. **As part of an agent identity platform** (DID management + credential issuance + EXIT) — strong fit. EXIT becomes one API in a suite.
2. **As infrastructure for agent marketplaces / DAOs** — platforms that manage agent lifecycles need this built in. Sell it as an embedded feature, not a standalone service.
3. **The OSS library is the product** — the real opportunity is adoption of the standard, not hosting fees. Monetize via enterprise support, compliance certifications, and consulting.

**Recommended path:**
- Keep the library OSS (Apache-2.0 ✅ already done)
- Offer a hosted verification registry (free tier, paid for SLA + compliance)
- Bundle with broader agent identity / credential infrastructure
- Target 2-3 design partners in regulated industries (finance, healthcare) where FIPS + audit trails justify enterprise pricing

**Cloud deployment is trivially achievable** — the architecture is clean, the KMS integration is well-designed, and the OTel story is solid. The question isn't "can we deploy this" but "is the market ready." My estimate: 12-18 months before agent exit infrastructure becomes a pain point at scale.

---

*Assessment by P21 Cloud Solutions Architect persona. Part of Hawthorn persona assessment series v3.*
