import {type FlueContext} from '@flue/runtime';
import {local} from '@flue/runtime/node';
import * as v from 'valibot';

export const triggers = {};

export default async function ({init, payload, env}: FlueContext) {
  const dryRun = env.DRY_RUN !== 'false';

  const harness = await init({
    model: 'anthropic/claude-sonnet-4-6',
    sandbox: local({
      env: {
        GH_TOKEN: env.GH_TOKEN,
      },
    }),
  });

  const session = await harness.session();

  const {data} = await session.skill('classify-docs-issue', {
    args: {issueNumber: payload.issueNumber, dryRun},
    result: v.object({
      classification: v.picklist([
        'sdk-docs',
        'product-docs',
        'developer-docs',
        'platform-bug',
        'platform-improvement',
        'broken-link',
        'duplicate',
        'support-question',
      ]),
      platform: v.optional(v.string()),
      productArea: v.optional(v.string()),
      team: v.optional(v.string()),
      impact: v.picklist(['small', 'medium', 'large']),
      effort: v.picklist(['small', 'medium', 'large']),
      summary: v.string(),
      relatedDocs: v.array(v.string()),
      suggestedLabels: v.array(v.string()),
      linearLabel: v.picklist(['Docs Content', 'Docs Platform']),
      triageReport: v.string(),
    }),
  });

  return data;
}
