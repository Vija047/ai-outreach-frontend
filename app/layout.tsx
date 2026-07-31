import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ai-outreach.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI Outreach | AI-Powered Personalized Cold Email & B2B Sales Outreach",
    template: "%s | AI Outreach",
  },
  description:
    "Analyze any target company URL, extract core buying signals, and generate highly personalized cold emails, LinkedIn messages, and follow-up sequences with AI in seconds.",
  keywords: [
    "AI outreach",
    "cold email generator",
    "AI cold email",
    "personalized sales outreach",
    "prospect research tool",
    "B2B lead generation",
    "sales copy generator",
    "AI email sequence generator",
    "company research scraper",
    "hyper-personalized outreach",
  ],
  authors: [{ name: "AI Outreach Team" }],
  creator: "AI Outreach",
  publisher: "AI Outreach",
  icons: {
    icon: [
      { url: "/ai-outreachlogo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/ai-outreachlogo.png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "AI Outreach | AI-Powered Personalized Cold Email & Sales Outreach",
    description:
      "Transform any company URL into high-converting, hyper-personalized sales outreach sequences using deep AI research.",
    siteName: "AI Outreach",
    images: [
      {
        url: "/ai-outreachlogo.png",
        width: 1200,
        height: 630,
        alt: "AI Outreach Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Outreach | AI-Powered Personalized Cold Email & Sales Outreach",
    description:
      "Paste any company website URL and generate personalized cold outreach copy with AI in seconds.",
    images: ["/ai-outreachlogo.png"],
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "AI Outreach",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": siteUrl,
      "logo": `${siteUrl}/ai-outreachlogo.png`,
      "description":
        "AI Outreach is the premier AI platform for automated B2B prospect research and hyper-personalized cold outreach generation. Analyze company URLs, discover key value drivers, and create multi-channel outreach campaigns instantly.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
    },
    {
      "@type": "Organization",
      "name": "AI Outreach",
      "url": siteUrl,
      "logo": `${siteUrl}/ai-outreachlogo.png`,
      "sameAs": ["https://twitter.com/aioutreach"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/ai-outreachlogo.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/ai-outreachlogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/ai-outreachlogo.png" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM context file" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
