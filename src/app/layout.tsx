import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "./registry";
import AnalyticsTracker from "@/src/components/AnalyticsTracker";
import SectionRouteObserver from "@/src/components/SectionRouteObserver";
import SmoothScrolling from "@/src/components/SmoothScrolling";
import ClientChatWidget from "@/src/components/ClientChatWidget";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yfadvisors.in"),
  title: {
    default: "YF Advisors | Business Process Re-engineering, Accounting & Advisory",
    template: "%s | YF Advisors",
  },
  description:
    "Yours Faithfully Advisors (YF Advisors) is a premier business advisory and financial services firm. 50+ CAs, CSs & experts serving clients across India, USA, and Dubai.",
  keywords: [
    "YF Advisors",
    "Chartered Accountants",
    "GST Filing",
    "Payroll Management",
    "Virtual CFO",
    "Accounting Outsourcing",
    "Business Advisory India",
    "ROC Filing",
  ],
  authors: [{ name: "YF Advisors" }],
  creator: "YF Advisors",
  publisher: "YF Advisors",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yfadvisors.in",
    title: "YF Advisors | Business Process Re-engineering & Accounting Advisory",
    description:
      "Grow your business, not your Back Office. Premier financial, tax, and operational advisory services.",
    siteName: "YF Advisors",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "YF Advisors Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YF Advisors | Business Advisory & Accounting Solutions",
    description:
      "Strategic financial partners helping businesses grow with clarity, compliance, and confidence.",
    images: ["/logo.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "name": "YF Advisors",
    "alternateName": "Yours Faithfully Advisors",
    "url": "https://yfadvisors.in",
    "logo": "https://yfadvisors.in/logo.webp",
    "description": "Premier financial, tax, payroll, and business advisory firm with 50+ professionals.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.linkedin.com/company/yf-advisors/"
    ]
  };

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/hero-3d-ecosystem.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased`}
      >
        <SmoothScrolling>
          <AnalyticsTracker />
          <SectionRouteObserver />
          {/* WRAP CHILDREN WITH THE REGISTRY COMPONENT */}
          <StyledComponentsRegistry>
            {children}
            <ClientChatWidget />
          </StyledComponentsRegistry>
        </SmoothScrolling>
      </body>
    </html>
  );
}