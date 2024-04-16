import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import {unified} from 'unified';

import {type APICategory} from 'sentry-docs/build/resolveOpenAPI';

import {DocPage} from './docPage';
import {ApiSidebar} from './sidebar';
import {SmartLink} from './smartLink';

type Props = {
  category: APICategory;
};

const markdown2Html = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify);

export async function ApiCategoryPage({category}: Props) {
  const descriptionHtml = category.description
    ? String(await markdown2Html.process(category.description))
    : null;

  const frontMatter = {
    title: category.name,
  };

  return (
    <DocPage frontMatter={frontMatter} notoc sidebar={<ApiSidebar />}>
      {descriptionHtml ? <p dangerouslySetInnerHTML={{__html: descriptionHtml}} /> : null}
      <ul data-noindex>
        {category.apis.map(api => (
          <li key={api.name} style={{marginBottom: '1rem'}}>
            <h4>
              <SmartLink to={`/api/${category.slug}/${api.slug}`}>{api.name}</SmartLink>
            </h4>
          </li>
        ))}
      </ul>
    </DocPage>
  );
}
