import type { ReactNode } from "react";
import type { Appliance } from "../data/products";
import type { FeaturedColumnIds } from "../lib/storefront";
import FeaturedColumnGrid from "./FeaturedColumnGrid";

type FeaturedProductsGridProps = {
  inventory: Appliance[];
  featuredColumns: FeaturedColumnIds[];
  renderItem: (appliance: Appliance) => ReactNode;
  itemClassName?: string;
};

export default function FeaturedProductsGrid({
  inventory,
  featuredColumns,
  renderItem,
  itemClassName = "w-full",
}: FeaturedProductsGridProps) {
  const byId = new Map(inventory.map((item) => [item.id, item]));

  const columns = featuredColumns.flatMap((column) => {
    const top = byId.get(column.topProductId);
    if (!top) return [];
    const bottom = column.bottomProductId ? byId.get(column.bottomProductId) : undefined;
    return [{ top, bottom }];
  });

  return (
    <FeaturedColumnGrid
      columns={columns}
      getKey={(appliance) => String(appliance.id)}
      renderItem={renderItem}
      itemClassName={itemClassName}
    />
  );
}
