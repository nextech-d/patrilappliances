"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_SITE_SETTINGS,
  fetchFeaturedColumnsClient,
  fetchFaqClient,
  fetchSiteSettingsClient,
  type FaqItemData,
  type FeaturedColumnIds,
  type SiteSettingsData,
} from "../lib/storefront";

type StorefrontContextValue = {
  featuredColumns: FeaturedColumnIds[];
  siteSettings: SiteSettingsData;
  faqItems: FaqItemData[];
  loaded: boolean;
};

const StorefrontContext = createContext<StorefrontContextValue>({
  featuredColumns: [],
  siteSettings: DEFAULT_SITE_SETTINGS,
  faqItems: [],
  loaded: false,
});

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [featuredColumns, setFeaturedColumns] = useState<FeaturedColumnIds[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData>(DEFAULT_SITE_SETTINGS);
  const [faqItems, setFaqItems] = useState<FaqItemData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchFeaturedColumnsClient(),
      fetchSiteSettingsClient(),
      fetchFaqClient(),
    ]).then(([columns, settings, faq]) => {
      setFeaturedColumns(columns);
      setSiteSettings(settings);
      setFaqItems(faq);
      setLoaded(true);
    });
  }, []);

  return (
    <StorefrontContext.Provider value={{ featuredColumns, siteSettings, faqItems, loaded }}>
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront(): StorefrontContextValue {
  return useContext(StorefrontContext);
}

export function useSiteSettings(): SiteSettingsData {
  return useContext(StorefrontContext).siteSettings;
}
