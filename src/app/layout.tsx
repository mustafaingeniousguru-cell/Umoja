import type { Metadata } from "next";
import { Lato, Cinzel, Playfair_Display } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Umoja Treasure Co. — Premium Hobby Collector Marketplace",
  description:
    "Discover rare treasures, premium sealed products, graded slabs, and curated collectibles from the world's most sought-after brands.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${lato.variable} ${cinzel.variable} ${playfair.variable}`}>
      <body className="bg-[#0a1628] text-white antialiased">{children}</body>
    </html>
  );
}
