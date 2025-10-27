# MDX Build Cache Optimization Summary

## Changes Made

### 1. **Re-enabled Registry-Dependent File Caching** (`src/mdx.ts`)

**Problem:** [PR #15124](https://github.com/getsentry/sentry-docs/pull/15124) disabled caching for ~1000 files that depend on the Release Registry (SDK versions, Lambda layers, etc.), causing them to be recompiled in every worker on every build.

**Solution:** Smart cache key that includes both source hash AND registry data hash:

```typescript
// Regular files
cacheKey = md5(source);

// Registry-dependent files  
cacheKey = md5(source) + md5(registryData);
```

**Benefits:**
- ✅ Files cached across workers within a build
- ✅ Cache invalidates automatically when registry updates
- ✅ Safe: no stale SDK versions

### 2. **Per-Worker Registry Hash Caching**

**Problem:** Each registry-dependent file was fetching and hashing the registry independently.

**Solution:** Compute registry hash once per worker, reuse for all files:

```typescript
let cachedRegistryHash: string | null = null;
async function getRegistryHash(): Promise<string> {
  if (cachedRegistryHash) return cachedRegistryHash;
  const [apps, packages] = await Promise.all([...]);
  cachedRegistryHash = md5(JSON.stringify({apps, packages}));
  return cachedRegistryHash;
}
```

**Benefits:**
- ⚡ Faster: Only 1 registry fetch per worker (vs hundreds)
- 🔒 Consistent: All files in same worker use same hash
- 💾 Less memory: Registry data loaded once

### 3. **Cache Hit Logging**

**Problem:** No visibility into whether cache was being used on Vercel.

**Solution:** Log when registry-dependent files are served from cache:

```
✓ Using cached registry-dependent file: platform-includes/.../javascript.mdx (registry: 50fbbd5e)
```

**Benefits:**
- 📊 Visibility into cache effectiveness
- 🐛 Debug cache issues in production builds
- ✅ Verify optimization is working

## Expected Impact

### Current Baseline (from Vercel logs):
```
Total build: 18 minutes
- Compilation: ~10 min
- Page generation: ~6.5 min (MDX compilation)
```

### Expected After Optimization:
```
Total build: ~14-15 minutes
- Compilation: ~10 min (unchanged)
- Page generation: ~2-3 min (registry files cached)
```

**Estimated savings: 3-4 minutes per preview build**

## How It Works

### First Build on a Branch:
1. Worker 1 compiles `javascript.mdx` → generates cache key `abc123-50fbbd5e`
2. Saves to `.next/cache/mdx-bundler/abc123-50fbbd5e.br`
3. Workers 2-8 hit same file → read from cache ✨

### Second Build (same branch, no registry changes):
1. Vercel restores `.next/cache/` from previous build
2. All workers read compiled files from cache
3. Super fast! 🚀

### When Registry Updates (e.g., new SDK release):
1. Registry hash changes: `50fbbd5e` → `6a7c8d9e`
2. Cache key changes: `abc123-50fbbd5e` → `abc123-6a7c8d9e`
3. Cache miss → recompile (correct!)
4. Fresh content with new SDK version ✅

## Cache Location

```
.next/cache/mdx-bundler/
├── abc123-50fbbd5e.br          (compressed MDX bundle)
├── abc123-50fbbd5e/            (image assets)
├── def456.br                   (non-registry file)
└── ...                         (~4,300 files, 205MB)
```

Vercel automatically caches `.next/cache/` between builds.

## Testing Checklist

- [x] Local test with `CI=1 yarn build:preview`
- [x] Cache hit logs appear: ✓ Using cached registry-dependent file
- [x] No linting errors
- [ ] Push to Vercel preview branch
- [ ] Monitor first build time (should be ~18 min - baseline)
- [ ] Monitor second build time (should be ~14-15 min - optimized)
- [ ] Verify cache hit logs in Vercel build output
- [ ] Verify registry-dependent files show correct SDK versions

## Files Modified

1. `src/mdx.ts`:
   - Added `getRegistryHash()` function for per-worker caching
   - Modified cache key generation to include registry hash
   - Added cache hit logging for registry-dependent files
   - Removed old `skipCache` logic

## Rollback Plan

If this causes issues, simply revert to the `skipCache` approach from PR #15124:
```bash
git revert <this-commit>
```

This will go back to the safe (but slower) approach of always recompiling registry-dependent files.

