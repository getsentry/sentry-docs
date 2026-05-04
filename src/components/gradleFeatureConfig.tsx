import Link from 'next/link';
import {Fragment} from 'react';

import {Alert} from './alert';
import {CodeBlock} from './codeBlock';
import {CodeTabs} from './codeTabs';
import {codeToJsx} from './highlightCode';

type Props = {
  feature: string;
};

export function GradleFeatureConfig({feature}: Props) {
  return (
    <Fragment>
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
      <Alert level="info">
        Gradle-based uploads require the variant to not be excluded by the Sentry Gradle
        plugin's variant filters (<code>ignoredVariants</code>,{' '}
        <code>ignoredBuildTypes</code>, or <code>ignoredFlavors</code>). See{' '}
        <Link href="/platforms/android/configuration/gradle/#variant-filtering">
          Variant Filtering
        </Link>{' '}
        for details.
      </Alert>
    </Fragment>
  );
}
