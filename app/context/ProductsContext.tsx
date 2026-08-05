"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getInventory, fetchInventoryClient, type Appliance } from "../lib/inventory";

const ProductsContext = createContext<Appliance[]>(getInventory());

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<Appliance[]>(getInventory());

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
