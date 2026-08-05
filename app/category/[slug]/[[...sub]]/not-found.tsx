import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Category Not Found</h1>
        <p className="mt-2 text-sm text-neutral-500">This collection doesn&apos;t exist.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white">
          Return Home
        </Link>
      </div>
    </div>
  );
}
