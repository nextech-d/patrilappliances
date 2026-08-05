import type { ReactNode } from "react";
import FeaturedColumnGrid from "./FeaturedColumnGrid";
import { resolveFeaturedColumns } from "../data/products";
import type { Appliance } from "../data/products";

type FeaturedProductsGridProps = {
  inventory: Appliance[];
  renderItem: (appliance: Appliance) => ReactNode;
  itemClassName?: string;
};

export default function FeaturedProductsGrid({
  inventory,
  renderItem,
  itemClassName = "w-full",
}: FeaturedProductsGridProps) {
  const columns = resolveFeaturedColumns(inventory);

  return (
    <FeaturedColumnGrid
      columns={columns}
      getKey={(appliance) => String(appliance.id)}
      renderItem={renderItem}
      itemClassName={itemClassName}
    />
  );
}
