import {Alert} from './alert';
import {CodeBlock} from './codeBlock';
import {CodeTabs} from './codeTabs';

export function WindowsNodeEnvSetup({nodeOption}: {nodeOption: string}) {
  return (
    <Alert>
      <p>
        If you're on Windows, set <code>NODE_OPTIONS</code> environment variable before
        running your app.
      </p>
      <CodeTabs>
        <CodeBlock language="cmd">
          <pre>
            <code>set NODE_OPTIONS={nodeOption}</code>
          </pre>
        </CodeBlock>
        <CodeBlock language="powershell">
          <pre>
            <code>$env:NODE_OPTIONS="{nodeOption}"</code>
          </pre>
        </CodeBlock>
      </CodeTabs>
      <p className="pt-3">
        Read more about{' '}
        <a href="https://learn.microsoft.com/en-us/windows/win32/procthread/environment-variables">
          environment variables
        </a>
        .
      </p>
    </Alert>
  );
}
