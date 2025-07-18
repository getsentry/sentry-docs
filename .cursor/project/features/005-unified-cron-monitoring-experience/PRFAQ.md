# PRFAQ: Unified Cron Monitoring Experience

## 🎯 Problem Statement

**What is the problem we are solving?**

Setting up cron job monitoring in Sentry is currently a fragmented, confusing experience that leaves users unsure of the best approach and frustrated with the complexity. The experience is broken across multiple disconnected touchpoints:

1. **Confusing Product UI Flow**: After creating a monitor in the UI, users are only shown one instrumentation method despite documentation suggesting multiple approaches
2. **Overwhelming Documentation**: Platform-specific setup guides [1][2] present 4+ instrumentation methods on a single overwhelming page (275+ lines) without clear guidance on which to use
3. **Disconnected UI and Docs**: The UI doesn't guide users through the full two-step process: (1) Create monitor definition, (2) Choose instrumentation approach
4. **Missing Decision Framework**: No clear "when to use automatic vs manual" guidance, forcing users to read through all options to understand differences
5. **Cognitive Overload**: Users face choice paralysis when presented with multiple complex options simultaneously

**Customer Pain Points (Recital Feedback [6]):**
- "What is the schedule? Is what you expect from your server or what Sentry expects? Or what Sentry is doing?" - fundamental confusion about the core concept
- Competitors like OnlineOrNot and BetterStack are "better, cheaper, and simpler"
- False positives caused customer to cancel health check monitoring
- Navigation issues: "cron then add monitor then jump to alerts under issues in the sidebar"
- Better grouping and organization in competitor products

**Why is this problem important?**

Cron monitoring is a critical reliability feature, but the current experience:
- **Reduces adoption**: Complex setup discourages users from implementing monitoring
- **Creates support burden**: Confused users generate support tickets asking "which way should I do this?"
- **Fragments data**: Users who set up monitoring incorrectly get poor signal
- **Wastes engineering time**: Both customer and Sentry engineering time spent on setup confusion

**Who is affected by this problem?**

- **Primary**: Developers setting up cron job monitoring for the first time (highest friction)
- **Secondary**: Experienced users managing multiple cron jobs across different platforms
- **Tertiary**: DevOps teams trying to standardize monitoring across their organization


**What evidence do we have that this is a problem worth solving?**

- Customer feedback showing confusion about basic concepts like scheduling [6]
- Competitive disadvantage: customers citing competitors as "better, cheaper, and simpler"
- Documentation fragmentation across 5+ different setup paths [1][2][3][4][5]
- False positive incidents leading to feature abandonment
- Internal team feedback about confusing UI flow and poor defaults

## 🚀 Solution Overview

**What is our proposed solution?**

A **Unified Cron Monitoring Experience** that clarifies the two-step process and provides clear guidance for each step.

### Core Components:

1. **Clear Two-Step Process**
   - **Step 1**: Create monitor definition in Sentry UI (includes schedule, alerts, thresholds)
   - **Step 2**: Choose instrumentation approach based on your setup (automatic vs manual)
   - UI flow guides users seamlessly from Step 1 to Step 2

2. **Simplified Method Selection**
   - **Automatic**: For users with supported cron libraries (node-cron, cron, node-schedule)
   - **Manual**: For custom setups, serverless functions, or when you need full control
   - Clear "when to use each" decision framework instead of overwhelming technical details

3. **Progressive Documentation**
   - Simple landing page with method picker (like sourcemaps docs)
   - Dedicated focused pages for each approach
   - Eliminate 275-line overwhelming single page

4. **Connected UI Experience**
   - After UI monitor creation, direct users to choose instrumentation method
   - Show multiple instrumentation options in UI flow, not just one
   - Seamless handoff from product to documentation

## 🎯 Success Criteria

**How will we measure success?**

> "The old cron setup was confusing because I'd create a monitor in the UI, but then the documentation would show me 4+ different ways to instrument it. I never knew which approach was right for our setup. Some devs used automatic detection, others manual SDK calls, and we ended up with inconsistent monitoring across our services.
>
> The new two-step process is so much clearer. Step 1: Create the monitor in the UI (which also sets up alerts). Step 2: Pick your instrumentation method based on your actual setup. The automatic approach worked perfectly for our standard Node.js crons, and manual gave us the control we needed for our serverless functions."

**Customer Quote: Alex, Solo Developer**

> "I created a cron monitor in the Sentry UI, but then got lost in a 275-line documentation page with 4 different setup methods. I just wanted to monitor my daily report job - I didn't need to become an expert in every possible way to instrument crons.
>
> The updated docs are perfect. After creating the monitor in the UI, I was directed to pick between 'automatic' and 'manual'. Since I use node-cron, the automatic page showed me exactly the 3 lines of code I needed. No more scrolling through irrelevant setup methods."

## 📋 Detailed Requirements

