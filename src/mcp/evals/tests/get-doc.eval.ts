import {describeEval} from 'vitest-evals';

import {NoOpTaskRunner, ToolPredictionScorer} from '../utils';

describeEval('get-doc', {
  data: async () => [
    {
      input: 'Get the full documentation for /platforms/javascript/guides/nextjs',
      expectedTools: [
        {
          name: 'get_doc',
          arguments: {path: '/platforms/javascript/guides/nextjs'},
        },
      ],
    },
    {
      input: 'Read the Python SDK setup guide at platforms/python',
      expectedTools: [
        {
          name: 'get_doc',
          arguments: {path: 'platforms/python'},
        },
      ],
    },
    {
      input: 'Fetch the configuration page for the Go SDK',
      expectedTools: [
        {
          name: 'get_doc',
          arguments: {path: '/platforms/go/configuration'},
        },
      ],
    },
    {
      input: 'Get the developer documentation for envelope formats',
      expectedTools: [
        {
          name: 'get_doc',
          arguments: {path: 'envelope', site: 'develop'},
        },
      ],
    },
    {
      input:
        "I found a search result for /platforms/javascript/configuration/sampling, can you get the full content?",
      expectedTools: [
        {
          name: 'get_doc',
          arguments: {path: '/platforms/javascript/configuration/sampling'},
        },
      ],
    },
  ],
  task: NoOpTaskRunner(),
  scorers: [ToolPredictionScorer()],
  threshold: 0.6,
});
