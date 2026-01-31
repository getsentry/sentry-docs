import {describeEval} from 'vitest-evals';

import {NoOpTaskRunner, ToolPredictionScorer} from '../utils';

describeEval('get-doc-tree', {
  data: () => Promise.resolve([
    {
      input: 'Show me the documentation structure',
      expectedTools: [
        {
          name: 'get_doc_tree',
          arguments: {},
        },
      ],
    },
    {
      input: 'What sections are available in the JavaScript documentation?',
      expectedTools: [
        {
          name: 'get_doc_tree',
          arguments: {path: 'platforms/javascript'},
        },
      ],
    },
    {
      input: 'Navigate the Python SDK docs, show me the table of contents',
      expectedTools: [
        {
          name: 'get_doc_tree',
          arguments: {path: 'platforms/python'},
        },
      ],
    },
    {
      input: 'I want to explore the configuration options, show me what subsections exist',
      expectedTools: [
        {
          name: 'get_doc_tree',
          arguments: {path: 'configuration', depth: 2},
        },
      ],
    },
    {
      input: 'Give me a deep overview of all pages under product/sentry-basics',
      expectedTools: [
        {
          name: 'get_doc_tree',
          arguments: {path: 'product/sentry-basics', depth: 3},
        },
      ],
    },
    {
      input: 'Show me just the top-level categories of documentation',
      expectedTools: [
        {
          name: 'get_doc_tree',
          arguments: {depth: 1},
        },
      ],
    },
  ]),
  task: NoOpTaskRunner(),
  scorers: [ToolPredictionScorer()],
  threshold: 0.6,
});
