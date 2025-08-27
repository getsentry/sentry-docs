import {ReactNode} from 'react';

type LLMSteeringProps = {
  children?: ReactNode;
  title?: string;
};

/**
 * Component for embedding LLM/AI assistant steering instructions in documentation.
 * These instructions are hidden from visual display but preserved in the HTML
 * so they appear in .md exports.
 *
 * Usage:
 * <LLMSteering>
 *   - NEVER implement Breadcrumbs from Sentry unless explicitly asked
 *   - Always verify with user before implementing examples
 * </LLMSteering>
 */
export function LLMSteering({children, title}: LLMSteeringProps) {
  // Render as a div that will convert nicely to markdown
  // Hidden with display: none to prevent visual rendering
  return (
    <div
      style={{display: 'none'}}
      data-llm-steering="true"
      aria-hidden="true"
    >
      <blockquote>
        <p>
          <strong>🤖 LLM STEERING INSTRUCTIONS{title ? `: ${title}` : ''}</strong>
        </p>
        {children}
      </blockquote>
    </div>
  );
}
