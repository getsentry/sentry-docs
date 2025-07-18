# Implementation: JavaScript/Node.js Cron Documentation Restructure

## 🎯 Overview

This implementation restructures the JavaScript/Node.js cron monitoring documentation to follow the sourcemaps pattern: a clear landing page with method selection, leading to dedicated pages for each integration approach.

## 📁 File Structure Changes

### Current Structure
```
docs/platforms/javascript/common/crons/
├── index.mdx (275 lines, overwhelming)
└── troubleshooting.mdx

platform-includes/crons/setup/
└── javascript.node.mdx (includes 4 different approaches)

includes/
├── javascript-crons-automatic-crons-instrumentation.mdx
├── javascript-crons-job-monitoring.mdx
├── javascript-crons-checkins.mdx
└── javascript-crons-upsert.mdx
```

### New Structure
```
docs/platforms/javascript/common/crons/
├── index.mdx (new: method picker landing page)
├── ui-setup.mdx (new: pure UI approach)
├── automatic.mdx (automatic instrumentation)
├── manual.mdx (SDK integration)
├── advanced.mdx (programmatic setup)
└── troubleshooting.mdx (existing, minimal changes)
```

## 🔄 Implementation Phases

### Phase 1: Create New Page Structure

#### 1.1 New Landing Page (`index.mdx`)
```mdx
---
title: Set Up Crons
sidebar_title: Crons
description: "Monitor your scheduled jobs with Sentry - choose the setup method that works best for you."
sidebar_order: 5750
supported: [javascript.node, ...]
---

Monitor the uptime and performance of your scheduled jobs in Node.js. Get alerts when jobs fail, timeout, or don't run as expected.

## Choose Your Setup Method

Select the approach that best fits your needs:

<Grid>
  <GridItem title="UI Setup" badge="Easiest" href="ui-setup">
    Create monitors in Sentry's web interface. No code changes required.
    **Best for:** Simple scripts, getting started quickly
  </GridItem>
  
  <GridItem title="Automatic" badge="Recommended" href="automatic">
    Auto-instrument existing cron libraries with minimal code changes.
    **Best for:** Apps using node-cron, cron, or node-schedule
  </GridItem>
  
  <GridItem title="Manual Integration" href="manual">
    Full SDK integration with custom status updates and error handling.
    **Best for:** Custom cron logic, maximum control
  </GridItem>
  
  <GridItem title="Advanced Setup" href="advanced">
    Programmatically create and manage monitors via code.
    **Best for:** CI/CD pipelines, managing many monitors
  </GridItem>
</Grid>

## Feature Comparison

| Feature | UI Setup | Automatic | Manual | Advanced |
|---------|----------|-----------|---------|----------|
| Setup Time | 2 minutes | 5 minutes | 10 minutes | 15 minutes |
| Code Changes | None | Minimal | Moderate | Custom |
| Error Tracking | Basic | Full | Full | Full |
| Custom Config | Limited | Limited | Full | Full |
| Bulk Management | No | No | No | Yes |

## Not Sure Which to Choose?

- **Just want notifications?** → [UI Setup](ui-setup)
- **Using node-cron or similar?** → [Automatic](automatic)
- **Need custom error handling?** → [Manual Integration](manual)
- **Managing 10+ monitors?** → [Advanced Setup](advanced)
```

#### 1.2 UI Setup Page (`ui-setup.mdx`)
```mdx
---
title: UI Setup
description: "Create cron monitors in Sentry's interface without any code changes."
---

Create cron monitors through Sentry's web interface with no code changes required. This approach provides basic monitoring - you'll get alerts when your jobs don't run as expected.

## When to Use UI Setup

✅ **Perfect for:**
- Simple Node.js scripts run by system cron
- Getting started with cron monitoring
- Jobs where you just need failure notifications
- Prototyping before adding SDK integration

❌ **Not ideal for:**
- Jobs that need custom error reporting
- Complex scheduling requirements
- Applications that need runtime error tracking

## Quick Start

### Step 1: Create Monitor in Sentry

1. Go to **Alerts** → **Create Alert** → **Cron Monitor**
2. Fill in your monitor details:
   - **Name**: Give your job a descriptive name
   - **Schedule**: When your cron job runs (e.g., `0 2 * * *` for daily at 2 AM)
   - **Timezone**: Your server's timezone

[Screenshot: Monitor creation form]

### Step 2: Configure Your Cron Job

Add a simple HTTP call to your existing script:

```bash
#!/bin/bash

# Your existing cron job logic
node /path/to/your/script.js

