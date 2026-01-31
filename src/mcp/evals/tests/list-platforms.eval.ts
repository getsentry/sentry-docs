import {describeEval} from 'vitest-evals';

import {NoOpTaskRunner, ToolPredictionScorer} from '../utils';

describeEval('list-platforms', {
  data: () =>
    Promise.resolve([
      {
        input: 'What platforms does Sentry support?',
        expectedTools: [
          {
            name: 'list_platforms',
            arguments: {},
          },
        ],
      },
      {
        input: 'List all available SDKs',
        expectedTools: [
          {
            name: 'list_platforms',
            arguments: {},
          },
        ],
      },
      {
        input: 'What frameworks are available for JavaScript?',
        expectedTools: [
          {
            name: 'list_platforms',
            arguments: {platform: 'javascript'},
          },
        ],
      },
      {
        input: 'Show me the guides available for the Python SDK',
        expectedTools: [
          {
            name: 'list_platforms',
            arguments: {platform: 'python'},
          },
        ],
      },
      {
        input: 'Does Sentry support React Native?',
        expectedTools: [
          {
            name: 'list_platforms',
            arguments: {platform: 'react-native'},
          },
        ],
      },
      {
        input: 'What mobile SDKs does Sentry have?',
        expectedTools: [
          {
            name: 'list_platforms',
            arguments: {},
          },
        ],
      },
    ]),
  task: NoOpTaskRunner(),
  scorers: [ToolPredictionScorer()],
  threshold: 0.6,
});
