import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatApp - Real-time Chat Application",
  description:
    "A modern real-time chat application built with Next.js and Socket.IO",
  keywords: ["chat", "real-time", "messaging", "socket.io", "nextjs"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
