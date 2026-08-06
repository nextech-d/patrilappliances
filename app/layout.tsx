import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import CartToast from "./components/CartToast";
import SiteJsonLd from "./components/SiteJsonLd";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import { rootMetadata } from "./lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-black">
        <SiteJsonLd />
        <CartProvider>
          <ProductsProvider>
            <Header />
            <CartDrawer />
            <CartToast />
            <main className="flex-grow">{children}</main>
            <Footer />
          </ProductsProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
