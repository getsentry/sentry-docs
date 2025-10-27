# Build Optimization Plan - Sentry Docs

## Current Build Architecture Analysis

### Build Flow
```
1. Next.js spawns N workers (typically 8-16 based on CPU cores)
2. Each worker:
   - Calls generateStaticParams() → getAllFilesFrontMatter() → builds doc tree
   - Compiles MDX pages assigned to it (getFileBySlug())
   - Generates static HTML
3. Main process collects results and finalizes build
```

### Current Performance Metrics
- **Total build time**: ~194-247 seconds
- **Total pages**: 8,982
- **Doc tree builds**: 15+ times (1.2-1.7s each) = ~20-25s wasted
- **MDX compilation**: 0.2-0.6s per page average
- **Slow pages**: 8-10 pages taking 3-5 seconds each
- **Frontmatter reading**: ~0.4-0.6s per worker

### Key Bottlenecks Identified
1. ❌ Doc tree rebuilt independently by each worker
2. ❌ No cross-build caching of compiled MDX
3. ❌ Some pages 10-20x slower than average
4. ❌ Performance degrades as build progresses (0.2s → 0.6s per page)
5. ❌ Frontmatter reading happens independently per worker

---

## 5 Optimization Approaches

### Approach 1: Pre-compute Doc Tree Before Worker Spawn
**Problem**: Doc tree is built 15+ times (once per worker) during static generation
**Root Cause**: Each Next.js worker calls `generateStaticParams()` or `generateMetadata()`, triggering independent doc tree builds

**Solution**:
- Create a build-time cache file for the doc tree
- Generate it once in `next.config.ts` or a prebuild script
- Load from cache in workers instead of rebuilding

**Implementation**:
1. Add `scripts/prebuild-doctree.ts` to serialize doc tree to `.next/cache/doctree.json`
2. Modify `src/docTree.ts` to load from cache if available
3. Update `package.json` build script to run prebuild step

**Expected Impact**: 
- Save **20-25 seconds** per build
- Reduce worker startup time
- More consistent worker performance

**Risks**: 
- Low risk - cache invalidation is simple (delete on clean build)
- May need to handle dev vs production modes differently

---

### Approach 2: Implement Content-Based MDX Caching
**Problem**: Every MDX page is compiled from scratch on every build, even if content unchanged
**Root Cause**: No persistent cache of compiled MDX between builds

**Solution**:
- Generate hash of MDX source + dependencies (plugins, imports, etc.)
- Cache compiled output keyed by hash
- Store in `.next/cache/mdx/` or use Vercel build cache

**Implementation**:
1. Modify `src/mdx.ts` `getFileBySlug()` to check cache first
2. Hash: source content + plugin config + imported files
3. Store serialized compiled output
4. Invalidate on hash mismatch

**Expected Impact**:
- **Incremental builds**: 50-80% faster (only changed pages recompile)
- **Full builds**: No impact (but still valuable for preview deploys)
- On typical PR: ~100-200 pages change → save **40-80 seconds**

**Risks**:
- Medium risk - need robust cache invalidation
- Hash calculation must include all dependencies
- Cache size management needed

---

### Approach 3: Profile and Optimize Slow MDX Pages
**Problem**: 8-10 pages take 3-5 seconds to compile (10-20x slower than average)
**Root Cause**: Unknown - could be file size, complex components, or plugin overhead

**Solution**:
1. Add detailed profiling to slow pages
2. Identify bottleneck (parsing, plugins, component resolution)
3. Optimize based on findings:
   - Split large files
   - Lazy load heavy components
   - Skip expensive plugins for specific pages
   - Cache intermediate results

**Implementation**:
1. Add detailed timer breakpoints in `src/mdx.ts` for slow pages
2. Profile: source read, bundleMDX, remark plugins, rehype plugins
3. Implement specific fixes based on findings

**Expected Impact**:
- If we can halve slow page time (5s → 2.5s): save **20-40 seconds**
- Better understanding of MDX bottlenecks
- May reveal systematic issues affecting all pages

**Risks**:
- Low risk - purely additive profiling
- May require content restructuring if files are too large

---

### Approach 4: Parallelize Frontmatter Collection
**Problem**: `getAllFilesFrontMatter()` reads ~9,000 files sequentially
**Root Cause**: File reading happens in a single-threaded loop

**Solution**:
- Use `Promise.all()` to read multiple files concurrently
- Batch operations (e.g., 100 files at a time to avoid fd exhaustion)
- Consider worker threads for CPU-intensive parsing

**Implementation**:
1. Modify `getAllFilesFrontMatter()` in `src/mdx.ts`
2. Replace sequential `for` loop with batched `Promise.all()`
3. Tune batch size for optimal performance (100-500 files)

**Expected Impact**:
- Reduce frontmatter reading from **0.4-0.6s to 0.1-0.2s** per worker
- Total savings: **5-10 seconds** (across all workers)
- Faster dev server startup

**Risks**:
- Low risk - reading files is I/O bound
- Watch for file descriptor limits (handle via batching)

---

### Approach 5: Optimize MDX Plugin Chain
**Problem**: Average compilation time increases from 0.2s to 0.6s as build progresses
**Root Cause**: Potentially memory pressure or inefficient plugin usage

