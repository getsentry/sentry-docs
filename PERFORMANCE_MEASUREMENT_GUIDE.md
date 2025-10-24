# Performance Measurement Guide

## What We Added

We've instrumented the codebase with performance timing logs WITHOUT changing any logic. This will help us validate our hypothesis about where build time is being spent.

## Instrumented Areas

### 1. Frontmatter Parsing (`src/mdx.ts`)
- **`getDocsFrontMatter()`** - Tracks every call and whether cache was used
- **`getDocsFrontMatterUncached()`** - Measures actual parsing time
- **`getDevDocsFrontMatter()`** - Same for developer docs
- **Call counter** - Shows how many times frontmatter is parsed

### 2. MDX Compilation (`src/mdx.ts`)
- **`getFileBySlug()`** - Tracks entry/exit time per file
- **`bundleMDX()`** - Measures MDX compilation time
- **Call counter** - Shows how many files are compiled

### 3. Document Tree Building (`src/docTree.ts`)
- **`getDocsRootNode()`** - Tracks every call and cache usage
- **`getDocsRootNodeUncached()`** - Measures tree building time
- **`frontmatterToTree()`** - Isolated tree construction timing

### 4. Page Generation (`app/[[...path]]/page.tsx`)
- **`generateStaticParams()`** - Total time to generate all paths
- **`Page()` component** - Sampled timing (every 100th page) to avoid log spam

## Log Format

All logs follow this pattern for easy parsing:
```
[PERF:category] operation: Xms (metadata)
```

**Categories:**
- `frontmatter` - Frontmatter parsing operations
- `mdx` - MDX compilation operations
- `tree` - Document tree operations
- `page` - Page generation operations

## How to Run Instrumented Build

### Option 1: Local Build (Recommended for Testing)
```bash
# Clean previous build
rm -rf .next

# Run build with CI flag (enables caching)
CI=true yarn build 2>&1 | tee build-performance.log

# The logs will be in build-performance.log
```

### Option 2: Vercel Build
1. Push changes to a branch
2. Let Vercel build automatically
3. Download build logs from Vercel dashboard
4. Analyze logs locally

## Analyzing the Results

### Quick Analysis Commands

```bash
# Count frontmatter calls
grep "\[PERF:frontmatter\] getDocsFrontMatter called" build-performance.log | wc -l

# Count times frontmatter was actually parsed (uncached)
grep "\[PERF:frontmatter\] getDocsFrontMatterUncached started" build-performance.log | wc -l

# See frontmatter parsing times
grep "\[PERF:frontmatter\] getDocsFrontMatterUncached completed" build-performance.log

# Count doc tree calls
grep "\[PERF:tree\] getDocsRootNode called" build-performance.log | wc -l

# Count MDX compilations
grep "\[PERF:mdx\] getFileBySlug started" build-performance.log | wc -l

# See total time in generateStaticParams
grep "\[PERF:page\] generateStaticParams" build-performance.log

# Sample page render times
grep "\[PERF:page\] Page render completed" build-performance.log
```

### What We're Looking For

#### ✅ Hypothesis CONFIRMED if we see:

1. **High frontmatter call count**
   ```bash
   # If this number is > 100:
   grep "getDocsFrontMatter called" build-performance.log | wc -l
   ```
   Expected: 1-2 calls
   Problem: 100s or 1000s of calls

2. **Cache not working**
   ```bash
   # Compare these two numbers:
   grep "getDocsFrontMatter called" build-performance.log | wc -l
   grep "getDocsFrontMatterUncached started" build-performance.log | wc -l
   ```
   If they're close (within 10%), cache isn't working

3. **Frontmatter parsing is slow**
   ```bash
   # Check the duration (should be in output):
   grep "getDocsFrontMatterUncached completed" build-performance.log
   ```
   Expected: 5-15 seconds per call
   If called 100 times: 500-1500 seconds = 8-25 minutes!

4. **Tree building is fast (not the bottleneck)**
   ```bash
   grep "tree building:" build-performance.log
   ```
   Expected: < 100ms per call

#### ❌ Hypothesis REJECTED if we see:

1. Only 1-2 calls to `getDocsFrontMatter`
2. Cache hit rate > 90%
3. Total frontmatter time < 1 minute
4. Most time is elsewhere

