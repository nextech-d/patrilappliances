import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import CartToast from "./components/CartToast";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import { SITE } from "./config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE.name} — Home & Gym Appliances`,
  description: `Shop kitchen and gym equipment in ${SITE.city}. Free delivery in Nairobi, installation help, and M-Pesa accepted across ${SITE.region}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-black">
        <CartProvider>
          <ProductsProvider>
            <Header />
            <CartDrawer />
            <CartToast />
            <main className="flex-grow">{children}</main>
            <Footer />
          </ProductsProvider>
        </CartProvider>
      </body>
    </html>
  );
}