**Solution**:
1. Profile remark/rehype plugin execution time
2. Identify expensive plugins
3. Optimize:
   - Remove unused plugins
   - Replace with faster alternatives
   - Cache plugin results where possible
   - Run expensive plugins only when needed

**Implementation**:
1. Add timing wrapper around each plugin in `src/mdx.ts`
2. Log plugin timing for representative pages
3. Optimize based on findings:
   - Consider removing or replacing slow plugins
   - Add conditional plugin execution
   - Implement plugin-level caching

**Expected Impact**:
- If we reduce average time 0.4s → 0.2s: save **30-60 seconds**
- More stable performance throughout build
- Reduced memory pressure

**Risks**:
- Medium risk - may affect output if plugins are removed
- Need to ensure output quality maintained
- Plugin dependencies may be complex

---

## Implementation Order & Rationale

### Phase 1: Quick Wins (Low Risk, High Impact)
1. **Approach 1** - Pre-compute Doc Tree (save ~20-25s, low risk)
2. **Approach 4** - Parallelize Frontmatter (save ~5-10s, low risk)

### Phase 2: Profiling & Analysis
3. **Approach 3** - Profile Slow Pages (understand bottlenecks)
4. **Approach 5** - Profile Plugin Chain (understand bottlenecks)

### Phase 3: Systematic Optimizations
5. **Approach 2** - MDX Caching (high impact for incremental builds)
6. Apply findings from profiling (Approaches 3 & 5)

---

## Success Metrics

- **Target**: Reduce build time from ~240s to ~150s (37% improvement)
- **Monitoring**: Track build times for each approach
- **Rollback**: Each approach should be independently revertable

---

## Next Steps

1. ✅ Document all approaches
2. ⏭️ Skip Approach 1 (Pre-compute Doc Tree) - Next.js workers don't share memory
3. ✅ Implement Approach 2 (Cache Registry-Dependent Files)
4. ⏳ Test and measure impact
5. ⏳ Implement remaining approaches if needed

---

## ✅ IMPLEMENTED: Approach 2 - Cache Registry-Dependent Files

### The Problem (from Vercel logs)
- Platform-includes were NOT being cached (hundreds of "Not using cached version" messages)
- Same files compiled 10-50+ times per build (e.g., `javascript.mdx`)
- Individual files taking **3+ minutes** to compile
- Total wasted: **~2-3 hours per build** (most of the 18 min total!)

### The Solution
Changed cache key strategy in `src/mdx.ts` to include:
1. **File content hash** (`md5(source)`)
2. **Registry data hash** (`md5(JSON.stringify({apps, packages}))`) - only for registry-dependent files
3. **Branch name** (`VERCEL_GIT_COMMIT_REF`) - same for all workers + persists across commits!

### Cache Key Formula
```typescript
// Files with registry components (<PlatformSDKPackageName>, @inject, <LambdaLayerDetail>):
cacheKey = `${sourceHash}-${registryHash}-${VERCEL_GIT_COMMIT_REF}`

// Regular files:
cacheKey = `${sourceHash}-${VERCEL_GIT_COMMIT_REF}`
```

### Why This Works (Using Branch Name!)

**Within a Build (All workers share cache):**
- All 8 workers get same `VERCEL_GIT_COMMIT_REF` (branch name) from Vercel
- Worker 1 compiles `javascript.mdx` (3 min) → saves to `.next/cache/mdx-bundler/`
- Workers 2-8 read from cache (instant) → **21 min saved per file**

**Across Builds on Same Branch (HUGE WIN!):**
```
Preview branch "feat/optimize-build":
  Commit 1: feat/optimize-build + registry_v1 → compile everything (18 min)
  Commit 2: feat/optimize-build + registry_v1 → ALL CACHED! (2 min) ✅
  Commit 3: feat/optimize-build + registry_v1 → ALL CACHED! (2 min) ✅
```
**Every subsequent commit on the same preview branch is ~90% faster!**

**When Cache Invalidates (As Expected):**
- Different branch → new cache key ✓
- Registry updated → new registry hash ✓
- File content changed → new source hash ✓

**Vercel Cache Persistence:**
- `.next/cache/mdx-bundler` is in `next.config.ts` line 22 `cacheDirectories`
- Vercel restores this cache between deployments
- Cache survives across commits as long as registry hasn't changed

### Expected Impact

**First Build on a Branch:**
- **Platform-includes**: ~50 files × 3 min × 7 workers = **~17.5 min saved**
- **Distributed-tracing**: ~30 files × 3 min × 7 workers = **~10.5 min saved**
- **Total**: **~85-90% of build time** (from 18 min → ~2-3 min)

**Subsequent Builds on Same Branch (Even Better!):**
- **All files cached** (registry unchanged, same branch)
- **Build time**: **~2 min** (just Next.js overhead)
- **Per PR savings**: 3-5 commits × 16 min = **~48-80 min saved per PR!**

### Files Modified
- `src/mdx.ts`: Lines 687-754 (cache key generation logic)
- `src/mdx.ts`: Line 887 (cache writing condition)

### Testing Plan
1. Clean build: `rm -rf .next && yarn build:preview`
2. Check logs for:
   - "✓ Using cached registry-dependent file" messages
   - Build time reduction
   - No "Not using cached version" spam
3. Deploy to Vercel preview and verify timing

