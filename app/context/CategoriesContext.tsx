"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ALL_CATEGORIES, type Category } from "../data/categories";
import { fetchCategoriesClient } from "../lib/categories";

const CategoriesContext = createContext<Category[]>(ALL_CATEGORIES);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(ALL_CATEGORIES);

  useEffect(() => {
    fetchCategoriesClient().then(setCategories);
  }, []);

  return (
    <CategoriesContext.Provider value={categories}>{children}</CategoriesContext.Provider>
  );
}

export function useCategories(): Category[] {
  return useContext(CategoriesContext);
}

/** Nav order — all DB categories (seed preserves Gym-first sort). */
export function useNavCategories(): Category[] {
  return useCategories();
}
