# PRD: JavaScript/Node.js Cron Documentation Improvement

## 🎯 Problem Statement

The current JavaScript/Node.js cron monitoring documentation creates confusion and overwhelms users with multiple setup approaches without clear guidance on which to choose. This directly addresses issues identified in the unified cron monitoring experience PRFAQ.

### Current Pain Points

1. **Overwhelming Content**: The main cron page presents 4+ different integration methods (Automatic, Job Monitoring, Check-ins, Upsert) with no clear prioritization
2. **Missing UI Option**: No mention that users can create monitors via Sentry's UI without any SDK setup
3. **Poor Information Architecture**: All methods dumped on one page instead of guided navigation
4. **Technical Jargon**: Complex explanations using terms like "upsert" and "check-ins" without user-friendly context
5. **No Clear Recommendation**: Users can't easily determine which approach fits their use case

### Evidence
- PRFAQ feedback: "Platform-specific setup guides that seem to ignore the product UI entirely"
- PRFAQ feedback: "Multiple Conflicting Paths: UI setup, SDK configuration, CLI tools, automatic detection - with no clear guidance on which to use"
- Current docs require users to read 200+ lines to understand their options

## 🎯 Success Criteria

### Primary Goals
- **Reduce Cognitive Load**: Users can identify their setup path in under 30 seconds
- **Increase UI Adoption**: More users discover and use UI-based monitor creation
- **Clear Recommendations**: Each integration method has clear "when to use" guidance
- **Better Progressive Disclosure**: Complex details hidden behind expandable sections

### Customer Quotes (Target State)

> "I knew exactly what to do. The docs showed me I could just create the monitor in the UI for my simple Node.js script, and only add SDK code if I wanted advanced features."
> 
> — Sarah, Full-stack Developer

> "Finally! The automatic instrumentation for node-cron was exactly what I needed. The docs made it clear this was the best option for my existing cron setup."
> 
> — Mike, Backend Engineer

## 📋 Detailed Requirements

### Must Have (P0)

1. **Restructured Landing Page**
   - Overview of cron monitoring with clear value proposition
   - "Choose Your Setup Method" section with 3-4 clear options
   - Each option shows: when to use, difficulty level, features supported

2. **UI-First Approach**
   - Prominently feature UI-based monitor creation as the simplest option
   - Include screenshots from the UI creation flow
   - Clear explanation that no code changes required for basic monitoring

3. **Simplified Language**
   - Replace "upsert" with "programmatic setup" 
   - Replace "check-ins" with "status updates" in user-facing content
   - Use "when to use" language instead of technical specifications

4. **Clear Navigation Structure**
   - Landing page with method picker
   - Separate sub-pages for each integration type
   - Consistent page structure across methods

### Should Have (P1)

1. **Progressive Disclosure**
   - Basic examples shown first
   - Advanced options behind expandables
   - Environment-specific details in separate sections

2. **Integration Method Pages**
   - `/crons/ui-setup/` - Pure UI approach
   - `/crons/automatic/` - Framework/library auto-instrumentation
   - `/crons/manual/` - SDK-based manual integration
   - `/crons/advanced/` - Programmatic monitor creation

3. **Contextual Help**
   - Quick decision tree: "Not sure which to choose?"
   - Common use case examples
   - Migration guidance between methods

### Nice to Have (P2)

1. **Interactive Elements**
   - Code snippet generator based on user choices
   - Framework detection suggestions
   - Live examples with copy-paste ready code

## 🏗️ Technical Approach

### Page Structure (Following Sourcemaps Pattern)

```
docs/platforms/javascript/common/crons/
├── index.mdx (landing page with method picker)
├── ui-setup.mdx (new: UI-only approach)
├── automatic.mdx (auto-instrumentation for libraries)
├── manual.mdx (SDK check-ins and monitoring)
├── advanced.mdx (programmatic setup)
└── troubleshooting.mdx (existing)
```

### Content Organization

**Landing Page Flow:**
1. Brief value proposition (30 seconds to understand benefits)
2. "Choose Your Method" with 4 clear options:
   - **UI Setup**: No code changes, basic monitoring
   - **Automatic**: Your app uses node-cron/cron/node-schedule
   - **Manual**: Custom integration with full control
   - **Advanced**: Programmatic monitor creation

3. Quick comparison table showing features vs complexity

**Individual Method Pages:**
- Consistent structure: When to use → Quick start → Examples → Advanced options
- Real-world examples with actual cron schedule patterns
- Screenshots where relevant (especially UI setup)
- Clear next steps and related documentation

### Migration Strategy

1. **Phase 1**: Create new page structure while keeping existing content
2. **Phase 2**: Redirect platform-includes to new structure
3. **Phase 3**: Update all cross-references and links
4. **Phase 4**: Remove deprecated includes

## 🎭 User Scenarios

### Scenario 1: New User (Basic Monitoring)

**Background**: Sarah has a simple Node.js script that runs via cron every hour. She wants basic failure notifications.

**Current Experience**: 
- Reads 200+ lines trying to understand options
- Overwhelmed by technical terms like "check-ins" and "upsert"
- Unclear if she needs to write code or use UI

**Target Experience**:
- Landing page immediately shows "UI Setup" as simplest option
- Clicks through to UI setup guide with screenshots
- Creates monitor in 2 minutes without touching code
- Gets SMS when job fails

### Scenario 2: Existing Library User (Automatic)

**Background**: Mike has 10+ jobs using the `node-cron` library. Wants comprehensive monitoring with minimal changes.

**Current Experience**:
- Has to scroll through automatic instrumentation mixed with manual examples
- Unclear which approach works with his existing setup
- Can't easily see what monitoring features he'll get

**Target Experience**:
- Method picker identifies "Automatic" as best option
- Page specifically for node-cron shows exact code needed
- Clear feature comparison vs other methods
- Working monitoring in 5 minutes

### Scenario 3: Advanced User (Programmatic)

**Background**: DevOps engineer managing 50+ microservices, needs programmatic monitor creation.

**Current Experience**:
- "Upsert" documentation buried in check-ins section
- Advanced configuration options scattered across different sections
- No clear migration path from other approaches

**Target Experience**:
- "Advanced" method clearly labeled for programmatic use cases
- Dedicated page with comprehensive configuration options
- Clear examples for bulk setup and management
- Integration with CI/CD pipeline examples

## 📊 Success Metrics

### Quantitative
- **Page Bounce Rate**: Reduce from 70% to <40% (align with PRFAQ goals)
- **Time to Value**: Users complete setup in <5 minutes (vs current 20-30 minutes)
- **UI Monitor Creation**: 50% increase in monitors created via UI
- **Documentation Engagement**: 60% increase in users visiting multiple cron doc pages

### Qualitative
- **User Feedback**: Positive sentiment on method selection clarity
- **Support Tickets**: Reduction in "which approach should I use?" questions
- **Developer Experience**: Faster onboarding for new team members

## 🚫 Out of Scope

- Changes to the Sentry UI for monitor creation
- New SDK features or API endpoints
- Updates to other platform documentation (Python, PHP, etc.)
- Integration with external cron management tools

## 📋 Dependencies

- Access to current UI screenshot assets for monitor creation flow
- Review of existing platform-includes structure and dependencies
- Coordination with technical writing team for content quality
- SEO considerations for URL structure changes

## 🔄 Future Iterations

- Interactive setup wizard based on user selections
- Framework-specific quick start guides (Next.js, Express, etc.)
- Video tutorials for complex setup scenarios
- Integration with Sentry's planned unified cron experience 