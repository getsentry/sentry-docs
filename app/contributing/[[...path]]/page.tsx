import { getAllFilesFrontMatter } from "sentry-docs/mdx";

export async function generateStaticParams() {
    const docs = await getAllFilesFrontMatter();
    return docs.map((doc) => ({ path: doc.slug.split('/').slice(1) }));
}

export default async function Page({ params }) {
  // get frontmatter of all docs in tree
  const docs = await getAllFilesFrontMatter();
  const slug = params.path
    ? ['contributing', ...params.path].join('/')
    : 'contributing';
  const doc = await getFileBySlug(slug);
  
  // get the MDX for the current doc and render it

  return (
    <>
        <h1>{doc.title}</h1>
        <ul>
            {
            docs.map((doc) => <li key={doc.slug}>{doc.title} ({doc.slug})</li>)
            }
        </ul>
    </>
  )
  // get the headers for the current doc
  // pass frontmatter tree into sidebar, rendered page + fm into middle, headers into toc
}