# Notify Sentry the job completed (replace with your actual values)
curl "https://___ORG_INGEST_DOMAIN___/api/___PROJECT_ID___/cron/your-monitor-slug/___PUBLIC_KEY___/?status=ok"
```

Or in Node.js:
```javascript
// At the end of your script
fetch('https://___ORG_INGEST_DOMAIN___/api/___PROJECT_ID___/cron/your-monitor-slug/___PUBLIC_KEY___/?status=ok')
  .catch(err => console.log('Sentry notification failed:', err));
```

### Step 3: Test Your Setup

Run your script manually to verify the check-in appears in Sentry.

## Next Steps

- **Need error tracking?** Consider [Manual Integration](manual)
- **Using a cron library?** Try [Automatic](automatic) instead
- **Want to track runtime?** Use [Manual Integration](manual) with start/end status updates

## Troubleshooting

<Expandable title="My check-ins aren't appearing">
  Verify your monitor slug and project ID are correct. Check the Sentry monitor page for the exact URL.
</Expandable>

<Expandable title="Getting 404 errors">
  Make sure you're using the correct ingest domain and have created the monitor in Sentry first.
</Expandable>
```

#### 1.3 Automatic Integration Page (`automatic.mdx`)
```mdx
---
title: Automatic Instrumentation
description: "Auto-instrument your existing cron libraries with minimal code changes."
---

Automatically monitor your existing cron jobs with minimal code changes. Sentry can instrument popular Node.js cron libraries to send status updates automatically.

## When to Use Automatic Instrumentation

✅ **Perfect for:**
- Apps using `node-cron`, `cron`, or `node-schedule`
- Existing cron setups you don't want to modify heavily
- Teams wanting comprehensive monitoring with minimal effort

❌ **Consider Manual Integration if:**
- Using custom cron logic or other libraries
- Need fine-grained control over what gets monitored
- Want to customize error handling

## Quick Start

### Step 1: Install and Configure Sentry

[Include standard Sentry setup]

### Step 2: Instrument Your Cron Library

<Tabs>
<Tab title="node-cron">

Replace your `node-cron` import:

```javascript
// Before
import cron from "node-cron";

// After  
import cron from "node-cron";
const cronWithCheckIn = Sentry.cron.instrumentNodeCron(cron);

cronWithCheckIn.schedule(
  "0 */2 * * *", // Every 2 hours
  () => {
    console.log("Processing data...");
    // Your job logic here
  },
  { 
    name: "data-processor", // This becomes your monitor name
    timezone: "America/Los_Angeles" 
  }
);
```

</Tab>
<Tab title="cron">

Instrument the `CronJob` constructor:

```javascript
import { CronJob } from "cron";

const CronJobWithCheckIn = Sentry.cron.instrumentCron(CronJob, "daily-report");

const job = new CronJobWithCheckIn("0 9 * * *", () => {
  console.log("Generating daily report...");
  // Your job logic here
});

job.start();
```

</Tab>
<Tab title="node-schedule">

Instrument the schedule export:

```javascript
import * as schedule from "node-schedule";

const scheduleWithCheckIn = Sentry.cron.instrumentNodeSchedule(schedule);

scheduleWithCheckIn.scheduleJob(
  "backup-job",
  "0 3 * * *", // Daily at 3 AM
  () => {
    console.log("Running backup...");
    // Your job logic here
  }
);
```

</Tab>
</Tabs>

### Step 3: Verify Setup

Your monitors will be automatically created in Sentry when the jobs first run. Check the **Alerts** → **Cron Monitors** section.

## Features You Get

- ✅ **Automatic monitor creation** - No need to create monitors in UI first
- ✅ **Status tracking** - Start, success, and failure states
- ✅ **Runtime monitoring** - Track how long jobs take
- ✅ **Error integration** - Exceptions during jobs are captured
- ✅ **Smart defaults** - Reasonable timeouts and margins

## Advanced Configuration

<Expandable title="Custom Monitor Settings">

Override default settings for specific jobs:

```javascript
cronWithCheckIn.schedule(
  "0 */6 * * *",
  () => { /* job logic */ },
  { 
    name: "heavy-job",
    timezone: "UTC",
    // Advanced Sentry config
    sentryMonitorConfig: {
      checkinMargin: 10, // 10 minute grace period
      maxRuntime: 30,    // 30 minute timeout
      failureIssueThreshold: 2, // Alert after 2 failures
    }
  }
);
```

</Expandable>

## Migration from Other Methods

<Expandable title="From UI Setup">

If you're currently using UI setup:
1. Remove manual HTTP calls from your scripts
2. Add automatic instrumentation as shown above
3. The existing monitors will be updated automatically

</Expandable>

## Next Steps

- **Need custom error handling?** See [Manual Integration](manual)
- **Managing many services?** Consider [Advanced Setup](advanced)
- **Having issues?** Check [Troubleshooting](troubleshooting)
```

### Phase 2: Update Existing Files

#### 2.1 Update `platform-includes/crons/setup/javascript.node.mdx`
Replace content with simple redirect to new structure:

