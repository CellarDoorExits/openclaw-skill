/**
 * cellar-door-exit — JSON-LD Context Document
 */

export const EXIT_CONTEXT_V1_URL = "https://cellar-door.org/exit/v1";

export const EXIT_CONTEXT = {
  "@context": {
    // Base vocabularies
    exit: "https://cellar-door.org/exit/v1#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    dc: "http://purl.org/dc/terms/",

    // 7 Core fields
    id: "@id",
    subject: { "@id": "exit:subject", "@type": "@id" },
    origin: { "@id": "exit:origin", "@type": "@id" },
    timestamp: { "@id": "exit:timestamp", "@type": "xsd:dateTime" },
    exitType: { "@id": "exit:exitType", "@type": "xsd:string" },
    status: { "@id": "exit:status", "@type": "xsd:string" },
    proof: { "@id": "exit:proof", "@type": "@id" },

    // Proof fields
    type: "@type",
    created: { "@id": "exit:created", "@type": "xsd:dateTime" },
    verificationMethod: { "@id": "exit:verificationMethod", "@type": "@id" },
    proofValue: { "@id": "exit:proofValue", "@type": "xsd:string" },

    // Module namespaces
    lineage: { "@id": "exit:lineage", "@type": "@id" },
    reputation: { "@id": "exit:reputation", "@type": "@id" },
    originAttestation: { "@id": "exit:originAttestation", "@type": "@id" },
    assets: { "@id": "exit:assets", "@type": "@id" },
    continuity: { "@id": "exit:continuity", "@type": "@id" },
    dispute: { "@id": "exit:dispute", "@type": "@id" },

    // Legacy module slots (Sprint 1 compat)
    stateSnapshot: { "@id": "exit:stateSnapshot", "@type": "@id" },
    economic: { "@id": "exit:economic", "@type": "@id" },
    metadata: { "@id": "exit:metadata", "@type": "@id" },
    crossDomain: { "@id": "exit:crossDomain", "@type": "@id" },

    // Ceremony terms
    ceremonyState: { "@id": "exit:ceremonyState", "@type": "xsd:string" },
    intent: { "@id": "exit:intent", "@type": "@id" },
    challengeWindow: { "@id": "exit:challengeWindow", "@type": "@id" },
    witness: { "@id": "exit:witness", "@type": "@id" },

    // Lineage module terms
    predecessor: { "@id": "exit:predecessor", "@type": "@id" },
    successor: { "@id": "exit:successor", "@type": "@id" },
    lineageChain: { "@id": "exit:lineageChain", "@type": "@id", "@container": "@list" },
    continuityProof: { "@id": "exit:continuityProof", "@type": "@id" },

    // Reputation module terms
    metrics: { "@id": "exit:metrics", "@type": "@id" },
    endorsements: { "@id": "exit:endorsements", "@type": "@id", "@container": "@list" },
    tenure: { "@id": "exit:tenure", "@type": "xsd:duration" },

    // Asset module terms
    assetManifest: { "@id": "exit:assetManifest", "@type": "@id", "@container": "@list" },

    // Continuity module terms
    stateHash: { "@id": "exit:stateHash", "@type": "xsd:string" },
    memoryRef: { "@id": "exit:memoryRef", "@type": "@id" },
    configHash: { "@id": "exit:configHash", "@type": "xsd:string" },
  },
};

/** Get the full EXIT JSON-LD context object. */
export function getContext(): typeof EXIT_CONTEXT {
  return EXIT_CONTEXT;
}
