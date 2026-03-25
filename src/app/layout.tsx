import type { Metadata } from "next";
import { Manrope, Inter, Space_Grotesk, DotGothic16 } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n";

const manrope = Manrope({
  variable: "--font-headline",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
});

const dotGothic16 = DotGothic16({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio | The Technical Aesthete",
  description: "Creative technologist portfolio showcasing media art, development, and creative coding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${manrope.variable} ${inter.variable} ${spaceGrotesk.variable} ${dotGothic16.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <I18nProvider>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
