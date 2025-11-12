import {Fragment} from 'react';

import {CodeBlock} from './codeBlock';

type Props = {
  feature: string;
};

export function GradleFeatureConfig({feature}: Props) {
  return (
    <Fragment>
      <CodeBlock language="kotlin" filename="build.gradle.kts">
        <pre>
          <code className="language-kotlin">{`sentry {
  ${feature} {
    enabled = providers.environmentVariable("GITHUB_ACTIONS").isPresent
  }
}`}</code>
        </pre>
      </CodeBlock>

      <CodeBlock language="groovy" filename="build.gradle">
        <pre>
          <code className="language-groovy">{`sentry {
  ${feature} {
    enabled = providers.environmentVariable("GITHUB_ACTIONS").present
  }
}`}</code>
        </pre>
      </CodeBlock>
    </Fragment>
  );
}
