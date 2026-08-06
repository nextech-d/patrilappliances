import type { ReactNode } from "react";
import { splitItemsForTShape } from "../lib/tShapeLayout";

type TShapeGridProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  className?: string;
  rowClassName?: string;
  itemClassName?: string;
};

export default function TShapeGrid<T>({
  items,
  getKey,
  renderItem,
  className = "",
  rowClassName = "flex flex-wrap justify-center gap-3",
  itemClassName = "",
}: TShapeGridProps<T>) {
  const { topRow, bottomRow } = splitItemsForTShape(items);

  if (items.length === 0) return null;

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {topRow.length > 0 && (
        <div className={rowClassName}>
          {topRow.map((item) => (
            <div key={getKey(item)} className={itemClassName}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
      {bottomRow.length > 0 && (
        <div className={rowClassName}>
          {bottomRow.map((item) => (
            <div key={getKey(item)} className={itemClassName}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
