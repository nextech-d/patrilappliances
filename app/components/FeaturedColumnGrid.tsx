import type { ReactNode } from "react";

export type FeaturedColumn<T> = {
  top: T;
  bottom?: T;
};

type FeaturedColumnGridProps<T> = {
  columns: FeaturedColumn<T>[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  itemClassName?: string;
};

export default function FeaturedColumnGrid<T>({
  columns,
  getKey,
  renderItem,
  itemClassName = "w-full",
}: FeaturedColumnGridProps<T>) {
  if (columns.length === 0) return null;

  return (
    <div className="grid w-full grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
      {columns.map(({ top, bottom }) => (
        <div
          key={getKey(top)}
          className="row-span-2 grid gap-y-8 lg:grid-rows-subgrid"
        >
          <div className={`${itemClassName} h-full min-h-0`}>{renderItem(top)}</div>
          <div className={`${itemClassName} h-full min-h-0`}>
            {bottom ? renderItem(bottom) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
