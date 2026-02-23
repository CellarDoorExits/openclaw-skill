# cellar-door-exit — npm Publish Prep Assessment

**Date:** 2026-02-23  
**Package:** cellar-door-exit@0.1.0  
**Status:** ✅ Ready for publish

## Changes Made

### package.json
- Moved `tsup` and `tsx` from `dependencies` to `devDependencies`
- Added `"module"` field pointing to `dist/index.js` (ESM)
- Changed `"main"` to `dist/index.cjs` (CJS)
- Added `"exports"` map with dual CJS/ESM + types conditions
- Added `"files"` array: `["dist", "README.md", "LICENSE", "CHANGELOG.md"]`
- Updated build script to `--format esm,cjs` for dual output
- Added `"repository"`, `"homepage"`, `"bugs"` fields
- Added `"keywords"` array
- `"license": "Apache-2.0"` was already present

### tsconfig.json (created)
- Did not exist; created with `moduleResolution: "bundler"` to support DTS generation

### LICENSE
- Updated copyright line to "2026 Warren Koch, EXIT Protocol Project"

### .npmignore (created)
- Excludes `src/`, `benchmarks/`, `docs/`, `*.test.ts`, `tsconfig.json`, `.gitignore`

### src/key-compromise.ts (type fix)
- Added type cast to fix DTS build error where destructured spread lost required `id`/`proof` fields

## Build Output

```
ESM dist/cli.js            22.14 KB
ESM dist/index.js          4.31 KB
ESM dist/chunk-HCY72MBQ.js 72.22 KB
CJS dist/cli.cjs           38.16 KB
CJS dist/index.cjs         78.61 KB
DTS dist/cli.d.ts          20.00 B
DTS dist/index.d.ts        84.71 KB
DTS dist/cli.d.cts         20.00 B
DTS dist/index.d.cts       84.71 KB
```

## npm pack --dry-run

```
npm notice package: cellar-door-exit@0.1.0
npm notice Tarball Contents
npm notice 10.8kB  LICENSE
npm notice 6.7kB   README.md
npm notice 74.8kB  dist/chunk-ESUKLCVE.js
npm notice 74.0kB  dist/chunk-HCY72MBQ.js
npm notice 39.1kB  dist/cli.cjs
npm notice 20B     dist/cli.d.cts
npm notice 20B     dist/cli.d.ts
npm notice 22.7kB  dist/cli.js
npm notice 80.5kB  dist/index.cjs
npm notice 86.9kB  dist/index.d.cts
npm notice 86.9kB  dist/index.d.ts
npm notice 4.4kB   dist/index.js
npm notice 1.8kB   package.json
npm notice total files: 13
npm notice package size: 120.8 kB
npm notice unpacked size: 488.7 kB
```

## Test Results

```
Test Files  13 passed (13)
      Tests  205 passed (205)
   Duration  6.61s
```

All tests pass. No regressions.

## Next Steps

1. `npm publish` (or `npm publish --access public` for scoped)
2. Consider adding a CHANGELOG.md before first publish
3. Verify the GitHub repo URL is correct before publish
