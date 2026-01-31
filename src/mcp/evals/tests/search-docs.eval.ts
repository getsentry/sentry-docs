import {describeEval} from 'vitest-evals';

import {NoOpTaskRunner, ToolPredictionScorer} from '../utils';

describeEval('search-docs', {
  data: () => Promise.resolve([
    {
      input: 'How do I set up Sentry in my Next.js app?',
      expectedTools: [
        {
          name: 'search_docs',
          arguments: {query: 'setup Next.js', guide: 'javascript/nextjs'},
        },
      ],
    },
    {
      input: 'Show me the error handling configuration for Python',
      expectedTools: [{name: 'search_docs', arguments: {query: 'error handling Python'}}],
    },
    {
      input: 'How do I configure the tracesSampleRate option?',
      expectedTools: [{name: 'search_docs', arguments: {query: 'tracesSampleRate configuration'}}],
    },
    {
      input: 'Find documentation about beforeSend hook',
      expectedTools: [{name: 'search_docs', arguments: {query: 'beforeSend hook'}}],
    },
    {
      input: 'How do I add breadcrumbs to my errors in React?',
      expectedTools: [
        {
          name: 'search_docs',
          arguments: {query: 'breadcrumbs', guide: 'javascript/react'},
        },
      ],
    },
    {
      input: 'Search the developer docs for SDK architecture',
      expectedTools: [
        {
          name: 'search_docs',
          arguments: {query: 'SDK architecture', site: 'develop'},
        },
      ],
    },
  ]),
  task: NoOpTaskRunner(),
  scorers: [ToolPredictionScorer()],
  threshold: 0.6,
});
