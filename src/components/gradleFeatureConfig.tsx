import {CodeBlock} from './codeBlock';
import {CodeTabs} from './codeTabs';
import {codeToJsx} from './highlightCode';

type Props = {
  feature: string;
};

export function GradleFeatureConfig({feature}: Props) {
  return (
    <CodeTabs>
      <CodeBlock language="kotlin" filename="build.gradle.kts">
        <pre>
          {codeToJsx(
            `sentry {
  ${feature} {
    enabled = providers.environmentVariable("GITHUB_ACTIONS").isPresent
  }
}`,
            'kotlin'
          )}
        </pre>
      </CodeBlock>

      <CodeBlock language="groovy" filename="build.gradle">
        <pre>
          {codeToJsx(
            `sentry {
  ${feature} {
    enabled = providers.environmentVariable("GITHUB_ACTIONS").present
  }
}`,
            'groovy'
          )}
        </pre>
      </CodeBlock>
    </CodeTabs>
  );
}
