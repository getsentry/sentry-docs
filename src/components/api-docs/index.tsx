import {DocPage} from '../docPage';

import {ApiDocs} from './apiDocs';

export function ApiDocsPage() {
  const frontMatter: React.ComponentProps<typeof DocPage>['frontMatter'] = {
    title: 'API Docs',
  };

  return (
    <DocPage frontMatter={frontMatter} fullWidth>
      <ApiDocs />
    </DocPage>
  );
}