```mdx
<Alert>
This documentation has moved to provide a better experience. 

Choose your setup method:
- **[UI Setup](/platforms/javascript/guides/node/crons/ui-setup/)** - No code changes
- **[Automatic](/platforms/javascript/guides/node/crons/automatic/)** - Auto-instrument existing libraries  
- **[Manual Integration](/platforms/javascript/guides/node/crons/manual/)** - Full SDK control
- **[Advanced Setup](/platforms/javascript/guides/node/crons/advanced/)** - Programmatic management
</Alert>
```

#### 2.2 Create Manual Integration Page (`manual.mdx`)
Content from existing check-ins and job monitoring includes, reorganized with clear structure.

#### 2.3 Create Advanced Setup Page (`advanced.mdx`)  
Content from existing upsert include, with better examples and use cases.

### Phase 3: Update Cross-References

#### 3.1 Update Links in Other Documentation
- Update references in product docs (`docs/product/crons/`)
- Update platform guide cross-references
- Update getting started guides

#### 3.2 SEO and URL Redirects
- Implement redirects for old deep-link URLs
- Update sitemap and internal linking
- Preserve existing URL structure where possible

## 🔧 Technical Implementation Details

### Grid Component Usage
Following the sourcemaps pattern, use existing Grid components:

```mdx
<Grid>
  <GridItem title="Method Name" badge="Optional Badge" href="relative-path">
    Description text
    **Best for:** specific use cases
  </GridItem>
</Grid>
```

### Consistent Page Structure
Each method page follows this template:

1. **When to Use** section (✅/❌ format)
2. **Quick Start** with numbered steps
3. **Code Examples** in expandable tabs
4. **Features You Get** bulleted list
5. **Advanced Configuration** in expandables
6. **Migration** guidance in expandables
7. **Next Steps** with clear links

### Screenshots and Assets
Required visual assets:
- Monitor creation form (from UI screenshots provided)
- Monitor list view showing different types
- Check-in timeline view
- Alert configuration screen

### MDX Components to Use
- `<Tabs>` and `<Tab>` for code examples
- `<Expandable>` for advanced options
- `<Alert>` for important notes
- `<Grid>` and `<GridItem>` for method selection
- Standard code highlighting for JavaScript/TypeScript

## 📋 Implementation Checklist

### Phase 1: New Structure (Week 1)
- [ ] Create new `index.mdx` with method picker
- [ ] Create `ui-setup.mdx` with UI-first approach
- [ ] Create `automatic.mdx` with library instrumentation
- [ ] Create `manual.mdx` with SDK integration
- [ ] Create `advanced.mdx` with programmatic setup
- [ ] Test all pages render correctly

### Phase 2: Content Migration (Week 2) 
- [ ] Update platform-includes to redirect to new structure
- [ ] Migrate content from existing includes to new pages
- [ ] Update internal links and cross-references
- [ ] Add screenshots and visual assets
- [ ] Test all code examples

### Phase 3: Integration (Week 3)
- [ ] Update all cross-references from other documentation
- [ ] Implement URL redirects for old links  
- [ ] Update navigation and sidebar structure
- [ ] SEO review and sitemap updates
- [ ] Final testing across all supported platforms

### Phase 4: Validation (Week 4)
- [ ] Content review with technical writing team
- [ ] User testing with sample scenarios
- [ ] Accessibility and mobile responsiveness check
- [ ] Analytics setup for success metrics tracking
- [ ] Go-live and monitoring

## 🚨 Risk Mitigation

### Broken Links
- Implement comprehensive redirect mapping
- Use automated link checking in CI/CD
- Monitor 404 errors after deployment

### Content Consistency  
- Use shared includes for common concepts
- Standardize code example formatting
- Regular content audits across method pages

### User Confusion During Transition
- Show clear migration paths between old and new approaches
- Use prominent alerts during transition period
- Monitor user feedback and support tickets

## 📊 Success Measurement

### Analytics to Track
- Page bounce rates (target <40%)
- Time spent on documentation pages
- Conversion from docs to monitor creation
- User paths through method selection

### User Feedback Collection
- Add feedback widgets to new pages
- Monitor support ticket themes
- Track community forum discussions
- Developer experience surveys

### Technical Metrics
- Page load performance
- Mobile usability scores
- Search engine rankings for cron-related queries
- Cross-browser compatibility

## 🔮 Future Enhancements

### Phase 2 Features (3-6 months)
- Interactive setup wizard with framework detection
- Live code snippet generation based on user selections
- Video tutorials for complex setup scenarios
- Integration examples for popular frameworks (Express, Next.js)

### Integration Opportunities
- Link to Sentry's unified cron experience when available
- Connect with Sentry's CLI documentation improvements
- Integrate with error tracking setup guides 