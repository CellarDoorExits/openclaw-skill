# Reference Update Log — 2026-02-23

## Task
Update all Hawthorn project references to point to the real GitHub repo and npm package for cellar-door-exit.

## Canonical Locations
- **npm**: `cellar-door-exit` — https://www.npmjs.com/package/cellar-door-exit
- **GitHub**: `CellarDoorExits/exit-door` — https://github.com/CellarDoorExits/exit-door
- **Org**: `CellarDoorExits` (GitHub), `@cellar-door` (npm)

## Changes Made

### 1. `cellar-door-exit/package.json`
- `repository.url` → `https://github.com/CellarDoorExits/exit-door.git`
- `homepage` → `https://github.com/CellarDoorExits/exit-door`
- `bugs.url` → `https://github.com/CellarDoorExits/exit-door/issues`

### 2. `cellar-door-exit/docs/NIST_RFI_DRAFT.md` (line 267)
- `https://github.com/cellar-door/exit` → `https://github.com/CellarDoorExits/exit-door`

### 3. Integration import paths (relative → package)
- `integrations/langchain/src/exit-callback.ts` — `from "cellar-door-exit"`
- `integrations/langchain/src/exit-tool.ts` — `from "cellar-door-exit"`
- `integrations/vercel-ai-sdk/src/exit-middleware.ts` — `from "cellar-door-exit"`
- `integrations/vercel-ai-sdk/src/exit-tool.ts` — `from "cellar-door-exit"`
- `integrations/vercel-ai-sdk/src/__tests__/exit-middleware.test.ts` — `from "cellar-door-exit"`

### 4. Integration package.json files
- Already had `cellar-door-exit` as proper peerDependency (no changes needed)

### 5. README.md install instructions
- Already says `npm install cellar-door-exit` (no changes needed)

### 6. Hawthorn project docs
- `HAWTHORN.md` — org URL updated to `CellarDoorExits`
- `memory/HAWTHORN.md` — org URL updated to `CellarDoorExits`

### 7. Git push
- Committed and pushed `package.json` + `NIST_RFI_DRAFT.md` to `CellarDoorExits/exit-door` (commit `99e7406`)

## Not Changed (contextual/historical references)
- `TODO.md`, `TODO_old.md`, `memory/2026-02-18.md`, `memory/reading-notes.md`, `MEMORY.md` — these contain historical notes about HOLOS-git as an org, not package references. Left as-is for accuracy.
