import type {Route} from 'next';

import {type APICategory} from 'sentry-docs/build/resolveOpenAPI';

import {ApiSidebar} from './apiSidebar';
import {DocPage} from './docPage';
import {SmartLink} from './smartLink';

type Props = {
  category: APICategory;
};

export function ApiCategoryPage({category}: Props) {
  const frontMatter = {
    title: category.name,
  };

  return (
    <DocPage frontMatter={frontMatter} notoc sidebar={<ApiSidebar />}>
      {category.description}
      <ul data-noindex>
        {category.apis.map(api => (
          <li key={api.name} style={{marginBottom: '1rem'}}>
            <h4>
              <SmartLink to={`/api/${category.slug}/${api.slug}` as Route}>
                {api.name}
              </SmartLink>
            </h4>
          </li>
        ))}
      </ul>
    </DocPage>
  );
}
