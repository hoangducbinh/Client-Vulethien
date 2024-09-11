import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vũ Lệ Thiên - Bán bằng cả tâm tình",
  description: "NPP Vũ Lệ Thiên",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/vscode.png" sizes="any" />
      <body className={inter.className}>
        {children}</body>
    </html>
  );
}
