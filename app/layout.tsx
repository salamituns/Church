import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ScrollToTop } from "@/components/ui/ScrollToTop"
import { getMinistries } from "@/lib/cms/queries"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RCCG Shiloh Mega Parish | Sugar Land TX Worship & Ministries",
  description: "Welcome to RCCG Shiloh Mega Parish in Sugar Land, Texas. Join us for worship, fellowship, and community.",
  keywords: ["church", "Sugar Land TX", "RCCG", "worship", "ministries", "community"],
  openGraph: {
    title: "RCCG Shiloh Mega Parish | Sugar Land TX Worship & Ministries",
    description: "Welcome to RCCG Shiloh Mega Parish in Sugar Land, Texas. Join us for worship, fellowship, and community.",
    type: "website",
    url: "https://rccgshilohmega.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "RCCG Shiloh Mega Parish",
    description: "Welcome to RCCG Shiloh Mega Parish in Sugar Land, Texas.",
  },
  metadataBase: new URL("https://rccgshilohmega.org"),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ministries = await getMinistries()

  return (
    <html lang="en">
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <Header ministries={ministries} />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  )
}

