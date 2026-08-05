import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Searching...</p>
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}
