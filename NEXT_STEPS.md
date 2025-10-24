# Next Steps: Performance Investigation

## ✅ What We Just Did

Added comprehensive performance instrumentation to measure build times WITHOUT changing any logic.

## 📊 Files Modified

1. **`src/mdx.ts`** - Added timing for frontmatter parsing and MDX compilation
2. **`src/docTree.ts`** - Added timing for document tree building  
3. **`app/[[...path]]/page.tsx`** - Added timing for page generation
4. **`BUILD_PERFORMANCE_HYPOTHESIS.md`** - Documents our hypothesis
5. **`PERFORMANCE_MEASUREMENT_GUIDE.md`** - How to run and analyze

## 🎯 Our Hypothesis

**The frontmatter cache isn't working during Next.js builds**, causing thousands of files to be parsed repeatedly.

**Expected impact if true**: 20-25 minute savings (from 30min to 5-10min)

## 🧪 How to Test

### Quick Test (5-10 minutes locally):
```bash
# Clean build
rm -rf .next

# Run instrumented build
CI=true yarn build 2>&1 | tee build-performance.log

# Quick check - how many times did we parse frontmatter?
grep -c "getDocsFrontMatterUncached started" build-performance.log
```

**What we expect to see:**
- ❌ **Bad (confirms hypothesis)**: Number is > 10 (could be 100s or 1000s)
- ✅ **Good (rejects hypothesis)**: Number is 1-2

### Full Analysis:
```bash
# Follow commands in PERFORMANCE_MEASUREMENT_GUIDE.md
# to create a detailed performance summary
```

## 📈 Decision Tree

```
Run instrumented build
    ↓
Check: How many times was frontmatter parsed?
    ↓
    ├─ > 10 times → HYPOTHESIS CONFIRMED
    │   ↓
    │   Implement disk-based frontmatter cache
    │   ↓
    │   Expected: 20-25 min savings
    │   ↓
    │   Measure again
    │
    └─ 1-2 times → HYPOTHESIS REJECTED
        ↓
        Analyze where time IS being spent
        ↓
        - MDX compilation slow?
        - Next.js internals?
        - Network/IO?
        ↓
        Profile further & implement different fixes
```

## 💡 If Hypothesis is Confirmed

We already have the fix ready! It's the same disk-based caching pattern you use for MDX compilation, just applied to frontmatter.

The fix involves:
1. Cache frontmatter to `.next/cache/frontmatter/`
2. Use MD5 hash of file list as cache key
3. Brotli compress the JSON
4. Cache persists across builds (Vercel already caches `.next/cache/`)

**Changes needed**: ~50 lines in `src/mdx.ts`

## 📝 What the Logs Tell Us

### Example log output:
```
[PERF:page] generateStaticParams started
[PERF:frontmatter] getDocsFrontMatter called (call #1, cached: false)
[PERF:frontmatter] getDocsFrontMatterUncached started
[PERF:frontmatter] getDocsFrontMatterUncached completed: 8542ms (2,487 entries)
[PERF:page] generateStaticParams completed: 8723ms (2,488 paths)

[PERF:tree] getDocsRootNode called (call #1, cached: false)
[PERF:tree] getDocsRootNodeUncached started
[PERF:frontmatter] getDocsFrontMatter called (call #2, cached: true)  ← Good!
[PERF:tree] getDocsRootNodeUncached completed: 56ms

[PERF:mdx] getFileBySlug started (call #1): docs/platforms/javascript/index
[PERF:mdx] bundleMDX starting for docs/platforms/javascript/index (cache miss)
[PERF:mdx] bundleMDX completed: 145ms for docs/platforms/javascript/index
[PERF:mdx] getFileBySlug completed: 156ms (docs/platforms/javascript/index)

[PERF:page] Page render started (100): platforms/javascript/guides/react
[PERF:tree] getDocsRootNode called (call #100, cached: true)  ← Good!
[PERF:frontmatter] getDocsFrontMatter called (call #200, cached: true)  ← Wait, why so many?
[PERF:page] Page render completed: 234ms (platforms/javascript/guides/react)
```

### What to look for:
- **"cached: false"** appearing many times → Cache not persisting
- **High call counts** for getDocsFrontMatter → Called too many times
- **Long durations** for getDocsFrontMatterUncached → Slow parsing
- **"cached: true"** mostly → Cache IS working (hypothesis wrong!)

## 🚀 Recommended Action Plan

1. **Today**: Run instrumented build locally or on Vercel
2. **Review logs**: Check call counts and timing
3. **If confirmed**: Implement disk-based cache (we have code ready)
4. **If rejected**: Dig deeper into what's actually slow
5. **Measure again**: Validate the fix worked
6. **Profile next bottleneck**: There may be more optimizations

## 📞 Questions to Answer

After running the instrumented build:

1. How many times is `getDocsFrontMatter` called?
2. How many times is it actually parsed (uncached)?
3. What's the duration of each parsing?
4. What's the total time in frontmatter operations?
5. What percentage of build time is frontmatter?

## 🎬 Ready to Start

```bash
# Go!
CI=true yarn build 2>&1 | tee build-performance.log

# When done, share the output of:
grep "\[PERF:" build-performance.log | head -100
```

This will give us enough data to validate or reject the hypothesis and decide on next steps.

