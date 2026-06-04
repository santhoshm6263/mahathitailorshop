import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { BoutiqueProvider } from "./providers";
import { AppShell } from "./AppShell";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Mahathi Tailor Shop | Luxury Boutique Tailoring & Aari Studio",
  description: "Premium women's boutique fashion studio specializing in designer blouses, heavy bridal Aari embroidery, custom tailoring, and wedding collections in deep royal maroon and gold.",
  keywords: ["Designer Blouses", "Bridal Blouses", "Aari Work", "Maggam Work", "Boutique Kuppam", "Custom Stitching", "Mahathi Tailor Shop"],
  authors: [{ name: "Mahathi Tailors" }],
  openGraph: {
    title: "Mahathi Tailor Shop | Luxury Boutique Tailoring & Aari Studio",
    description: "Premium women's boutique fashion studio specializing in designer blouses, heavy bridal Aari embroidery, custom tailoring, and wedding collections.",
    url: "https://mahathitailors.vercel.app",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-poppins selection:bg-[#5C061E] selection:text-[#D4AF37]">
        <BoutiqueProvider>
          <AppShell>
            {children}
          </AppShell>
        </BoutiqueProvider>
      </body>
    </html>
  );
}
