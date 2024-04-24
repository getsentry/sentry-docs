import 'prism-sentry/index.css';

import {headers} from 'next/headers';

import {Breadcrumbs} from 'sentry-docs/components/breadcrumbs';
import {Header} from 'sentry-docs/components/header';
import {Sidebar} from 'sentry-docs/components/sidebar';
import {DocNode, getDocsRootNode, nodeForPath} from 'sentry-docs/docTree';

export default async function NotFound() {
  const headersList = headers();
  // the special `x-pathname` header is set by the middleware
  const pathname = headersList.get('x-pathname');
  const path = pathname?.split('/').filter(Boolean) ?? [];

  const rootNode = (await getDocsRootNode())!;

  let firstMatchingNode: DocNode | undefined;
  for (let i = path.length; i >= 0; i--) {
    const node = nodeForPath(rootNode, path.slice(0, i));
    if (node) {
      firstMatchingNode = node;
      break;
    }
  }

  const firstFoundPath = firstMatchingNode?.path.split('/').filter(Boolean) ?? [];

  return (
    <div className="tw-app">
      <Header pathname="/" searchPlatforms={[]} />
      <section className="px-0 flex relative">
        <Sidebar path={firstFoundPath} />
        <main className="main-content flex w-full md:w-[calc(100%-var(--sidebar-width))] lg:ml-[var(--sidebar-width)] mt-[var(--header-height)] flex-1 mx-auto">
          <div className="mx-auto lg:mx-0 pt-6 px-6 max-w-full">
            {firstMatchingNode && <Breadcrumbs leafNode={firstMatchingNode} />}
            <div className="prose prose-slate mt-8">
              <h1 className="font-medium text-3xl mb-4">Page Not Found</h1>
              <p className="text-lg">We couldn't find the page you were looking for.</p>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
