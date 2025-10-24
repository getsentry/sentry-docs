# Build Performance Hypothesis & Measurement Plan

## 📊 Current State
- **Build time**: ~30 minutes on Vercel
- **Total pages**: ~2,500+ static pages  
- **Content**: ~162,901 lines of MDX across thousands of files

## 🎯 Hypothesis: Where Time is Being Spent

### Primary Hypothesis (High Confidence)
**Frontmatter parsing is happening repeatedly for every page**

**Why we think this:**
1. Module-level cache (`getDocsFrontMatterCache`) may not persist across:
   - Next.js worker processes during static generation
   - Between `generateStaticParams()` and page component rendering
   - Between `generateMetadata()` calls

2. Each call to `getDocsFrontMatter()` without cache:
   - Recursively scans `docs/` directory (~2,500+ files)
   - Reads each file from disk
   - Parses frontmatter with `gray-matter`
   - Processes `common/` folders, versions, configs
   - Processes API categories

3. Number of potential calls per build:
   ```
   generateStaticParams: 1x getDocsFrontMatter()
   For each of ~2,500 pages:
     - Page component: 1x getDocsRootNode() → getDocsFrontMatter()
     - generateMetadata: 1x getDocsRootNode() → getDocsFrontMatter()
   
   Worst case: 1 + (2,500 × 2) = ~5,001 calls
   Best case (if cache works): 1 call
   ```

4. **Expected savings if fixed**: 20-25 minutes

### Secondary Hypothesis (Medium Confidence)
**MDX compilation is slow even with cache**

**Why we think this:**
1. Even with disk cache, each page needs:
   - Cache key generation (MD5 of source)
   - File I/O to check cache
   - Decompression of cached bundle
   - MDX component creation

2. Some files skip cache (contain `@inject`, `<PlatformSDKPackageName>`, etc.)

3. **Expected savings if optimized**: 2-5 minutes

### Tertiary Hypothesis (Lower Confidence)
**DocTree building is redundant**

**Why we think this:**
1. `frontmatterToTree()` is called for every page that needs `getDocsRootNode()`
2. Tree building involves sorting and nested iteration
3. Could be pre-built and served as static JSON

4. **Expected savings if optimized**: 1-2 minutes

## 🧪 Measurement Plan

### What We'll Measure

1. **Frontmatter Cache Effectiveness**
   - How many times `getDocsFrontMatter()` is called
   - How many times `getDocsFrontMatterUncached()` is actually executed
   - Time spent in `getDocsFrontMatterUncached()`
   - Cache hit/miss rate

2. **MDX Compilation Performance**
   - Time per file compilation
   - Cache hit rate for MDX bundling
   - Time in cache I/O vs actual compilation

3. **Page Generation Timing**
   - Time in `generateStaticParams()`
   - Average time per page render
   - Time in `generateMetadata()`
   - Time building doc tree

### Where We'll Add Timing Logs

#### In `src/mdx.ts`:
- `getDocsFrontMatter()` - entry point, count calls
- `getDocsFrontMatterUncached()` - actual work, measure duration
- `getAllFilesFrontMatter()` - file processing
- `getFileBySlug()` - MDX compilation entry
- `bundleMDX()` - actual compilation time
- Cache read/write operations

#### In `src/docTree.ts`:
- `getDocsRootNode()` - count calls
- `getDocsRootNodeUncached()` - measure tree building time
- `frontmatterToTree()` - measure tree construction

#### In `app/[[...path]]/page.tsx`:
- `generateStaticParams()` - measure total time
- `Page()` - measure per-page render time
- `generateMetadata()` - measure metadata generation time

## 📈 Success Metrics

### What confirms our hypothesis:
1. **Frontmatter called repeatedly**: 
   - See `getDocsFrontMatterUncached()` called > 10 times
   - See high total time in frontmatter parsing (> 10 minutes)

2. **Cache not working**:
   - Cache hit rate < 50%
   - See duplicate calls from same page

3. **MDX compilation is slow**:
   - Average compilation time > 100ms per file
   - Total MDX time > 10 minutes

### What would disprove our hypothesis:
1. `getDocsFrontMatterUncached()` only called 1-2 times
2. Cache hit rate > 90%
3. Most time is in Next.js internals (not our code)

## 🔄 Next Steps

1. **Add timing instrumentation** (this document)
2. **Run instrumented build** on Vercel or locally with `CI=true`
3. **Analyze timing logs** to validate/reject hypothesis
4. **Implement fixes** for confirmed bottlenecks
5. **Measure improvements** with same instrumentation

## 📝 Log Format

We'll use this format for easy parsing:
```
[PERF:category] operation_name: Xms (metadata)
```

Examples:
```
[PERF:frontmatter] getDocsFrontMatter called (call #1)
[PERF:frontmatter] getDocsFrontMatterUncached started
[PERF:frontmatter] getDocsFrontMatterUncached completed: 8542ms (2,487 files)
[PERF:tree] getDocsRootNode called (call #12)
[PERF:mdx] getFileBySlug started: docs/platforms/javascript/index
[PERF:mdx] bundleMDX completed: 145ms (cache miss)
[PERF:page] Page render completed: 234ms (platforms/javascript)
```

This will allow us to:
- Filter logs by category (`grep "PERF:frontmatter"`)
- Calculate total time per category
- Count calls
- Identify slowest operations

## 🎯 Expected Outcome

After measurement, we expect to see:
1. **Confirmed**: Frontmatter parsing happening 100s or 1000s of times
2. **Confirmed**: Each call taking 5-15 seconds
3. **Total frontmatter time**: 10-20 minutes (the majority of build time)
4. **MDX compilation time**: 5-10 minutes
5. **Next.js overhead**: 5-10 minutes

**If confirmed**, implementing disk-based frontmatter cache should reduce build time by **20-25 minutes** (from ~30min to ~5-10min).

