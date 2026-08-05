export default function CategoryLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-6 py-12">
      <div className="mb-8 h-4 w-48 rounded bg-neutral-200" />
      <div className="mb-4 h-10 w-96 max-w-full rounded bg-neutral-200" />
      <div className="mb-8 h-4 w-64 rounded bg-neutral-200" />
      <div className="mb-6 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-neutral-200" />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl border border-neutral-200/60 p-4">
            <div className="aspect-[4/3] rounded-xl bg-neutral-200" />
            <div className="mt-4 h-4 w-3/4 rounded bg-neutral-200" />
            <div className="mt-2 h-3 w-1/2 rounded bg-neutral-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
