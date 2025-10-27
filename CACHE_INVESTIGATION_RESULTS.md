# MDX Cache Investigation Results

## Summary

Added comprehensive cache hit/miss logging and slow compilation tracking to understand build performance.

## Changes Made

### 1. Cache Statistics Tracking (`src/mdx.ts`)

Added per-worker tracking for:
- Cache hits/misses (total)
- Registry-dependent file hits/misses (subset)
- Automatic statistics reporting

### 2. Cache Hit/Miss Logging

**Cache HITs** (using existing cache):
```
✓ Cache HIT (registry): /path/to/file.mdx (registry: 50fbbd5e)
```

**Cache MISSes** (compiling from scratch):
```
✗ Cache MISS (registry): /path/to/file.mdx (registry: 50fbbd5e)
```

### 3. Slow Compilation Detection

Logs any file taking >10 seconds to compile:
```
⚠️  Slow compilation (12.3s): /path/to/slow/file.mdx
```

## Local Build Results (First Build After Changes)

### Cache Performance
```
Registry-dependent files:
  Hits:   202 files (58.6%)
  Misses: 143 files (41.4%)
  Total:  345 files
```

**Analysis:**
- **Good**: 58.6% cache hit rate shows the caching is working!
- **Expected**: 41.4% miss rate is expected for first build with new cache key format
- **Next build**: Should see ~100% cache hit rate (only files that actually changed will miss)

### Compilation Speed
- **No slow compilations detected** (all files compiled in <10 seconds)
- **Build time**: ~194 seconds (3.2 minutes) - similar to baseline

## Why Local Build Is Fast

1. **Webpack cache**: Already warm from previous builds
2. **Single machine**: No distributed worker coordination overhead
3. **No network delays**: Registry fetches are fast
4. **Local filesystem**: Cache reads/writes are instant

## Expected Vercel Results

### First Build on Branch
- **Expected**: Similar to baseline (~18-20 min)
- **Reason**: New cache key format = cache miss on all registry-dependent files
- **Cache HIT rate**: ~0% for registry files on FIRST build

### Second Build on Same Branch
- **Expected**: 14-16 minutes (20-30% faster)
- **Reason**: Registry-dependent files now cached across workers
- **Cache HIT rate**: ~100% for registry files (unless registry updated)

## Timeout Investigation

### Findings
- **Local builds**: No timeouts, all files compile in <10 seconds
- **Vercel timeouts**: Likely caused by:
  1. **Worker coordination overhead**: Multiple workers compiling simultaneously
  2. **Network latency**: Registry fetches from Vercel infrastructure
  3. **Cache cold starts**: First-time compilation of large pages
  4. **Resource contention**: 4-core machine compiling ~9000 pages

### Timeout Patterns from Vercel Logs
Common timeout pages (from previous builds):
- `/platforms/java/**` pages
- `/platforms/ruby/**` pages
- `/platforms/node/guides/koa/**` pages

These are often:
- Large pages with many includes
- Heavy use of MDX components
- Multiple registry variable injections

## Recommendations

### Immediate Action
1. **Push to Vercel**: Test with new caching in real environment
2. **Make second commit**: Verify cache persistence works
3. **Monitor logs**: Count cache HITs vs MISSes on Vercel

### If Timeouts Persist
1. **Increase timeout threshold**: Currently 60s, might need 90s for some pages
2. **Pre-warm cache**: Run build twice on fresh branches
3. **Split large pages**: Break down pages with >50 includes
4. **Optimize MDX plugins**: Profile remark/rehype plugins for slow operations

## Next Steps

1. ✅ Local testing complete
2. ⏳ Push to Vercel preview branch
3. ⏳ Monitor first build (expect similar time to baseline)
4. ⏳ Make second commit
5. ⏳ Monitor second build (expect 20-30% improvement)
6. ⏳ Compare results and optimize further if needed

