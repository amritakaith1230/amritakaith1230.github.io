import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { OrderProvider } from "@/lib/order-context"
import { SystemProvider } from "@/lib/system-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cruise Ship Management System",
  description: "Complete cruise ship service management platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SystemProvider>
            <CartProvider>
              <OrderProvider>{children}</OrderProvider>
            </CartProvider>
          </SystemProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
