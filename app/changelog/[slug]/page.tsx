import {Fragment, useMemo} from 'react';
import * as Sentry from '@sentry/nextjs';
import {getMDXComponent} from 'mdx-bundler/client';
import type {Metadata, ResolvingMetadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';

import Article from 'sentry-docs/components/changelog/article';
import {getFileBySlug} from 'sentry-docs/mdx';
import {mdxComponents} from 'sentry-docs/mdxComponents';

const mdx: {[key: string]: object} = {};
async function getMDXFile({params}) {
  if (!mdx[params.slug]) {
    mdx[params.slug] = await getFileBySlug(`changelog/${params.slug}`);
  }
  return mdx[params.slug];
}

type Props = {
  params: {id: string};
};

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  let entry: any = null;
  try {
    entry = await getMDXFile({params});
  } catch (e) {
    return {title: (await parent).title};
  }

  const {frontMatter} = entry;

  return {
    title: frontMatter.title,
    description: frontMatter.summary,
    openGraph: {
      images: frontMatter.images,
    },
    other: {
      'sentry-trace': Sentry.getActiveSpan()?.toTraceparent(),
    },
  };
}

function MDXLayoutRenderer({mdxSource, ...rest}) {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
  return <MDXLayout components={mdxComponents()} {...rest} />;
}

export default async function ChangelogEntry({params}) {
  let entry: any = null;
  try {
    entry = await getMDXFile({params});
  } catch (e) {
    if (e.code === 'ENOENT') {
      return notFound();
    }
    throw e;
  }
  const {mdxSource, toc, frontMatter} = entry;

  return (
    <Fragment>
      <div className="relative min-h-[calc(100vh-8rem)] w-full mx-auto grid grid-cols-12 bg-gray-200">
        <div className="col-span-12 md:col-start-3 md:col-span-8">
          <div className="max-w-3xl mx-auto px-4 p-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center space-x-4 py-3">
              <Link href="/changelog/">
                <button
                  className="flex items-center gap-2 px-6 py-3 font-bold text-center text-primary uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                  Back
                </button>
              </Link>
              <div className="flex space-x-4">
                <Link className="text-gray-500 hover:text-gray-700" href="#">
                  Twitter
                </Link>
              </div>
            </div>
            <Article {...frontMatter}>
              <MDXLayoutRenderer
                toc={toc}
                mdxSource={mdxSource}
                frontMatter={frontMatter}
              />
            </Article>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