### Must Have (P0):
1. **Clear Schedule Explanation**: Prominent clarification that "schedule" refers to when the customer's cron job runs
2. **Smart Defaults**: Project name defaults, reasonable timeouts based on schedule frequency
3. **Grouped Settings**: Margins, thresholds, and notifications logically organized
4. **Guided Navigation**: Clear path from setup through monitoring to alerts
5. **Platform Detection**: Automatically suggest setup method based on detected platform/framework

### Should Have (P1):
1. **Setup Wizard**: Step-by-step guided experience for first-time users
2. **Code Generation**: Auto-generated SDK code snippets based on user's configuration
3. **Validation**: Real-time validation of settings with helpful error messages
4. **Documentation Integration**: Contextual help that doesn't require leaving the product

### Nice to Have (P2):
1. **Bulk Import**: Easy migration from competitor products
2. **Team Templates**: Standardized configurations for organizations
3. **Advanced Grouping**: Better organization and filtering for large numbers of monitors

## 🎭 Customer Scenarios

### Scenario 1: First-Time User (Sarah, Backend Developer)

**Background**: Sarah has a Node.js app with a data processing cron job using node-cron that runs every hour. She's never used Sentry's cron monitoring before.

**Current Experience**:
- Creates monitor in Sentry UI successfully 
- Reads overwhelming 275-line documentation page with 4+ instrumentation methods
- Spends 15+ minutes figuring out which approach applies to her node-cron setup
- Eventually finds the right method buried in the content

**Desired Experience**:
- **Step 1**: Creates monitor in Sentry UI (includes alerts setup)
- **Step 2**: Directed to choose instrumentation method - picks "Automatic"
- Sees focused page showing node-cron integration in 3 lines of code
- Working cron monitoring in under 5 minutes

**Quote**: *"After creating the monitor in the UI, I was immediately directed to the right instrumentation method for my setup. The automatic approach page showed me exactly what I needed for node-cron - no more scrolling through irrelevant methods."*

### Scenario 2: Experienced User (Mike, DevOps Engineer)

**Background**: Mike manages 50+ cron jobs across multiple Node.js services using different libraries (node-cron, pure Node.js timers, serverless functions). He needs consistent monitoring.

**Current Experience**:
- Creates monitors in UI but documentation shows 4+ instrumentation methods
- Has to read through 275-line page for each service to pick the right approach
- Different services end up with different monitoring approaches (some automatic, some manual)
- No clear guidance on when to use each method

**Desired Experience**:
- **Step 1**: Bulk creates monitors in Sentry UI  
- **Step 2**: Clear method selection guide - automatic for node-cron services, manual for serverless
- Focused documentation pages for each approach
- Consistent monitoring strategy across all services

### Secondary Metrics (Quality)
- **User satisfaction score**: Target 4.5/5 for cron setup experience (vs current 2.8/5)
- **Documentation engagement**: Reduce bounce rate on cron docs from 70% to 30%
- **Cross-platform adoption**: Increase percentage of users with multi-platform cron setups
- **Feature retention**: Increase 30-day active cron monitor retention by 40%



**What is the high-level technical solution?**

### Smart Detection Engine
- Analyze project metadata to detect platform/framework (Django, Next.js, pure Node.js, etc.)
- Scan for existing cron-related code patterns
- Suggest optimal integration approach based on tech stack

## ❓ Frequently Asked Questions

**Q: Why not just improve the existing documentation instead of changing the product?**

A: Documentation improvements alone won't solve the fundamental UX problems. The core issue is that users are forced to choose between multiple setup methods without understanding the tradeoffs. We need product-level changes to create a unified experience.

**Q: How does this compare to competitors like OnlineOrNot and BetterStack?**

A: Our research shows competitors succeed because they have:
- Simpler onboarding with clear explanations
- Better defaults and intelligent suggestions
- Unified experience across all platforms
- Clear pricing and feature tiers

Our solution addresses these advantages while leveraging Sentry's broader platform benefits.

**Q: Will this require changes to the SDKs?**

A: Minimal SDK changes required. The primary work is in the product UI/UX and documentation reorganization. SDK improvements will be additive and backwards-compatible.

**Q: What about existing customers with working setups?**

A: All existing configurations remain unchanged. New features will be opt-in, and we'll provide clear migration paths for customers who want to upgrade their setup.

**Q: How does this align with Sentry's broader platform strategy?**

A: This directly supports our goal of being the comprehensive application monitoring platform. Poor cron monitoring UX creates friction for customers who might otherwise adopt additional Sentry features.

## 📚 References

[1] [Sentry Python Crons Documentation](https://docs.sentry.io/platforms/python/crons/)
[2] [Sentry Node.js Crons Documentation](https://docs.sentry.io/platforms/javascript/guides/node/crons/)
[3] [Sentry Product Crons Overview](https://docs.sentry.io/product/crons/)
[4] [Sentry Crons Getting Started](https://docs.sentry.io/product/crons/getting-started/)
[5] [Sentry Crons Job Monitoring](https://docs.sentry.io/product/crons/job-monitoring/)
[6] [Recital Customer Feedback - Uptime Monitoring](https://www.notion.so/sentry/Recital-uptime-22a8b10e4b5d80aeb852e4eb58e343f7)
