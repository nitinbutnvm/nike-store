import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { CartProvider } from "@/contexts/CartContext"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nike E-commerce Store",
  description: "A modern Nike-inspired e-commerce website built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <html lang="en">
  <body className={`${inter.className} ${GeistSans.variable} ${GeistMono.variable}`}>
    <CartProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </CartProvider>
  </body>
</html>

  )
}
