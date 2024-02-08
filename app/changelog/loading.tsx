import Article from 'sentry-docs/components/changelog/article';

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto mt-20 px-4 pb-4 sm:px-6 md:px-8">
      <Article loading />
    </div>
  );
}
