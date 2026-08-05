export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-6 py-8">
      <div className="mb-12 h-3 w-64 rounded bg-neutral-200" />
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5 aspect-square rounded-2xl bg-neutral-200" />
        <div className="lg:col-span-7 space-y-4 pt-8">
          <div className="h-10 w-3/4 rounded bg-neutral-200" />
          <div className="h-8 w-32 rounded bg-neutral-200" />
          <div className="h-20 w-full rounded bg-neutral-200" />
          <div className="h-11 w-48 rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
