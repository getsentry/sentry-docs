# Platform Cron Documentation Improvement Checklist

## 📋 Overview

This checklist guides the application of our proven cron documentation improvements to all Sentry platforms. Based on our successful JavaScript platform cleanup, this ensures consistent, maintainable, and user-friendly cron monitoring documentation across all supported SDKs.

**Reference Implementation:** [JavaScript Platform](https://docs.sentry.io/platforms/javascript/common/crons/)
**Source:** [Sentry Crons Getting Started](https://docs.sentry.io/product/crons/getting-started/)

## 🎯 Platforms to Update

### ✅ Completed Platforms
- [x] **JavaScript/Node.js** - ✅ **Phase 1 Complete**
  - [x] Next.js
  - [x] SvelteKit  
  - [x] Remix
  - [x] NestJS

### 🔄 Pending Platforms

#### High-Priority SDK Platforms
- [ ] **Python** 
  - [ ] Base Python SDK
  - [ ] Celery integration
- [ ] **PHP**
  - [ ] Base PHP SDK  
  - [ ] Laravel integration
- [ ] **Java**
  - [ ] Base Java SDK
  - [ ] Spring Boot integration
- [ ] **Go**
- [ ] **Ruby** 
- [ ] **Elixir**

#### CLI/HTTP Methods
- [ ] **HTTP Implementation**
- [ ] **Sentry CLI**

## 📐 Implementation Template

### File Structure Template
```
docs/platforms/{platform}/common/crons/
├── index.mdx                    # Main cron monitoring overview
├── automatic.mdx               # Auto-instrumentation (if supported)
├── job-monitoring.mdx          # Full context method
├── check-ins.mdx              # Heartbeat style method  
├── heartbeat.mdx              # Simple ping method
├── upserting-monitors.mdx     # Programmatic monitor creation
└── troubleshooting.mdx        # FAQ format
```

### Required Page Changes Per Platform

#### 1. Main Index Page (`index.mdx`)
**Current State Assessment:**
- [ ] Evaluate current content length and complexity
- [ ] Identify repetitive explanations
- [ ] Check for overwhelming decision points

**Required Updates:**
- [ ] Simplify integration path presentation
- [ ] Remove verbose explanations
- [ ] Clear categorization: UI Setup → Automatic → Manual Methods
- [ ] Remove repetitive notes about CLI/HTTP limitations
- [ ] Ensure working platform-specific examples

**Content Structure:**
```markdown
# Cron Monitoring

Brief intro to cron monitoring for {platform}.

## Integration Methods

### UI Setup
[Platform-agnostic description with link to UI setup guide]

### Automatic Integration  
[Platform-specific auto-instrumentation if available]

### Manual Methods
[Link to the four manual approaches]

[Platform-specific getting started example]
```

#### 2. Automatic Integration (`automatic.mdx`)
**Platform Capability Assessment:**
- [ ] **Full Auto-instrumentation:** Platform has popular cron libraries that can be auto-instrumented
- [ ] **Limited Support:** Some libraries supported, link to manual methods for others  
- [ ] **No Support:** Platform doesn't have auto-instrumentation, redirect to manual methods

**Required Updates:**
- [ ] Platform-specific library detection and instrumentation
- [ ] Clear "when to use" guidance
- [ ] Working code examples for supported libraries
- [ ] Links to manual methods for unsupported cases

#### 3. Manual Method Pages
**Apply to All Four Methods:**
- [ ] `job-monitoring.mdx`
- [ ] `check-ins.mdx`  
- [ ] `heartbeat.mdx`
- [ ] `upserting-monitors.mdx`

**Content Reduction Requirements:**
- [ ] **Target Length:** 50-80 lines (down from 200+ lines)
- [ ] **Structure:** Purpose → When to Use → Quick Example → Reference Links
- [ ] **Remove:** Verbose explanations, repeated setup instructions
- [ ] **Keep:** Essential usage patterns, working code examples

**Platform-Specific Code Examples:**
- [ ] Verify all code examples work with current SDK version
- [ ] Use platform-appropriate syntax and conventions
- [ ] Include necessary imports and setup
- [ ] Remove placeholders where possible (use real values)

#### 4. Troubleshooting (`troubleshooting.mdx`)
**Convert from Narrative to FAQ:**
- [ ] **Current Assessment:** Identify verbose troubleshooting content
- [ ] **Target Structure:** 4-6 key FAQ items maximum
- [ ] **Platform-Specific Issues:** Include platform-specific troubleshooting
- [ ] **Support Navigation:** Include "Getting Help" section with links

**FAQ Structure Template:**
```markdown
# Troubleshooting

## Common Issues

### Issue 1: [Platform-specific problem]
**Problem:** [Brief description]
**Solution:** [Actionable fix]

### Issue 2: [Configuration problem]  
**Problem:** [Brief description]
**Solution:** [Actionable fix]

### Issue 3: [Monitoring not working]
**Problem:** [Brief description]  
**Solution:** [Actionable fix]

### Issue 4: [Performance/integration issue]
**Problem:** [Brief description]
**Solution:** [Actionable fix]

## Getting Help
[Links to support, platform-specific documentation, etc.]
```

#### 5. Content Cleanup
**Remove Advanced Configuration Pages:**
- [ ] Assess if platform has "advanced" configuration pages
- [ ] **Decision:** Remove entirely (following JavaScript precedent) 
- [ ] **Reason:** Users feedback indicated these were "overkill"
- [ ] Update all links that referenced advanced pages

**Link Management:**
- [ ] Verify all internal links work after page removal
- [ ] Update sidebar navigation order
- [ ] Fix any broken cross-references
- [ ] Test dev server for 404 errors

## 🔧 Platform-Specific Considerations

### High Auto-Instrumentation Platforms
**Platforms:** Node.js, Python
- [ ] Emphasize automatic integration as preferred method
- [ ] Provide clear library support matrix
- [ ] Include migration guidance from manual to automatic

### Limited Auto-Instrumentation Platforms  
**Platforms:** PHP, Java, others
- [ ] Focus on manual methods as primary approach
- [ ] Include auto-instrumentation for supported libraries where available
- [ ] Clear guidance on when manual methods are needed

### CLI/HTTP Only Platforms
**Platforms:** Generic HTTP, CLI usage
- [ ] Acknowledge SDK feature limitations upfront
- [ ] Focus on the available functionality
- [ ] Clear setup instructions specific to CLI/HTTP approach

## 📊 Quality Assurance Checklist

### Content Quality
- [ ] **Length Target:** 50-80 lines per manual method page
- [ ] **Duplication:** No repeated content across pages
- [ ] **Examples:** All code examples tested and working
- [ ] **Links:** All internal links verified and functional
- [ ] **Style:** Follows established [content strategy](./llms/content-strategy.mdc)

### User Experience  
- [ ] **Clear Path:** Obvious route from problem to solution
- [ ] **Decision Support:** Guidance on which method to choose
- [ ] **Progressive Disclosure:** Advanced topics linked, not inline
- [ ] **Cognitive Load:** Reduced overwhelming options

### Technical Validation
- [ ] **SDK Compatibility:** Examples work with current SDK version
- [ ] **Import Statements:** All necessary imports included
- [ ] **Error Handling:** Basic error handling shown where relevant
- [ ] **Configuration:** Links to detailed configuration docs

### Navigation & Structure
- [ ] **Sidebar Order:** Logical progression through integration methods
- [ ] **Breadcrumbs:** Clear hierarchical navigation
- [ ] **Cross-References:** Helpful links between related methods
- [ ] **Mobile:** Responsive design and readable on mobile devices

## 🚀 Implementation Process

### Phase 1: Platform Assessment (Week 1)
1. **Content Audit**
   - [ ] Document current page lengths and structure
   - [ ] Identify duplicate content across methods
   - [ ] List platform-specific auto-instrumentation capabilities
   - [ ] Note current user pain points or support issues

2. **Platform Capability Matrix**
   - [ ] Auto-instrumentation support level
   - [ ] Available manual methods for platform
   - [ ] SDK version and compatibility requirements
   - [ ] Platform-specific integration patterns

### Phase 2: Content Restructuring (Week 2)
1. **Apply Content Reduction**
   - [ ] Implement essential-first structure on all pages
   - [ ] Remove verbose explanations and duplicate content
   - [ ] Update code examples for platform syntax
   - [ ] Convert troubleshooting to FAQ format

2. **Update Information Architecture**
   - [ ] Clear method categorization
   - [ ] Progressive disclosure implementation
   - [ ] Cross-reference optimization
   - [ ] Navigation flow improvement

### Phase 3: Validation & Testing (Week 3)
1. **Technical Validation**
   - [ ] Test all code examples
   - [ ] Verify link functionality
   - [ ] Check sidebar navigation
   - [ ] Mobile responsiveness check

2. **Content Review**
   - [ ] Style guide compliance
   - [ ] Platform-specific accuracy
   - [ ] User experience flow
   - [ ] Support team review (if applicable)

## 📈 Success Metrics

### Quantitative Measures
- [ ] **Content Length Reduction:** Target 60% reduction in page length
- [ ] **Duplicate Content Elimination:** Zero repeated content across methods
- [ ] **Link Health:** 100% working internal links
- [ ] **Code Example Coverage:** All examples tested and functional

### Qualitative Measures  
- [ ] **User Journey Clarity:** Clear path from problem to solution
- [ ] **Method Selection:** Obvious guidance on which approach to use
- [ ] **Cognitive Load Reduction:** Less overwhelming decision making
- [ ] **Maintenance Efficiency:** Easier to maintain and update

## 🔄 Platform Rollout Schedule

### Immediate Priority (Q1)
1. **Python** - High usage, good auto-instrumentation support
2. **PHP** - High usage, Laravel integration important
3. **Java** - Enterprise focus, Spring Boot integration

### Secondary Priority (Q2)  
4. **Go** - Growing adoption, manual methods focus
5. **Ruby** - Established user base
6. **Elixir** - Smaller but dedicated user base

### Final Priority (Q3)
7. **HTTP Documentation** - Language-agnostic approach
8. **CLI Documentation** - Developer tooling focus

## 📝 PR Template for Each Platform

```markdown
# Unified Cron Monitoring Experience - {Platform} Platform

## Summary
Applies proven documentation improvements from JavaScript platform to {Platform} cron monitoring docs.

## Changes
- ✅ Reduced page length by ~60% (from X to Y lines average)
- ✅ Eliminated duplicate content across methods  
- ✅ Applied essential-first content structure
- ✅ Updated all code examples for {Platform} syntax
- ✅ Converted troubleshooting to FAQ format
- ✅ [Platform-specific improvements]

## Testing
- [x] All code examples tested and working
- [x] Internal links verified
- [x] Sidebar navigation optimized
- [x] Mobile responsiveness confirmed

**Follows:** [Content Strategy Framework](.cursor/rules/llms/content-strategy.mdc)
**Reference:** JavaScript platform implementation
```

## 🤝 Cross-Platform Consistency

### Shared Content Opportunities
- [ ] **UI Setup Instructions:** Can be largely platform-agnostic
- [ ] **Troubleshooting Patterns:** Many issues are cross-platform
- [ ] **Method Selection Guidance:** Decision criteria often similar
- [ ] **Configuration References:** Link to platform-specific config docs

### Platform-Specific Elements
- [ ] **Code Syntax:** Platform-appropriate examples and imports
- [ ] **Library Integrations:** Platform-specific auto-instrumentation
- [ ] **Performance Considerations:** Platform-specific optimization notes
- [ ] **Deployment Notes:** Platform-specific deployment considerations

---

This checklist ensures consistent application of our proven cron documentation improvements across all Sentry platforms while respecting platform-specific needs and capabilities. 