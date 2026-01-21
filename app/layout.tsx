import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://readme-gen.vercel.app"),
  title: {
    default: "README Gen | Free README Generator for GitHub Projects",
    template: "%s | README Gen",
  },
  description:
    "Create professional README.md files in seconds. Free online README generator with GitHub URL auto-fill, live preview, markdown editor, multiple export formats, and draft management. No sign-up required.",
  keywords: [
    "README generator",
    "GitHub README",
    "markdown generator",
    "README.md creator",
    "documentation generator",
    "GitHub documentation",
    "README template",
    "markdown editor",
    "free README generator",
    "online README maker",
    "GitHub project documentation",
    "README badges",
    "open source documentation",
  ],
  authors: [{ name: "Rehan", url: "https://rehanbuilds.xyz" }],
  creator: "Rehan",
  publisher: "README Gen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "UrnTHeuyZsULh51e1768MOmnLROFkvMpQJTKnrh7wEY",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://readme-gen.vercel.app",
    title: "README Gen | Free README Generator for GitHub Projects",
    description:
      "Create professional README.md files in seconds. Free online README generator with GitHub URL auto-fill, live preview, markdown editor, and multiple export formats.",
    siteName: "README Gen",
    images: [
      {
        url: "/images/herogen.png",
        width: 1200,
        height: 630,
        alt: "README Gen - Professional README Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "README Gen | Free README Generator for GitHub Projects",
    description:
      "Create professional README.md files in seconds. Free online README generator with GitHub URL auto-fill, live preview, and markdown editor.",
    creator: "@MRehan_5",
    images: ["/images/herogen.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
