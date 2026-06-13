import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { deDE } from '@clerk/localizations';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhaleByte - Terminbuchung",
  description: "Die einfachste Art, Termine zu planen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={deDE}>
      <html lang="de" suppressHydrationWarning>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}