### Create a Summary Report

```bash
# Create a performance summary
cat > performance-summary.txt << 'EOF'
# Performance Analysis Summary

## Call Counts
EOF

echo "Frontmatter calls: $(grep -c "getDocsFrontMatter called" build-performance.log)" >> performance-summary.txt
echo "Frontmatter uncached calls: $(grep -c "getDocsFrontMatterUncached started" build-performance.log)" >> performance-summary.txt
echo "Doc tree calls: $(grep -c "getDocsRootNode called" build-performance.log)" >> performance-summary.txt
echo "MDX compilations: $(grep -c "getFileBySlug started" build-performance.log)" >> performance-summary.txt

echo -e "\n## Timing Samples" >> performance-summary.txt
echo -e "\nFrontmatter parsing:" >> performance-summary.txt
grep "getDocsFrontMatterUncached completed" build-performance.log >> performance-summary.txt
echo -e "\nDoc tree building:" >> performance-summary.txt
grep "getDocsRootNodeUncached completed" build-performance.log >> performance-summary.txt
echo -e "\ngenerateStaticParams:" >> performance-summary.txt
grep "generateStaticParams completed" build-performance.log >> performance-summary.txt
echo -e "\nSample page renders (every 100th):" >> performance-summary.txt
grep "Page render completed" build-performance.log | head -5 >> performance-summary.txt

cat performance-summary.txt
```

## Expected Results (Based on Hypothesis)

### If Hypothesis is Correct:

```
# Performance Analysis Summary

## Call Counts
Frontmatter calls: 2501
Frontmatter uncached calls: 2501  ← PROBLEM! Should be 1-2
Doc tree calls: 2501
MDX compilations: 2487

## Timing Samples

Frontmatter parsing:
[PERF:frontmatter] getDocsFrontMatterUncached completed: 8542ms (2,487 entries)
[PERF:frontmatter] getDocsFrontMatterUncached completed: 8421ms (2,487 entries)
[... repeated 2500+ times ...]

Doc tree building:
[PERF:tree] getDocsRootNodeUncached completed: 8650ms (tree building: 108ms, 2,487 entries)

generateStaticParams:
[PERF:page] generateStaticParams completed: 8723ms (2,488 paths)

Total frontmatter time: 2501 × 8.5s = ~21,258 seconds = ~6 hours
(But likely parallelized across workers, so actual time ~20-30 minutes)
```

**Conclusion**: Frontmatter is being parsed repeatedly instead of cached!

### If Hypothesis is Wrong:

```
# Performance Analysis Summary

## Call Counts
Frontmatter calls: 2501
Frontmatter uncached calls: 1  ← GOOD! Cache is working
Doc tree calls: 2501
MDX compilations: 2487

## Timing Samples

Frontmatter parsing:
[PERF:frontmatter] getDocsFrontMatterUncached completed: 8542ms (2,487 entries)  ← Only once!

Doc tree building:
[PERF:tree] getDocsRootNodeUncached completed: 8650ms (tree building: 108ms, 2,487 entries)

Total frontmatter time: 8.5 seconds
```

**Conclusion**: Frontmatter cache is working. Look elsewhere for bottleneck.

## What To Do With Results

### If Hypothesis Confirmed (Cache Not Working)

1. **Implement disk-based cache** (we have the code ready)
   - Expected savings: 20-25 minutes
   - Risk: Low (same pattern as existing MDX cache)

2. **Measure again** with cache implemented
3. **Profile for next bottleneck**

### If Hypothesis Rejected

1. **Analyze where time IS being spent**
   - Check MDX compilation times
   - Check if it's Next.js internals
   - Look at memory usage

2. **Profile with more detailed instrumentation**
3. **Consider different optimization strategies**

## Notes

- Page render logging is **sampled** (every 100th page) to avoid 2500+ log lines
- All timing uses `Date.now()` so resolution is 1ms
- Logs go to stdout/stderr (captured in Next.js build logs)
- Module-level counters reset between worker processes (expected)

## Cleanup After Measurement

Once we have the data and implement fixes, we can:
1. Keep logs if they're useful for monitoring
2. Remove them if they're too noisy
3. Put them behind an env var like `DEBUG_PERF=true`

For now, they should stay active to validate our fixes.

