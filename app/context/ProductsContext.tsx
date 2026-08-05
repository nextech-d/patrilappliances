"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { APPLIANCES_INVENTORY } from "../data/products";
import { fetchInventoryClient, type Appliance } from "../lib/inventory";

const ProductsContext = createContext<Appliance[]>(APPLIANCES_INVENTORY);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<Appliance[]>(APPLIANCES_INVENTORY);

  useEffect(() => {
    fetchInventoryClient().then(setInventory);
  }, []);

  return (
    <ProductsContext.Provider value={inventory}>{children}</ProductsContext.Provider>
  );
}

export function useInventory(): Appliance[] {
  return useContext(ProductsContext);
}
