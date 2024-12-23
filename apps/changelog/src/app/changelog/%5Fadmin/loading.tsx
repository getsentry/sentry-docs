export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <h3 className="text-2xl text-primary font-semibold">
        <div
          className="mx-auto mb-8 h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        />{' '}
        Loading...
      </h3>
    </div>
  );
}
