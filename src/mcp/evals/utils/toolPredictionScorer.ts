import {createAnthropic} from '@ai-sdk/anthropic';
import {generateObject, type LanguageModel} from 'ai';
import {z} from 'zod';

const anthropicProvider = createAnthropic();

/**
 * Expected tool call structure for evaluation.
 */
export interface ExpectedToolCall {
  /** Tool name (e.g., "search_docs", "get_doc") */
  name: string;
  /** Expected arguments - can be partial, only checked fields are compared */
  arguments?: Record<string, unknown>;
}

/**
 * Available tools in the sentry-docs MCP server.
 * This description helps the scoring model understand what tools are available.
 */
const AVAILABLE_TOOLS = [
  {
    name: 'search_docs',
    description:
      'Search Sentry documentation for SDK setup, configuration, and usage guidance. Returns snippets with relevance scores.',
    parameters: {
      query: 'Search query in natural language (required)',
      maxResults: 'Maximum results to return, 1-10 (optional, default 5)',
      site: 'Which site to search: "docs" or "develop" (optional, default "docs")',
      guide:
        'Filter by platform/guide, e.g., "javascript/nextjs", "python/django" (optional)',
    },
  },
  {
    name: 'get_doc',
    description:
      'Fetch the full markdown content of a Sentry documentation page. Use after search_docs to get complete content.',
    parameters: {
      path: 'Documentation path, e.g., "/platforms/javascript/guides/nextjs" (required)',
      site: 'Which site: "docs" or "develop" (optional, default "docs")',
    },
  },
  {
    name: 'list_platforms',
    description:
      'List available SDK platforms and their guides in Sentry documentation. Without platform param returns all platforms, with platform param returns detailed info including guides.',
    parameters: {
      platform:
        'Specific platform slug to get details for, e.g., "javascript", "python" (optional)',
    },
  },
  {
    name: 'get_doc_tree',
    description:
      'Get the documentation structure/table of contents for navigation. Helps understand documentation hierarchy.',
    parameters: {
      path: 'Starting path to get tree from, e.g., "platforms/javascript" (optional)',
      depth: 'How many levels deep to include, 1-3 (optional, default 2)',
      site: 'Which site: "docs" or "develop" (optional, default "docs")',
    },
  },
];

/**
 * Schema for the prediction response from the scoring model.
 */
const predictionSchema = z.object({
  predictedTools: z.array(
    z.object({
      name: z.string().describe('The name of the tool that would be called'),
      argumentsJson: z
        .string()
        .optional()
        .describe('JSON string of the arguments that would be passed to the tool'),
      reasoning: z
        .string()
        .describe('Brief explanation of why this tool would be selected'),
    })
  ),
  score: z
    .number()
    .describe('Score from 0.0 to 1.0 indicating how well the predicted tools match the expected'),
  rationale: z
    .string()
    .describe('Explanation of the score and any discrepancies between predicted and expected'),
});

/**
 * Generate the prompt for the scoring model.
 */
function generatePrompt(
  userQuery: string,
  expectedTools: ExpectedToolCall[]
): string {
  const toolDescriptions = AVAILABLE_TOOLS.map(
    tool =>
      `- **${tool.name}**: ${tool.description}\n  Parameters: ${JSON.stringify(tool.parameters, null, 2)}`
  ).join('\n\n');

  const expectedDescription = expectedTools
    .map(
      (tool, i) =>
        `${i + 1}. Tool: ${tool.name}${tool.arguments ? `\n   Arguments: ${JSON.stringify(tool.arguments)}` : ''}`
    )
    .join('\n');

  return `You are evaluating whether an AI assistant would correctly select MCP tools to answer a user query about Sentry documentation.

## Available Tools

${toolDescriptions}

## User Query

"${userQuery}"

## Expected Tool Calls

The expected tool calls for this query are:

${expectedDescription}

## Your Task

1. Predict which tool(s) an AI assistant would call to answer the user's query.
2. Consider the most logical and efficient tool selection.
3. Compare your prediction against the expected tools.
4. Score how well the expected tools match what should be called:
   - 1.0: Perfect match - the expected tools are exactly what should be called
   - 0.8-0.9: Good match - minor differences in arguments or an extra optional tool
   - 0.6-0.7: Acceptable - correct primary tool but missing secondary tools or wrong arguments
   - 0.3-0.5: Partial match - some correct tools but significant issues
   - 0.0-0.2: Poor match - wrong tools or completely off

Focus on evaluating whether the EXPECTED tools make sense for the query, not whether you would choose differently.`;
}

/**
 * Default model for scoring - Claude Sonnet 4.5 for balance of quality and cost.
 */
const defaultModel = anthropicProvider('claude-sonnet-4-5-20250929');

/**
 * Scorer options interface matching vitest-evals BaseScorerOptions
 * with our custom expectedTools field.
 */
interface ToolPredictionScorerOptions {
  input: string;
  output: string;
  expectedTools?: ExpectedToolCall[];
}

/**
 * ToolPredictionScorer - Scores tool prediction accuracy using Claude.
 *
 * This scorer asks Claude to predict which tools would be called for a given
 * user query, then compares against the expected tools to generate a score.
 *
 * @param model - Optional LanguageModel to use for scoring (defaults to Claude Sonnet)
 * @returns Scorer function compatible with vitest-evals
 */
export function ToolPredictionScorer(model: LanguageModel = defaultModel) {
  return async function scorer(opts: ToolPredictionScorerOptions) {
    // If no expected tools provided, we can't score
    if (!opts.expectedTools || opts.expectedTools.length === 0) {
      return {score: null};
    }

    try {
      const {object} = await generateObject({
        model,
        prompt: generatePrompt(opts.input, opts.expectedTools),
        schema: predictionSchema,
      });

      return {
        score: object.score,
        metadata: {
          rationale: object.rationale,
          predictedTools: object.predictedTools,
          expectedTools: opts.expectedTools,
        },
      };
    } catch (error) {
      console.error('Error in ToolPredictionScorer:', error);
      return {
        score: 0,
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  };
}
