import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Lesspriz",
    template: "%s | Lesspriz",
  },
  description: "The premium price tracker for those who value their time and money.",
  metadataBase: new URL("https://lesspriz.com"),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Lesspriz",
    description: "Track prices, catch drops, and save money with donation-powered alerts.",
    url: "https://lesspriz.com",
    siteName: "Lesspriz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lesspriz",
    description: "Track prices and get alerts without subscriptions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} antialiased`}>
        <body className="min-h-screen bg-bg text-fg font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
