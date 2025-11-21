import {Fragment} from 'react';

import {CodeBlock} from './codeBlock';
import {CodeTabs} from './codeTabs';
import {GradleFeatureConfig} from './gradleFeatureConfig';
import {codeToJsx} from './highlightCode';
import {OrgAuthTokenNote} from './orgAuthTokenNote';

type Props = {
  feature: 'sizeAnalysis' | 'distribution';
};

export function GradleUploadInstructions({feature}: Props) {
  const featureName = feature === 'sizeAnalysis' ? 'size analysis' : 'distribution';

  return (
    <Fragment>
      <p>
        The Gradle plugin automatically detects build metadata from your git repository.
        On GitHub Actions, all metadata is automatically detected. On other CI systems,
        you may need to manually set some values using the <code>vcsInfo</code> extension.
      </p>

      <ol>
        <li>
          Configure the{' '}
          <a href="/platforms/android/configuration/gradle/">
            Sentry Android Gradle plugin
          </a>{' '}
          with at least version <code>6.0.0-beta1</code>
        </li>

        <li>
          <p>
            Set the auth token as an environment variable to be used when running your
            release build.
          </p>
          <OrgAuthTokenNote />
          <CodeBlock language="bash">
            <pre>
              {codeToJsx(`export SENTRY_AUTH_TOKEN=___ORG_AUTH_TOKEN___`, 'bash')}
            </pre>
          </CodeBlock>
        </li>

        <li>
          <p>Enable uploading for {featureName} for CI builds.</p>
          <GradleFeatureConfig feature={feature} />
        </li>

        <li>
          <p>
            Invoke the following Gradle tasks to build your app and trigger the upload.
          </p>
          <CodeTabs>
            <CodeBlock language="aab" filename="aab">
              <pre>{codeToJsx(`./gradlew bundleRelease`, 'bash')}</pre>
            </CodeBlock>
            <CodeBlock language="apk" filename="apk">
              <pre>{codeToJsx(`./gradlew assembleRelease`, 'bash')}</pre>
            </CodeBlock>
          </CodeTabs>
        </li>

        <li>
          <p>
            After an upload has successfully processed, confirm the metadata is correct in
            the Sentry UI
          </p>
          <img
            src="/platforms/android/build-distribution/images/android-metadata.png"
            alt="Upload metadata"
            style={{maxWidth: '400px'}}
          />
        </li>
      </ol>

      <h3>Overriding Metadata</h3>

      <p>
        The Gradle plugin automatically detects build metadata from your git repository.
        On GitHub Actions, all metadata is automatically detected. On other CI systems,
        you may need to manually set some values using the <code>vcsInfo</code> extension.
      </p>

      <p>Configure overrides in your Gradle build configuration:</p>

      <CodeTabs>
        <CodeBlock language="kotlin" filename="build.gradle.kts">
          <pre>
            {codeToJsx(
              `sentry {
  ${feature} {
    enabled = providers.environmentVariable("GITHUB_ACTIONS").isPresent
  }

  vcsInfo {
    headSha.set("abc123")
    baseSha.set("def456")
    vcsProvider.set("github")
    headRepoName.set("organization/repository")
    baseRepoName.set("organization/repository")
    headRef.set("feature-branch")
    baseRef.set("main")
    prNumber.set(42)
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

  vcsInfo {
    headSha = 'abc123'
    baseSha = 'def456'
    vcsProvider = 'github'
    headRepoName = 'organization/repository'
    baseRepoName = 'organization/repository'
    headRef = 'feature-branch'
    baseRef = 'main'
    prNumber = 42
  }
}`,
              'groovy'
            )}
          </pre>
        </CodeBlock>
      </CodeTabs>

      <p>
        Available <code>vcsInfo</code> properties:
      </p>

      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>headSha</code>
            </td>
            <td>String</td>
            <td>Current commit SHA</td>
          </tr>
          <tr>
            <td>
              <code>baseSha</code>
            </td>
            <td>String</td>
            <td>Base commit SHA (for comparison)</td>
          </tr>
          <tr>
            <td>
              <code>vcsProvider</code>
            </td>
            <td>String</td>
            <td>VCS provider (e.g., "github")</td>
          </tr>
          <tr>
            <td>
              <code>headRepoName</code>
            </td>
            <td>String</td>
            <td>Repository name (org/repo format)</td>
          </tr>
          <tr>
            <td>
              <code>baseRepoName</code>
            </td>
            <td>String</td>
            <td>Base repository name</td>
          </tr>
          <tr>
            <td>
              <code>headRef</code>
            </td>
            <td>String</td>
            <td>Branch or tag name</td>
          </tr>
          <tr>
            <td>
              <code>baseRef</code>
            </td>
            <td>String</td>
            <td>Base branch name</td>
          </tr>
          <tr>
            <td>
              <code>prNumber</code>
            </td>
            <td>Int</td>
            <td>Pull request number</td>
          </tr>
        </tbody>
      </table>
    </Fragment>
  );
}
