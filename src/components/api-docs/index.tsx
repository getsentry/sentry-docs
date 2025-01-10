import {API, APICategory} from 'sentry-docs/build/resolveOpenAPI';

import {DocPage} from '../docPage';

import {ApiDocs} from './apiDocs';

type Props = {
  api?: API;
  category?: APICategory;
};

export function ApiDocsPage({api, category}: Props) {
  const frontMatter: React.ComponentProps<typeof DocPage>['frontMatter'] = {
    title: 'API Reference',
    description: 'Sentry API Reference',
  };

  return (
    <DocPage frontMatter={frontMatter} fullWidth>
      <ApiDocs api={api} category={category} />
    </DocPage>
  );
}
