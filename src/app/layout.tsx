import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quản lý Phân Phối",
  description: "Quản lý Phân Phối",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/truck.svg" sizes="any" />
      <body className={inter.className}>
        {children}</body>
    </html>
  );
}
