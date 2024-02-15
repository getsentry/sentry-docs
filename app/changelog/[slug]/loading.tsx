import Article from 'sentry-docs/components/changelog/article';

export default function Loading() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] w-full mx-auto grid grid-cols-12 bg-gray-200">
      <div className="col-span-12 md:col-start-3 md:col-span-8">
        <div className="max-w-3xl mx-auto px-4 p-4 sm:px-6 lg:px-8 mt-16">
          <Article loading />
        </div>
      </div>
    </div>
  );
}
